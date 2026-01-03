<template>
  <div class="document-step-layout" :data-step="currentStep">
    <!-- Left Sidebar -->
    <aside v-if="showSidebar" class="document-step-layout__sidebar">
      <div class="sidebar-content">
        <!-- Document Info Section -->
        <div class="sidebar-content__section">
          <h3 class="sidebar-content__title">{{ documentInfo.title }}</h3>
          <p class="sidebar-content__subtitle">
            Last edit<span class="betweengap">
              {{ documentInfo.lastEdit }}
            </span>
          </p>

          <!-- Status and Author - Inline -->
          <div class="sidebar-content__meta-row">
            <!-- Status Column -->
            <div
              class="sidebar-content__meta-col sidebar-content__meta-col--first"
            >
              <span class="sidebar-content__label">Status</span>
              <span
                class="sidebar-content__badge sidebar-content__badge--status"
              >
                {{ documentInfo.status }}
              </span>
            </div>

            <!-- Author Column -->
            <div class="sidebar-content__meta-col">
              <span class="sidebar-content__label">Author</span>
              <div class="sidebar-content__author">
                <img
                  :src="documentInfo.authorAvatar"
                  :alt="documentInfo.authorName"
                  class="sidebar-content__avatar"
                />
                <span class="sidebar-content__author-name">
                  {{ documentInfo.authorName }}
                </span>
              </div>
            </div>
          </div>

          <AppButton variant="ghost" size="sm" @click="$emit('edit-info')">
            <EditDocumentIcon />
            Edit document information
          </AppButton>
        </div>

        <!-- Template Section -->
        <div class="sidebar-content__section">
          <h3 class="sidebar-content__section-title">
            {{ documentInfo.templateName }}
          </h3>

          <div class="sidebar-content__badge-group">
            <span class="sidebar-content__badge--verified">
              <VerifyTickIcon class="sidebar-content__badge-icon" />
              Verified
            </span>
            <span class="sidebar-content__badge--author">
              By
              <span class="sidebar-content__badge--author--brand">{{
                documentInfo.templateAuthor
              }}</span>
            </span>
          </div>

          <span class="sidebar-content__date-text">
            This template updated on
          </span>
          <div class="sidebar-content__template-date">
            <CalenderIcon class="sidebar-content__date-icon" />

            <p class="sidebar-content__date-value">
              {{ documentInfo.templateUpdateDate }}
            </p>
          </div>

          <div class="sidebar-content__tags">
            <span
              v-for="tag in documentInfo.templateTags"
              :key="tag"
              class="sidebar-content__tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Dynamic Progress Checklist with Vertical Line -->
        <div
          class="sidebar-content__section sidebar-content__section--checklist"
        >
          <div class="sidebar-content__checklist">
            <div
              v-for="(item, index) in documentInfo.checklistItems"
              :key="item.title"
              class="sidebar-content__checklist-item"
            >
              <!-- Check Icon -->
              <div class="sidebar-content__check-wrapper">
                <div
                  :class="[
                    'sidebar-content__check-icon',
                    {
                      'sidebar-content__check-icon--completed': item.completed,
                    },
                  ]"
                  :style="getStepOpacity(item, index)"
                >
                  <CheckIcon
                    v-if="item.completed"
                    class="sidebar-content__check"
                  />
                  <span v-else class="sidebar-content__check-number">
                    {{ index + 1 }}
                  </span>
                </div>

                <!-- Vertical Dotted Line (not on last item) -->
                <div
                  v-if="index < documentInfo.checklistItems.length - 1"
                  class="sidebar-content__checklist-line"
                ></div>
              </div>

              <!-- Content -->
              <div
                class="sidebar-content__checklist-content"
                :style="getStepOpacity(item, index)"
              >
                <p class="sidebar-content__checklist-title">{{ item.title }}</p>
                <p class="sidebar-content__checklist-subtitle">
                  {{ item.subtitle }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="document-step-layout__main">
      <slot />
    </main>
  </div>
</template>

<script setup>
import EditDocumentIcon from "@/assets/icons/common/edit-document.svg";
import CheckIcon from "@/assets/icons/common/check.svg";

import CalenderIcon from "@/assets/icons/common/calendar.svg";
import VerifyTickIcon from "@/assets/icons/common/verified-tick.svg";
import AppButton from "@/components/ui/AppButton.vue";

defineProps({
  showSidebar: {
    type: Boolean,
    default: true,
  },
  documentInfo: {
    type: Object,
    default: () => ({
      title: "Document title",
      lastEdit: "{last edited date and time}",
      status: "Draft",
      authorName: "{User Name}",
      authorAvatar: "/src/assets/images/av.png",
      templateName: "Non-Disclosure Agreement",
      templateAuthor: "doclast",
      templateUpdateDate: "December 5, 2025",
      templateTags: ["Tag 1", "Tag 2", "Tag 3"],
      checklistItems: [],
    }),
  },
  currentStep: {
    type: Number,
    default: 1,
  },
});

defineEmits(["edit-info"]);

// Calculate opacity for each step
const getStepOpacity = (item, index) => {
  if (item.completed) {
    return { opacity: 1 };
  }

  // Progressive transparency with minimum of 0.4
  // Step 1: 1.0, Step 2: 0.8, Step 3: 0.6, Step 4: 0.4
  const opacityValue = Math.max(0.4, 1 - index * 0.2);
  return { opacity: opacityValue };
};
</script>

<style scoped lang="scss">
.document-step-layout {
  display: flex;
  gap: 2rem;
  padding-top: 5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  margin: 0 auto;

  &[data-step="1"] {
    max-width: 69rem;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
  }

  &__sidebar {
    flex: 0 0 320px;
    position: sticky;
    height: fit-content;
    overflow-y: auto;

    @media (max-width: 1024px) {
      position: static;
      flex: 1;
      max-height: none;
    }

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f3f4f6;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 3px;

      &:hover {
        background: #9ca3af;
      }
    }
  }

  &__main {
    flex: 1;
    min-width: 0;
  }
}
.betweengap {
  padding-left: 0.25rem;
}
// Sidebar Content
.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 20rem;
  padding: 1rem 1.5rem;
  background-color: #ffffff;
  border: 1px solid #d5d7da;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &__section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 2px dotted #d5d7da;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    &:not(:first-child) {
      padding-top: 1rem;
    }

    &--checklist {
      border-bottom: none;
      padding-bottom: 0;
    }
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.5;
    color: #181d27;
    margin: 0;
  }

  &__subtitle {
    font-size: 0.875rem;
    line-height: 1.5;
    color: #6b7280;
    margin: 0;
  }

  &__meta-row {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  &__meta-col {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;

    &--first {
      border-right: 1px solid #d5d7da;
      padding-right: 1rem;
    }
  }

  &__meta-col > :last-child {
    min-height: 1.5rem;
    display: flex;
    align-items: center;
  }

  &__label {
    font-size: 0.75rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: #6b7280;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.25rem;
    border-radius: 0.375rem;
    width: fit-content;

    &--status {
      color: #374151;
      background-color: #f8f9fc;
      border: 1px solid #d5d9eb;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 0.375rem;
      height: 1.5rem;
    }

    &--verified {
      font-size: 0.875rem;
      font-weight: 400;
      display: flex;
      color: #535862;
      padding-right: 0.25rem;
      border-radius: 0;
      gap: 0.25rem;
      align-items: center;
      border-right: 1px solid #d5d7da;
    }

    &--author {
      color: #535862;
      padding-left: 0.25rem;
      font-size: 0.875rem;
      font-weight: 400;

      &--brand {
        color: #4539cc;
      }
    }
  }

  &__badge-icon {
    width: 0.875rem;
    height: 0.875rem;
  }

  &__author {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  &__avatar {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.25rem;
    object-fit: cover;
    flex-shrink: 0;
  }

  &__author-name {
    font-size: 1rem;
    font-weight: 600;
    color: #181d27;
  }

  &__icon {
    width: 1rem;
    height: 1rem;
  }

  &__section-title {
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.5;
    color: #181d27;
    margin: 0;
  }

  &__badge-group {
    display: flex;
    flex-wrap: wrap;
  }

  &__template-date {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__date-icon {
    width: 1rem;
    height: 1rem;
    color: #9ca3af;
    flex-shrink: 0;
  }

  &__date-text {
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.25rem;
    color: #717680;
  }

  &__date-value {
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.25rem;
    color: #181d27;
    margin: 0;
  }

  &__tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__tag {
    padding: 0.125rem 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1rem;
    color: #414651;
    border: 1px solid #d5d7da;
    border-radius: 0.375rem;
  }

  // Progress Checklist
  &__checklist {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  &__checklist-item {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    padding-bottom: 1.25rem;

    &:last-child {
      padding-bottom: 0;
    }
  }

  &__check-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
  }

  &__check-icon {
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e9eaeb;
    border-radius: 50%;
    background-color: #ffffff;
    transition: all 0.2s ease;
    z-index: 1;
    position: relative;

    &--completed {
      background-color: #079455;
      border-color: #079455;
    }
  }

  &__check-number {
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    line-height: 1;
  }

  // Vertical Dotted Line with 4px padding from circle
  &__checklist-line {
    position: absolute;
    top: calc(1.5rem + 4px); // Circle height + 4px padding
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    height: calc(100% + 1.25rem - 1rem); // Subtract 4px top + 4px bottom
    background-image: repeating-linear-gradient(
      to bottom,
      #d1d5db,
      #d1d5db 2px,
      transparent 2px,
      transparent 6px
    );
  }

  &__checklist-content {
    flex: 1;
    padding-top: 0.125rem;
    transition: opacity 0.2s ease;
  }

  &__checklist-title {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.25rem;
    color: #414651;
    margin: 0;
  }

  &__checklist-subtitle {
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1rem;
    color: #535862;
    margin: 0;
  }
}
</style>
