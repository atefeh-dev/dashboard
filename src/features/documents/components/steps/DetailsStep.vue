<template>
  <div class="details-step">
    <ErrorBoundary
      fallback-title="Template Selection Error"
      fallback-message="Something went wrong with template selection. Your document details have been saved."
      @error="handleFormError"
      @recover="handleRecover"
    >
      <!-- Template Selector Section -->
      <section class="section">
        <h2 class="section__heading">Select a template</h2>
        <p class="section__description">
          Choose from our library of pre-built and verified templates to create
          your document
        </p>

        <!-- Search -->
        <div class="search-box">
          <Search class="search-box__icon" />
          <AppInput
            :model-value="templatesStore.searchQuery"
            type="text"
            placeholder="Or try typing a keyword, for example NDA"
            class="search-box__input-field"
            @update:model-value="templatesStore.setSearchQuery"
          />
          <kbd class="search-box__kbd">⌘K</kbd>
        </div>

        <!-- Filters -->
        <div class="filters">
          <div class="filters__group">
            <label class="filters__label">Status</label>
            <AppSelect
              :model-value="templatesStore.statusFilter"
              @update:model-value="templatesStore.setStatusFilter"
            >
              <option value="" disabled selected hidden>Select status</option>
              <option value="verified">Verified</option>
              <option value="all">All</option>
            </AppSelect>
          </div>

          <div class="filters__group">
            <label class="filters__label">Type</label>
            <AppSelect
              :model-value="templatesStore.typeFilter"
              @update:model-value="templatesStore.setTypeFilter"
            >
              <option value="" disabled selected hidden>Select type</option>
              <option value="all">All</option>
              <option value="agreement">Agreement</option>
              <option value="contract">Contract</option>
            </AppSelect>
          </div>

          <div class="filters__group">
            <label class="filters__label">Tag</label>
            <AppTagInput
              :tags="templatesStore.selectedTags"
              :max-visible="2"
              placeholder="Type tag and press Enter..."
              @add-tag="templatesStore.addTag"
              @remove-tag="templatesStore.removeTag"
            />
          </div>
        </div>

        <!-- Template Table -->
        <TemplateTable
          :templates="templatesStore.filteredTemplates"
          :selected-template="currentSelectedTemplate"
          @select="handleSelectTemplate"
          @clear-filters="clearFilters"
        />

        <!-- Template Selection Error -->
        <transition name="fade">
          <div v-if="templateErrorMessage" class="error-message">
            {{ templateErrorMessage }}
          </div>
        </transition>
      </section>

      <!-- Divider with Heading -->
      <div class="section-divider">
        <span class="section-divider__text"
          >Give your document some details</span
        >
      </div>

      <!-- Document Details Form -->
      <section class="section section--form">
        <Form
          :validation-schema="validationSchema"
          :initial-values="initialFormValues"
          @submit="handleSubmit"
          v-slot="{ meta: formMeta, errors: formErrors, values: formValues }"
        >
          <div class="form-card">
            <!-- Selected Template (Hidden Field for Validation) -->
            <Field name="templateId" v-slot="{ field, errors: templateErrors }">
              <input type="hidden" v-bind="field" />

              <div class="selected-template">
                <div class="selected-template__label-col">
                  <label class="selected-template__label"
                    >Selected template</label
                  >
                  <p class="selected-template__hint">
                    You can't change template after creating.
                  </p>
                </div>

                <div
                  class="selected-template__card"
                  :class="{
                    'has-error': templateErrors.length && formMeta.touched,
                  }"
                >
                  <div class="selected-template__info">
                    <FileTypeIcon class="selected-template__icon" />
                    <div class="selected-template__text">
                      <div class="selected-template__name">
                        {{
                          currentSelectedTemplate?.name ||
                          "No template selected"
                        }}
                      </div>
                      <div class="selected-template__meta">
                        By
                        <span class="selected-template__author">{{
                          currentSelectedTemplate?.author || "—"
                        }}</span>
                        <span class="selected-template__verify">
                          <VerifiedTickIcon /> Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  <AppButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    @click="scrollToTemplateSelection"
                  >
                    {{ currentSelectedTemplate ? "Change" : "Select" }}
                  </AppButton>
                </div>
              </div>
            </Field>

            <!-- Name of Document -->
            <Field name="name" v-slot="{ field, errors, meta }">
              <div
                class="form-field"
                :class="{
                  'has-error': errors.length && meta.touched,
                }"
              >
                <label class="form-field__label">
                  Name of your document
                  <span class="form-field__required">*</span>
                </label>
                <AppInput
                  v-bind="field"
                  placeholder="For example Accelerator Contract 2025"
                  :class="{
                    'input-error': errors.length && meta.touched,
                  }"
                />
                <transition name="fade">
                  <div
                    v-if="errors.length && meta.touched"
                    class="error-message"
                  >
                    {{ errors[0] }}
                  </div>
                </transition>
              </div>
            </Field>

            <!-- File Name -->
            <Field
              name="filename"
              v-slot="{ value, errors, meta, handleChange, handleBlur }"
            >
              <div
                class="form-field"
                :class="{
                  'has-error': errors.length && meta.touched,
                }"
              >
                <label class="form-field__label">
                  File name to save <span class="form-field__required">*</span>
                </label>
                <AppInputWithPrefix
                  :model-value="value"
                  @update:model-value="handleChange"
                  @blur="handleBlur"
                  prefix="doclast-"
                  placeholder="accelerator-contract-2025"
                  :class="{
                    'input-error': errors.length && meta.touched,
                  }"
                />
                <transition name="fade">
                  <div
                    v-if="errors.length && meta.touched"
                    class="error-message"
                  >
                    {{ errors[0] }}
                  </div>
                  <div v-else class="form-field__hint">
                    Use lowercase letters, numbers, and hyphens only
                  </div>
                </transition>
              </div>
            </Field>

            <!-- Description -->
            <Field name="description" v-slot="{ field, errors, meta }">
              <div
                class="form-field"
                :class="{
                  'has-error': errors.length && meta.touched,
                }"
              >
                <label class="form-field__label">Description</label>
                <AppTextarea
                  v-bind="field"
                  placeholder="Provide some details about what this document for ..."
                  rows="5"
                  :class="{
                    'input-error': errors.length && meta.touched,
                  }"
                />
                <div class="form-field__footer">
                  <transition name="fade">
                    <div
                      v-if="errors.length && meta.touched"
                      class="error-message"
                    >
                      {{ errors[0] }}
                    </div>
                  </transition>
                  <div
                    class="form-field__char-count"
                    :class="{
                      'count-warning': (field.value?.length || 0) > 450,
                    }"
                  >
                    {{ field.value?.length || 0 }} / 500 characters
                  </div>
                </div>
              </div>
            </Field>

            <!-- Status -->
            <Field name="status" v-slot="{ field }">
              <div class="form-field">
                <label class="form-field__label">Status</label>
                <AppSelect v-bind="field">
                  <option value="" disabled selected hidden>
                    Select status
                  </option>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </AppSelect>
              </div>
            </Field>

            <!-- Action Buttons -->
            <div class="form-actions">
              <AppButton
                type="button"
                variant="ghost"
                size="md"
                :disabled="isSaving"
                @click="handleDiscard"
              >
                Discard
              </AppButton>
              <AppButton
                type="submit"
                variant="primary"
                size="md"
                :disabled="
                  !currentSelectedTemplate ||
                  !formValues.name ||
                  !formValues.filename ||
                  isSaving
                "
              >
                <Loader
                  v-if="isSaving"
                  class="form-actions__icon animate-spin"
                />
                <Plus v-else class="form-actions__icon" />
                {{ isSaving ? "Creating..." : "Create" }}
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
                    <li v-for="(error, field) in formErrors" :key="field">
                      <strong>{{ formatFieldName(field) }}:</strong> {{ error }}
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
          </div>
        </Form>
      </section>
    </ErrorBoundary>
  </div>
