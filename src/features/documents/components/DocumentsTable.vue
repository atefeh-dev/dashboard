<template>
  <div class="documents-table">
    <div class="documents-table__wrapper">
      <table class="documents-table__table">
        <thead class="documents-table__head">
          <tr class="documents-table__row documents-table__row--header">
            <th class="documents-table__header">Name</th>
            <th class="documents-table__header">Categories</th>
            <th class="documents-table__header">Rating</th>
            <th class="documents-table__header">Last assessed</th>
            <th class="documents-table__header">Actions</th>
          </tr>
        </thead>

        <tbody class="documents-table__body">
          <tr
            v-for="(doc, i) in store.paginated"
            :key="i"
            class="documents-table__row"
          >
            <!-- Name -->
            <td class="documents-table__cell">
              <div class="documents-table__name">{{ doc.name }}</div>
              <div class="documents-table__domain">{{ doc.domain }}</div>
            </td>

            <!-- Categories -->
            <td class="documents-table__cell">
              <div class="documents-table__categories">
                <span
                  :class="[
                    'documents-table__badge',
                    doc.status === 'Active'
                      ? 'documents-table__badge--active'
                      : 'documents-table__badge--inactive',
                  ]"
                >
                  <span class="documents-table__badge-dot"></span>
                  {{ doc.status }}
                </span>

                <span
                  v-for="(c, idx) in doc.categories"
                  :key="idx"
                  class="documents-table__tag"
                  >{{ c }}</span
                >

                <span v-if="doc.tags > 0" class="documents-table__tag"
                  >+{{ doc.tags }}</span
                >
              </div>
            </td>

            <!-- Rating -->
            <td class="documents-table__cell">
              <span
                :class="[
                  'documents-table__status',
                  doc.status === 'Active'
                    ? 'documents-table__status--active'
                    : 'documents-table__status--inactive',
                ]"
              >
                {{ doc.status }}
              </span>
            </td>

            <!-- Last Assessed -->
            <td class="documents-table__cell">
              <div
                :class="[
                  'documents-table__rating',
                  doc.direction === 'up'
                    ? 'documents-table__rating--up'
                    : 'documents-table__rating--down',
                ]"
              >
                <component
                  :is="doc.direction === 'up' ? TrendingUp : TrendingDown"
                  class="documents-table__rating-icon"
                />
                {{ doc.rating }}
              </div>
              <div class="documents-table__date">{{ doc.date }}</div>
            </td>

            <!-- Actions -->
            <td class="documents-table__cell">
              <div class="documents-table__actions">
                <AppButton
                  variant="ghost"
                  size="sm"
                  @click="remove(i)"
                  title="Delete"
                  class="documents-table__action-btn"
                >
                  <Trash2 class="documents-table__action-icon" />
                </AppButton>
                <AppButton
                  variant="ghost"
                  size="sm"
                  title="Edit"
                  class="documents-table__action-btn"
                >
                  <Pencil class="documents-table__action-icon" />
                </AppButton>
              </div>
            </td>
          </tr>

          <tr v-if="store.paginated.length === 0">
            <td class="documents-table__empty" colspan="5">
              No documents found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->

    <AppPagination
      :pages="pages"
      :current="store.currentPage"
      @change="goToPage"
      @prev="prev"
      @next="next"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useDocumentsStore } from "@/stores/useDocumentsStore";
