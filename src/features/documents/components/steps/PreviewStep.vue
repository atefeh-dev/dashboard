<template>
  <div class="preview-step">
    <ErrorBoundary
      fallback-title="Preview Error"
      fallback-message="Something went wrong with the preview. Your changes have been saved."
      @error="handleError"
      @recover="handleRecover"
    >
      <section class="section">
        <h2 class="section__heading">
          Preview your generated document content
        </h2>

        <p class="section__description">
          You can see your answers in action with template and generated
          content.
        </p>

        <!-- Export Buttons -->
        <div class="export-buttons">
          <AppButton
            variant="secondary"
            size="sm"
            @click="handleExport1"
            class="padding"
          >
            Export 1
          </AppButton>
          <AppButton
            variant="secondary"
            size="sm"
            @click="handleExport2"
            class="padding"
          >
            Export 2
          </AppButton>
        </div>

        <!-- Warning Banner -->
        <div class="warning-banner">
          <WarningIcon />
          <p class="warning-banner__text">
            You can edit and style the generated content but you can't save your
            new changed content
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state">
          <Loader class="loading-state__spinner" />
          <p class="loading-state__text">Loading preview...</p>
        </div>

        <!-- Editor (Editable with Auto-Save) -->
        <div v-else class="editor-wrapper">
          <RichTextEditor
            v-model="editorContent"
            :editable="true"
            placeholder="Start typing your document..."
          />
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <AppButton variant="blank" @click="handleBack" :disabled="isSaving">
            <Loader v-if="isSaving" class="form-actions__icon animate-spin" />
            <ArrowNarrowLetIcon v-else />
            {{ isSaving ? "Saving..." : "Back" }}
          </AppButton>

          <AppButton
            variant="primary"
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
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import { AlertCircle, Loader } from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";
import RichTextEditor from "@/components/ui/RichTextEditor.vue";
import ErrorBoundary from "./ErrorBoundary.vue";
import { useTemplatesStore } from "@/stores/useTemplatesStore";
import { useFormPersistence } from "@/composables/useFormPersistence";
import {
  useKeyboardShortcuts,
  getShortcutLabels,
} from "@/composables/useKeyboardShortcuts";
import ArrowNarrowLetIcon from "@/assets/icons/common/arrow-narrow-left.svg";
import WarningIcon from "@/assets/icons/common/warning.svg";

const props = defineProps({
  stepData: {
    type: Object,
    required: true,
  },
  template: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["continue", "back", "update:data"]);

const templatesStore = useTemplatesStore();
const shortcutLabels = getShortcutLabels();

// State
const editorContent = ref("");
const hasInitialized = ref(false);
const isLoading = ref(true);

// Form persistence with auto-save
const {
  isSaving,
  saveNow,
  startWatching,
  restoreEmergencyBackup,
  clearEmergencyBackup,
} = useFormPersistence(
  "preview-step",
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

// Find template by name
const templateFromStore = computed(() => {
  if (!props.template) {
    console.warn("⚠️ No template passed to PreviewStep");
    return null;
  }

  let template = templatesStore.templates.find(
    (t) => t.id === props.template.id
  );

  if (!template) {
    template = templatesStore.templates.find(
      (t) => t.name === props.template.name
    );
  }

  if (!template) {
    console.error("❌ Template not found in store:", props.template);
    return null;
  }

  return template;
});

// Reactive values for auto-save
const previewData = computed(() => ({
  content: editorContent.value,
}));

// Initialize editor with template content or saved content
watch(
  templateFromStore,
  (template) => {
    if (hasInitialized.value) return;

    // First, try to restore from saved stepData
    if (props.stepData?.content) {
      editorContent.value = props.stepData.content;
      console.log("✅ Editor restored from saved data");
    }
    // Otherwise, use template content
    else if (template?.content) {
      editorContent.value = template.content;
      console.log("✅ Editor initialized with template content");
    }

    hasInitialized.value = true;
    isLoading.value = false;
  },
  { immediate: true }
);

// Fallback: force initialization on mount
onMounted(() => {
  console.log("[Preview Step] Mounted, checking initialization...");

  if (!hasInitialized.value) {
    // Try saved data first
    if (props.stepData?.content) {
      editorContent.value = props.stepData.content;
    }
    // Then try template
    else if (templateFromStore.value?.content) {
      editorContent.value = templateFromStore.value.content;
    }
    // Last resort: emergency backup
    else {
      const backup = restoreEmergencyBackup();
      if (backup?.content) {
        editorContent.value = backup.content;
        console.warn("[Preview Step] Restored from emergency backup");
      }
    }

    hasInitialized.value = true;
  }

  // Hide loading after 500ms
  setTimeout(() => {
    isLoading.value = false;
  }, 500);

  // Start auto-save watching
  startWatching(() => previewData.value);
});

// Save before unmount
onBeforeUnmount(() => {
  console.log("[Preview Step] Unmounting, saving data...");

  if (editorContent.value) {
    emit("update:data", { content: editorContent.value });
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

// Export handlers
function handleExport1() {
  console.log("Export 1 clicked");
  // TODO: Implement export logic
  alert("Export 1 functionality coming soon");
}

function handleExport2() {
  console.log("Export 2 clicked");
  // TODO: Implement export logic
  alert("Export 2 functionality coming soon");
}

// Event handlers with proper saving
async function handleBack() {
  try {
    console.log("[Preview Step] Back clicked, saving...");

    await saveNow({ content: editorContent.value });
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log("[Preview Step] Data saved, going back");
    emit("back");
  } catch (error) {
    console.error("[Preview Step] Failed to go back:", error);
    alert("Failed to save your progress. Please try again.");
  }
}

async function handleContinue() {
  try {
    console.log("[Preview Step] Continue clicked, saving...");

    await saveNow({ content: editorContent.value });
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log("[Preview Step] Data saved, continuing");
    emit("continue");
  } catch (error) {
    console.error("[Preview Step] Failed to continue:", error);
    alert("Failed to save your progress. Please try again.");
  }
}

function handleError(errorInfo) {
  console.error("[Preview Step] Error:", errorInfo);

  if (editorContent.value) {
    localStorage.setItem(
      "emergency-backup-preview-step",
      JSON.stringify({
        content: editorContent.value,
        timestamp: Date.now(),
      })
    );
  }
}

function handleRecover() {
  const backup = restoreEmergencyBackup();
  if (backup?.content) {
    editorContent.value = backup.content;
    alert("Your content has been restored successfully.");
  }
}
</script>

<style scoped lang="scss">
@use "./stepStyles.scss";

// ====================================
// PREVIEW STEP SPECIFIC STYLES
// ====================================

.export-buttons {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 0.25rem;
  border: 1px solid #e9eaeb;
  border-radius: 0.5rem;
  background-color: #fafafa;
}
.padding {
  padding: 0.5rem 0.75rem;
}

.warning-banner {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  align-items: center;
  border: 1px solid #d5d7da;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;

  &__icon {
    flex-shrink: 0;
  }

  &__text {
    flex: 1;
    font-size: 0.875rem;
    font-weight: 500;
    margin: 0;
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;

  &__spinner {
    width: 2.5rem;
    height: 2.5rem;
    color: #3b82f6;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  &__text {
    font-size: 0.875rem;
    color: #6b7280;
  }
}

.editor-wrapper {
  margin-bottom: 2rem;
}

// Override form-actions for Preview step (space between layout)
.form-actions {
  justify-content: space-between;
}
</style>
