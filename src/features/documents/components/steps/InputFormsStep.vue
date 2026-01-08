<template>
  <div class="input-forms-step">
    <ErrorBoundary
      fallback-title="Form Error"
      fallback-message="Something went wrong with the form. Your data has been saved as a backup."
      @error="handleFormError"
      @recover="handleRecover"
      @reset="handleReset"
    >
      <section class="section">
        <div class="section__header-with-badge">
          <div class="section__header-main">
            <h2 class="section__heading">Fill in the template details</h2>
            <p class="section__description">
              Provide the information required for your
              {{ template?.name || "document" }}
            </p>
          </div>
        </div>

        <Form
          :key="formKey"
          :validation-schema="validationSchema"
          :initial-values="currentFormData"
          @submit="handleContinue"
          v-slot="{ meta: formMeta, errors: formErrors, values: formValues }"
        >
          <div class="form-card">
            <!-- Dynamic Form Fields based on Template -->
            <Field
              v-for="(field, index) in templateFields"
              :key="index"
              :name="field.name"
              v-slot="{ field: fieldProps, errors, meta }"
            >
              <div
                class="form-field"
                :class="{
                  'has-error': errors.length && meta.touched,
                }"
              >
                <label class="form-field__label">
                  {{ field.label }}
                  <span v-if="field.required" class="form-field__required"
                    >*</span
                  >
                </label>

                <!-- Text Input -->
                <AppInput
                  v-if="field.type === 'text'"
                  v-bind="fieldProps"
                  :placeholder="
                    field.placeholder || `Enter ${field.label.toLowerCase()}`
                  "
                  :class="{ 'input-error': errors.length && meta.touched }"
                  :maxlength="field.maxLength"
                  @update:model-value="
                    handleFieldUpdate(field.name, $event, formValues)
                  "
                />

                <!-- Email Input -->
                <AppInput
                  v-else-if="field.type === 'email'"
                  v-bind="fieldProps"
                  type="email"
                  :placeholder="
                    field.placeholder || `Enter ${field.label.toLowerCase()}`
                  "
                  :class="{ 'input-error': errors.length && meta.touched }"
                  :maxlength="field.maxLength"
                  @update:model-value="
                    handleFieldUpdate(field.name, $event, formValues)
                  "
                />

                <!-- Textarea -->
                <AppTextarea
                  v-else-if="field.type === 'textarea'"
                  v-bind="fieldProps"
                  :placeholder="
                    field.placeholder || `Enter ${field.label.toLowerCase()}`
                  "
                  :rows="field.rows || 4"
                  :class="{ 'input-error': errors.length && meta.touched }"
                  :maxlength="field.maxLength"
                  @update:model-value="
                    handleFieldUpdate(field.name, $event, formValues)
                  "
                />

                <!-- Date Input -->
                <AppInput
                  v-else-if="field.type === 'date'"
                  v-bind="fieldProps"
                  type="date"
                  :class="{ 'input-error': errors.length && meta.touched }"
                  @update:model-value="
                    handleFieldUpdate(field.name, $event, formValues)
                  "
                />

                <!-- Error Message -->
                <transition name="fade">
                  <div
                    v-if="errors.length && meta.touched"
                    class="error-message"
                  >
                    {{ errors[0] }}
                  </div>
                </transition>

                <!-- Hint Text -->
                <p v-if="field.hint && !errors.length" class="form-field__hint">
                  {{ field.hint }}
                </p>
              </div>
            </Field>
          </div>

          <!-- Navigation Buttons -->
          <div class="form-actions">
            <AppButton
              type="button"
              variant="blank"
              size="md"
              :disabled="isSaving"
              @click="handleBack"
            >
              <Loader v-if="isSaving" class="form-actions__icon animate-spin" />
              <ArrowNarrowLetIcon v-else class="form-actions__icon" />
              {{ isSaving ? "Saving..." : "Back" }}
            </AppButton>
            <AppButton
              type="submit"
              variant="primary"
              size="md"
              :disabled="!canContinue(formValues) || isSaving"
            >
              {{ isSaving ? "Saving..." : "Continue" }}
              <Loader v-if="isSaving" class="form-actions__icon animate-spin" />
            </AppButton>
          </div>

          <!-- Form Summary -->
          <transition name="fade">
            <div
              v-if="Object.keys(formErrors).length > 0 && formMeta.touched"
              class="form-summary"
            >
              <AlertCircle class="form-summary__icon" />
              <div class="form-summary__content">
                <p class="form-summary__title">
                  Please fix the following errors:
                </p>
                <ul class="form-summary__list">
                  <li v-for="(error, fieldName) in formErrors" :key="fieldName">
                    <strong>{{ getFieldLabel(fieldName) }}:</strong>
                    {{ error }}
                  </li>
                </ul>
              </div>
            </div>
          </transition>

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
        </Form>
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
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import AppButton from "@/components/ui/AppButton.vue";
import AppInput from "@/components/ui/AppInput.vue";
import AppTextarea from "@/components/ui/AppTextarea.vue";
import ErrorBoundary from "./ErrorBoundary.vue";
import { useTemplatesStore } from "@/stores/useTemplatesStore";
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
  template: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["continue", "back", "update:data"]);

const templatesStore = useTemplatesStore();
const shortcutLabels = getShortcutLabels();
const isSaving = ref(false);
const formKey = ref(0);

// Get template fields from the store
const templateFields = computed(() => {
  const template = templatesStore.getTemplateById(props.template?.id);
  return template?.fields || [];
});

// Initialize form data
const currentFormData = ref({});

