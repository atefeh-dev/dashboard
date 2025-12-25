<template>
  <div class="document-step-layout">
    <!-- Left Sidebar -->
    <aside v-if="showSidebar" class="document-step-layout__sidebar">
      <div class="sidebar-content">
        <!-- Document Info Section -->
        <div class="sidebar-content__section">
          <h3 class="sidebar-content__title">{{ documentInfo.title }}</h3>
          <p class="sidebar-content__subtitle">
            Last edit {{ documentInfo.lastEdit }}
          </p>

          <!-- Status and Author - Inline -->
          <div class="sidebar-content__meta-row">
            <!-- Status Column -->
            <div class="sidebar-content__meta-col">
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
            <Edit class="sidebar-content__icon" />
            Edit document information
          </AppButton>
        </div>

        <!-- Template Section -->
        <div class="sidebar-content__section">
          <h3 class="sidebar-content__section-title">
            {{ documentInfo.templateName }}
          </h3>

          <div class="sidebar-content__badge-group">
            <span
              class="sidebar-content__badge sidebar-content__badge--verified"
            >
              <Check class="sidebar-content__badge-icon" />
              Verified
            </span>
            <span class="sidebar-content__badge sidebar-content__badge--author">
              By {{ documentInfo.templateAuthor }}
            </span>
          </div>

          <div class="sidebar-content__template-date">
            <Calendar class="sidebar-content__date-icon" />
            <span class="sidebar-content__date-text">
              This template updated on
            </span>
          </div>

          <p class="sidebar-content__date-value">
            {{ documentInfo.templateUpdateDate }}
          </p>

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
                >
                  <Check v-if="item.completed" class="sidebar-content__check" />
                </div>

                <!-- Vertical Dotted Line (not on last item) -->
                <div
                  v-if="index < documentInfo.checklistItems.length - 1"
                  class="sidebar-content__checklist-line"
                ></div>
              </div>

              <!-- Content -->
              <div class="sidebar-content__checklist-content">
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
import { Edit, Calendar, Check } from "lucide-vue-next";
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
});

defineEmits(["edit-info"]);
</script>

<style scoped lang="scss">
.document-step-layout {
  display: flex;
  gap: 2rem;
  max-width: 90rem;
  margin: 0 auto;

  @media (max-width: 1024px) {
    flex-direction: column;
  }

  &__sidebar {
    flex: 0 0 320px;
    position: sticky;
    top: 150px;
    height: fit-content;
    max-height: calc(100vh - 170px);
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

// Sidebar Content
.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 1.5rem;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &__section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px dotted #e5e7eb; // Dotted divider

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    &:not(:first-child) {
      padding-top: 1.5rem;
    }

    // Remove border from checklist section (has its own styling)
    &--checklist {
      border-bottom: none;
      padding-bottom: 0;
    }
  }

  &__title {
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.5;
    color: #111827;
    margin: 0;
  }

  &__subtitle {
    font-size: 0.875rem;
    line-height: 1.5;
    color: #6b7280;
    margin: 0;
  }

  // Status and Author - Inline Layout
  &__meta-row {
    display: flex;
    gap: 1.5rem;
    margin-top: 0.5rem;
  }

  &__meta-col {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__label {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #6b7280;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1rem;
    border-radius: 0.375rem;
    width: fit-content;

    // Status badge (Draft)
    &--status {
      color: #374151;
      background-color: #f3f4f6;
      border: 1px solid #e5e7eb;
    }

    // Verified badge
    &--verified {
      color: #2563eb;
      background-color: #dbeafe;
      border: 1px solid #bfdbfe;
    }

    // Author badge
    &--author {
      color: #6b7280;
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
    }
  }

  &__badge-icon {
    width: 0.875rem;
    height: 0.875rem;
  }

  &__author {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__avatar {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  &__author-name {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
    color: #111827;
  }

  &__icon {
    width: 1rem;
    height: 1rem;
  }

  // Template Section
  &__section-title {
    font-size: 0.9375rem;
    font-weight: 600;
    line-height: 1.5;
    color: #111827;
    margin: 0;
  }

  &__badge-group {
    display: flex;
    gap: 0.5rem;
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
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #6b7280;
  }

  &__date-value {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.25rem;
    color: #111827;
    margin: 0;
  }

  &__tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__tag {
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1rem;
    color: #374151;
    background-color: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
  }

  // Progress Checklist with Vertical Dotted Line
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
    border: 2px solid #d1d5db;
    border-radius: 50%;
    background-color: #ffffff;
    transition: all 0.2s ease;
    z-index: 1;

    &--completed {
      background-color: #10b981;
      border-color: #10b981;
    }
  }

  &__check {
    width: 0.875rem;
    height: 0.875rem;
    color: #ffffff;
  }

  // Vertical Dotted Line
  &__checklist-line {
    position: absolute;
    top: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: calc(100% + 1.25rem);
    background-image: repeating-linear-gradient(
      to bottom,
      #d1d5db,
      #d1d5db 4px,
      transparent 4px,
      transparent 8px
    );
  }

  &__checklist-content {
    flex: 1;
    padding-top: 0.125rem;
  }

  &__checklist-title {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.25rem;
    color: #111827;
    margin: 0 0 0.25rem 0;
  }

  &__checklist-subtitle {
    font-size: 0.75rem;
    line-height: 1rem;
    color: #6b7280;
    margin: 0;
  }
}
</style>