</template>

<script setup>
// ... (keep all your existing script - no changes needed)
import {
  ref,
  computed,
  onMounted,
  watch,
  nextTick,
  onBeforeUnmount,
} from "vue";
import {
  Search,
  FileText,
  Check,
  Plus,
  AlertCircle,
  Loader,
} from "lucide-vue-next";
import { Form, Field, useForm } from "vee-validate";
import * as yup from "yup";
import { useTemplatesStore } from "@/stores/useTemplatesStore";
import AppButton from "@/components/ui/AppButton.vue";
import AppInput from "@/components/ui/AppInput.vue";
import AppInputWithPrefix from "@/components/ui/AppInputWithPrefix.vue";
import AppSelect from "@/components/ui/AppSelect.vue";
import AppTextarea from "@/components/ui/AppTextarea.vue";
import AppTagInput from "@/components/ui/AppTagInput.vue";
import TemplateTable from "./TemplateTable.vue";
import ErrorBoundary from "./ErrorBoundary.vue";
import { useFormPersistence } from "@/composables/useFormPersistence";
import { getShortcutLabels } from "@/composables/useKeyboardShortcuts";
import FileTypeIcon from "@/assets/icons/common/file-type-icon.svg";
import VerifiedTickIcon from "@/assets/icons/common/verified-tick.svg";

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
  selectedTemplate: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits([
  "continue",
  "discard",
  "selectTemplate",
  "update:form",
]);

