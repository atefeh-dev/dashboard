<template>
  <div class="overview-table">
    <div class="overview-table__wrapper">
      <table class="overview-table__table">
        <thead class="overview-table__head">
          <tr class="overview-table__row overview-table__row--header">
            <th class="overview-table__header">
              <span class="overview-table__header-name">
                Name <ArrowDownIcon />
              </span>
            </th>
            <th class="overview-table__header">Categories</th>
            <th class="overview-table__header">Rating</th>
            <th class="overview-table__header"></th>
            <th class="overview-table__header">Last assessed</th>
            <th class="overview-table__header"></th>
          </tr>
        </thead>

        <tbody class="overview-table__body">
          <tr
            v-for="(item, i) in store.paginated"
            :key="i"
            class="overview-table__row"
          >
            <!-- Name -->
            <td class="overview-table__cell">
              <div class="overview-table__name">{{ item.name }}</div>
              <div class="overview-table__domain">{{ item.domain }}</div>
            </td>

            <!-- Categories -->
            <td class="overview-table__cell">
              <div class="overview-table__categories">
                <span class="overview-table__badge">
                  <span
                    :class="[
                      'overview-table__badge-dot',
                      item.status === 'Active'
                        ? 'overview-table__badge-dot--active'
                        : 'overview-table__badge-dot--inactive',
                    ]"
                  ></span>
                  {{ item.status }}
                </span>

                <span
                  v-for="(cat, idx) in item.categories"
                  :key="idx"
                  class="overview-table__tag"
                >
                  {{ cat }}
                </span>

                <span v-if="item.tags > 0" class="overview-table__tag">
                  +{{ item.tags }}
                </span>
              </div>
            </td>

            <!-- Status -->
            <td class="overview-table__cell">
              <span
                :class="[
                  'overview-table__status',
                  item.status === 'Active'
                    ? 'overview-table__status--active'
                    : 'overview-table__status--inactive',
                ]"
              >
                {{ item.status }}
              </span>
            </td>

            <!-- Rating -->
            <td class="overview-table__cell">
              <div class="overview-table__rating">
                <span
                  :class="[
                    'overview-table__rating-value',
                    item.direction === 'up'
                      ? 'overview-table__rating-value--up'
                      : 'overview-table__rating-value--down',
                  ]"
                >
                  <component
                    :is="
                      item.direction === 'up'
                        ? ArrowUpGreenIcon
                        : ArrowDownRedIcon
                    "
                    class="overview-table__rating-icon"
                  />
                  {{ item.rating }}
                </span>
              </div>
            </td>

            <!-- Last Assessed -->
            <td class="overview-table__cell">
              <div class="overview-table__date">{{ item.date }}</div>
            </td>

            <!-- Actions -->
            <td class="overview-table__cell">
              <div class="overview-table__actions">
                <AppButton
                  variant="blank"
                  size="sm"
                  @click="store.removeDocument(i)"
                  title="Delete"
                  class="overview-table__action-btn"
                >
                  <TrashIcon class="overview-table__action-icon" />
                </AppButton>

                <AppButton
                  variant="blank"
                  size="sm"
                  title="Edit"
                  class="overview-table__action-btn"
                >
                  <EditIcon class="overview-table__action-icon" />
                </AppButton>
              </div>
            </td>
          </tr>

          <tr v-if="store.paginated.length === 0">
            <td class="overview-table__empty" colspan="6">No data found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Simple Footer -->
    <div class="overview-footer">
      <div class="overview-footer__info">
        Page {{ store.currentPage }} of {{ store.totalPages }}
      </div>

      <div class="overview-footer__actions">
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
import AppButton from "@/components/ui/AppButton.vue";
import { useDocumentsStore } from "@/stores/useDocumentsStore";

import ArrowDownIcon from "@/assets/icons/common/arrow-down.svg";
import ArrowDownRedIcon from "@/assets/icons/common/arrow-down-red.svg";
import ArrowUpGreenIcon from "@/assets/icons/common/arrow-up-green.svg";
import TrashIcon from "@/assets/icons/common/trash.svg";
import EditIcon from "@/assets/icons/common/edit.svg";

const store = useDocumentsStore();
</script>

<style scoped lang="scss">
@use "../../../assets/styles/table-mixins" as mixins;

// Apply the shared table styles with 'overview-table' prefix
@include mixins.table-base-styles("overview-table");

// Overview-specific footer styles
.overview-footer {
  border-top: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
  }

  &__info {
    font-size: 0.875rem;
    color: #6b7280;
  }

  &__actions {
    display: flex;
    gap: 0.5rem;

    @media (max-width: 640px) {
      width: 100%;

      button {
        flex: 1;
      }
    }
  }
}
</style>
