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
    <!-- Main Content -->
    <div class="input-forms-step">
      <section class="section">
        <h2 class="section__heading">{{ stepTitle }}</h2>
        <p class="section__description">{{ stepDescription }}</p>

        <div class="form-card">
          <!-- Dynamic Form Fields -->
          <div
            v-for="(field, index) in formFields"
            :key="index"
            class="form-field"
          >
            <label class="form-field__label">
              {{ field.label }}
              <span v-if="field.required" class="form-field__required">*</span>
            </label>

            <!-- Text Input -->
            <AppInput
              v-if="field.type === 'text'"
              v-model="localData[field.name]"
              :placeholder="field.placeholder"
              @update:model-value="emitUpdate"
            />

            <!-- Email Input -->
            <AppInput
              v-else-if="field.type === 'email'"
              v-model="localData[field.name]"
              type="email"
              :placeholder="field.placeholder"
              @update:model-value="emitUpdate"
            />

            <!-- Textarea -->
            <AppTextarea
              v-else-if="field.type === 'textarea'"
              v-model="localData[field.name]"
              :placeholder="field.placeholder"
              :rows="field.rows || 4"
              @update:model-value="emitUpdate"
            />

            <!-- Select -->
            <AppSelect
              v-else-if="field.type === 'select'"
              v-model="localData[field.name]"
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

            <!-- Number Input -->
            <AppInput
              v-else-if="field.type === 'number'"
              v-model="localData[field.name]"
              type="number"
              :placeholder="field.placeholder"
              @update:model-value="emitUpdate"
            />

            <!-- Date Input -->
            <AppInput
              v-else-if="field.type === 'date'"
              v-model="localData[field.name]"
              type="date"
              @update:model-value="emitUpdate"
            />

            <!-- Hint Text -->
            <p v-if="field.hint" class="form-field__hint">
              {{ field.hint }}
            </p>
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
        </div>
      </section>
    </div>
  </StepLayoutWithSidebar>
</template>

<script setup>
import { ref, watch } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import StepLayoutWithSidebar from "../../layout/StepLayoutWithSidebar.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppInput from "@/components/ui/AppInput.vue";
import AppTextarea from "@/components/ui/AppTextarea.vue";
import AppSelect from "@/components/ui/AppSelect.vue";

const props = defineProps({
  // Document info for sidebar (passed from parent)
  documentInfo: {
    type: Object,
    required: true,
  },

  // Step content
  stepTitle: {
    type: String,
    default: "Input forms",
  },
  stepDescription: {
    type: String,
    default: "Based on template needs",
  },
  formFields: {
    type: Array,
    default: () => [],
  },
  stepData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["continue", "back", "update:data"]);

// Local data for autosave
const localData = ref({ ...props.stepData });

// Watch for external changes
watch(
  () => props.stepData,
  (newData) => {
    localData.value = { ...localData.value, ...newData };
  },
  { deep: true }
);

// Emit updates for autosave
function emitUpdate() {
  emit("update:data", localData.value);
}
</script>

<style scoped lang="scss">
@use "./stepStyles.scss";

// .input-forms-step {
//   // Additional step-specific styles if needed
// }
</style>
