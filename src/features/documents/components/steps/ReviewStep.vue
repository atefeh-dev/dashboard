<template>
  <div class="review-step">
    <ErrorBoundary
      fallback-title="Review Error"
      fallback-message="Something went wrong. Your changes have been saved."
      @error="handleError"
      @recover="handleRecover"
    >
      <section class="section">
        <h2 class="section__heading">Review your information</h2>
        <p class="section__description">
          Review and edit your answers before continuing. Click "Edit" to make
          changes to any section.
        </p>

        <!-- Review Sections (Accordion Style) -->
        <div class="review-sections">
          <div
            v-for="(section, sectionIndex) in reviewSections"
            :key="sectionIndex"
            class="review-card"
            :class="{
              'review-card--expanded': expandedSections.includes(sectionIndex),
              'review-card--edited': isEdited(section.key),
            }"
          >
            <!-- Card Header -->
            <div class="review-card__header">
              <div class="review-card__header-content">
                <div class="review-card__title-row">
                  <h3 class="review-card__title">{{ section.title }}</h3>
                  <span
                    v-if="isEdited(section.key)"
                    class="edited-badge"
                    title="This section has been edited"
                  >
                    Edited
                  </span>
                </div>
                <p class="review-card__subtitle">{{ section.subtitle }}</p>
              </div>
              <button
                class="review-card__toggle-btn"
                @click="toggleSection(sectionIndex)"
                :aria-label="
                  expandedSections.includes(sectionIndex)
                    ? 'Collapse section'
                    : 'Edit section'
                "
              >
                <Edit2
                  v-if="!expandedSections.includes(sectionIndex)"
                  class="review-card__icon"
                />
                <ChevronUp v-else class="review-card__icon" />
                {{ expandedSections.includes(sectionIndex) ? "Done" : "Edit" }}
              </button>
            </div>

            <!-- Card Body - Read-Only Summary (when collapsed) -->
            <div
              v-if="!expandedSections.includes(sectionIndex)"
              class="review-card__summary"
            >
              <div
                v-for="(field, fieldIndex) in section.fields"
                :key="fieldIndex"
                class="summary-field"
              >
                <span class="summary-field__label">{{ field.label }}:</span>
                <span class="summary-field__value">
                  {{ formatFieldValue(section.key, field) }}
                </span>
              </div>
            </div>

            <!-- Card Body - Editable Fields (when expanded) -->
            <div v-else class="review-card__body">
              <div
                v-for="(field, fieldIndex) in section.fields"
                :key="fieldIndex"
                class="review-field"
              >
                <label class="review-field__label">
                  {{ field.label }}
                  <span v-if="field.required" class="review-field__required"
                    >*</span
                  >
                </label>

                <!-- Text/Email Input -->
                <AppInput
                  v-if="field.type === 'text' || field.type === 'email'"
                  v-model="localData[section.key][field.name]"
                  :type="field.type"
                  :placeholder="field.placeholder"
                  @update:model-value="handleFieldChange(section.key)"
                />

                <!-- Input with Prefix -->
                <AppInputWithPrefix
                  v-else-if="field.type === 'text-prefix'"
                  v-model="localData[section.key][field.name]"
                  :prefix="field.prefix"
                  :placeholder="field.placeholder"
                  @update:model-value="handleFieldChange(section.key)"
                />

                <!-- Textarea -->
                <AppTextarea
                  v-else-if="field.type === 'textarea'"
                  v-model="localData[section.key][field.name]"
                  :placeholder="field.placeholder"
                  :rows="field.rows || 4"
                  @update:model-value="handleFieldChange(section.key)"
                />

                <!-- Select -->
                <AppSelect
                  v-else-if="field.type === 'select'"
                  v-model="localData[section.key][field.name]"
                  @update:model-value="handleFieldChange(section.key)"
                >
                  <option
                    v-for="option in field.options"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </AppSelect>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="form-actions">
          <AppButton
            variant="ghost"
            size="md"
            @click="handleBack"
            :disabled="isSaving"
          >
            <Loader v-if="isSaving" class="form-actions__icon animate-spin" />
            <ArrowNarrowLetIcon />
            {{ isSaving ? "Saving..." : "Back" }}
          </AppButton>
          <AppButton
            variant="primary"
            size="md"
            @click="handleContinue"
            :disabled="isSaving"
          >
            {{ isSaving ? "Saving..." : "Continue" }}
            <Loader v-if="isSaving" class="form-actions__icon animate-spin" />
          </AppButton>
        </div>

        <!-- Keyboard Shortcuts Hint -->
        <div class="keyboard-hints">
          <kbd class="kbd">{{ shortcutLabels.alt }}</kbd>
          <kbd class="kbd">{{ shortcutLabels.left }}</kbd>
          Back
          <span class="keyboard-hints__separator">•</span>
          <kbd class="kbd">{{ shortcutLabels.alt }}</kbd>
          <kbd class="kbd">{{ shortcutLabels.right }}</kbd>
          Continue
        </div>
      </section>
    </ErrorBoundary>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Edit2,
  Loader,
} from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";
import AppInput from "@/components/ui/AppInput.vue";
import AppInputWithPrefix from "@/components/ui/AppInputWithPrefix.vue";
import AppTextarea from "@/components/ui/AppTextarea.vue";
import AppSelect from "@/components/ui/AppSelect.vue";
import ErrorBoundary from "./ErrorBoundary.vue";
import { useFormPersistence } from "@/composables/useFormPersistence";
import {
  useKeyboardShortcuts,
  getShortcutLabels,
} from "@/composables/useKeyboardShortcuts";
import ArrowNarrowLetIcon from "@/assets/icons/common/arrow-narrow-left.svg";

