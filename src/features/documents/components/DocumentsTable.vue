<template>
  <div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200">
            <th
              class="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              class="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Categories
            </th>
            <th
              class="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Rating
            </th>
            <th
              class="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Last assessed
            </th>
            <th
              class="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="(doc, i) in store.paginated"
            :key="i"
            class="hover:bg-gray-50 transition-colors"
          >
            <!-- Name -->
            <td class="py-4 px-6">
              <div class="font-medium text-gray-900">{{ doc.name }}</div>
              <div class="text-sm text-gray-500">{{ doc.domain }}</div>
            </td>

            <!-- Categories -->
            <td class="py-4 px-6">
              <div class="flex flex-wrap gap-2">
                <span
                  :class="[
                    'inline-flex items-center gap-1 px-2 py-1 text-xs rounded',
                    doc.status === 'Active'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-600',
                  ]"
                >
                  <span
                    :class="[
                      'w-1.5 h-1.5 rounded-full',
                      doc.status === 'Active' ? 'bg-green-500' : 'bg-gray-400',
                    ]"
                  ></span>
                  {{ doc.status }}
                </span>

                <span
                  v-for="(c, idx) in doc.categories"
                  :key="idx"
                  class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                  >{{ c }}</span
                >

                <span
                  v-if="doc.tags > 0"
                  class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                  >+{{ doc.tags }}</span
                >
              </div>
            </td>

            <!-- Rating -->
            <td class="py-4 px-6">
              <span
                :class="[
                  'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium',
                  doc.status === 'Active'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-700',
                ]"
              >
                {{ doc.status }}
              </span>
            </td>

            <!-- Last Assessed -->
            <td class="py-4 px-6">
              <div
                :class="[
                  'flex items-center gap-1 text-sm font-medium',
                  doc.direction === 'up' ? 'text-green-600' : 'text-red-600',
                ]"
              >
                <component
                  :is="doc.direction === 'up' ? TrendingUp : TrendingDown"
                  class="w-4 h-4"
                />
                {{ doc.rating }}
              </div>
              <div class="text-sm text-gray-500 mt-1">{{ doc.date }}</div>
            </td>

            <!-- Actions -->
            <td class="py-4 px-6">
              <div class="flex items-center gap-2">
                <AppButton
                  variant="ghost"
                  size="sm"
                  @click="remove(i)"
                  title="Delete"
                  class="action-btn"
                >
                  <Trash2 class="w-4 h-4" />
                </AppButton>
                <AppButton
                  variant="ghost"
                  size="sm"
                  title="Edit"
                  class="action-btn"
                >
                  <Pencil class="w-4 h-4" />
                </AppButton>
              </div>
            </td>
          </tr>

          <tr v-if="store.paginated.length === 0">
            <td class="px-6 py-8 text-center text-gray-500" colspan="5">
              No documents found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      class="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200"
    >
      <!-- Previous Button -->
      <AppButton
        variant="secondary"
        size="sm"
        @click="prev"
        :disabled="store.currentPage === 1"
        class="pagination-btn"
      >
        <ChevronLeft class="w-4 h-4" />
        <span class="hidden sm:inline">Previous</span>
      </AppButton>

      <!-- Page Numbers -->
      <div class="hidden sm:flex items-center gap-1">
        <!-- First Page -->
        <button
          v-if="pageNumbers[0] > 1"
          @click="goToPage(1)"
          class="pagination-number"
        >
          1
        </button>

        <!-- Left Ellipsis -->
        <span v-if="pageNumbers[0] > 2" class="px-2 text-gray-400">...</span>

        <!-- Page Numbers -->
        <button
          v-for="page in pageNumbers"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'pagination-number',
            page === store.currentPage ? 'pagination-number-active' : '',
          ]"
        >
          {{ page }}
        </button>

        <!-- Right Ellipsis -->
        <span
          v-if="pageNumbers[pageNumbers.length - 1] < store.totalPages - 1"
          class="px-2 text-gray-400"
          >...</span
        >

        <!-- Last Page -->
        <button
          v-if="pageNumbers[pageNumbers.length - 1] < store.totalPages"
          @click="goToPage(store.totalPages)"
          class="pagination-number"
        >
          {{ store.totalPages }}
        </button>
      </div>

      <!-- Next Button -->
      <AppButton
        variant="secondary"
        size="sm"
        @click="next"
        :disabled="store.currentPage === store.totalPages"
        class="pagination-btn"
      >
        <span class="hidden sm:inline">Next</span>
        <ChevronRight class="w-4 h-4" />
      </AppButton>
    </div>
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

const store = useDocumentsStore();

// Calculate which page numbers to show
const pageNumbers = computed(() => {
  const current = store.currentPage;
  const total = store.totalPages;
  const delta = 2; // Show 2 pages on each side of current page

  const range = [];
  const rangeWithDots = [];
  let l;

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
// Custom styles for action buttons
.action-btn {
  min-width: auto;
  padding: 0.375rem;

  &:hover {
    background-color: #f3f4f6;
  }
}

// Custom styles for pagination buttons
.pagination-btn {
  min-width: fit-content;

  @media (max-width: 640px) {
    padding: 0.5rem;
  }
}

// Page number buttons
.pagination-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  background-color: transparent;
  border-radius: 0.375rem;
  transition: all 0.2s;
  cursor: pointer;

  &:hover:not(.pagination-number-active) {
    background-color: #f3f4f6;
    color: #111827;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
}

.pagination-number-active {
  background-color: #6366f1;
  color: white;
  font-weight: 600;

  &:hover {
    background-color: #4f46e5;
  }
}

// Ensure table is responsive
@media (max-width: 768px) {
  table {
    font-size: 0.875rem;

    th,
    td {
      padding: 0.75rem 1rem;
    }
  }
}
</style>
