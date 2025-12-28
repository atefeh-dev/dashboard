<template>
  <div class="preview-step">
    <ErrorBoundary
      fallback-title="Preview Error"
      fallback-message="Something went wrong with the preview. Your changes have been saved."
      @error="handleError"
      @recover="handleRecover"
    >
      <section class="section">
        <h2 class="section__heading">Preview and customize your document</h2>

        <p class="section__description">
          Review and edit your document content. All changes are automatically
          saved.
        </p>

        <!-- Info Banner -->
        <div class="info-banner">
          <Pencil class="info-banner__icon" />
          <div class="info-banner__content">
            <p class="info-banner__title">Editable Preview</p>
            <p class="info-banner__text">
              Feel free to customize the content. Your changes are automatically
              saved as you type.
            </p>
          </div>
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
          <AppButton variant="ghost" @click="handleBack" :disabled="isSaving">
            <Loader v-if="isSaving" class="form-actions__icon animate-spin" />
            <ChevronLeft v-else class="form-actions__icon" />
            {{ isSaving ? "Saving..." : "Back" }}
          </AppButton>

          <AppButton
            variant="primary"
            @click="handleContinue"
            :disabled="isSaving"
          >
            {{ isSaving ? "Saving..." : "Continue" }}
            <Loader v-if="isSaving" class="form-actions__icon animate-spin" />
            <ChevronRight v-else class="form-actions__icon" />
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
import { ChevronLeft, ChevronRight, Pencil, Loader } from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";
import RichTextEditor from "@/components/ui/RichTextEditor.vue";
import ErrorBoundary from "./ErrorBoundary.vue";
import { useTemplatesStore } from "@/stores/useTemplatesStore";
import { useFormPersistence } from "@/composables/useFormPersistence";
import {
  useKeyboardShortcuts,
  getShortcutLabels,
} from "@/composables/useKeyboardShortcuts";

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

.info-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1px solid #86efac;
  border-left: 4px solid #22c55e;
  border-radius: 8px;
  margin-bottom: 20px;
  animation: infoSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes infoSlideIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &__icon {
    width: 20px;
    height: 20px;
    color: #16a34a;
    flex-shrink: 0;
    margin-top: 1px;
  }

  &__content {
    flex: 1;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: #15803d;
    margin-bottom: 4px;
  }

  &__text {
    font-size: 14px;
    color: #15803d;
    line-height: 1.5;
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

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.editor-wrapper {
  margin-bottom: 32px;
  animation: editorFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s backwards;

  @keyframes editorFadeIn {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;

  &__icon {
    width: 1rem;
    height: 1rem;

    &.animate-spin {
      animation: spin 1s linear infinite;
    }
  }
}

.keyboard-hints {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin-top: 1rem;
  padding: 0.75rem;
  font-size: 0.75rem;
  color: #6b7280;
  background-color: #f9fafb;
  border-radius: 0.375rem;

  &__separator {
    margin: 0 0.5rem;
    color: #d1d5db;
  }
}

.kbd {
  display: inline-block;
  padding: 0.125rem 0.375rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  background-color: #fff;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  min-width: 1.5rem;
  text-align: center;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
