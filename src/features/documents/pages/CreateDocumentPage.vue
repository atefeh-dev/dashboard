<template>
  <div class="create-document">
    <!-- Top Navigation Bar -->
    <Navbar>
      <!-- LEFT -->
      <template #left>
        <button class="navbar-custom__back-btn" @click="goBack">
          <ChevronLeft class="navbar-custom__back-icon" />
          Back to documents
        </button>

        <div class="navbar-custom__breadcrumb">
          <span class="navbar-custom__breadcrumb-item">Workspace name</span>
          <ChevronRight class="navbar-custom__breadcrumb-separator" />
          <span class="navbar-custom__breadcrumb-item">Documents</span>
          <ChevronRight class="navbar-custom__breadcrumb-separator" />
          <span
            class="navbar-custom__breadcrumb-item navbar-custom__breadcrumb-item--active"
            >Name</span
          >
          <ChevronRight class="navbar-custom__breadcrumb-separator" />
          <span
            class="navbar-custom__breadcrumb-item navbar-custom__breadcrumb-item--status"
            >Draft</span
          >
        </div>
      </template>

      <!-- RIGHT -->
      <template #right>
        <button class="navbar-custom__icon-btn" aria-label="History">
          <Clock class="navbar-custom__icon" />
        </button>

        <button class="navbar-custom__icon-btn" aria-label="Settings">
          <Settings class="navbar-custom__icon" />
        </button>

        <span class="navbar-custom__autosave"> Auto saved 2 minutes ago </span>

        <AppButton variant="primary" size="md" @click="saveAndExit">
          <Download class="navbar-custom__btn-icon" />
          Save & exit
        </AppButton>
      </template>
    </Navbar>

    <!-- Multi-Step Tabs -->
    <div class="steps">
      <button
        v-for="(step, index) in steps"
        :key="step.id"
        :class="[
          'steps__item',
          {
            'steps__item--completed': index < currentStepIndex,
            'steps__item--active': index === currentStepIndex,
            'steps__item--upcoming': index > currentStepIndex,
          },
        ]"
        :disabled="index > currentStepIndex"
        @click="goToStep(index)"
      >
        <div class="steps__content">
          <span class="steps__title">{{ step.title }}</span>
          <span class="steps__subtitle">{{ step.subtitle }}</span>
        </div>
      </button>
    </div>

    <!-- Main Content -->
    <div class="create-document__content">
      <!-- Step 1: Details - Template Selector -->
      <section v-if="currentStep === 'details'" class="section">
        <h2 class="section__heading">Select a template</h2>
        <p class="section__description">
          Choose from our library of pre-built and verified templates to create
          your document
        </p>

        <!-- Search -->
        <div class="search-box">
          <Search class="search-box__icon" />
          <AppInput
            v-model="searchQuery"
            type="text"
            placeholder="Or try typing a keyword, for example NDA"
            class="search-box__input-field"
          />
          <kbd class="search-box__kbd">⌘K</kbd>
        </div>

        <!-- Filters -->
        <div class="filters">
          <div class="filters__group">
            <label class="filters__label">Status</label>
            <AppSelect v-model="filters.status">
              <option value="verified">Verified</option>
              <option value="all">All</option>
            </AppSelect>
          </div>

          <div class="filters__group">
            <label class="filters__label">Type</label>
            <AppSelect v-model="filters.type">
              <option value="all">All</option>
              <option value="agreement">Agreement</option>
              <option value="contract">Contract</option>
            </AppSelect>
          </div>

          <div class="filters__group">
            <label class="filters__label">Tag</label>
            <div class="tag-input">
              <span class="tag-input__tag">
                nda
                <X class="tag-input__remove" @click="removeTag(0)" />
              </span>
              <span class="tag-input__tag">
                non-disclouser
                <X class="tag-input__remove" @click="removeTag(1)" />
              </span>
            </div>
          </div>
        </div>

        <!-- Templates Table -->
        <div class="table-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Author</th>
                <th>Last update</th>
                <th>Tag</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="template in filteredTemplates"
                :key="template.id"
                :class="{
                  'data-table__row--selected':
                    selectedTemplate?.id === template.id,
                }"
              >
                <td>
                  <div class="template-name">
                    <FileText class="template-name__icon" />
                    <span>{{ template.name }}</span>
                  </div>
                </td>
                <td class="data-table__muted">{{ template.author }}</td>
                <td class="data-table__muted">{{ template.lastUpdate }}</td>
                <td>
                  <div class="badge-group">
                    <span
                      v-for="(tag, idx) in template.tags"
                      :key="idx"
                      class="badge"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </td>
                <td>
                  <AppButton
                    variant="primary"
                    size="sm"
                    @click="selectTemplate(template)"
                  >
                    Use
                  </AppButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Document Details Form -->
        <div class="section" style="margin-top: 3rem">
          <h2 class="section__heading">Give your document some details</h2>

          <div class="form-card">
            <!-- Selected Template -->
            <div class="selected-template">
              <div class="selected-template__label-col">
                <label class="selected-template__label"
                  >Selected template</label
                >
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
              </div>

              <div class="selected-template__action">
                <AppButton variant="ghost" size="sm">Change</AppButton>
              </div>
            </div>

            <!-- Name of Document -->
            <div class="form-field">
              <label class="form-field__label">
                Name of your document
                <span class="form-field__required">*</span>
              </label>
              <AppInput
                v-model="documentForm.name"
                placeholder="For example
              Accelerator Contract 2025"
              />
            </div>

            <!-- File Name -->
            <div class="form-field">
              <label class="form-field__label">
                File name to save <span class="form-field__required">*</span>
              </label>
              <AppInputWithPrefix
                v-model="documentForm.filename"
                prefix="doclast-"
                placeholder="accelerator-contract-2025"
              />
            </div>

            <!-- Description -->
            <div class="form-field">
              <label class="form-field__label">Description</label>
              <AppTextarea
                v-model="documentForm.description"
                placeholder="Provide some details about what this document for ..."
                rows="5"
              />
              <div class="form-field__char-count">
                {{ documentForm.description.length }} characters left
              </div>
            </div>

            <!-- Status -->
            <div class="form-field">
              <label class="form-field__label">Status</label>
              <AppSelect v-model="documentForm.status">
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </AppSelect>
            </div>

            <!-- Action Buttons -->
            <div class="form-actions">
              <AppButton variant="ghost" size="md" @click="discard">
                Discard
              </AppButton>
              <AppButton variant="primary" size="md" @click="completeStep">
                <Plus class="form-actions__icon" />
                Create
              </AppButton>
            </div>
          </div>
        </div>
      </section>

      <!-- Step 2: Input Forms (Placeholder) -->
      <section v-if="currentStep === 'input'" class="section">
        <h2 class="section__heading">Input forms</h2>
        <p class="section__description">Based on template needs</p>
        <div class="form-card">
          <p>Input forms content goes here...</p>
          <div class="form-actions">
            <AppButton variant="ghost" size="md" @click="previousStep"
              >Back</AppButton
            >
            <AppButton variant="primary" size="md" @click="completeStep"
              >Continue</AppButton
            >
          </div>
        </div>
      </section>

      <!-- Step 3: Review (Placeholder) -->
      <section v-if="currentStep === 'review'" class="section">
        <h2 class="section__heading">Review</h2>
        <p class="section__description">Overview inputs and edit</p>
        <div class="form-card">
          <p>Review content goes here...</p>
          <div class="form-actions">
            <AppButton variant="ghost" size="md" @click="previousStep"
              >Back</AppButton
            >
            <AppButton variant="primary" size="md" @click="completeStep"
              >Continue</AppButton
            >
          </div>
        </div>
      </section>

      <!-- Step 4: Preview (Placeholder) -->
      <section v-if="currentStep === 'preview'" class="section">
        <h2 class="section__heading">Preview</h2>
        <p class="section__description">See data in action</p>
        <div class="form-card">
          <p>Preview content goes here...</p>
          <div class="form-actions">
            <AppButton variant="ghost" size="md" @click="previousStep"
              >Back</AppButton
            >
            <AppButton variant="primary" size="md" @click="completeStep"
              >Continue</AppButton
            >
          </div>
        </div>
      </section>

      <!-- Step 5: Document (Placeholder) -->
      <section v-if="currentStep === 'document'" class="section">
        <h2 class="section__heading">Document</h2>
        <p class="section__description">Save or send for action</p>
        <div class="form-card">
          <p>Final document content goes here...</p>
          <div class="form-actions">
            <AppButton variant="ghost" size="md" @click="previousStep"
              >Back</AppButton
            >
            <AppButton variant="primary" size="md" @click="createDocument"
              >Finish</AppButton
            >
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Settings,
  Download,
  Search,
  X,
  FileText,
  Check,
  Plus,
} from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";
import AppInput from "@/components/ui/AppInput.vue";
import AppInputWithPrefix from "@/components/ui/AppInputWithPrefix.vue";
import AppSelect from "@/components/ui/AppSelect.vue";
import AppTextarea from "@/components/ui/AppTextarea.vue";
import Navbar from "@/components/layout/Navbar.vue";