const shortcutLabels = getShortcutLabels();
const templatesStore = useTemplatesStore();

const {
  isSaving,
  saveNow,
  startWatching,
  restoreEmergencyBackup,
  clearEmergencyBackup,
} = useFormPersistence(
  "details-step",
  async (data) => {
    const { templateId, ...formData } = data;
    emit("update:form", formData);
    await new Promise((resolve) => setTimeout(resolve, 50));
  },
  {
    debounceMs: 500,
    enableEmergencyBackup: true,
    logChanges: import.meta.env.DEV,
  }
);

const currentSelectedTemplate = ref(null);
const templateErrorMessage = ref("");

const validationSchema = yup.object({
  templateId: yup
    .string()
    .nullable()
    .test(
      "template-required",
      "Please select a template to continue",
      () => currentSelectedTemplate.value !== null
    ),
  name: yup
    .string()
    .min(3, "Document name must be at least 3 characters")
    .max(100, "Document name must not exceed 100 characters")
    .required("Document name is required")
    .trim(),
  filename: yup
    .string()
    .min(3, "File name must be at least 3 characters")
    .max(50, "File name must not exceed 50 characters")
    .matches(
      /^[a-z0-9-]+$/,
      "File name can only contain lowercase letters, numbers, and hyphens"
    )
    .matches(/^[a-z]/, "File name must start with a letter")
    .matches(/[a-z0-9]$/, "File name must end with a letter or number")
    .test(
      "no-consecutive-hyphens",
      "File name cannot contain consecutive hyphens",
      (value) => !value?.includes("--")
    )
    .required("File name is required")
    .trim(),
  description: yup
    .string()
    .max(500, "Description must not exceed 500 characters")
    .notRequired()
    .transform((value) => value || ""),
  status: yup
    .string()
    .oneOf(["draft", "active", "archived"], "Invalid status")
    .default("draft"),
});

const initialFormValues = computed(() => ({
  templateId: currentSelectedTemplate.value?.id || "",
  name: props.form.name || "",
  filename: props.form.filename || "",
  description: props.form.description || "",
  status: props.form.status || "draft",
}));

const { values, setFieldValue, setValues, resetForm } = useForm({
  validationSchema,
  initialValues: initialFormValues.value,
});

onMounted(() => {
  initializeDefaultTemplate();

  if (props.form && Object.keys(props.form).length > 0) {
    if (props.form.name) setFieldValue("name", props.form.name);
    if (props.form.filename) setFieldValue("filename", props.form.filename);
    if (props.form.description !== undefined)
      setFieldValue("description", props.form.description);
    if (props.form.status) setFieldValue("status", props.form.status);
  } else {
    const backup = restoreEmergencyBackup();
    if (backup) {
      setValues(backup);
      clearEmergencyBackup();
    }
  }

  startWatching(() => values);
  setupKeyboardShortcuts();
});

onBeforeUnmount(() => {
  if (values && Object.keys(values).length > 0) {
    const { templateId, ...formData } = values;
    emit("update:form", formData);
  }
  cleanupKeyboardShortcuts();
});

