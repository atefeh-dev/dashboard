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
        <h2 class="section__heading">{{ stepTitle }}</h2>
        <p class="section__description">{{ stepDescription }}</p>

        <Form
          :validation-schema="validationSchema"
          :initial-values="initialFormValues"
          @submit="handleContinue"
          v-slot="{ meta: formMeta, errors: formErrors, values: formValues }"
        >
          <div class="form-card">
            <!-- Dynamic Form Fields -->
            <Field
              v-for="(field, index) in formFields"
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
                  :placeholder="field.placeholder"
                  :class="{ 'input-error': errors.length && meta.touched }"
                />

                <!-- Email Input -->
                <AppInput
                  v-else-if="field.type === 'email'"
                  v-bind="fieldProps"
                  type="email"
                  :placeholder="field.placeholder"
                  :class="{ 'input-error': errors.length && meta.touched }"
                />

                <!-- Textarea -->
                <AppTextarea
                  v-else-if="field.type === 'textarea'"
                  v-bind="fieldProps"
                  :placeholder="field.placeholder"
                  :rows="field.rows || 4"
                  :class="{ 'input-error': errors.length && meta.touched }"
                />

                <!-- Select -->
                <AppSelect
                  v-else-if="field.type === 'select'"
                  v-bind="fieldProps"
                  :placeholder="field.placeholder"
                >
                  <option
                    v-for="option in field.options"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </AppSelect>

                <!-- Date Input -->
                <AppInput
                  v-else-if="field.type === 'date'"
                  v-bind="fieldProps"
                  type="date"
                  :class="{ 'input-error': errors.length && meta.touched }"
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
              @click="handleBack(formValues)"
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

          <!-- Keyboard Shortcuts Hint - Cross Platform -->
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
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader,
} from "lucide-vue-next";
import { Form, Field, useForm } from "vee-validate";
import * as yup from "yup";
import AppButton from "@/components/ui/AppButton.vue";
import AppInput from "@/components/ui/AppInput.vue";
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

// Get keyboard shortcut labels for current OS
const shortcutLabels = getShortcutLabels();

// ============================================
// FORM PERSISTENCE SETUP
// ============================================
const {
  isSaving,
  saveNow,
  startWatching,
  restoreEmergencyBackup,
  clearEmergencyBackup,
} = useFormPersistence(
  "input-step",
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

// VALIDATION RULES (FIXED)
function createFieldValidation(field) {
  let validation;

  switch (field.type) {
    case "email":
      validation = yup.string().email("Please enter a valid email address");
      break;

    case "date":
      validation = yup.string();
      break;

    case "select":
      validation = yup.string().notOneOf([""], "Please select an option");
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
        })
        .test(
          "starts-with-text",
          `${field.label} must start with a letter or number`,
          (value) => value == null || /^[a-zA-Z0-9]/.test(value)
        )
        .test(
          "min-when-provided",
          `${field.label} must be at least 3 characters`,
          (value) => value == null || value.length >= 3
        );
  }
  // Add required validation LAST (takes precedence)
  if (field.required) {
    validation = validation.required(`${field.label} is required`);
  } else {
    validation = validation.notRequired();
  }

  if (field.maxLength) {
    validation = validation.max(
      field.maxLength,
      `Maximum ${field.maxLength} characters allowed`
    );
  }

  return validation;
}

const validationSchema = computed(() => {
  const schema = {};
  props.formFields.forEach((field) => {
    schema[field.name] = createFieldValidation(field);
  });
  return yup.object(schema);
});

// FORM SETUP WITH DATA RESTORATION
const initialFormValues = computed(() => {
  const values = {};
  props.formFields.forEach((field) => {
    const savedValue = props.stepData[field.name];
    values[field.name] =
      savedValue !== undefined && savedValue !== null ? savedValue : "";
  });
  return values;
});

const { values, setFieldValue, setValues, resetForm } = useForm({
  validationSchema,
  initialValues: initialFormValues.value,
});

