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
    <div class="preview-step">
      <section class="section">
        <h2 class="section__heading">
          Preview your generated document content
        </h2>
        <p class="section__description">
          You can see your answers in action with template and generated
          content.
        </p>

        <!-- Export Tabs -->
        <div class="export-tabs">
          <button
            v-for="tab in exportTabs"
            :key="tab.value"
            :class="[
              'export-tabs__tab',
              { 'export-tabs__tab--active': selectedExport === tab.value },
            ]"
            @click="selectedExport = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Warning Message -->
        <div class="warning-banner">
          <AlertCircle class="warning-banner__icon" />
          <p class="warning-banner__text">
            You can edit and style the generated content but you can't save your
            new changed content
          </p>
        </div>

        <!-- Rich Text Editor Component -->
        <div class="editor-wrapper">
          <RichTextEditor
            v-model="editorContent"
            :editable="true"
            :placeholder="'Start typing your document...'"
            @bold-art="handleBoldArt"
          />
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
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-vue-next";
import StepLayoutWithSidebar from "../../layout/StepLayoutWithSidebar.vue";
import AppButton from "@/components/ui/AppButton.vue";
import RichTextEditor from "@/components/ui/RichTextEditor.vue";

const props = defineProps({
  documentInfo: {
    type: Object,
    required: true,
  },
  stepData: {
    type: Object,
    required: true,
  },
  selectedTemplate: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["continue", "back", "update:data"]);

// Export tabs
const selectedExport = ref("export1");
const exportTabs = [
  { value: "export1", label: "Export 1" },
  { value: "export2", label: "Export 2" },
];

// Editor content - use template content if available
const editorContent = ref(props.selectedTemplate?.content || "");

// Watch for template changes
watch(
  () => props.selectedTemplate,
  (newTemplate) => {
    if (newTemplate?.content) {
      editorContent.value = newTemplate.content;
    }
  },
  { immediate: true }
);

// Watch editor content and emit updates
watch(editorContent, (newContent) => {
  emit("update:data", {
    content: newContent,
  });
});

// Handle Bold Art action
function handleBoldArt() {
  console.log("Bold Art clicked - trigger AI feature");
  // Implement AI feature here
}
</script>

<style scoped lang="scss">
@use "./stepStyles.scss";

// .preview-step {
//   // Step-specific styles
// }

// ========================================
// EXPORT TABS
// ========================================

.export-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;

  &__tab {
    padding: 8px 20px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }

    &:active {
      background: #f3f4f6;
    }

    &--active {
      background: #eff6ff;
      border-color: #3b82f6;
      color: #3b82f6;
      font-weight: 600;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.08);
    }
  }
}

// ========================================
// WARNING BANNER
// ========================================

.warning-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  margin-bottom: 20px;

  &__icon {
    width: 20px;
    height: 20px;
    color: #f59e0b;
    flex-shrink: 0;
    margin-top: 1px;
  }

  &__text {
    font-size: 14px;
    color: #92400e;
    line-height: 1.5;
    font-weight: 500;
  }
}

// ========================================
// EDITOR WRAPPER
// ========================================

.editor-wrapper {
  margin-bottom: 32px;
}
</style>
