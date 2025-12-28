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
                  :class="{ 'input-error': errors.length && meta.touched }"
                >
                  <option value="" disabled>Select an option</option>
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

            <!-- Save Status Indicator -->
            <transition name="fade">
              <div
                v-if="showSaveStatus"
                class="save-status"
                :class="saveStatusClass"
              >
                <component :is="saveStatusIcon" class="save-status__icon" />
                <span class="save-status__text">{{ saveStatusText }}</span>
              </div>
            </transition>

            <!-- Navigation Buttons -->
            <div class="form-actions">
              <AppButton
                type="button"
                variant="ghost"
                size="md"
                :disabled="isSaving"
                @click="handleBack(formValues)"
              >
                <Loader
                  v-if="isSaving"
                  class="form-actions__icon animate-spin"
                />
                <ChevronLeft v-else class="form-actions__icon" />
                {{ isSaving ? "Saving..." : "Back" }}
              </AppButton>
              <AppButton
                type="submit"
                variant="primary"
                size="md"
                :disabled="!canContinue(formValues) || isSaving"
              >
                {{ isSaving ? "Saving..." : "Continue" }}
                <Loader
                  v-if="isSaving"
                  class="form-actions__icon animate-spin"
                />
                <ChevronRight v-else class="form-actions__icon" />
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
                    <li
                      v-for="(error, fieldName) in formErrors"
                      :key="fieldName"
                    >
                      <strong>{{ getFieldLabel(fieldName) }}:</strong>
                      {{ error }}
                    </li>
                  </ul>
                </div>
              </div>
            </transition>

            <!-- Keyboard Shortcuts Hint -->
            <div class="keyboard-hints">
              <kbd class="kbd">Alt</kbd> + <kbd class="kbd">←</kbd> Back
              <span class="keyboard-hints__separator">•</span>
              <kbd class="kbd">Alt</kbd> + <kbd class="kbd">→</kbd> Continue
            </div>
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
  Check,
  AlertTriangle,
  Save,
} from "lucide-vue-next";
import { Form, Field, useForm } from "vee-validate";
import * as yup from "yup";
import AppButton from "@/components/ui/AppButton.vue";
import AppInput from "@/components/ui/AppInput.vue";
import AppTextarea from "@/components/ui/AppTextarea.vue";
import AppSelect from "@/components/ui/AppSelect.vue";
import ErrorBoundary from "./ErrorBoundary.vue";
import { useFormPersistence } from "@/composables/useFormPersistence";

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

// ============================================
// FORM PERSISTENCE SETUP
// ============================================
const {
  isSaving,
  lastSaveTime,
  saveError,
  saveNow,
  startWatching,
  restoreEmergencyBackup,
  clearEmergencyBackup,
} = useFormPersistence(
  "input-step",
  async (data) => {
    // Emit to parent for autosave
    emit("update:data", data);
    // Wait a bit to ensure parent processes
    await new Promise((resolve) => setTimeout(resolve, 50));
  },
  {
    debounceMs: 500,
    enableEmergencyBackup: true,
    logChanges: import.meta.env.DEV,
  }
);

// Save status indicator
const showSaveStatus = ref(false);
const saveStatusType = ref("idle"); // 'idle', 'saving', 'saved', 'error'

const saveStatusClass = computed(() => ({
  "save-status--saving": saveStatusType.value === "saving",
  "save-status--saved": saveStatusType.value === "saved",
  "save-status--error": saveStatusType.value === "error",
}));

const saveStatusIcon = computed(() => {
  switch (saveStatusType.value) {
    case "saving":
      return Loader;
    case "saved":
      return Check;
    case "error":
      return AlertTriangle;
    default:
      return Save;
  }
});

const saveStatusText = computed(() => {
  switch (saveStatusType.value) {
    case "saving":
      return "Saving...";
    case "saved":
      return "All changes saved";
    case "error":
      return "Save failed (backup created)";
    default:
      return "";
  }
});

// Watch save status
watch(isSaving, (saving) => {
  if (saving) {
    saveStatusType.value = "saving";
    showSaveStatus.value = true;
  }
});

watch(lastSaveTime, () => {
  saveStatusType.value = "saved";
  showSaveStatus.value = true;
  // Hide after 2 seconds
  setTimeout(() => {
    showSaveStatus.value = false;
  }, 2000);
});

watch(saveError, (error) => {
  if (error) {
    saveStatusType.value = "error";
    showSaveStatus.value = true;
  }
});

// ============================================
// VALIDATION RULES (FIXED)
// ============================================
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

  // Add max length if specified
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

