<template>
  <div class="documents">
    <div class="documents__table-wrapper">
      <table class="documents__table">
        <thead class="documents__thead">
          <tr class="documents__row documents__row--head">
            <th class="documents__th">Name</th>
            <th class="documents__th">Categories</th>
            <th class="documents__th">Rating</th>
            <th class="documents__th">Last assessed</th>
            <th class="documents__th">Actions</th>
          </tr>
        </thead>

        <tbody class="documents__tbody">
          <tr
            class="documents__row"
            v-for="(item, i) in store.paginated"
            :key="i"
          >
            <!-- NAME -->
            <td class="documents__td">
              <div class="documents__name">{{ item.name }}</div>
              <div class="documents__domain">{{ item.domain }}</div>
            </td>

            <!-- CATEGORIES -->
            <td class="documents__td">
              <div class="documents__categories">
                <span
                  class="documents__badge documents__badge--status"
                  :class="{
                    'documents__badge--active': item.status === 'Active',
                    'documents__badge--inactive': item.status !== 'Active',
                  }"
                >
                  <span
                    class="documents__dot"
                    :class="{
                      'documents__dot--active': item.status === 'Active',
                      'documents__dot--inactive': item.status !== 'Active',
                    }"
                  ></span>
                  {{ item.status }}
                </span>

                <span
                  v-for="(cat, idx) in item.categories"
                  :key="idx"
                  class="documents__badge"
                >
                  {{ cat }}
                </span>

                <span v-if="item.tags > 0" class="documents__badge">
                  +{{ item.tags }}
                </span>
              </div>
            </td>

            <!-- RATING -->
            <td class="documents__td">
              <span class="documents__rating-badge">Active</span>
            </td>

            <!-- LAST ASSESSED -->
            <td class="documents__td">
              <span
                class="documents__trend"
                :class="{
                  'documents__trend--up': item.direction === 'up',
                  'documents__trend--down': item.direction === 'down',
                }"
              >
                {{ item.direction === "up" ? "↑" : "↓" }} {{ item.rating }}
              </span>
              <div class="documents__date">{{ item.date }}</div>
            </td>

            <!-- ACTIONS -->
            <td class="documents__td table-cell table-cell--actions">
              <div class="documents__actions">
                <button
                  class="documents__action-btn"
                  @click="store.removeDocument(i)"
                >
                  <Trash2 class="documents__icon" />
                </button>

                <button class="documents__action-btn">
                  <Edit class="documents__icon" />
                </button>
              </div>
            </td>
          </tr>

          <!-- EMPTY -->
          <tr v-if="store.paginated.length === 0">
            <td class="documents__empty" colspan="5">No data found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- FOOTER -->
    <div class="documents__footer">
      <div class="documents__page-info">
        Page {{ store.currentPage }} of {{ store.totalPages }}
      </div>

      <div class="documents__pagination">
        <AppButton
          variant="secondary"
          @click="store.goToPage(store.currentPage - 1)"
          :disabled="store.currentPage === 1"
        >
          Previous
        </AppButton>

        <AppButton
          variant="secondary"
          @click="store.goToPage(store.currentPage + 1)"
          :disabled="store.currentPage === store.totalPages"
        >
          Next
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Trash2, Edit } from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";
import { useDocumentsStore } from "../../../stores/useDocumentsStore";

const store = useDocumentsStore();
</script>

<style lang="scss" scoped>
.table-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.125rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 9999px;
  background: transparent;
  color: #374151;
}

.table-badge-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: #9ca3af; /* gray-400 default */
  display: inline-block;
  flex-shrink: 0;
}

.table-badge--active .table-badge-dot {
  background-color: #10b981; /* green-500 */
}

.table-badge--inactive .table-badge-dot {
  background-color: #9ca3af; /* gray-400 */
}

.table-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  font-size: 0.8125rem;
  background: #f3f4f6;
  border-radius: 0.375rem;
  color: #374151;
  margin-right: 0.25rem;
}

.documents {
  &__table-wrapper {
    overflow-x: auto;
  }

  &__table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }

  /* HEAD */
  &__thead {
    background: #fafafa;
  }

  &__row--head th {
    text-align: left;
    padding: 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #4b5563;
    border-bottom: 1px solid #e5e7eb;
  }

  /* CELLS */
  &__td {
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
    vertical-align: top;
  }

  /* NAME */
  &__name {
    font-weight: 600;
    color: #111827;
  }

  &__domain {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 2px;
  }

  /* CATEGORIES */
  &__categories {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__badge {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    border-radius: 4px;
    background: #f3f4f6;
    color: #374151;

    &--status {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }

    &--active {
      background: #ecfdf5;
      color: #047857;
    }

    &--inactive {
      background: #f3f4f6;
      color: #6b7280;
    }
  }

  &__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;

    &--active {
      background: #10b981;
    }

    &--inactive {
      background: #9ca3af;
    }
  }

  /* RATING */
  &__rating-badge {
    padding: 0.25rem 0.5rem;
    background: #ecfdf5;
    color: #047857;
    border-radius: 4px;
    font-size: 0.75rem;
  }

  /* TREND */
  &__trend {
    font-size: 0.875rem;
    font-weight: 600;

    &--up {
      color: #059669;
    }

    &--down {
      color: #dc2626;
    }
  }

  &__date {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  /* ACTION ICONS */
  &__actions {
    display: flex;
    gap: 0.5rem;
  }

  &__action-btn {
    padding: 0.25rem;
    color: #9ca3af;
    transition: 0.2s;

    &:hover {
      color: #4b5563;
    }
  }

  &__icon {
    width: 16px;
    height: 16px;
  }

  /* EMPTY */
  &__empty {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
    font-size: 0.875rem;
  }

  /* FOOTER */
  &__footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__page-info {
    font-size: 0.875rem;
    color: #6b7280;
  }

  &__pagination {
    display: flex;
    gap: 0.5rem;
  }
}
</style>
.table-cell--actions { width: 72px; max-width: 72px; white-space: nowrap; }