const props = defineProps({
  stepData: {
    type: Object,
    required: true,
  },
  reviewSections: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["continue", "back", "update:data"]);

const shortcutLabels = getShortcutLabels();

// Track which sections are expanded (start with all collapsed for clean review)
const expandedSections = ref([]);

// Track which sections have been edited
const editedSections = ref(new Set());

// Form persistence with auto-save
const {
  isSaving,
  saveNow,
  startWatching,
  restoreEmergencyBackup,
  clearEmergencyBackup,
} = useFormPersistence(
  "review-step",
  async (data) => {
    emit("update:data", data);
    await new Promise((resolve) => setTimeout(resolve, 50));
  },
  {
    debounceMs: 500,
    enableEmergencyBackup: true,
    logChanges: import.meta.env.DEV,
  }
);

// Initialize local data structure properly
const initializeData = () => {
  const data = {};
  props.reviewSections.forEach((section) => {
    data[section.key] = {};

    section.fields.forEach((field) => {
      data[section.key][field.name] = "";
    });

    // Populate with existing data from stepData
    if (props.stepData[section.key]) {
      data[section.key] = {
        ...data[section.key],
        ...props.stepData[section.key],
      };
    }
  });
  return data;
};

const localData = ref(initializeData());

// Re-initialize when stepData changes
watch(
  () => props.stepData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      localData.value = initializeData();
    }
  },
  { immediate: true, deep: true }
);

// Lifecycle
onMounted(() => {
  console.log("[Review Step] Mounted, restoring data...");

  // Try to restore from emergency backup
  const backup = restoreEmergencyBackup();
  if (backup) {
    console.warn("[Review Step] Restored from emergency backup");
    localData.value = backup;
    clearEmergencyBackup();
  }

  // Start auto-save watching
  startWatching(() => localData.value);
});

onBeforeUnmount(() => {
  console.log("[Review Step] Unmounting, saving data...");
  if (localData.value) {
    emit("update:data", localData.value);
  }
});

// Keyboard shortcuts
useKeyboardShortcuts({
  back: {
    shortcut: { key: "ArrowLeft", alt: true },
    handler: () => {
      if (!isSaving.value) {
        handleBack();
      }
    },
    description: "Go back",
  },
  continue: {
    shortcut: { key: "ArrowRight", alt: true },
    handler: () => {
      if (!isSaving.value) {
        handleContinue();
      }
    },
    description: "Continue to next step",
  },
});

