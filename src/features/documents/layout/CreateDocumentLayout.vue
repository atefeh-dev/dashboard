<template>
  <div class="create-document-layout">
    <!-- Navbar (Shared) -->
    <Navbar>
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

        <span class="navbar-custom__autosave"> Auto saved 2 minutes ago </span>

        <AppButton variant="primary" size="md" @click="saveAndExit">
          <Download class="navbar-custom__btn-icon" />
          Save & exit
        </AppButton>
      </template>
    </Navbar>

    <!-- Steps / Progress (Shared & Sticky) -->
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

          <!-- Progress border (visible when completed or active) -->
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

    <!-- Step Content (Dynamic) -->
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
});

const emit = defineEmits(["goToStep", "saveAndExit"]);

const router = useRouter();

function goToStep(index) {
  emit("goToStep", index);
}

function goBack() {
  router.push("/documents");
}

function saveAndExit() {
  emit("saveAndExit");
}
</script>

<style scoped lang="scss">
.create-document-layout {
  min-height: 100vh;
  background-color: #f9fafb;

  &__content {
    max-width: 56rem;
    margin: 0 auto;
    padding: 2rem 1.5rem;
    padding-top: calc(2rem + 80px); // Account for sticky steps
  }
}

// Navbar custom styles
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

// Steps Wrapper (Sticky Container)
.steps-wrapper {
  position: sticky;
  top: 0;
  z-index: 30;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

// Steps
.steps {
  display: flex;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

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

    &:hover:not(&--upcoming) {
      background-color: #f9fafb;
    }

    // Completed step (green text)
    &--completed {
      .steps__title {
        color: #10b981;
        font-weight: 600;
      }

      .steps__subtitle {
        color: #6b7280;
      }
    }

    // Active step (purple text)
    &--active {
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

  // Progress Border (Bottom indicator)
  &__progress-border {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background-color: transparent;
    transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    // Completed: Purple border
    &--completed {
      background-color: #6366f1;
    }

    // Active: Purple border (same as completed for visual consistency)
    &--active {
      background-color: #6366f1;
    }
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .create-document-layout__content {
    padding-top: calc(1.5rem + 70px);
  }

  .steps {
    &__item {
      padding: 0.875rem 1rem;
    }

    &__title {
      font-size: 0.8125rem;
    }

    &__subtitle {
      font-size: 0.6875rem;
    }
  }
}
</style>
