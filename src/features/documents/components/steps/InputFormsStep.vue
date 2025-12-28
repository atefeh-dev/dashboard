<template>
  <!-- Main Content -->
  <div class="input-forms-step">
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
                <div v-if="errors.length && meta.touched" class="error-message">
                  {{ errors[0] }}
                </div>
              </transition>

              <!-- Hint Text -->
              <p v-if="field.hint && !errors.length" class="form-field__hint">
                {{ field.hint }}
              </p>
            </div>
          </Field>

          <!-- Navigation Buttons -->
          <div class="form-actions">
            <AppButton
              type="button"
              variant="ghost"
              size="md"
              @click="handleBack"
            >
              <ChevronLeft class="form-actions__icon" />
              Back
            </AppButton>
            <AppButton
              type="submit"
              variant="primary"
              size="md"
              :disabled="!canContinue(formValues)"
            >
              Continue
              <ChevronRight class="form-actions__icon" />
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
                    <strong>{{ getFieldLabel(fieldName) }}:</strong> {{ error }}
                  </li>
                </ul>
              </div>
            </div>
          </transition>
        </div>
      </Form>
    </section>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-vue-next";
import { Form, Field, useForm } from "vee-validate";
import * as yup from "yup";
import AppButton from "@/components/ui/AppButton.vue";
import AppInput from "@/components/ui/AppInput.vue";
import AppTextarea from "@/components/ui/AppTextarea.vue";
import AppSelect from "@/components/ui/AppSelect.vue";

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
// VALIDATION RULES - Easy to modify here
// ============================================
function createFieldValidation(field) {
  let validation;

  // Base validation by type
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
      // Textarea can be empty, no minimum required
      validation = yup.string();
      break;

    case "text":
    default:
      // Only apply min(3) if field is required
      validation = field.required
        ? yup.string().min(3, `${field.label} must be at least 3 characters`)
        : yup.string();
      break;
  }

  // Add required validation
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

// Build validation schema
const validationSchema = computed(() => {
  const schema = {};
  props.formFields.forEach((field) => {
    schema[field.name] = createFieldValidation(field);
  });
  return yup.object(schema);
});

// ============================================
// FORM SETUP
// ============================================
const initialFormValues = computed(() => {
  const values = {};
  props.formFields.forEach((field) => {
    values[field.name] = props.stepData[field.name] || "";
  });
  return values;
});

const { values, setFieldValue } = useForm({
  validationSchema,
  initialValues: initialFormValues.value,
});

// Watch for external changes
watch(
  () => props.stepData,
  (newData) => {
    Object.keys(newData).forEach((key) => {
      if (values[key] !== newData[key]) {
        setFieldValue(key, newData[key]);
      }
    });
  },
  { deep: true, immediate: true }
);

// Autosave
watch(
  values,
  (newValues) => {
    emit("update:data", newValues);
  },
  { deep: true }
);

// ============================================
// HANDLERS
// ============================================
function canContinue(formValues) {
  const requiredFields = props.formFields.filter((f) => f.required);
  return requiredFields.every((field) => {
    const value = formValues[field.name];
    // Required text fields need at least 3 characters
    // Other required fields just need to have a value
    if (field.type === "text") {
      return value && value.length >= 3;
    }
    return value && value !== "";
  });
}

function handleContinue(formValues) {
  emit("continue", formValues);
}

function handleBack() {
  emit("back");
}

function getFieldLabel(fieldName) {
  const field = props.formFields.find((f) => f.name === fieldName);
  return field?.label || fieldName;
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
