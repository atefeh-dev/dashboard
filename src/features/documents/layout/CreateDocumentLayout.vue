<template>
  <div class="create-document-layout">
    <!-- FIXED: Navbar stays at top (like Figma, Notion, Linear) -->
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
            <span
              class="navbar-custom__breadcrumb-item navbar-custom__breadcrumb-item--status"
            >
              {{ documentStatus }}
            </span>
          </div>
        </template>

        <template #right>
          <button class="navbar-custom__icon-btn" aria-label="History">
            <Clock class="navbar-custom__icon" />
          </button>

          <button class="navbar-custom__icon-btn" aria-label="Settings">
            <Settings class="navbar-custom__icon" />
          </button>

          <!-- Autosave indicator -->
          <div class="navbar-custom__autosave" v-if="lastSaveTime">
            <svg
              class="navbar-custom__autosave-icon"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
              />
              <path
                v-if="!isSaving"
                d="M8 12l2 2 4-4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle
                v-else
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="2"
                stroke-dasharray="60"
                stroke-dashoffset="15"
                fill="none"
                class="navbar-custom__autosave-spinner"
              />
            </svg>
            <span class="navbar-custom__autosave-text">
              Auto saved {{ lastSaveTime }}
            </span>
          </div>

          <AppButton variant="primary" size="md" @click="saveAndExit">
            <Download class="navbar-custom__btn-icon" />
            Save & exit
          </AppButton>
        </template>
      </Navbar>
    </div>

    <!-- FIXED: Steps also stay at top (below navbar) -->
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

    <!-- Content area (scrolls under fixed headers) -->
    <div class="create-document-layout__content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Settings,
  Download,
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import Navbar from "@/components/layout/Navbar.vue";
import AppButton from "@/components/ui/AppButton.vue";

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
});

const emit = defineEmits(["goToStep", "saveAndExit", "goBack"]);

const router = useRouter();

function goToStep(index) {
  emit("goToStep", index);
}

function goBack() {
  emit("goBack");
}

function saveAndExit() {
  emit("saveAndExit");
}
</script>

<style scoped lang="scss">
.create-document-layout {
  min-height: 100vh;
  background-color: #f9fafb;
  padding-top: 130px; // Space for fixed navbar + steps (64px + 66px)

  @media (max-width: 768px) {
    padding-top: 120px; // Slightly less on mobile
  }

  &__content {
    max-width: 56rem;
    margin: 0 auto;
    padding: 2rem 1.5rem;

    @media (max-width: 768px) {
      padding: 1.5rem 1rem;
    }
  }
}

// SENIOR UX: Fixed navbar (always visible at top)
.navbar-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100; // Above everything except modals
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 400;

    @media (min-width: 1024px) {
      display: flex;
    }
  }

  &__autosave-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: #9ca3af;
    flex-shrink: 0;
  }

  &__autosave-spinner {
    animation: spin 1s linear infinite;
  }

  &__autosave-text {
    color: #6b7280;
    white-space: nowrap;
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

// SENIOR UX: Fixed steps (always visible below navbar)
.steps-wrapper {
  position: fixed;
  top: 64px; // Below navbar
  left: 0;
  right: 0;
  z-index: 90; // Below navbar, above content
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
    background: transparent;
    border: none;
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
        color: #10b981;
        font-weight: 600;
      }

      .steps__subtitle {
        color: #6b7280;
      }
    }

    &--active {
      .steps__title {
        color: #6366f1;
        font-weight: 600;
      }

      .steps__subtitle {
        color: #6366f1;
      }
    }

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
    height: 3px;
    background-color: transparent;
    transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    &--completed,
    &--active {
      background-color: #6366f1;
    }
  }
}
</style>
