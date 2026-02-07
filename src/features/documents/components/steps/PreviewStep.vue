<template>
  <div class="preview-step">
    <section class="section">
      <h2 class="section__heading">Preview your generated document content</h2>

      <p class="section__description">
        You can see your answers in action with template and generated content.
      </p>

      <div class="export-banner">
        <div class="export-banner__content">
          <AppButton size="md" variant="secondary">Export 1</AppButton>
          <AppButton size="md" variant="transparent">Export 2</AppButton>
        </div>
      </div>

      <!-- Info Banner -->
      <div class="info-banner">
        <WarningIcon />
        <div class="info-banner__content">
          <p class="info-banner__title">
            You can edit and style the generated content but you can't save your
            new changed content
          </p>
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
        <AppButton variant="blank" @click="handleBack">
          <ArrowNarrowLetIcon /> Back
        </AppButton>

        <AppButton
          variant="primary"
          @click="handleContinue"
          :disabled="!templateToUse || !editorContent"
        >
          Continue
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
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";
import RichTextEditor from "@/components/ui/RichTextEditor.vue";
import { useTemplatesStore } from "@/stores/useTemplatesStore";
import WarningIcon from "@/assets/icons/common/warning.svg";
import ArrowNarrowLetIcon from "@/assets/icons/common/arrow-narrow-left.svg";
import { getShortcutLabels } from "@/composables/useKeyboardShortcuts";

const props = defineProps({
  stepData: {
    type: Object,
    default: () => ({}),
  },
});

const shortcutLabels = getShortcutLabels();

const emit = defineEmits(["continue", "back", "update:data"]);

const templatesStore = useTemplatesStore();
const editorContent = ref("");
const hasInitialized = ref(false);
const editorInstance = ref(null);
const insertLockedFieldFn = ref(null);

// Determine which template to use
const templateToUse = computed(() => {
  if (props.stepData?.template?.content) {
    return props.stepData.template;
  }

  if (props.stepData?.templateName) {
    const template = templatesStore.templates.find(
      (t) => t.name === props.stepData.templateName,
    );
    if (template) return template;
  }

  if (props.stepData?.templateId) {
    const template = templatesStore.getTemplateById(props.stepData.templateId);
    if (template) return template;
  }

  const defaultTemplate = templatesStore.templates.find(
    (t) => t.name === "Non Disclosure Agreement",
  );

  return defaultTemplate || null;
});

// Extract field data from input forms
const fieldData = computed(() => {
  const data = {};
  const inputData = props.stepData?.input || {};

  if (inputData.items && Array.isArray(inputData.items)) {
    inputData.items.forEach((item) => {
      Object.assign(data, item);
    });
  } else if (Array.isArray(inputData)) {
    inputData.forEach((item) => {
      Object.assign(data, item);
    });
  } else {
    Object.assign(data, inputData);
  }

  console.log("📊 Field data:", data);
  return data;
});

// Get locked field names from template
const lockedFieldNames = computed(() => {
  if (!templateToUse.value?.fields) return [];
  const names = templateToUse.value.fields.map((field) => field.name);
  console.log("🔒 Locked fields:", names);
  return names;
});

