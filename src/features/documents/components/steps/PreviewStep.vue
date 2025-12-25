<template>
  <div class="preview-step">
    <section class="section">
      <h2 class="section__heading">Preview your generated document content</h2>

      <p class="section__description">
        You can see your answers in action with template and generated content.
      </p>

      <!-- Warning -->
      <div class="warning-banner">
        <AlertCircle class="warning-banner__icon" />
        <p class="warning-banner__text">
          You can edit and style the generated content but you can't save your
          changes.
        </p>
      </div>

      <!-- Editor -->
      <div class="editor-wrapper">
        <RichTextEditor
          v-model="editorContent"
          :editable="true"
          placeholder="Start typing your document..."
        />
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <AppButton variant="ghost" @click="handleBack">
          <ChevronLeft /> Back
        </AppButton>

        <AppButton variant="primary" @click="handleContinue">
          Continue <ChevronRight />
        </AppButton>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-vue-next";
import StepLayoutWithSidebar from "../../layout/DocumentStepLayout.vue";
import AppButton from "@/components/ui/AppButton.vue";
import RichTextEditor from "@/components/ui/RichTextEditor.vue";
import { useTemplatesStore } from "@/stores/useTemplatesStore";

// Props
const props = defineProps({
  stepData: {
    type: Object,
    required: true,
  },
});

// Emits
const emit = defineEmits(["continue", "back", "update:data"]);

// Store
const templatesStore = useTemplatesStore();

// State
const editorContent = ref("");
const hasInitialized = ref(false);

// Find template by name
const templateFromStore = computed(() => {
  if (!props.documentInfo?.templateName) {
    console.warn("No template name in documentInfo");
    return null;
  }

  const template = templatesStore.templates.find(
    (t) => t.name === props.documentInfo.templateName
  );

  if (!template) {
    console.error("Template not found:", props.documentInfo.templateName);
  }

  return template;
});

// Initialize editor with template content
watch(
  templateFromStore,
  (template) => {
    if (!template?.content || hasInitialized.value) return;

    editorContent.value = template.content;
    hasInitialized.value = true;
    console.log("✅ Editor initialized with template content");
  },
  { immediate: true }
);

// Emit content changes
watch(editorContent, (value) => {
  emit("update:data", { content: value });
});

// Fallback: force initialization on mount if needed
onMounted(() => {
  if (!hasInitialized.value && templateFromStore.value?.content) {
    editorContent.value = templateFromStore.value.content;
    hasInitialized.value = true;
  }
});

// Event handlers
function handleBack() {
  emit("back");
}

function handleContinue() {
  emit("continue");
}
</script>

<style scoped lang="scss">
@use "./stepStyles.scss";

.warning-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 1px solid #fcd34d;
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  margin-bottom: 20px;
  animation: warningSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes warningSlideIn {
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
    color: #f59e0b;
    flex-shrink: 0;
    margin-top: 1px;
    animation: warningPulse 2s ease-in-out infinite;

    @keyframes warningPulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.6;
      }
    }
  }

  &__text {
    font-size: 14px;
    color: #92400e;
    line-height: 1.5;
    font-weight: 500;
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
</style>
