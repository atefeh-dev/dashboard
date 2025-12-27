<template>
  <div class="details-step">
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

    <!-- Document Details Form -->
    <section class="section">
      <h2 class="section__heading">Give your document some details</h2>

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
                  <FileText class="selected-template__icon" />
                  <div class="selected-template__text">
                    <div class="selected-template__name">
                      {{
                        currentSelectedTemplate?.name || "No template selected"
                      }}
                    </div>
                    <div class="selected-template__meta">
                      By
                      <span class="selected-template__author">{{
                        currentSelectedTemplate?.author || "—"
                      }}</span>
                      <span
                        v-if="currentSelectedTemplate?.verified"
                        class="selected-template__separator"
                        >•</span
                      >
                      <span
                        v-if="currentSelectedTemplate?.verified"
                        class="verified"
                      >
                        <Check class="verified__icon" />
                        Verified
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
                <div v-if="errors.length && meta.touched" class="error-message">
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
                <div v-if="errors.length && meta.touched" class="error-message">
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
                  :class="{ 'count-warning': (field.value?.length || 0) > 450 }"
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
                !formValues.filename
              "
            >
              <Plus class="form-actions__icon" />
              Create
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
        </div>
      </Form>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { Search, FileText, Check, Plus, AlertCircle } from "lucide-vue-next";
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

// Use templates store
const templatesStore = useTemplatesStore();

// Local state for template
const currentSelectedTemplate = ref(null);
const templateErrorMessage = ref("");

// Validation schema with proper template validation
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
    .required("Document name is required")
    .min(3, "Document name must be at least 3 characters")
    .max(100, "Document name must not exceed 100 characters")
    .trim(),
  filename: yup
    .string()
    .required("File name is required")
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

// Initial form values
const initialFormValues = {
  templateId: "",
  name: "",
  filename: "",
  description: "",
  status: "draft",
};

// Initialize form with VeeValidate
const { values, setFieldValue, setValues, resetForm } = useForm({
  validationSchema,
  initialValues: initialFormValues,
});

// Set default template on mount
onMounted(() => {
  initializeDefaultTemplate();
});

// Initialize default template (Non Disclosure Agreement)
function initializeDefaultTemplate() {
  // If no template is selected, try to find and select the default one
  if (!currentSelectedTemplate.value && !props.selectedTemplate) {
    const defaultTemplate =
      templatesStore.filteredTemplates.find(
        (t) => t.name === "Non Disclosure Agreement"
      ) || templatesStore.filteredTemplates[0];

    if (defaultTemplate) {
      handleSelectTemplate(defaultTemplate);
    }
  } else if (props.selectedTemplate) {
    currentSelectedTemplate.value = props.selectedTemplate;
    setFieldValue("templateId", props.selectedTemplate.id);
  }
}

// Watch for external template changes
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

// Watch for external form changes
watch(
  () => props.form,
  (newForm) => {
    if (newForm.name) setFieldValue("name", newForm.name);
    if (newForm.filename) setFieldValue("filename", newForm.filename);
    if (newForm.description !== undefined)
      setFieldValue("description", newForm.description);
    if (newForm.status) setFieldValue("status", newForm.status);
  },
  { deep: true, immediate: true }
);

// Watch form values and emit updates for autosave
watch(
  values,
  (newValues) => {
    const { templateId, ...formData } = newValues;
    emit("update:form", formData);
  },
  { deep: true }
);

// Handle template selection
function handleSelectTemplate(template) {
  currentSelectedTemplate.value = template;
  setFieldValue("templateId", template.id);
  templateErrorMessage.value = "";
  emit("selectTemplate", template);
}

// Scroll to template selection
function scrollToTemplateSelection() {
  const templateSection = document.querySelector(".section");
  templateSection?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Handle form submission
async function handleSubmit(formValues) {
  // Additional validation for template
  if (!currentSelectedTemplate.value) {
    templateErrorMessage.value = "Please select a template to continue";
    scrollToTemplateSelection();
    return;
  }

  // Prepare submission data
  const submissionData = {
    ...formValues,
    template: currentSelectedTemplate.value,
  };

  // Remove templateId from the data sent to parent
  const { templateId, ...formData } = submissionData;

  emit("continue", { ...formData, template: currentSelectedTemplate.value });
}

// Handle discard
function handleDiscard() {
  resetForm({
    values: initialFormValues,
  });
  // Re-initialize default template after discard
  setTimeout(() => {
    initializeDefaultTemplate();
  }, 0);
  templateErrorMessage.value = "";
  emit("discard");
}

// Clear filters
function clearFilters() {
  templatesStore.setSearchQuery("");
  templatesStore.setStatusFilter("verified");
  templatesStore.setTypeFilter("all");
  templatesStore.clearAllTags();
}

// Format field name for error display
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
</script>

<style scoped lang="scss">
@use "./stepStyles.scss";

// Filters layout
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

// Form field states
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

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.375rem;
    min-height: 1.25rem;
  }

  &__char-count {
    font-size: 0.75rem;
    color: #6b7280;
    margin-left: auto;
    transition: color 0.2s ease;

    &.count-warning {
      color: #f59e0b;
      font-weight: 600;
    }
  }
}

// Input states
.input-error {
  border-color: #dc2626 !important;

  &:focus {
    border-color: #dc2626 !important;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
  }
}

// Error message
.error-message {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 0.375rem;
  font-weight: 500;
}

// Selected template
.selected-template {
  margin-bottom: 2rem;

  &__label-col {
    margin-bottom: 0.75rem;
  }

  &__label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.25rem;
  }

  &__hint {
    font-size: 0.75rem;
    color: #6b7280;
  }

  &__card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    background-color: #fff;
    transition: all 0.2s ease;

    &.has-error {
      border-color: #dc2626;
      background-color: #fef2f2;
    }
  }

  &__info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__icon {
    width: 2.5rem;
    height: 2.5rem;
    color: #3b82f6;
    flex-shrink: 0;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__name {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #111827;
  }

  &__meta {
    font-size: 0.8125rem;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  &__author {
    font-weight: 500;
    color: #374151;
  }

  &__separator {
    color: #d1d5db;
  }
}

// Verified badge
.verified {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #059669;
  font-weight: 500;

  &__icon {
    width: 0.875rem;
    height: 0.875rem;
  }
}

// Form summary
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

// Form actions
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
  }
}

// Animations
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

// Disabled button state
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