// Replace placeholders with locked field nodes
function processTemplateWithLockedFields() {
  if (
    !templateToUse.value?.content ||
    !insertLockedFieldFn.value ||
    !editorInstance.value
  ) {
    console.warn("⚠️ Not ready to process");
    return;
  }

  console.log("🚀 Processing template with locked fields");

  const template = templateToUse.value.content;
  const fields = fieldData.value;
  const lockedNames = lockedFieldNames.value;

  editorInstance.value.commands.setContent(template, false);

  setTimeout(() => {
    const { state } = editorInstance.value;
    const { doc } = state;
    const { tr } = state;
    let modified = false;

    const replacements = [];
    doc.descendants((node, pos) => {
      if (node.isText && node.text) {
        const regex = /\{\{(\w+)\}\}/g;
        let match;

        while ((match = regex.exec(node.text)) !== null) {
          const fieldName = match[1];
          const fieldValue = fields[fieldName];
          const isLocked = lockedNames.includes(fieldName);

          if (fieldValue && isLocked) {
            replacements.push({
              from: pos + match.index,
              to: pos + match.index + match[0].length,
              fieldName,
              fieldValue: String(fieldValue),
            });
          }
        }
      }
    });

    console.log(`Found ${replacements.length} placeholders to replace`);

    replacements.reverse().forEach((replacement) => {
      const { from, to, fieldName, fieldValue } = replacement;

      tr.delete(from, to);

      const lockedNode = editorInstance.value.schema.nodes.lockedField.create({
        fieldName,
        fieldValue,
      });

      tr.insert(from, lockedNode);
      modified = true;

      console.log(`✅ Replaced {{${fieldName}}} with locked field`);
    });

    if (modified) {
      editorInstance.value.view.dispatch(tr);
      console.log("✅ All locked fields inserted successfully");
    }
  }, 150);
}

// Handle editor mounted
function handleEditorMounted({ editor, insertLockedField }) {
  console.log("🎯 Editor mounted");

  editorInstance.value = editor;
  insertLockedFieldFn.value = insertLockedField;

  if (!hasInitialized.value && templateToUse.value) {
    hasInitialized.value = true;
    processTemplateWithLockedFields();
  }
}

// Watch for changes
watch(
  [templateToUse, fieldData, lockedFieldNames],
  () => {
    if (
      insertLockedFieldFn.value &&
      !hasInitialized.value &&
      templateToUse.value
    ) {
      hasInitialized.value = true;
      processTemplateWithLockedFields();
    }
  },
  { immediate: false },
);

// Watch editor content changes and emit updates
watch(editorContent, (value) => {
  console.log("📝 Editor content changed, length:", value?.length || 0);
  emit("update:data", { content: value });
});

function handleBack() {
  // Ensure content is saved before going back
  emit("update:data", { content: editorContent.value });
  emit("back");
}

async function handleContinue() {
  if (!templateToUse.value) {
    alert("Please select a template first");
    emit("back");
    return;
  }

  if (
    !editorContent.value ||
    editorContent.value.trim() === "" ||
    editorContent.value === "<p></p>"
  ) {
    alert("Please wait for the document to load or add some content");
    return;
  }

  console.log(
    "✅ Continuing with content, length:",
    editorContent.value.length,
  );

  // CRITICAL: Emit the content with the continue event
  // This ensures the parent receives the content immediately
  emit("update:data", { content: editorContent.value });

  // Wait for the update to propagate
  await nextTick();

  // Now emit continue WITH the content data
  emit("continue", { content: editorContent.value });
}
</script>

<style scoped lang="scss">
@use "./stepStyles.scss";

// ====================================
// PREVIEW STEP SPECIFIC STYLES - CLEANED
// ====================================

.section {
  &__heading {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  &__description {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1.5rem;
  }
}

.export-banner {
  display: flex;
  background-color: #fafafa;
  border: 1px solid #e9eaeb;
  padding: 0.25rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;

  &__content {
    display: flex;
    gap: 0.25rem;
  }
}

.info-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: transparent;
  border: 1px solid #d5d7da;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;

  &__content {
    flex: 1;
  }

  &__title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #414651;
    margin: 0;
  }
}

.error-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 1px solid #fecaca;
  border-left: 4px solid #ef4444;
  border-radius: 0.5rem;
  margin-bottom: 1.25rem;

  &__icon {
    width: 1.5rem;
    height: 1.5rem;
    color: #ef4444;
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
  }

  &__title {
    font-size: 1rem;
    font-weight: 600;
    color: #991b1b;
    margin-bottom: 0.25rem;
  }

  &__text {
    font-size: 0.875rem;
    color: #991b1b;
    line-height: 1.5;
  }
}

.editor-wrapper {
  margin-bottom: 2rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 2rem;
}
</style>
