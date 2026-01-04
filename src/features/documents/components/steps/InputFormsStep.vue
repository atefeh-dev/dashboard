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
            <h2 class="section__heading">{{ stepTitle }}</h2>
            <p class="section__description">{{ stepDescription }}</p>
          </div>
          <div v-if="allowRepeat" class="repeat-badge">
            <InfoCircle class="repeat-badge__icon" />
            <span>You can repeat this item</span>
          </div>
        </div>

        <!-- Repeated Items List (if multiple) -->
        <div v-if="items.length > 1" class="items-tabs">
          <button
            v-for="(item, index) in items"
            :key="item.id"
            class="items-tabs__tab"
            :class="{ 'items-tabs__tab--active': currentItemIndex === index }"
            @click="switchToItem(index)"
          >
            {{ stepTitle }} {{ index + 1 }}
            <button
              v-if="items.length > 1"
              class="items-tabs__remove"
              @click.stop="removeItem(index)"
              :title="`Remove ${stepTitle} ${index + 1}`"
            >
              <X class="items-tabs__remove-icon" />
            </button>
          </button>
        </div>

        <Form
          :key="formKey"
          :validation-schema="validationSchema"
          :initial-values="currentItemData"
          @submit="handleContinue"
          v-slot="{ meta: formMeta, errors: formErrors, values: formValues }"
        >
          <!-- Watch formValues and store them for switching -->
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
                  @update:model-value="
                    handleFieldUpdate(field.name, $event, formValues)
                  "
                />

                <!-- Email Input -->
                <AppInput
                  v-else-if="field.type === 'email'"
                  v-bind="fieldProps"
                  type="email"
                  :placeholder="field.placeholder"
                  :class="{ 'input-error': errors.length && meta.touched }"
                  @update:model-value="
                    handleFieldUpdate(field.name, $event, formValues)
                  "
                />

                <!-- Textarea -->
                <AppTextarea
                  v-else-if="field.type === 'textarea'"
                  v-bind="fieldProps"
                  :placeholder="field.placeholder"
                  :rows="field.rows || 4"
                  :class="{ 'input-error': errors.length && meta.touched }"
                  @update:model-value="
                    handleFieldUpdate(field.name, $event, formValues)
                  "
                />

                <!-- Select -->
                <AppSelect
                  v-else-if="field.type === 'select'"
                  v-bind="fieldProps"
                  :placeholder="field.placeholder"
                  @update:model-value="
                    handleFieldUpdate(field.name, $event, formValues)
                  "
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

            <!-- Horizontal Divider -->
            <div class="form-card__divider"></div>

            <!-- Action Buttons Row -->
            <div class="form-card__actions">
              <AppButton
                type="button"
                variant="secondary"
                size="sm"
                @click="addAnotherItem"
                :disabled="!isFormFilled(formValues)"
              >
                <Plus />
                Add another ({{ stepTitle }})
              </AppButton>
              <AppButton
                type="button"
                variant="ghost"
                size="sm"
                @click="handleDiscard"
              >
                Discard
              </AppButton>
            </div>
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
import {
  AlertCircle,
  Loader,
  Plus,
  Trash2,
  X,
  Info as InfoCircle,
} from "lucide-vue-next";
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import AppButton from "@/components/ui/AppButton.vue";
import AppInput from "@/components/ui/AppInput.vue";
import AppTextarea from "@/components/ui/AppTextarea.vue";
import AppSelect from "@/components/ui/AppSelect.vue";
import ErrorBoundary from "./ErrorBoundary.vue";
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
  allowRepeat: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["continue", "back", "update:data"]);

const shortcutLabels = getShortcutLabels();
const isSaving = ref(false);

// ============================================
// REPEATABLE ITEMS MANAGEMENT
// ============================================
const items = ref([]);
const currentItemIndex = ref(0);
let nextItemId = 1;

const formKey = ref(0);

// Initialize items from stepData
function initializeItems() {
  console.log("[v0] Initializing items from stepData:", props.stepData);

  if (props.stepData?.items && Array.isArray(props.stepData.items)) {
    items.value = props.stepData.items.map((item, index) => ({
      id: nextItemId++,
      data: JSON.parse(JSON.stringify(item)),
    }));
  } else if (props.stepData && Object.keys(props.stepData).length > 0) {
    // Convert old format to new format
    items.value = [
      {
        id: nextItemId++,
        data: JSON.parse(JSON.stringify(props.stepData)),
      },
    ];
  } else {
    // Create first empty item
    items.value = [
      {
        id: nextItemId++,
        data: createEmptyItem(),
      },
    ];
  }

  console.log("[v0] Items initialized:", items.value);
}