// ============================================
// LIFECYCLE HOOKS
// ============================================
onMounted(() => {
  console.log("[Input Step] Mounted, restoring data...");

  if (props.stepData && Object.keys(props.stepData).length > 0) {
    console.log("[Input Step] Restoring from props:", props.stepData);
    setValues(props.stepData);
  } else {
    const backup = restoreEmergencyBackup();
    if (backup) {
      console.warn("[Input Step] Restored from emergency backup");
      setValues(backup);
      clearEmergencyBackup();
    }
  }

  startWatching(() => values);
});

onBeforeUnmount(() => {
  console.log("[Input Step] Unmounting, saving data...");

  if (values && Object.keys(values).length > 0) {
    emit("update:data", values);
  }
});

// ============================================
// CROSS-PLATFORM KEYBOARD SHORTCUTS
// ============================================
useKeyboardShortcuts({
  back: {
    shortcut: { key: "ArrowLeft", alt: true },
    handler: () => {
      if (!isSaving.value) {
        handleBack(values);
      }
    },
    description: "Go back",
  },
  continue: {
    shortcut: { key: "ArrowRight", alt: true },
    handler: () => {
      if (canContinue(values) && !isSaving.value) {
        handleContinue(values);
      }
    },
    description: "Continue to next step",
  },
});

// ============================================
// WATCH FOR EXTERNAL CHANGES
// ============================================
watch(
  () => props.stepData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      Object.keys(newData).forEach((key) => {
        if (values[key] !== newData[key]) {
          setFieldValue(key, newData[key]);
        }
      });
    }
  },
  { deep: true, immediate: true }
);

// ============================================
// HANDLERS
// ============================================
function canContinue(formValues) {
  const requiredFields = props.formFields.filter((f) => f.required);
  return requiredFields.every((field) => {
    const value = formValues[field.name];
    if (field.type === "text") {
      return value && value.length >= 3;
    }
    return value && value !== "";
  });
}

async function handleContinue(formValues) {
  try {
    console.log("[Input Step] Continue clicked, saving...");

    await saveNow(formValues);
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log("[Input Step] Data saved, proceeding to next step");
    emit("continue", formValues);
  } catch (error) {
    console.error("[Input Step] Failed to continue:", error);
    alert("Failed to save your progress. Please try again.");
  }
}

async function handleBack(formValues) {
  try {
    console.log("[Input Step] Back clicked, saving...");

    await saveNow(formValues);
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log("[Input Step] Data saved, going back");
    emit("back");
  } catch (error) {
    console.error("[Input Step] Failed to go back:", error);
    alert("Failed to save your progress. Please try again.");
  }
}

function getFieldLabel(fieldName) {
  const field = props.formFields.find((f) => f.name === fieldName);
  return field?.label || fieldName;
}

// ============================================
// ERROR HANDLING
// ============================================
function handleFormError(errorInfo) {
  console.error("[Input Step] Form error caught:", errorInfo);

  if (values && Object.keys(values).length > 0) {
    const backup = {
      ...values,
      _error: errorInfo.error.message,
      _timestamp: Date.now(),
    };
    localStorage.setItem("emergency-backup-input-step", JSON.stringify(backup));
  }

  alert(
    "An error occurred with the form. Your data has been saved as a backup. " +
      "Please refresh the page or contact support if the problem persists."
  );
}

function handleRecover() {
  console.log("[Input Step] Attempting to recover...");

  const backup = restoreEmergencyBackup();
  if (backup) {
    setValues(backup);
    alert("Your data has been restored successfully.");
  }
}

function handleReset() {
  console.log("[Input Step] Resetting form...");

  resetForm({
    values: initialFormValues.value,
  });
  clearEmergencyBackup();
}
</script>

<style scoped lang="scss">
@use "./stepStyles.scss";

.form-actions {
  justify-content: space-between;
  margin-right: unset;
  margin-left: unset;
}
</style>
