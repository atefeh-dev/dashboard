<template>
  <div class="preview-step">
    <section class="section">
      <h2 class="section__heading">Preview your generated document content</h2>

      <p class="section__description">
        You can see your answers in action with template and generated content.
      </p>

      <!-- Info Banner -->
      <div class="info-banner">
        <svg
          class="info-banner__icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <div class="info-banner__content">
          <p class="info-banner__title">Editing Guidelines</p>
          <ul class="info-banner__list">
            <li>
              🔒 <strong>Your data fields</strong> (highlighted in yellow) are
              protected and cannot be edited
            </li>
            <li>
              🎨 You can <strong>change colors</strong> of protected fields for
              visual emphasis
            </li>
            <li>
              ✏️ All other <strong>template content</strong> can be freely
              edited and styled
            </li>
          </ul>
        </div>
      </div>

      <!-- Locked Fields Legend -->
      <div class="legend">
        <div class="legend__item">
          <span class="legend__sample locked-field-sample">
            Your Protected Data
            <span class="lock-icon">🔒</span>
          </span>
          <span class="legend__label">Read-only (from previous steps)</span>
        </div>
        <div class="legend__item">
          <span class="legend__sample editable-sample">Template Text</span>
          <span class="legend__label">Fully editable</span>
        </div>
      </div>

      <!-- Editor -->
      <div v-if="!templateToUse" class="error-banner">
        <AlertCircle class="error-banner__icon" />
        <div class="error-banner__content">
          <p class="error-banner__title">No template selected</p>
          <p class="error-banner__text">
            Please go back and select a template in the details step.
          </p>
        </div>
      </div>

      <div v-else class="editor-wrapper">
        <RichTextEditor
          v-model="editorContent"
          :editable="true"
          placeholder="Start typing your document..."
          @mounted="handleEditorMounted"
        />
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <AppButton variant="ghost" @click="handleBack">
          <ChevronLeft /> Back
        </AppButton>

        <AppButton
          variant="primary"
          @click="handleContinue"
          :disabled="!templateToUse"
        >
          Continue <ChevronRight />
        </AppButton>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";
import RichTextEditor from "@/components/ui/RichTextEditor.vue";
import { useTemplatesStore } from "@/stores/useTemplatesStore";

// Props
const props = defineProps({
  stepData: {
    type: Object,
    default: () => ({}),
  },
});

// Emits
const emit = defineEmits(["continue", "back", "update:data"]);

// Store
const templatesStore = useTemplatesStore();

// State
const editorContent = ref("");
const hasInitialized = ref(false);
const editorInstance = ref(null);

// Determine which template to use
const templateToUse = computed(() => {
  if (props.stepData?.template?.content) {
    return props.stepData.template;
  }

  if (props.stepData?.templateName) {
    const template = templatesStore.templates.find(
      (t) => t.name === props.stepData.templateName
    );
    if (template) return template;
  }

  if (props.stepData?.templateId) {
    const template = templatesStore.getTemplateById(props.stepData.templateId);
    if (template) return template;
  }

  const defaultTemplate = templatesStore.templates.find(
    (t) => t.name === "Non Disclosure Agreement"
  );

  return defaultTemplate || null;
});

// Extract field data from input forms (from stepData.input)
const fieldData = computed(() => {
  const data = {};

  // Get data from input step
  const inputData = props.stepData?.input || {};

  // If inputData has an 'items' array (from your InputFormsStep structure)
  if (inputData.items && Array.isArray(inputData.items)) {
    // Merge all items into one object
    inputData.items.forEach((item) => {
      Object.assign(data, item);
    });
  } else if (Array.isArray(inputData)) {
    // If it's directly an array
    inputData.forEach((item) => {
      Object.assign(data, item);
    });
  } else {
    // If it's a direct object
    Object.assign(data, inputData);
  }

  console.log("📊 Field data extracted:", data);
  return data;
});

// Get list of field names that should be locked (from template definition)
const lockedFieldNames = computed(() => {
  if (!templateToUse.value?.fields) return [];

  const names = templateToUse.value.fields.map((field) => field.name);
  console.log("🔒 Locked field names:", names);
  return names;
});

// Replace placeholders with locked field HTML
function replaceWithLockedFields(content, fields, lockedNames) {
  let updatedContent = content;

  // Replace each placeholder
  Object.entries(fields).forEach(([fieldName, fieldValue]) => {
    // Only lock if this field is in the template's field definitions
    if (!lockedNames.includes(fieldName)) {
      console.log(`⏭️ Skipping ${fieldName} - not in template fields`);
      return;
    }

    const placeholder = `{{${fieldName}}}`;

    // Check if placeholder exists in content
    if (!updatedContent.includes(placeholder)) {
      console.log(`⚠️ Placeholder {{${fieldName}}} not found in template`);
      return;
    }

    // Create locked field HTML
    const lockedFieldHTML = `<span class="locked-field" contenteditable="false" data-field-name="${fieldName}" data-field-value="${fieldValue}" title="Protected field: ${fieldName} (Read-only)">${fieldValue}<span class="lock-icon">🔒</span></span>`;

    // Replace all occurrences
    updatedContent = updatedContent.replaceAll(placeholder, lockedFieldHTML);
    console.log(`✅ Replaced {{${fieldName}}} with locked field:`, fieldValue);
  });

  return updatedContent;
}

