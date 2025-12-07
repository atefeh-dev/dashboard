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
                <button
                  @click="remove(i)"
                  class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
                <button
                  class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  title="Edit"
                >
                  <Pencil class="w-4 h-4" />
                </button>
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
      class="flex items-center justify-between px-6 py-4 border-t border-gray-200"
    >
      <div class="text-sm text-gray-500">
        Showing {{ (store.currentPage - 1) * store.perPage + 1 }} to
        {{ Math.min(store.currentPage * store.perPage, store.filtered.length) }}
        of {{ store.filtered.length }} results
      </div>
      <div class="flex gap-2">
        <button
          @click="prev"
          :disabled="store.currentPage === 1"
          class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          @click="next"
          :disabled="store.currentPage === store.totalPages"
          class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDocumentsStore } from "@/stores/useDocumentsStore";
import { Trash2, Pencil, TrendingUp, TrendingDown } from "lucide-vue-next";

const store = useDocumentsStore();

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
  // Pass the index directly - store will calculate the actual index
  store.removeDocument(index);
}
</script>
