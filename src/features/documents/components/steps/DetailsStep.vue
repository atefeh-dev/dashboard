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
            placeholder="Type tag and press Enter..."
            @add-tag="templatesStore.addTag"
            @remove-tag="templatesStore.removeTag"
          />
        </div>
      </div>

      <!-- Templates Table -->
      <!-- Templates Table -->
      <div class="table-card">
        <div class="data-table">
          <div class="data-table__wrapper">
            <table class="data-table__table">
              <thead class="data-table__head">
                <tr class="data-table__row data-table__row--header">
                  <th class="data-table__header">Name</th>
                  <th class="data-table__header">Author</th>
                  <th class="data-table__header">Last update</th>
                  <th class="data-table__header">Tag</th>
                  <th class="data-table__header">Action</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="template in templatesStore.filteredTemplates"
                  :key="template.id"
                  class="data-table__row"
                  :class="{
                    'data-table__row--selected':
                      selectedTemplate?.id === template.id,
                  }"
                >
                  <td class="data-table__cell">
                    <div class="template-name">
                      <FileText class="template-name__icon" />
                      <span class="data-table__name">
                        {{ template.name }}
                      </span>
                    </div>
                  </td>

                  <td class="data-table__cell data-table__domain">
                    {{ template.author }}
                  </td>

                  <td class="data-table__cell data-table__date">
                    {{ template.lastUpdate }}
                  </td>

                  <td class="data-table__cell">
                    <div class="data-table__categories">
                      <span
                        v-for="(tag, idx) in template.tags.slice(0, 3)"
                        :key="idx"
                        class="data-table__tag"
                      >
                        {{ tag }}
                      </span>

                      <span
                        v-if="template.tags.length > 3"
                        class="data-table__badge"
                      >
                        +{{ template.tags.length - 3 }}
                      </span>
                    </div>
                  </td>

                  <td class="data-table__cell">
                    <AppButton
                      variant="primary"
                      size="sm"
                      @click="handleSelectTemplate(template)"
                    >
                      Use
                    </AppButton>
                  </td>
                </tr>

                <tr
                  v-if="templatesStore.filteredTemplates.length === 0"
                  class="data-table__row"
                >
                  <td class="data-table__empty" colspan="5">
                    No templates found matching your filters
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
            v-model="form.name"
            placeholder="For example Accelerator
          Contract 2025"
          />
        </div>

        <!-- File Name -->
        <div class="form-field">
          <label class="form-field__label">
            File name to save <span class="form-field__required">*</span>
          </label>
          <AppInputWithPrefix
            v-model="form.filename"
            prefix="doclast-"
            placeholder="accelerator-contract-2025"
          />
        </div>

        <!-- Description -->
        <div class="form-field">
          <label class="form-field__label">Description</label>
          <AppTextarea
            v-model="form.description"
            placeholder="Provide some details about what this document for ..."
            rows="5"
          />
          <div class="form-field__char-count">
            {{ form.description.length }} characters left
          </div>
        </div>

        <!-- Status -->
        <div class="form-field">
          <label class="form-field__label">Status</label>
          <AppSelect v-model="form.status">
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
import { Search, FileText, Check, Plus } from "lucide-vue-next";
import { useTemplatesStore } from "@/stores/useTemplatesStore";
import AppButton from "@/components/ui/AppButton.vue";
import AppInput from "@/components/ui/AppInput.vue";
import AppInputWithPrefix from "@/components/ui/AppInputWithPrefix.vue";
import AppSelect from "@/components/ui/AppSelect.vue";
import AppTextarea from "@/components/ui/AppTextarea.vue";
import AppTagInput from "@/components/ui/AppTagInput.vue";

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

const emit = defineEmits(["continue", "discard", "selectTemplate"]);

// Use templates store
const templatesStore = useTemplatesStore();

function handleSelectTemplate(template) {
  emit("selectTemplate", template);
}
</script>

<style scoped lang="scss">
@use "./stepStyles.scss";

@use "../../../../assets/styles/table-mixins" as *;
@include table-base-styles("data-table");

// Additional styles for empty state
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;

  &__icon {
    width: 3rem;
    height: 3rem;
    color: #d1d5db;
    margin-bottom: 1rem;
  }

  &__text {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1rem;
  }
}

// Badge modifier for +N more tags
.badge--more {
  background-color: #f3f4f6;
  color: #6b7280;
}
</style>
