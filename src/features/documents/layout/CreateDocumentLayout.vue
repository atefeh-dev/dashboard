<template>
  <div class="create-document-layout">
    <!-- FIXED: Navbar stays at top -->
    <div class="navbar-container">
      <Navbar>
        <template #left>
          <AppButton variant="ghost" @click="goBack">
            <ChevronLeft class="navbar-custom__back-icon" />
            Back to documents
          </AppButton>

          <div class="navbar-custom__breadcrumb">
            <span class="navbar-custom__breadcrumb-item">Workspace name</span>
            <ChevronRight class="navbar-custom__breadcrumb-separator" />
            <span class="navbar-custom__breadcrumb-item">Documents</span>
            <ChevronRight class="navbar-custom__breadcrumb-separator" />
            <span
              class="navbar-custom__breadcrumb-item navbar-custom__breadcrumb-item--active"
            >
              {{ documentTitle || "Document title" }}
            </span>
            <ChevronRight class="navbar-custom__breadcrumb-separator" />

            <!-- Dynamic: Show status or Complete button (only after send) -->
            <span
              v-if="!shouldShowCompleteButton"
              class="navbar-custom__breadcrumb-item navbar-custom__breadcrumb-item--status"
            >
              {{ documentStatus }}
            </span>
            <AppButton
              v-else
              variant="success"
              size="sm"
              @click="completeDocument"
              class="navbar-custom__complete-btn"
            >
              <CheckCircle class="navbar-custom__complete-icon" />
              Complete
            </AppButton>
          </div>
        </template>

        <template #right>
          <div class="navbar-custom__setting-section">
            <button class="navbar-custom__icon-btn" aria-label="History">
              <ClockReVindIcon />
            </button>

            <button class="navbar-custom__icon-btn" aria-label="Settings">
              <SettingIcon />
            </button>
          </div>

          <!-- Autosave indicator -->
          <div class="navbar-custom__autosave" v-if="lastSaveTime">
            <AppLoadingSpinner v-if="!isSaving" />
            <span class="navbar-custom__autosave-text">
              Auto saved {{ lastSaveTime }}
            </span>
          </div>

          <AppButton variant="primary" size="md" @click="saveAndExit">
            <ExportSaveIcon />
            Save & exit
          </AppButton>
        </template>
      </Navbar>
    </div>

    <!-- FIXED: Steps stay at top (below navbar) -->
    <div class="steps-wrapper">
      <div class="steps">
        <button
          v-for="(step, index) in steps"
          :key="step.id"
          :class="[
            'steps__item',
            {
              'steps__item--completed': completedSteps.includes(index),
              'steps__item--active': index === currentStepIndex,
              'steps__item--upcoming':
                index > currentStepIndex && !completedSteps.includes(index),
            },
          ]"
          :disabled="
            index > currentStepIndex && !completedSteps.includes(index)
          "
          @click="goToStep(index)"
        >
          <div class="steps__content">
            <span class="steps__title">{{ step.title }}</span>
            <span class="steps__subtitle">{{ step.subtitle }}</span>
          </div>

          <div
            class="steps__progress-border"
            :class="{
              'steps__progress-border--completed':
                completedSteps.includes(index),
              'steps__progress-border--active': index === currentStepIndex,
            }"
          ></div>
        </button>
      </div>
    </div>

    <!-- Content area with sidebar (scrolls under fixed headers) -->
    <div class="create-document-layout__content">
      <DocumentStepLayout
        :show-sidebar="showSidebar"
        :document-info="documentInfo"
        @edit-info="$emit('edit-info')"
      >
        <slot />
      </DocumentStepLayout>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import Navbar from "@/components/layout/Navbar.vue";
import AppButton from "@/components/ui/AppButton.vue";
import DocumentStepLayout from "@/features/documents/layout/DocumentStepLayout.vue";
import ClockReVindIcon from "@/assets/icons/common/clock-rewind.svg";
import SettingIcon from "@/assets/icons/common/setting.svg";
import ExportSaveIcon from "@/assets/icons/common/export-save.svg";
import AppLoadingSpinner from "@/components/ui/AppLoadingSpinner.vue";
import ChevronRight from "@/assets/icons/common/nav-chevron-right.svg";

