<template>
  <div class="step-layout-with-sidebar">
    <!-- Left Sidebar -->
    <aside class="step-sidebar">
      <!-- Document Info Card -->
      <div class="document-card">
        <!-- Document Header -->
        <div class="document-header">
          <h3 class="document-header__title">{{ documentTitle }}</h3>
          <p class="document-header__edit">
            Last edit <span class="document-header__time">{{ lastEdit }}</span>
          </p>
        </div>

        <!-- Status & Author Row -->
        <div class="document-meta">
          <div class="document-meta__item">
            <span class="document-meta__label">Status</span>
            <AppBadge :variant="statusVariant">{{ status }}</AppBadge>
          </div>

          <!-- Vertical Divider -->
          <div class="document-meta__divider"></div>

          <div class="document-meta__item">
            <span class="document-meta__label">Author</span>
            <div class="author">
              <img :src="authorAvatar" alt="" class="author__avatar" />
              <span class="author__name">{{ authorName }}</span>
            </div>
          </div>
        </div>

        <!-- Edit Button -->
        <button class="edit-document-btn">
          <Link2 class="edit-document-btn__icon" />
          Edit document information
        </button>

        <!-- Divider -->
        <div class="divider"></div>

        <!-- Template Info -->
        <div class="template-section">
          <h4 class="template-section__title">{{ templateName }}</h4>

          <div class="template-section__meta">
            <span class="verified-badge">
              <CheckCircle2 class="verified-badge__icon" />
              Verified
            </span>
            <span class="template-section__separator">|</span>
            <span class="template-section__author"
              >By
              <span class="template-section__author-name">{{
                templateAuthor
              }}</span></span
            >
          </div>

          <p class="template-section__updated-label">
            This template updated on
          </p>

          <div class="template-section__date">
            <Calendar class="template-section__date-icon" />
            <span class="template-section__date-text">{{
              templateUpdateDate
            }}</span>
          </div>

          <div class="template-tags">
            <span
              v-for="(tag, idx) in templateTags"
              :key="idx"
              class="template-tags__tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Divider -->
        <div class="divider"></div>

        <!-- Progress Checklist -->
        <div class="progress-list">
          <div
            v-for="(item, idx) in checklistItems"
            :key="idx"
            class="progress-item"
            :class="{
              'progress-item--completed': item.completed,
              'progress-item--active': item.active,
              'progress-item--last': idx === checklistItems.length - 1,
            }"
          >
            <!-- Circle Indicator -->
            <div class="progress-item__indicator">
              <div class="progress-item__circle">
                <Check
                  v-if="item.completed"
                  class="progress-item__check-icon"
                />
                <span v-else class="progress-item__number">{{ idx + 1 }}</span>
              </div>
              <!-- Dotted Line (hidden for last item) -->
              <div
                v-if="idx !== checklistItems.length - 1"
                class="progress-item__line"
              ></div>
            </div>

            <!-- Content -->
            <div class="progress-item__content">
              <h5 class="progress-item__title">{{ item.title }}</h5>
              <p class="progress-item__subtitle">{{ item.subtitle }}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Right Content Area -->
    <main class="step-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { Check, Calendar, CheckCircle2, Link2 } from "lucide-vue-next";
import AppBadge from "@/components/ui/AppBadge.vue";

