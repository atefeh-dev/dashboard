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

                <span v-if="doc.tags > 0" class="documents-table__tag">
                  +{{ doc.tags }}
                </span>
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
                        ? ArrowUpGreenIcon
                        : ArrowDownRedIcon
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
@use "../../../assets/styles/table-mixins" as mixins;

// Apply the shared table styles with 'documents-table' prefix
@include mixins.table-base-styles("documents-table");
</style>