import {
  Trash2,
  Pencil,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";
import AppPagination from "@/components/ui/AppPagination.vue";

const store = useDocumentsStore();

// Calculate which page numbers to show
const pageNumbers = computed(() => {
  const current = store.currentPage;
  const total = store.totalPages;
  const delta = 2;

  const range = [];

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  return range;
});

// Build pages array with a centered ellipsis between left/right groups
// If total pages is small, return full range. Otherwise return first N, '...', last N.
const pages = computed(() => {
  const total = store.totalPages || 0;
  const maxVisible = 7; // total items to show including ellipsis

  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const side = Math.floor((maxVisible - 1) / 2); // items on each side of ellipsis
  const left = Array.from({ length: side }, (_, i) => i + 1);
  const right = Array.from({ length: side }, (_, i) => total - side + i + 1);

  // If there is no gap (or only one) between left and right, return full range
  if (right[0] - left[left.length - 1] <= 1) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  return [...left, "...", ...right];
});

function goToPage(page) {
  store.goToPage(page);
}

function prev() {
  if (store.currentPage > 1) {
    store.goToPage(store.currentPage - 1);
  }
}

function next() {
  if (store.currentPage < store.totalPages) {
    store.goToPage(store.currentPage + 1);
  }
}

function remove(index) {
  store.removeDocument(index);
}
</script>

<style scoped lang="scss">
.documents-table {
  width: 100%;

  // Table wrapper with horizontal scroll
  &__wrapper {
    overflow-x: auto;
  }

  // Base table
  &__table {
    width: 100%;
    border-collapse: collapse;
  }

  // Table head
  &__head {
    border-bottom: 1px solid #e5e7eb;
  }

  // Table body
  &__body {
    .documents-table__row:not(:last-child) {
      border-bottom: 1px solid #e5e7eb;
    }
  }

  // Table row
  &__row {
    transition: background-color 0.2s ease;

    &:hover:not(&--header) {
      background-color: #f9fafb;
    }
  }

  // Table header cell
  &__header {
    text-align: left;
    padding: 0.75rem 1.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  // Table cell
  &__cell {
    padding: 1rem 1.5rem;
    vertical-align: top;
  }

  // Name column
  &__name {
    font-weight: 500;
    color: #111827;
    margin-bottom: 0.25rem;
  }

  &__domain {
    font-size: 0.875rem;
    color: #6b7280;
  }

  // Categories
  &__categories {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  // Badge (Active/Inactive status)
  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    border-radius: 0.25rem;

    &--active {
      background-color: #d1fae5;
      color: #065f46;
    }

    &--inactive {
      background-color: #f3f4f6;
      color: #4b5563;
    }
  }

  &__badge-dot {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background-color: currentColor;
  }

  // Tag
  &__tag {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    background-color: #f3f4f6;
    color: #374151;
    border-radius: 0.25rem;
  }

  // Status badge
  &__status {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 9999px;

    &--active {
      background-color: #d1fae5;
      color: #065f46;
    }

    &--inactive {
      background-color: #f3f4f6;
      color: #374151;
    }
  }

  // Rating
  &__rating {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.25rem;

    &--up {
      color: #059669;
    }

    &--down {
      color: #dc2626;
    }
  }

  &__rating-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  &__date {
    font-size: 0.875rem;
    color: #6b7280;
  }

  // Actions
  &__actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__action-btn {
    min-width: auto;
    padding: 0.375rem;

    &:hover {
      background-color: #f3f4f6;
    }
  }

  &__action-icon {
    width: 1rem;
    height: 1rem;
  }

  // Empty state
  &__empty {
    padding: 2rem 1.5rem;
    text-align: center;
    color: #6b7280;
  }

  // Responsive
  @media (max-width: 768px) {
    &__table {
      font-size: 0.875rem;
    }

    &__header,
    &__cell {
      padding: 0.75rem 1rem;
    }
  }
}

// ============================================
// Pagination Block (BEM)
// ============================================
.pagination {
  border-top: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;

  // Container - centers and spaces pagination elements
  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;

    @media (max-width: 640px) {
      flex-direction: column;
      gap: 1rem;
    }
  }

  // Previous/Next buttons
  &__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    min-width: fit-content;

    @media (max-width: 640px) {
      width: 100%;
    }
  }

  &__icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  &__text {
    @media (max-width: 640px) {
      display: none;
    }
  }

  // Page numbers container
  &__numbers {
    display: flex;
    align-items: center;
    gap: 0.25rem;

    @media (max-width: 640px) {
      display: none;
    }
  }

  // Individual page number button
  &__number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2.5rem;
    height: 2.5rem;
    padding: 0 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    background-color: transparent;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.15s ease;
    user-select: none;

    &:hover:not(&--active) {
      background-color: #f3f4f6;
      color: #111827;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    &:active:not(&--active) {
      background-color: #e5e7eb;
    }

    // Active state - matches design
    &--active {
      background-color: #f3f4f6;
      color: #6b7280;
      font-weight: 600;
      cursor: default;

      &:hover {
        background-color: #f3f4f6;
      }
    }
  }

  // Ellipsis
  &__ellipsis {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2.5rem;
    height: 2.5rem;
    padding: 0 0.5rem;
    font-size: 0.875rem;
    color: #9ca3af;
    user-select: none;
  }
}
</style>