const props = defineProps({
  currentStepIndex: {
    type: Number,
    required: true,
  },
  completedSteps: {
    type: Array,
    default: () => [],
  },
  steps: {
    type: Array,
    required: true,
  },
  documentTitle: {
    type: String,
    default: "",
  },
  documentStatus: {
    type: String,
    default: "Draft",
  },
  lastSaveTime: {
    type: String,
    default: null,
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
  // Sidebar configuration
  showSidebar: {
    type: Boolean,
    default: true,
  },
  documentInfo: {
    type: Object,
    default: () => ({}),
  },
  // NEW: Track if documents have been sent
  documentsSent: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "goToStep",
  "saveAndExit",
  "goBack",
  "complete",
  "edit-info",
]);

const router = useRouter();
const authStore = useAuthStore();

// Check if user is authenticated
const isAuthenticated = computed(() => {
  return authStore.isAuthenticated || authStore.user !== null;
});

// Check if we're on the last step (Document step)
const isLastStep = computed(() => {
  return props.currentStepIndex === props.steps.length - 1;
});

// Show Complete button only if:
// 1. User is on the last step
// 2. User is authenticated
// 3. Documents have been sent
const shouldShowCompleteButton = computed(() => {
  return isLastStep.value && isAuthenticated.value && props.documentsSent;
});

function goToStep(index) {
  emit("goToStep", index);
}

function goBack() {
  emit("goBack");
}

function saveAndExit() {
  emit("saveAndExit");
}

function completeDocument() {
  emit("complete");
}
</script>

<style scoped lang="scss">
.create-document-layout {
  min-height: 100vh;
  margin: 0 auto;
  padding-top: 130px;

  @media (max-width: 768px) {
    padding-top: 120px;
  }

  &__content {
    @media (max-width: 768px) {
      padding: 1.5rem 1rem;
    }
  }
}

// FIXED: Navbar
.navbar-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #ffffff;
  border-bottom: 1px solid #e9eaeb;
}

// Navbar styles
.navbar-custom {
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
      color: #4539cc;
      font-weight: 600;
      font-size: 0.875rem;
    }

    &--status {
      color: #414651;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 0.5rem;
      background-color: #fafafa;
      border: 1px solid #e9eaeb;
      padding: 0.25rem 0.625rem;
      text-transform: capitalize;
    }
  }

  &__breadcrumb-separator {
    width: 1rem;
    height: 1rem;
    color: #d1d5db;
    flex-shrink: 0;
  }

  &__complete-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #ffffff;
    background-color: #10b981;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #059669;
    }

    &:active {
      background-color: #047857;
    }
  }

  &__complete-icon {
    width: 1rem;
    height: 1rem;
  }
  &__setting-section {
    display: flex;
    gap: 0.125rem;
  }

  &__icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.625rem 1rem;
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
    display: flex;
    background-color: #fafafa;
    gap: 0.5rem;
    padding: 0.625rem 0.875rem;
    border-radius: 0.5rem;
    color: #535862;

    @media (min-width: 1024px) {
      display: flex;
      align-items: center;
    }
  }

  &__autosave-icon {
    width: 1.25rem;
    color: #9ca3af;
    flex-shrink: 0;
  }

  &__autosave-spinner {
    animation: spin 1s linear infinite;
  }

  &__autosave-text {
    color: #535862;
    font-size: 0.875rem;
    white-space: nowrap;
    font-weight: 600;
  }

  &__btn-icon {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// FIXED: Steps
.steps-wrapper {
  position: fixed;
  top: 3.625rem;
  left: 0;
  right: 0;
  z-index: 90;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f3f4f6;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
  }
}

.steps {
  display: flex;
  min-width: max-content;

  &__item {
    position: relative;
    flex: 1;
    min-width: fit-content;
    padding: 1rem 1.5rem;
    padding-bottom: 1rem;
    background: transparent;
    border: none;
    margin-top: 1.25rem;
    cursor: pointer;
    transition: background-color 0.2s;
    text-align: left;

    @media (max-width: 768px) {
      padding: 0.875rem 1rem;
    }

    &:hover:not(&--upcoming) {
      background-color: #f9fafb;
    }

    &--completed {
      .steps__title {
        color: #414651;
        font-weight: 600;
      }

      .steps__subtitle {
        color: #535862;
        font-weight: 400;
      }
    }

    &--active {
      .steps__title {
        color: #4539cc;
        font-weight: 600;
      }

      .steps__subtitle {
        color: #4539cc;
        font-weight: 400;
      }
    }

    &--upcoming {
      cursor: not-allowed;
      opacity: 0.9;
      border-bottom: 5px solid #e9eaeb;

      .steps__title {
        color: #414651;
      }

      .steps__subtitle {
        color: #535862;
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
    white-space: nowrap;

    @media (max-width: 768px) {
      font-size: 0.8125rem;
    }
  }

  &__subtitle {
    font-size: 0.75rem;
    color: #6b7280;
    transition: color 0.2s;
    white-space: nowrap;

    @media (max-width: 768px) {
      font-size: 0.6875rem;
    }
  }

  &__progress-border {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 0.313rem;
    background-color: transparent;
    transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    &--completed,
    &--active {
      background-color: #4539cc;
    }
  }
}
</style>