function initializeFormData() {
  const data = {};

  // Initialize all fields with empty values
  templateFields.value.forEach((field) => {
    data[field.name] = "";
  });

  // Restore saved data if available
  if (props.stepData && Object.keys(props.stepData).length > 0) {
    Object.assign(data, props.stepData);
  }

  return data;
}

// Enhanced validation schema based on template fields
function createFieldValidation(field) {
  let validation;

  switch (field.type) {
    case "email":
      validation = yup.string().email("Please enter a valid email address");
      break;

    case "date":
      validation = yup.string();
      break;

    case "textarea":
      validation = yup.string();
      break;

    case "text":
    default:
      validation = yup
        .string()
        .notRequired()
        .transform((value) => {
          if (!value) return undefined;
          const trimmed = value.trim();
          return trimmed === "" ? undefined : trimmed;
        });

      // Add min length test only if field has minLength
      if (field.minLength && field.minLength > 0) {
        validation = validation.test(
          "min-when-provided",
          `${field.label} must be at least ${field.minLength} characters`,
          (value) => value == null || value.length >= field.minLength
        );
      } else {
        // Default min length for text fields without specific requirement
        validation = validation.test(
          "min-when-provided",
          `${field.label} must be at least 3 characters`,
          (value) => value == null || value.length >= 3
        );
      }
  }

  // Required validation
  if (field.required) {
    validation = validation.required(`${field.label} is required`);
  } else {
    validation = validation.notRequired();
  }

  // Max length validation (if specified)
  if (field.maxLength) {
    validation = validation.max(
      field.maxLength,
      `Maximum ${field.maxLength} characters allowed`
    );
  }

  // Min length validation for textarea (if specified)
  if (field.type === "textarea" && field.minLength && field.minLength > 0) {
    validation = validation.min(
      field.minLength,
      `${field.label} must be at least ${field.minLength} characters`
    );
  }

  return validation;
}

const validationSchema = computed(() => {
  const schema = {};
  templateFields.value.forEach((field) => {
    schema[field.name] = createFieldValidation(field);
  });
  return yup.object(schema);
});

function getFieldLabel(fieldName) {
  const field = templateFields.value.find((f) => f.name === fieldName);
  return field?.label || fieldName;
}

function canContinue(formValues) {
  if (!formValues) return false;

  const requiredFields = templateFields.value.filter((f) => f.required);

  return requiredFields.every((field) => {
    const value = formValues[field.name];
    if (!value) return false;

    const trimmedValue = typeof value === "string" ? value.trim() : value;
    if (trimmedValue === "") return false;

    // Check minimum length
    if (field.minLength && field.minLength > 0) {
      return trimmedValue.length >= field.minLength;
    }

    // Default minimum length for text fields
    if (field.type === "text") {
      return trimmedValue.length >= 3;
    }

    return true;
  });
}

function handleFieldUpdate(fieldName, value, formValues) {
  currentFormData.value[fieldName] = value;
  emit("update:data", currentFormData.value);
}

async function handleContinue(formValues) {
  try {
    console.log("[Input Step] Continue clicked with values:", formValues);

    isSaving.value = true;

    // Save to store
    templatesStore.updateInputForms([formValues]);

    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    isSaving.value = false;

    console.log("[Input Step] Data saved, proceeding to next step");
    emit("continue", formValues);
  } catch (error) {
    console.error("[Input Step] Failed to continue:", error);
    alert("Failed to save your progress. Please try again.");
    isSaving.value = false;
  }
}

async function handleBack() {
  try {
    console.log("[Input Step] Back clicked, saving...");

    isSaving.value = true;

    templatesStore.updateInputForms([currentFormData.value]);

    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    isSaving.value = false;

    console.log("[Input Step] Data saved, going back");
    emit("back");
  } catch (error) {
    console.error("[Input Step] Failed to go back:", error);
    alert("Failed to save your progress. Please try again.");
    isSaving.value = false;
  }
}

function handleFormError(errorInfo) {
  console.error("[Input Step] Form error caught:", errorInfo);

  const backup = {
    data: currentFormData.value,
    timestamp: Date.now(),
  };
  localStorage.setItem("emergency-backup-input-step", JSON.stringify(backup));

  alert(
    "An error occurred with the form. Your data has been saved as a backup."
  );
}

function handleRecover() {
  console.log("[Input Step] Attempting to recover...");

  const backupStr = localStorage.getItem("emergency-backup-input-step");
  if (backupStr) {
    try {
      const backup = JSON.parse(backupStr);
      if (backup?.data) {
        currentFormData.value = backup.data;
        formKey.value++;
        alert("Your data has been restored successfully.");
      }
    } catch (e) {
      console.error("Failed to restore backup:", e);
    }
  }
}

function handleReset() {
  console.log("[Input Step] Resetting form...");
  currentFormData.value = initializeFormData();
  formKey.value++;
}

// Lifecycle
onMounted(() => {
  console.log("[Input Step] Mounted, initializing...");
  currentFormData.value = initializeFormData();
  formKey.value++;
});

watch(
  () => props.stepData,
  (newStepData) => {
    if (newStepData && Object.keys(newStepData).length > 0) {
      console.log("[Input Step] stepData changed:", newStepData);
      Object.assign(currentFormData.value, newStepData);
    }
  },
  { deep: true }
);

onBeforeUnmount(() => {
  console.log("[Input Step] Unmounting, saving data...");
  emit("update:data", currentFormData.value);
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
      if (canContinue(currentFormData.value) && !isSaving.value) {
        handleContinue(currentFormData.value);
      }
    },
    description: "Continue to next step",
  },
});
</script>

<style scoped lang="scss">
@use "./stepStyles.scss";

.section__header-with-badge {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.section__header-main {
  flex: 1;
}

.form-actions {
  justify-content: space-between;
  margin-right: unset;
  margin-left: unset;
}
</style>