const router = useRouter();

// Multi-step management
const steps = [
  { id: "details", title: "Details", subtitle: "Template and information" },
  { id: "input", title: "Input forms", subtitle: "Based on template needs" },
  { id: "review", title: "Review", subtitle: "Overview inputs and edit" },
  { id: "preview", title: "Preview", subtitle: "See data in action" },
  { id: "document", title: "Document", subtitle: "Save or send for action" },
];

const currentStepIndex = ref(0);
const completedSteps = ref([]);

const currentStep = computed(() => steps[currentStepIndex.value].id);

function goToStep(index) {
  if (index <= currentStepIndex.value || completedSteps.value.includes(index)) {
    currentStepIndex.value = index;
  }
}

function completeStep() {
  if (!completedSteps.value.includes(currentStepIndex.value)) {
    completedSteps.value.push(currentStepIndex.value);
  }

  if (currentStepIndex.value < steps.length - 1) {
    currentStepIndex.value++;
  } else {
    createDocument();
  }
}

function previousStep() {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
  }
}

// Form data
const searchQuery = ref("");
const filters = ref({
  status: "verified",
  type: "all",
});

const selectedTemplate = ref(null);

const templates = ref([
  {
    id: 1,
    name: "Non Disclosure Agreement",
    author: "doclast",
    lastUpdate: "December 5, 2025",
    tags: ["Label", "Label", "Label", "Label"],
  },
  {
    id: 2,
    name: "Non Disclosure Agreement",
    author: "doclast",
    lastUpdate: "December 5, 2025",
    tags: ["Label", "Label", "Label"],
  },
  {
    id: 3,
    name: "Non Disclosure Agreement",
    author: "doclast",
    lastUpdate: "December 5, 2025",
    tags: ["Label", "Label"],
  },
  {
    id: 4,
    name: "Non Disclosure Agreement",
    author: "doclast",
    lastUpdate: "December 5, 2025",
    tags: ["Label", "Label", "Label"],
  },
  {
    id: 5,
    name: "Non Disclosure Agreement",
    author: "doclast",
    lastUpdate: "December 5, 2025",
    tags: ["Label", "Label", "Label"],
  },
]);

