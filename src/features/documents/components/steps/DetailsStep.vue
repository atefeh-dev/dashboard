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

      <!-- CLEAN: Use separate TemplateTable component -->
      <TemplateTable
        :templates="templatesStore.filteredTemplates"
        :selected-template="selectedTemplate"
        @select="handleSelectTemplate"
        @clear-filters="clearFilters"
      />
    </section>

    <!-- Document Details Form -->
    <section class="section">
      <h2 class="section__heading">Give your document some details</h2>

      <div class="form-card">
        <!-- Selected Template -->
        <div class="selected-template">
          <div class="selected-template__label-col">
            <label class="selected-template__label">Selected template</label>
            <p class="selected-template__hint">
              You can't change template after creating.
            </p>
          </div>

          <div class="selected-template__card">
            <div class="selected-template__info">
              <FileText class="selected-template__icon" />
              <div class="selected-template__text">
                <div class="selected-template__name">
                  {{ selectedTemplate?.name || "Non Disclosure Agreement" }}
                </div>
                <div class="selected-template__meta">
                  By
                  <span class="selected-template__author">{{
                    selectedTemplate?.author || "doclast"
                  }}</span>
                  <span class="selected-template__separator">•</span>
                  <span class="verified">
                    <Check class="verified__icon" />
                    Verified
                  </span>
                </div>
              </div>
            </div>

            <AppButton variant="ghost" size="sm">Change</AppButton>
          </div>
        </div>

        <!-- Name of Document -->
        <div class="form-field">
          <label class="form-field__label">
            Name of your document <span class="form-field__required">*</span>
          </label>
          <AppInput
            v-model="localForm.name"
            placeholder="For example Accelerator Contract 2025"
            @update:model-value="emitUpdate"
          />
        </div>

        <!-- File Name -->
        <div class="form-field">
          <label class="form-field__label">
            File name to save <span class="form-field__required">*</span>
          </label>
          <AppInputWithPrefix
            v-model="localForm.filename"
            prefix="doclast-"
            placeholder="accelerator-contract-2025"
            @update:model-value="emitUpdate"
          />
        </div>

        <!-- Description -->
        <div class="form-field">
          <label class="form-field__label">Description</label>
          <AppTextarea
            v-model="localForm.description"
            placeholder="Provide some details about what this document for ..."
            rows="5"
            @update:model-value="emitUpdate"
          />
          <div class="form-field__char-count">
            {{ localForm.description.length }} characters
          </div>
        </div>

        <!-- Status -->
        <div class="form-field">
          <label class="form-field__label">Status</label>
          <AppSelect
            v-model="localForm.status"
            @update:model-value="emitUpdate"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </AppSelect>
        </div>

        <!-- Action Buttons -->
        <div class="form-actions">
          <AppButton variant="ghost" size="md" @click="$emit('discard')">
            Discard
          </AppButton>
          <AppButton variant="primary" size="md" @click="$emit('continue')">
            <Plus class="form-actions__icon" />
            Create
          </AppButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { Search, FileText, Check, Plus } from "lucide-vue-next";
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

// Local form for autosave
const localForm = ref({
  name: "",
  filename: "",
  description: "",
  status: "draft",
  ...props.form,
});

// Watch for external changes
watch(
  () => props.form,
  (newForm) => {
    localForm.value = { ...localForm.value, ...newForm };
  },
  { deep: true }
);

// Emit updates for autosave
function emitUpdate() {
  emit("update:form", localForm.value);
}

function handleSelectTemplate(template) {
  emit("selectTemplate", template);
}

function clearFilters() {
  templatesStore.setSearchQuery("");
  templatesStore.setStatusFilter("verified");
  templatesStore.setTypeFilter("all");
  // Clear all tags
  templatesStore.selectedTags.forEach((tag) => {
    templatesStore.removeTag(tag);
  });
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
</style>
