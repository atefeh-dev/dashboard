<template>
  <StepLayoutWithSidebar
    :document-title="documentInfo.title"
    :last-edit="documentInfo.lastEdit"
    :status="documentInfo.status"
    :status-variant="documentInfo.statusVariant"
    :author-name="documentInfo.authorName"
    :author-avatar="documentInfo.authorAvatar"
    :template-name="documentInfo.templateName"
    :template-author="documentInfo.templateAuthor"
    :template-update-date="documentInfo.templateUpdateDate"
    :template-tags="documentInfo.templateTags"
    :checklist-items="documentInfo.checklistItems"
  >
    <div class="review-step">
      <section class="section">
        <h2 class="section__heading">Review</h2>
        <p class="section__description">
          Please review your answers, you can edit them by press "Edit" or
          continue to preview your document
        </p>

        <!-- Review Sections (Accordion Style) -->
        <div class="review-sections">
          <div
            v-for="(section, sectionIndex) in reviewSections"
            :key="sectionIndex"
            class="review-card"
          >
            <!-- Card Header -->
            <div class="review-card__header">
              <div class="review-card__header-content">
                <h3 class="review-card__title">{{ section.title }}</h3>
                <p class="review-card__subtitle">{{ section.subtitle }}</p>
              </div>
              <button
                class="review-card__edit-btn"
                @click="toggleSection(sectionIndex)"
              >
                <Edit2 class="review-card__edit-icon" />
                Edit
              </button>
            </div>

            <!-- Card Body (Editable Fields) -->
            <div
              v-show="expandedSections.includes(sectionIndex)"
              class="review-card__body"
            >
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
                  @update:model-value="emitUpdate"
                />

                <!-- Input with Prefix -->
                <AppInputWithPrefix
                  v-else-if="field.type === 'text-prefix'"
                  v-model="localData[section.key][field.name]"
                  :prefix="field.prefix"
                  :placeholder="field.placeholder"
                  @update:model-value="emitUpdate"
                />

                <!-- Textarea -->
                <AppTextarea
                  v-else-if="field.type === 'textarea'"
                  v-model="localData[section.key][field.name]"
                  :placeholder="field.placeholder"
                  :rows="field.rows || 4"
                  @update:model-value="emitUpdate"
                />

                <!-- Select -->
                <AppSelect
                  v-else-if="field.type === 'select'"
                  v-model="localData[section.key][field.name]"
                  @update:model-value="emitUpdate"
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
          <AppButton variant="ghost" size="md" @click="$emit('back')">
            <ChevronLeft class="form-actions__icon" />
            Back
          </AppButton>
          <AppButton variant="primary" size="md" @click="$emit('continue')">
            Continue
            <ChevronRight class="form-actions__icon" />
          </AppButton>
        </div>
      </section>
    </div>
  </StepLayoutWithSidebar>
</template>

<script setup>
import { ref, watch } from "vue";
import { ChevronLeft, ChevronRight, Edit2 } from "lucide-vue-next";
import StepLayoutWithSidebar from "../../layout/StepLayoutWithSidebar.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppInput from "@/components/ui/AppInput.vue";
import AppInputWithPrefix from "@/components/ui/AppInputWithPrefix.vue";
import AppTextarea from "@/components/ui/AppTextarea.vue";
import AppSelect from "@/components/ui/AppSelect.vue";

const props = defineProps({
  documentInfo: {
    type: Object,
    required: true,
  },
  stepData: {
    type: Object,
    required: true,
  },
  // Configuration for what to review
  reviewSections: {
    type: Array,
    default: () => [
      {
        key: "details",
        title: "Document Details",
        subtitle: "Template and information",
        fields: [
          {
            name: "name",
            label: "Name of your document",
            type: "text",
            placeholder: "For example Accelerator Contract 2025",
            required: true,
          },
          {
            name: "filename",
            label: "File name to save",
            type: "text-prefix",
            prefix: "doclast-",
            placeholder: "accelerator-contract-2025",
            required: true,
          },
          {
            name: "description",
            label: "Description",
            type: "textarea",
            placeholder:
              "Provide some details about what this document for ...",
            rows: 4,
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "draft", label: "Draft" },
              { value: "active", label: "Active" },
              { value: "archived", label: "Archived" },
            ],
          },
        ],
      },
      {
        key: "input",
        title: "Your details",
        subtitle: "Please provide your name and email",
        fields: [
          {
            name: "yourName",
            label: "Name of your document",
            type: "text",
            placeholder: "For example Accelerator Contract 2025",
            required: true,
          },
          {
            name: "filename",
            label: "File name to save",
            type: "text-prefix",
            prefix: "doclast-",
            placeholder: "accelerator-contract-2025",
            required: true,
          },
          {
            name: "description",
            label: "Description",
            type: "textarea",
            placeholder:
              "Provide some details about what this document for ...",
            rows: 4,
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [{ value: "draft", label: "Draft" }],
          },
        ],
      },
    ],
  },
});

const emit = defineEmits(["continue", "back", "update:data"]);

// Track which sections are expanded
const expandedSections = ref([]);

// Initialize local data structure properly
const initializeData = () => {
  const data = {};
  props.reviewSections.forEach((section) => {
    // Initialize section with empty object
    data[section.key] = {};

    // Initialize each field with empty value or existing value
    section.fields.forEach((field) => {
      data[section.key][field.name] = "";
    });

    // Populate with existing data from stepData if available
    if (props.stepData[section.key]) {
      data[section.key] = {
        ...data[section.key],
        ...props.stepData[section.key],
      };
    }
  });
  return data;
};

// Local data - organize by section key
const localData = ref(initializeData());

// Re-initialize when stepData changes
watch(
  () => props.stepData,
  () => {
    localData.value = initializeData();
  },
  { immediate: true, deep: true }
);

// Toggle section expansion
function toggleSection(index) {
  const idx = expandedSections.value.indexOf(index);
  if (idx > -1) {
    expandedSections.value.splice(idx, 1);
  } else {
    expandedSections.value.push(index);
  }
}

// Emit updates
function emitUpdate() {
  emit("update:data", localData.value);
}
</script>

<style scoped lang="scss">
@use "./stepStyles.scss";

// .review-step {
//   // Step-specific styles
// }

// ========================================
// REVIEW SECTIONS
// ========================================

.review-sections {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

// ========================================
// REVIEW CARD (Accordion Item)
// ========================================

.review-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  // ========================================
  // CARD HEADER
  // ========================================

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 20px 24px;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    gap: 16px;

    @media (max-width: 640px) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  &__header-content {
    flex: 1;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 4px;
    line-height: 1.4;
  }

  &__subtitle {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.5;
  }

  &__edit-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
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

  &__edit-icon {
    width: 16px;
    height: 16px;
    color: #6b7280;
  }

  // ========================================
  // CARD BODY (Editable Fields)
  // ========================================

  &__body {
    padding: 24px;
    background: #ffffff;
  }
}

// ========================================
// REVIEW FIELDS
// ========================================

.review-field {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  &__label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
    line-height: 1.4;
  }

  &__required {
    color: #ef4444;
    margin-left: 2px;
  }
}
</style>
