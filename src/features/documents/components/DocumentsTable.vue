<template>
  <div class="documents-table">
    <div class="documents-table__wrapper">
      <table class="documents-table__table">
        <thead class="documents-table__head">
          <tr class="documents-table__row documents-table__row--header">
            <th class="documents-table__header">
              <span class="documents-table__header-name">
                Name <ArrowDownIcon />
              </span>
            </th>

            <th class="documents-table__header">Categories</th>
            <th class="documents-table__header">Rating</th>
            <th class="documents-table__header"></th>
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
                <span class="documents-table__badge">
                  <span
                    :class="[
                      'documents-table__badge-dot',
                      doc.status === 'Active'
                        ? 'documents-table__badge-dot--active'
                        : 'documents-table__badge-dot--inactive',
                    ]"
                  ></span>
                  {{ doc.status }}
                </span>

                <span
                  v-for="(c, idx) in doc.categories"
                  :key="idx"
                  class="documents-table__tag"
                >
                  {{ c }}
                </span>

                <span v-if="doc.tags > 0" class="documents-table__tag"
                  >+{{ doc.tags }}</span
                >
              </div>
            </td>

            <!-- Status -->
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

            <!-- Rating -->
            <td class="documents-table__cell">
              <div class="documents-table__rating">
                <span
                  :class="[
                    'documents-table__rating-value',
                    doc.direction === 'up'
                      ? 'documents-table__rating-value--up'
                      : 'documents-table__rating-value--down',
                  ]"
                >
                  <component
                    :is="
                      doc.direction === 'up'
                        ? ArrowDownRedIcon
                        : ArrowUpGreenIcon
                    "
                    class="documents-table__rating-icon"
                  />
                  {{ doc.rating }}
                </span>
              </div>
            </td>

            <!-- Last Assessed -->
            <td class="documents-table__cell">
              <div class="documents-table__date">{{ doc.date }}</div>
            </td>

            <!-- Actions -->
            <td class="documents-table__cell">
              <div class="documents-table__actions">
                <AppButton
                  variant="blank"
                  size="sm"
                  @click="remove(i)"
                  title="Delete"
                  class="documents-table__action-btn"
                >
                  <TrashIcon class="documents-table__action-icon" />
                </AppButton>

                <AppButton
                  variant="blank"
                  size="sm"
                  title="Edit"
                  class="documents-table__action-btn"
                >
                  <EditIcon class="documents-table__action-icon" />
                </AppButton>
              </div>
            </td>
          </tr>

          <tr v-if="store.paginated.length === 0">
            <td class="documents-table__empty" colspan="6">
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

import AppButton from "@/components/ui/AppButton.vue";
import AppPagination from "@/components/ui/AppPagination.vue";

import ArrowDownIcon from "@/assets/icons/common/arrow-down.svg";
import ArrowDownRedIcon from "@/assets/icons/common/arrow-down-red.svg";
import ArrowUpGreenIcon from "@/assets/icons/common/arrow-up-green.svg";
import TrashIcon from "@/assets/icons/common/trash.svg";
import EditIcon from "@/assets/icons/common/edit.svg";

const store = useDocumentsStore();

// Pagination
const pages = computed(() => {
  const total = store.totalPages;
  const maxVisible = 7;
  if (total <= maxVisible)
    return Array.from({ length: total }, (_, i) => i + 1);

  const side = Math.floor((maxVisible - 1) / 2);
  const left = Array.from({ length: side }, (_, i) => i + 1);
  const right = Array.from({ length: side }, (_, i) => total - side + i + 1);

  if (right[0] - left[left.length - 1] <= 1)
    return Array.from({ length: total }, (_, i) => i + 1);

  return [...left, "...", ...right];
});

const goToPage = (p) => store.goToPage(p);
const prev = () =>
  store.currentPage > 1 && store.goToPage(store.currentPage - 1);
const next = () =>
  store.currentPage < store.totalPages && store.goToPage(store.currentPage + 1);

const remove = (i) => store.removeDocument(i);
</script>

<style scoped lang="scss">
.documents-table {
  width: 100%;

  &__wrapper {
    overflow-x: auto;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
  }

  &__head {
    border-bottom: 1px solid #e5e7eb;
  }

  &__row {
    transition: background-color 0.2s ease;

    &:hover:not(&--header) {
      background-color: #f9fafb;
    }
  }

  &__header {
    text-align: left;
    padding: 0.75rem 1.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    background-color: #fafafa;
    color: #717680;
    border-bottom: 1px solid #e9eaeb;
  }

  &__header-name {
    display: inline-flex;
    align-items: center;
    gap: 4px;

    svg {
      width: 0.75rem;
      height: 0.75rem;
    }
  }

  &__cell {
    padding: 1rem 1.5rem;
    vertical-align: top;
  }

  /* Name */
  &__name {
    font-weight: 500;
    color: #181d27;
    font-size: 0.875rem;
  }

  &__domain {
    font-size: 0.875rem;
    color: #535862;
  }

  /* Categories */
  &__categories {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.375rem;
    font-size: 0.75rem;
    background: #f3f4f6;
    border-radius: 0.375rem;
    border: 1px solid #d5d7da;
    box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05);
  }

  &__badge-dot {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background-color: currentColor;

    &--active {
      color: #17b26a;
    }
    &--inactive {
      color: #717680;
    }
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.375rem;
    font-size: 0.75rem;
    background-color: #f3f4f6;
    color: #374151;
    border-radius: 0.375rem;
    border: 1px solid #d5d7da;
  }

  /* Status */
  &__status {
    display: inline-flex;
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 9999px;
    border: 1px solid;

    &--active {
      background: #ecfdf3;
      color: #067647;
      border-color: #abefc6;
    }

    &--inactive {
      background: #f3f4f6;
      color: #717680;
      border-color: #d5d7da;
    }
  }

  /* Rating */
  &__rating {
    display: flex;
    align-items: center;
  }

  &__rating-value {
    display: inline-flex;
    align-items: center;
    gap: 0.125rem;
    padding: 0.125rem 0.375rem;
    font-size: 0.75rem;
    border-radius: 0.375rem;
    border: 1px solid #d5d7da;
    box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05);

    &--up {
      color: #16a34a;
    }

    &--down {
      color: #dc2626;
    }
  }

  &__rating-icon svg {
    width: 0.75rem;
    height: 0.75rem;
  }

  /* Date */
  &__date {
    font-size: 0.875rem;
    color: #535863;
  }

  /* Actions */
  &__actions {
    display: flex;
  }

  &__action-btn:hover {
    background-color: #f3f4f6;
  }

  &__action-icon {
    width: 1rem;
    height: 1rem;
  }

  /* Empty */
  &__empty {
    text-align: center;
    padding: 2rem 1.5rem;
    color: #6b7280;
  }
}
</style>