const documentForm = ref({
  name: "",
  filename: "",
  description: "",
  status: "draft",
});

const filteredTemplates = computed(() => {
  return templates.value.filter((t) => {
    if (searchQuery.value) {
      return t.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    }
    return true;
  });
});

function selectTemplate(template) {
  selectedTemplate.value = template;
}

function removeTag(index) {
  console.log("Remove tag:", index);
}

function goBack() {
  router.push("/documents");
}

function saveAndExit() {
  router.push("/documents");
}

function discard() {
  router.push("/documents");
}

function createDocument() {
  console.log("Creating document:", documentForm.value);
  router.push("/documents");
}
</script>

<style scoped lang="scss">
// ============================================
// LAYOUT
// ============================================
.create-document {
  min-height: 100vh;
  background-color: #f9fafb;
}

.create-document__content {
  max-width: 56rem;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

// ============================================
// NAVBAR CUSTOM STYLES (for slotted content)
// ============================================
.navbar-custom {
  &__back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: transparent;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 400;
    color: #6b7280;
    cursor: pointer;
    transition: background-color 0.15s;
    white-space: nowrap;

    &:hover {
      background-color: #f3f4f6;
    }
  }

  &__back-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  &__breadcrumb {
    display: none;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.875rem;
    color: #6b7280;

    @media (min-width: 768px) {
      display: flex;
    }
  }

  &__breadcrumb-item {
    color: #6b7280;
    white-space: nowrap;

    &--active {
      color: #6366f1;
      font-weight: 500;
    }

    &--status {
      color: #9ca3af;
    }
  }

  &__breadcrumb-separator {
    width: 1rem;
    height: 1rem;
    color: #d1d5db;
    flex-shrink: 0;
  }

  &__icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    background: transparent;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.15s;

    &:hover {
      background-color: #f3f4f6;
    }
  }

  &__icon {
    width: 1.25rem;
    height: 1.25rem;
    color: #6b7280;
  }

  &__autosave {
    display: none;
    font-size: 0.875rem;
    color: #9ca3af;

    @media (min-width: 1024px) {
      display: block;
    }
  }

  &__btn-icon {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }
}