function createEmptyItem() {
  const emptyItem = {};
  props.formFields.forEach((field) => {
    emptyItem[field.name] = "";
  });
  return emptyItem;
}

const currentItemData = computed(() => {
  const data = items.value[currentItemIndex.value]?.data || createEmptyItem();
  return JSON.parse(JSON.stringify(data));
});

function isFormFilled(formValues) {
  if (!formValues) return false;

  const requiredFields = props.formFields.filter((f) => f.required);

  // Check if all required fields in the LIVE form are filled
  return requiredFields.every((field) => {
    const value = formValues[field.name];
    if (!value) return false;

    // For text fields, check minimum length
    if (field.type === "text") {
      return value.trim().length >= 3;
    }

    // For other fields, just check if not empty
    return value.trim() !== "";
  });
}

// Fixed: Add another item only if current is filled
function addAnotherItem() {
  console.log(
    "[v0] Adding another item, current index:",
    currentItemIndex.value
  );

  const formValues = getCurrentFormValues();

  console.log("[v0] Current form values:", formValues);

  // Check if filled
  if (!isFormFilled(formValues)) {
    alert(
      `Please fill in all required fields in ${props.stepTitle} ${
        currentItemIndex.value + 1
      } before adding another.`
    );
    return;
  }

  items.value[currentItemIndex.value].data = JSON.parse(
    JSON.stringify(formValues)
  );

  // Add new empty item
  const emptyItem = createEmptyItem();
  items.value.push({
    id: nextItemId++,
    data: JSON.parse(JSON.stringify(emptyItem)),
  });

  // Switch to the new item
  currentItemIndex.value = items.value.length - 1;

  formKey.value++;

  console.log("[v0] Switched to new item index:", currentItemIndex.value);
  console.log("[v0] New item data:", items.value[currentItemIndex.value].data);

  emitUpdate();
}

function removeItem(index) {
  if (items.value.length === 1) {
    alert("You must have at least one item.");
    return;
  }

  const confirmed = confirm(
    `Are you sure you want to remove ${props.stepTitle} ${index + 1}?`
  );

  if (confirmed) {
    items.value.splice(index, 1);
    if (currentItemIndex.value >= items.value.length) {
      currentItemIndex.value = items.value.length - 1;
    }
    formKey.value++;
    emitUpdate();
  }
}

function switchToItem(index) {
  console.log("[v0] Switching from", currentItemIndex.value, "to", index);

  // Save current form data before switching
  const currentFormData = getCurrentFormValues();
  items.value[currentItemIndex.value].data = JSON.parse(
    JSON.stringify(currentFormData)
  );
  console.log("[v0] Saved current item data:", currentFormData);

  // Switch to new item
  currentItemIndex.value = index;

  formKey.value++;

  console.log("[v0] Loaded item", index, "data:", items.value[index].data);
}

function updateCurrentItem(fieldName, value) {
  if (items.value[currentItemIndex.value]) {
    items.value[currentItemIndex.value].data[fieldName] = value;
    emitUpdate();
  }
}

function emitUpdate() {
  const dataToEmit = {
    items: items.value.map((item) => JSON.parse(JSON.stringify(item.data))),
  };
  emit("update:data", dataToEmit);
}

// VALIDATION RULES
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

// ============================================
// LIFECYCLE HOOKS
// ============================================
onMounted(() => {
  console.log("[Input Step] Mounted, restoring data...");

  initializeItems();

  if (Array.isArray(props.stepData) && props.stepData.length > 0) {
    items.value = props.stepData.map((data) => ({
      id: Date.now() + Math.random(),
      data: JSON.parse(JSON.stringify(data)),
    }));
    formKey.value++;
  }
});

watch(
  () => props.stepData,
  (newStepData) => {
    console.log("[v0] stepData changed externally:", newStepData);

    if (newStepData?.items && Array.isArray(newStepData.items)) {
      items.value = newStepData.items.map((item) => ({
        id: nextItemId++,
        data: JSON.parse(JSON.stringify(item)),
      }));

      formKey.value++;

      console.log("[v0] Items restored from external data:", items.value);
    }
  },
  { deep: true }
);

onBeforeUnmount(() => {
  console.log("[Input Step] Unmounting, saving data...");
  emitUpdate();
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
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
      const currentFormValues = getCurrentFormValues();
      if (canContinue(currentFormValues) && !isSaving.value) {
        handleContinue(currentFormValues);
      }
    },
    description: "Continue to next step",
  },
});