// Protect locked fields from editing
function protectLockedFields() {
  nextTick(() => {
    const lockedFields = document.querySelectorAll(".locked-field");

    console.log(`🛡️ Protecting ${lockedFields.length} locked fields`);

    lockedFields.forEach((field) => {
      // Make absolutely sure it's not editable
      field.contentEditable = "false";
      field.setAttribute("contenteditable", "false");

      // Prevent any modification
      field.addEventListener("keydown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });

      field.addEventListener("paste", (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });

      field.addEventListener("cut", (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });

      field.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });

      // Allow selection for color change only
      field.addEventListener("click", (e) => {
        e.stopPropagation();
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNode(field);
        selection.removeAllRanges();
        selection.addRange(range);
      });
    });
  });
}

// Initialize editor with template content and locked fields
watch(
  [templateToUse, fieldData, lockedFieldNames],
  ([template, fields, lockedNames]) => {
    if (!template?.content) {
      console.warn("⚠️ No template content available");
      return;
    }

    if (hasInitialized.value) {
      console.log("⏭️ Already initialized, skipping");
      return;
    }

    console.log("📝 Initializing editor with locked fields");
    console.log("Template:", template.name);
    console.log("Field data:", fields);
    console.log("Locked field names:", lockedNames);

    // Replace placeholders with locked fields
    const contentWithLockedFields = replaceWithLockedFields(
      template.content,
      fields,
      lockedNames
    );

    editorContent.value = contentWithLockedFields;
    hasInitialized.value = true;

    // Protect fields after content is set
    setTimeout(() => {
      protectLockedFields();
      console.log("✅ Editor initialized with locked fields");
    }, 200);
  },
  { immediate: true }
);

// Re-protect fields when content changes
watch(editorContent, (value) => {
  protectLockedFields();
  emit("update:data", { content: value });
});

// Handle editor mounted
function handleEditorMounted(editor) {
  editorInstance.value = editor;
  protectLockedFields();
}

// Fallback initialization
onMounted(() => {
  setTimeout(() => {
    if (!hasInitialized.value && templateToUse.value?.content) {
      console.log("🔄 Force initializing...");
      const contentWithLockedFields = replaceWithLockedFields(
        templateToUse.value.content,
        fieldData.value,
        lockedFieldNames.value
      );
      editorContent.value = contentWithLockedFields;
      hasInitialized.value = true;

      setTimeout(() => {
        protectLockedFields();
      }, 100);
    }
  }, 300);
});

// Event handlers
function handleBack() {
  emit("back");
}

function handleContinue() {
  if (!templateToUse.value) {
    alert("Please select a template first");
    emit("back");
    return;
  }
  emit("continue");
}
</script>

<style scoped lang="scss">
.section {
  &__heading {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 8px;
  }

  &__description {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 24px;
  }
}

.info-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bfdbfe;
  border-left: 4px solid #3b82f6;
  border-radius: 8px;
  margin-bottom: 20px;
  animation: bannerSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes bannerSlideIn {
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
    color: #3b82f6;
    flex-shrink: 0;
    margin-top: 2px;
  }

  &__content {
    flex: 1;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: #1e40af;
    margin-bottom: 8px;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 13px;
    color: #1e40af;
    line-height: 1.6;

    li {
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;

      &:last-child {
        margin-bottom: 0;
      }

      strong {
        font-weight: 600;
      }
    }
  }
}

.legend {
  display: flex;
  gap: 24px;
  padding: 12px 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__sample {
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  &__label {
    font-size: 13px;
    color: #6b7280;
  }
}

.locked-field-sample {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #fbbf24;
  color: #92400e;

  .lock-icon {
    font-size: 10px;
    opacity: 0.7;
  }
}

.editable-sample {
  background: #ffffff;
  border: 2px dashed #d1d5db;
  color: #374151;
}

.error-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 1px solid #fecaca;
  border-left: 4px solid #ef4444;
  border-radius: 8px;
  margin-bottom: 20px;

  &__icon {
    width: 24px;
    height: 24px;
    color: #ef4444;
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: #991b1b;
    margin-bottom: 4px;
  }

  &__text {
    font-size: 14px;
    color: #991b1b;
    line-height: 1.5;
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
  justify-content: space-between;
  gap: 12px;
  margin-top: 32px;
}

// Global styles for locked fields in editor
:deep(.locked-field) {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%) !important;
  border: 2px solid #fbbf24 !important;
  border-radius: 4px !important;
  padding: 2px 8px !important;
  margin: 0 2px !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 4px !important;
  font-weight: 600 !important;
  color: #92400e !important;
  cursor: not-allowed !important;
  user-select: none !important;
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  position: relative !important;
  transition: all 0.2s ease !important;
  white-space: nowrap !important;

  // Prevent any formatting changes while keeping inherited styles
  text-decoration: none !important;
  font-style: normal !important;

  &:hover {
    background: linear-gradient(135deg, #fde68a 0%, #fcd34d 100%) !important;
    box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3) !important;
  }

  .lock-icon {
    font-size: 10px;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  &:hover .lock-icon {
    opacity: 1;
  }
}

// Prevent selection styling from breaking the locked field appearance
:deep(.ProseMirror) {
  .locked-field::selection {
    background: rgba(251, 191, 36, 0.3) !important;
  }
}
</style>