defineProps({
  documentTitle: {
    type: String,
    default: "Document title",
  },
  lastEdit: {
    type: String,
    default: "{last edited date and time}",
  },
  status: {
    type: String,
    default: "Draft",
  },
  statusVariant: {
    type: String,
    default: "default",
  },
  authorName: {
    type: String,
    default: "{User Name}",
  },
  authorAvatar: {
    type: String,
    default: "/src/assets/images/av.png",
  },
  templateName: {
    type: String,
    default: "Non-Disclosure Agreement",
  },
  templateAuthor: {
    type: String,
    default: "doclast",
  },
  templateUpdateDate: {
    type: String,
    default: "December 5, 2025",
  },
  templateTags: {
    type: Array,
    default: () => ["Tag 1", "Tag 2", "Tag 3"],
  },
  checklistItems: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped lang="scss">
// ========================================
// LAYOUT
// ========================================

.step-layout-with-sidebar {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2rem;
  min-height: calc(100vh - 130px);

  @media (max-width: 1024px) {
    grid-template-columns: 280px 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.step-sidebar {
  @media (max-width: 768px) {
    display: none;
  }
}

.step-content {
  min-width: 0;
}

// ========================================
// DOCUMENT CARD
// ========================================

.document-card {
  position: sticky;
  top: 150px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

// ========================================
// DOCUMENT HEADER
// ========================================

.document-header {
  margin-bottom: 24px;

  &__title {
    font-size: 28px;
    font-weight: 600;
    color: #111827;
    line-height: 1.2;
    margin-bottom: 8px;
    letter-spacing: -0.02em;
  }

  &__edit {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.5;
    font-weight: 400;
  }

  &__time {
    color: #6b7280;
  }
}

// ========================================
// DOCUMENT META (Status & Author)
// ========================================

.document-meta {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  align-items: start;
  margin-bottom: 20px;

  &__item {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  // Vertical divider between Status and Author
  &__divider {
    width: 1px;
    height: 100%;
    background: #e5e7eb;
    align-self: stretch;
  }

  &__label {
    font-size: 14px;
    color: #6b7280;
    font-weight: 400;
    line-height: 1.4;
  }
}

.author {
  display: flex;
  align-items: center;
  gap: 8px;

  &__avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #f3f4f6;
  }

  &__name {
    font-size: 16px;
    color: #111827;
    font-weight: 600;
  }
}

// ========================================
// EDIT DOCUMENT BUTTON
// ========================================

.edit-document-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 20px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-bottom: 24px;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  &__icon {
    width: 18px;
    height: 18px;
    color: #9ca3af;
  }
}

// ========================================
// DIVIDER
// ========================================

.divider {
  height: 1px;
  background-image: repeating-linear-gradient(
    to right,
    #d1d5db 0,
    #d1d5db 4px,
    transparent 4px,
    transparent 8px
  );
  margin: 24px 0;
}

// ========================================
// TEMPLATE SECTION
// ========================================

.template-section {
  &__title {
    font-size: 20px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 12px;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    margin-bottom: 20px;
  }

  &__separator {
    color: #d1d5db;
    font-weight: 400;
  }

  &__author {
    color: #6b7280;
    font-weight: 400;
  }

  &__author-name {
    color: #4f46e5;
    font-weight: 500;
  }

  &__updated-label {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 8px;
    line-height: 1.5;
  }

  &__date {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
  }

  &__date-icon {
    width: 24px;
    height: 24px;
    color: #6b7280;
    flex-shrink: 0;
  }

  &__date-text {
    font-size: 20px;
    color: #111827;
    font-weight: 600;
    line-height: 1.3;
  }
}

.verified-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #3b82f6;
  font-weight: 500;

  &__icon {
    width: 16px;
    height: 16px;
  }
}

.template-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  &__tag {
    padding: 6px 14px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 20px;
    font-size: 14px;
    color: #374151;
    font-weight: 500;
    line-height: 1.4;
  }
}

// ========================================
// PROGRESS LIST (THE IMPORTANT PART!)
// ========================================

.progress-list {
  display: flex;
  flex-direction: column;
}

.progress-item {
  position: relative;
  display: flex;
  gap: 12px;
  padding-bottom: 24px; // Space between items

  // Remove padding from last item
  &--last {
    padding-bottom: 0;
  }

  // ========================================
  // INDICATOR COLUMN (Circle + Line)
  // ========================================

  &__indicator {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
  }

  // ========================================
  // CIRCLE (Checkmark or Number)
  // ========================================

  &__circle {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: #f3f4f6;
    border-radius: 50%;
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  // Completed state (green with checkmark)
  &--completed &__circle {
    background: #10b981;
  }

  // Active state styling
  &--active &__circle {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }

  &__check-icon {
    width: 18px;
    height: 18px;
    color: #ffffff;
    stroke-width: 3;
  }

  &__number {
    font-size: 14px;
    font-weight: 600;
    color: #6b7280;
  }

  // ========================================
  // DOTTED LINE (Connecting items)
  // ========================================

  &__line {
    position: absolute;
    top: 32px; // Start below the circle
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: calc(100% + 24px); // Extend to next item
    background-image: repeating-linear-gradient(
      to bottom,
      #d1d5db 0,
      #d1d5db 4px,
      transparent 4px,
      transparent 8px
    );
  }

  // ========================================
  // CONTENT (Title + Subtitle)
  // ========================================

  &__content {
    flex: 1;
    padding-top: 4px; // Align with circle center
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 2px;
    line-height: 1.4;
  }

  &__subtitle {
    font-size: 12px;
    color: #6b7280;
    line-height: 1.5;
  }

  // Active state text styling
  &--active &__title {
    color: #3b82f6;
  }

  // Completed state text styling
  &--completed &__title {
    color: #6b7280;
  }

  &--completed &__subtitle {
    color: #9ca3af;
  }
}
</style>