// Toggle section expansion
function toggleSection(index) {
  const idx = expandedSections.value.indexOf(index);
  if (idx > -1) {
    // Collapse
    expandedSections.value.splice(idx, 1);
  } else {
    // Expand
    expandedSections.value.push(index);
  }
}

// Handle field changes
function handleFieldChange(sectionKey) {
  editedSections.value.add(sectionKey);
}

// Check if section has been edited
function isEdited(sectionKey) {
  return editedSections.value.has(sectionKey);
}

// Format field value for display in summary
function formatFieldValue(sectionKey, field) {
  const value = localData.value[sectionKey]?.[field.name];

  if (!value) {
    return "—"; // Em dash for empty values
  }

  // Format select options
  if (field.type === "select" && field.options) {
    const option = field.options.find((opt) => opt.value === value);
    return option?.label || value;
  }

  // Format text-prefix fields
  if (field.type === "text-prefix") {
    return `${field.prefix}${value}`;
  }

  // Truncate long text
  if (value.length > 100) {
    return value.substring(0, 100) + "...";
  }

  return value;
}

// Navigation handlers with proper saving
async function handleBack() {
  try {
    console.log("[Review Step] Back clicked, saving...");

    await saveNow(localData.value);
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log("[Review Step] Data saved, going back");
    emit("back");
  } catch (error) {
    console.error("[Review Step] Failed to go back:", error);
    alert("Failed to save your progress. Please try again.");
  }
}

async function handleContinue() {
  try {
    console.log("[Review Step] Continue clicked, saving...");

    await saveNow(localData.value);
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log("[Review Step] Data saved, continuing");
    emit("continue");
  } catch (error) {
    console.error("[Review Step] Failed to continue:", error);
    alert("Failed to save your progress. Please try again.");
  }
}

// Error handling
function handleError(errorInfo) {
  console.error("[Review Step] Error:", errorInfo);

  if (localData.value) {
    localStorage.setItem(
      "emergency-backup-review-step",
      JSON.stringify({
        data: localData.value,
        editedSections: Array.from(editedSections.value),
        timestamp: Date.now(),
      })
    );
  }
}

function handleRecover() {
  const backup = restoreEmergencyBackup();
  if (backup) {
    localData.value = backup.data || backup;
    if (backup.editedSections) {
      editedSections.value = new Set(backup.editedSections);
    }
    alert("Your data has been restored successfully.");
  }
}
</script>

<style scoped lang="scss">
// ====================================
// REVIEW STEP SPECIFIC STYLES
// ====================================
@use "./stepStyles.scss";

.review-sections {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.review-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  &--expanded {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &--edited {
    border-left: 4px solid #3b82f6;
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    gap: 1rem;

    @media (max-width: 640px) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  &__header-content {
    flex: 1;
  }

  &__title-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }

  &__title {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    line-height: 1.4;
  }

  &__subtitle {
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.5;
  }

  &__toggle-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 1rem;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    color: #374151;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    flex-shrink: 0;

    &:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }

    @media (max-width: 640px) {
      width: 100%;
      justify-content: center;
    }
  }

  &__icon {
    width: 1rem;
    height: 1rem;
    color: #6b7280;
  }

  // Summary view (collapsed)
  &__summary {
    padding: 1.25rem 1.5rem;
    background: #ffffff;
  }

  // Edit view (expanded)
  &__body {
    padding: 1.5rem;
    background: #ffffff;
  }
}

.edited-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #1e40af;
  background: #dbeafe;
  border-radius: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-field {
  display: flex;
  gap: 0.5rem;
  padding: 0.625rem 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

  &__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    min-width: 8.75rem;
    flex-shrink: 0;
  }

  &__value {
    font-size: 0.875rem;
    color: #111827;
    flex: 1;
    word-break: break-word;
  }
}

.review-field {
  margin-bottom: 1.25rem;

  &:last-child {
    margin-bottom: 0;
  }

  &__label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }

  &__required {
    color: #7f56d9;
    margin-left: 0.125rem;
  }
}

// Override form-actions for Review step (space between layout)
.form-actions {
  justify-content: space-between;
  margin-left: unset;
  margin-right: unset;
}
</style>