// ============================================
// MULTI-STEP TABS
// ============================================
.steps {
  display: flex;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  &__item {
    flex: 1;
    min-width: fit-content;
    padding: 1rem 1.5rem;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;

    &:hover:not(&--upcoming) {
      background-color: #f9fafb;
    }

    // Completed step (green check style)
    &--completed {
      .steps__title {
        color: #10b981;
        font-weight: 600;
      }

      .steps__subtitle {
        color: #6b7280;
      }
    }

    // Active step (purple/indigo)
    &--active {
      border-bottom-color: #6366f1;

      .steps__title {
        color: #6366f1;
        font-weight: 600;
      }

      .steps__subtitle {
        color: #6366f1;
      }
    }

    // Upcoming step (grayed out, not clickable)
    &--upcoming {
      cursor: not-allowed;
      opacity: 0.5;

      .steps__title {
        color: #9ca3af;
      }

      .steps__subtitle {
        color: #d1d5db;
      }
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #111827;
    transition: color 0.2s;
  }

  &__subtitle {
    font-size: 0.75rem;
    color: #6b7280;
    transition: color 0.2s;
  }
}

// ============================================
// SECTIONS
// ============================================
.section {
  margin-bottom: 3rem;

  &__heading {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  &__description {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1.5rem;
  }
}

// ============================================
// SEARCH BOX
// ============================================
.search-box {
  position: relative;
  margin-bottom: 1.5rem;

  &__icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.25rem;
    height: 1.25rem;
    color: #9ca3af;
    pointer-events: none;
    z-index: 1;
  }

  &__input-field {
    padding-left: 3rem;
    padding-right: 3.5rem;
  }

  &__kbd {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    padding: 0.125rem 0.375rem;
    background-color: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    color: #6b7280;
    font-family: ui-monospace, monospace;
    z-index: 1;
  }
}

// ============================================
// FILTERS
// ============================================
.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;

  &__group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }
}

.tag-input {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: 1px solid #d5d7da;
  border-radius: 0.5rem;
  background-color: #ffffff;
  min-height: 2.75rem;

  &__tag {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.5rem;
    background-color: #f3f4f6;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    color: #374151;
  }

  &__remove {
    width: 0.875rem;
    height: 0.875rem;
    color: #6b7280;
    cursor: pointer;
    transition: color 0.15s;

    &:hover {
      color: #111827;
    }
  }
}

// ============================================
// DATA TABLE
// ============================================
.table-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 2rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;

  th {
    padding: 0.75rem 1rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }

  td {
    padding: 1rem;
    font-size: 0.875rem;
    color: #111827;
    border-bottom: 1px solid #e5e7eb;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover {
    background-color: #f9fafb;
  }

  &__row--selected {
    background-color: #eff6ff !important;
  }

  &__muted {
    color: #6b7280 !important;
  }
}

.template-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &__icon {
    width: 1.25rem;
    height: 1.25rem;
    color: #6366f1;
    flex-shrink: 0;
  }
}

.badge-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.25rem 0.625rem;
  background-color: #eff6ff;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #3b82f6;
}

// ============================================
// FORM CARD & FIELDS
// ============================================
.form-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
}

.form-field {
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  &__label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  &__hint {
    margin-bottom: 0.75rem;
    font-size: 0.75rem;
    color: #6b7280;
  }

  &__required {
    color: #ef4444;
  }

  &__char-count {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: #6b7280;
  }
}

// Selected Template (horizontal layout)
.selected-template {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.5rem;
  align-items: start;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  &__label-col {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 160px;
  }

  &__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  &__hint {
    font-size: 0.75rem;
    color: #6b7280;
  }

  &__card {
    flex: 1;
    padding: 1rem;
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }

  &__info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__icon {
    width: 2.5rem;
    height: 2.5rem;
    padding: 0.625rem;
    color: #6366f1;
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    flex-shrink: 0;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    color: #6b7280;
  }

  &__author {
    color: #6366f1;
    font-weight: 500;
  }

  &__separator {
    margin: 0 0.25rem;
  }

  &__action {
    display: flex;
    align-items: start;
    padding-top: 0.25rem;
  }
}

.verified {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #10b981;
  font-weight: 500;

  &__icon {
    width: 0.875rem;
    height: 0.875rem;
  }
}

// Form Actions
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;

  &__icon {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }
}
</style>