watch(
  () => props.form,
  (newForm) => {
    if (newForm && Object.keys(newForm).length > 0) {
      if (newForm.name !== values.name)
        setFieldValue("name", newForm.name || "");
      if (newForm.filename !== values.filename)
        setFieldValue("filename", newForm.filename || "");
      if (newForm.description !== values.description)
        setFieldValue("description", newForm.description || "");
      if (newForm.status !== values.status)
        setFieldValue("status", newForm.status || "draft");
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => props.selectedTemplate,
  (newTemplate) => {
    if (newTemplate && newTemplate.id !== currentSelectedTemplate.value?.id) {
      currentSelectedTemplate.value = newTemplate;
      setFieldValue("templateId", newTemplate.id);
    }
  },
  { immediate: true }
);

let keyboardHandler = null;

function setupKeyboardShortcuts() {
  keyboardHandler = (e) => {
    if (
      e.key === "Escape" &&
      !e.shiftKey &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey
    ) {
      e.preventDefault();
      if (!isSaving.value) handleDiscard();
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

function initializeDefaultTemplate() {
  if (props.selectedTemplate) {
    currentSelectedTemplate.value = props.selectedTemplate;
    setFieldValue("templateId", props.selectedTemplate.id);
    return;
  }

  if (!currentSelectedTemplate.value) {
    const defaultTemplate =
      templatesStore.filteredTemplates.find(
        (t) => t.name === "Non Disclosure Agreement"
      ) || templatesStore.filteredTemplates[0];

    if (defaultTemplate) handleSelectTemplate(defaultTemplate);
  }
}

function handleSelectTemplate(template) {
  currentSelectedTemplate.value = template;
  setFieldValue("templateId", template.id);
  templateErrorMessage.value = "";
  emit("selectTemplate", template);
}

function scrollToTemplateSelection() {
  const templateSection = document.querySelector(".section");
  templateSection?.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function handleSubmit(formValues) {
  if (!currentSelectedTemplate.value) {
    templateErrorMessage.value = "Please select a template to continue";
    scrollToTemplateSelection();
    return;
  }

  try {
    await saveNow(formValues);
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const { templateId, ...formData } = formValues;
    emit("continue", { ...formData, template: currentSelectedTemplate.value });
  } catch (error) {
    console.error("[Details Step] Failed to submit:", error);
    alert("Failed to save your progress. Please try again.");
  }
}

function handleDiscard() {
  const confirmed = confirm(
    "Are you sure you want to discard? All your changes will be lost."
  );

  if (confirmed) {
    resetForm({
      values: {
        templateId: "",
        name: "",
        filename: "",
        description: "",
        status: "draft",
      },
    });

    setTimeout(() => {
      initializeDefaultTemplate();
    }, 0);

    templateErrorMessage.value = "";
    clearEmergencyBackup();
    emit("discard");
  }
}

function clearFilters() {
  templatesStore.setSearchQuery("");
  templatesStore.setStatusFilter("verified");
  templatesStore.setTypeFilter("all");
  templatesStore.clearAllTags();
}

function formatFieldName(fieldName) {
  const fieldNames = {
    templateId: "Template",
    name: "Document name",
    filename: "File name",
    description: "Description",
    status: "Status",
  };
  return fieldNames[fieldName] || fieldName;
}

function handleFormError(errorInfo) {
  console.error("[Details Step] Error caught:", errorInfo);
  if (values && Object.keys(values).length > 0) {
    localStorage.setItem(
      "emergency-backup-details-step",
      JSON.stringify(values)
    );
  }
}

function handleRecover() {
  const backup = restoreEmergencyBackup();
  if (backup) setValues(backup);
}
</script>

<style scoped lang="scss">
@use "./stepStyles.scss";

// NEW: Section Divider with Text

.section-divider {
  position: relative;
  display: flex;
  align-items: center;
  margin: 3.5rem 0 3rem 0;

  &::before {
    content: "";
    flex: 1;
    height: 1px;
    background-color: #e9eaeb;
  }

  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background-color: #e9eaeb;
  }

  &__text {
    padding: 0 1.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    color: #181d27;
    white-space: nowrap;
  }
}

// Update section spacing
.section {
  &--form {
    margin-top: 0; // Remove extra top margin since divider handles it
  }
}

.filters {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }

  &__group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
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
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;

  &__icon {
    width: 1rem;
    height: 1rem;

    &.animate-spin {
      animation: spin 1s linear infinite;
    }
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