// ============================================
// HANDLERS
// ============================================
function canContinue(formValues) {
  // Check if ALL items are filled properly
  return items.value.every((item) => {
    const requiredFields = props.formFields.filter((f) => f.required);
    return requiredFields.every((field) => {
      const value = item.data[field.name];
      if (field.type === "text") {
        return value && value.length >= 3;
      }
      return value && value !== "";
    });
  });
}

async function handleContinue(formValues) {
  try {
    console.log("[Input Step] Continue clicked, saving...");

    items.value[currentItemIndex.value].data = JSON.parse(
      JSON.stringify(formValues)
    );

    const dataToSave = {
      items: items.value.map((item) => JSON.parse(JSON.stringify(item.data))),
    };

    isSaving.value = true;
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));
    isSaving.value = false;

    console.log("[Input Step] Data saved, proceeding to next step");
    emit("continue", dataToSave);
  } catch (error) {
    console.error("[Input Step] Failed to continue:", error);
    alert("Failed to save your progress. Please try again.");
  }
}

async function handleBack() {
  try {
    console.log("[Input Step] Back clicked, saving...");

    const currentFormData = getCurrentFormValues();

    items.value[currentItemIndex.value].data = JSON.parse(
      JSON.stringify(currentFormData)
    );

    const dataToSave = {
      items: items.value.map((item) => JSON.parse(JSON.stringify(item.data))),
    };

    isSaving.value = true;
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));
    isSaving.value = false;

    console.log("[Input Step] Data saved, going back");
    emit("back");
  } catch (error) {
    console.error("[Input Step] Failed to go back:", error);
    alert("Failed to save your progress. Please try again.");
  }
}

function handleDiscard() {
  const confirmed = confirm(
    `Are you sure you want to discard all changes for ${props.stepTitle} ${
      currentItemIndex.value + 1
    }?`
  );

  if (confirmed) {
    if (items.value.length === 1) {
      // Reset to empty
      items.value[0].data = createEmptyItem();
      formKey.value++;
    } else {
      removeItem(currentItemIndex.value);
    }
    emitUpdate();
  }
}

// ============================================
// ERROR HANDLING
// ============================================
function handleFormError(errorInfo) {
  console.error("[Input Step] Form error caught:", errorInfo);

  const backup = {
    items: items.value,
    currentItemIndex: currentItemIndex.value,
    _error: errorInfo.error.message,
    _timestamp: Date.now(),
  };
  localStorage.setItem("emergency-backup-input-step", JSON.stringify(backup));

  alert(
    "An error occurred with the form. Your data has been saved as a backup."
  );
}

function handleRecover() {
  console.log("[Input Step] Attempting to recover...");

  const backup = JSON.parse(
    localStorage.getItem("emergency-backup-input-step")
  );
  if (backup?.items) {
    items.value = backup.items;
    currentItemIndex.value = backup.currentItemIndex || 0;
    formKey.value++;
    alert("Your data has been restored successfully.");
  }
}

function handleReset() {
  console.log("[Input Step] Resetting form...");

  items.value = [
    {
      id: Date.now(),
      data: {
        productName: "",
        quantity: "",
        unit: "",
        hsCode: "",
        unitPrice: "",
        description: "",
        repeatedInputs: [],
      },
    },
  ];
  currentItemIndex.value = 0;
  formKey.value++;
}

function getCurrentFormValues() {
  // Return current item data from items array
  return items.value[currentItemIndex.value]?.data || createEmptyItem();
}

function handleFieldUpdate(fieldName, value, formValues) {
  console.log("[v0] Field updated:", fieldName, "=", value);

  if (items.value[currentItemIndex.value]) {
    items.value[currentItemIndex.value].data[fieldName] = value;
  }

  emitUpdate();
}
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

.repeat-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #1e40af;
  white-space: nowrap;
}

.items-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
  overflow-x: auto;

  &__tab {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    padding-right: 2.5rem;
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;

    &:hover {
      background-color: #f3f4f6;
      border-color: #d1d5db;
    }

    &--active {
      background-color: #4539cc;
      border-color: #4539cc;
      color: #ffffff;

      .items-tabs__remove {
        color: #ffffff;

        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }

  &__remove {
    position: absolute;
    right: 0.25rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    background-color: transparent;
    border: none;
    border-radius: 0.25rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  &__remove-icon {
    width: 0.875rem;
    height: 0.875rem;
  }
}

.form-card__divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 1.5rem 0 1rem 0;
}

.form-card__actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-start;

  @media (max-width: 640px) {
    flex-direction: column;
  }
}

.button-icon {
  width: 1rem;
  height: 1rem;
}

.form-actions {
  justify-content: space-between;
  margin-right: unset;
  margin-left: unset;
}
</style>