// ============================================
// FORM SETUP WITH DATA RESTORATION
// ============================================
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

  // Try to restore from saved data first
  if (props.stepData && Object.keys(props.stepData).length > 0) {
    console.log("[Input Step] Restoring from props:", props.stepData);
    setValues(props.stepData);
  } else {
    // Try emergency backup
    const backup = restoreEmergencyBackup();
    if (backup) {
      console.warn("[Input Step] Restored from emergency backup");
      setValues(backup);
      // Clear the backup after successful restore
      clearEmergencyBackup();
    }
  }

  // Start watching for changes
  startWatching(() => values);

  // Setup keyboard shortcuts
  setupKeyboardShortcuts();
});

onBeforeUnmount(() => {
  console.log("[Input Step] Unmounting, saving data...");

  // Save current state before unmounting
  if (values && Object.keys(values).length > 0) {
    emit("update:data", values);
  }

  // Cleanup keyboard listeners
  cleanupKeyboardShortcuts();
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
let keyboardHandler = null;

function setupKeyboardShortcuts() {
  keyboardHandler = (e) => {
    // Alt + Left Arrow: Go back
    if (
      e.altKey &&
      e.key === "ArrowLeft" &&
      !e.shiftKey &&
      !e.ctrlKey &&
      !e.metaKey
    ) {
      e.preventDefault();
      if (!isSaving.value) {
        handleBack(values);
      }
    }

    // Alt + Right Arrow: Continue (if valid)
    if (
      e.altKey &&
      e.key === "ArrowRight" &&
      !e.shiftKey &&
      !e.ctrlKey &&
      !e.metaKey
    ) {
      e.preventDefault();
      if (canContinue(values) && !isSaving.value) {
        handleContinue(values);
      }
    }
  };

  window.addEventListener("keydown", keyboardHandler);
}

function cleanupKeyboardShortcuts() {
  if (keyboardHandler) {
    window.removeEventListener("keydown", keyboardHandler);
    keyboardHandler = null;
  }
}

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
// HANDLERS WITH IMPROVED PERSISTENCE
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

    // Save and wait for completion
    await saveNow(formValues);

    // Wait for next tick to ensure all updates propagate
    await nextTick();

    // Small additional delay for parent state updates
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

    // Save and wait for completion
    await saveNow(formValues);

    // Wait for next tick
    await nextTick();

    // Small additional delay
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

  // Save current data to emergency backup
  if (values && Object.keys(values).length > 0) {
    const backup = {
      ...values,
      _error: errorInfo.error.message,
      _timestamp: Date.now(),
    };
    localStorage.setItem("emergency-backup-input-step", JSON.stringify(backup));
  }

  // Show user-friendly message
  alert(
    "An error occurred with the form. Your data has been saved as a backup. " +
      "Please refresh the page or contact support if the problem persists."
  );
}

function handleRecover() {
  console.log("[Input Step] Attempting to recover...");

  // Try to restore from backup
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

.form-field {
  position: relative;
  margin-bottom: 1.5rem;

  &.has-error {
    .form-field__label {
      color: #dc2626;
    }
  }

  &__label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
    transition: color 0.2s ease;
  }

  &__required {
    color: #dc2626;
  }

  &__hint {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.375rem;
  }
}

.input-error {
  border-color: #dc2626 !important;

  &:focus {
    border-color: #dc2626 !important;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
  }
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 0.375rem;
  font-weight: 500;
}

.save-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  margin-bottom: 1rem;
  transition: all 0.2s ease;

  &--saving {
    background-color: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1e40af;
  }

  &--saved {
    background-color: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
  }

  &--error {
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    color: #991b1b;
  }

  &__icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;

    &.animate-spin {
      animation: spin 1s linear infinite;
    }
  }

  &__text {
    flex: 1;
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

.form-summary {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  margin-top: 1.5rem;

  &__icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    color: #dc2626;
    margin-top: 0.125rem;
  }

  &__content {
    flex: 1;
  }

  &__title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #991b1b;
    margin-bottom: 0.5rem;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 0.8125rem;
    color: #991b1b;

    li {
      margin-bottom: 0.25rem;

      &:last-child {
        margin-bottom: 0;
      }

      strong {
        font-weight: 600;
      }
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
  }
}

.keyboard-hints {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  font-size: 0.75rem;
  color: #6b7280;
  background-color: #f9fafb;
  border-radius: 0.375rem;

  &__separator {
    margin: 0 0.25rem;
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
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
