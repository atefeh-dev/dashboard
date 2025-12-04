<template>
  <div>
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Categories</th>
            <th>Rating</th>
            <th>Last assessed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in store.paginated" :key="i">
            <td>
              <div class="font-medium text-gray-900">{{ item.name }}</div>
              <div class="text-sm text-gray-500">{{ item.domain }}</div>
            </td>
            <td>
              <div class="flex flex-wrap gap-2">
                <span
                  :class="[
                    'inline-flex items-center gap-1 px-2 py-1 text-xs rounded',
                    item.status === 'Active'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-600',
                  ]"
                >
                  <span
                    :class="[
                      'w-1.5 h-1.5 rounded-full',
                      item.status === 'Active' ? 'bg-green-500' : 'bg-gray-400',
                    ]"
                  ></span>
                  {{ item.status }}
                </span>
                <span
                  v-for="(cat, idx) in item.categories"
                  :key="idx"
                  class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                >
                  {{ cat }}
                </span>
                <span
                  v-if="item.tags > 0"
                  class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                >
                  +{{ item.tags }}
                </span>
              </div>
            </td>
            <td>
              <span class="px-2 py-1 text-xs bg-green-50 text-green-700 rounded"
                >Active</span
              >
            </td>
            <td>
              <span
                :class="[
                  'inline-flex items-center gap-1 text-sm font-medium',
                  item.direction === 'up' ? 'text-green-600' : 'text-red-600',
                ]"
              >
                {{ item.direction === "up" ? "↑" : "↓" }} {{ item.rating }}
              </span>
              <div class="text-sm text-gray-500 mt-1">{{ item.date }}</div>
            </td>
            <td>
              <div class="flex gap-2">
                <button
                  class="p-1 text-gray-400 hover:text-gray-600"
                  @click="store.removeDocument(i)"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
                <button class="p-1 text-gray-400 hover:text-gray-600">
                  <Edit class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="store.paginated.length === 0">
            <td colspan="5" class="text-center py-6 text-gray-500">
              No data found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="px-6 py-4 border-t border-gray-200 flex items-center justify-between"
    >
      <div class="text-sm text-gray-500">
        Page {{ store.currentPage }} of {{ store.totalPages }}
      </div>
      <div class="flex gap-2">
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
import { useDocumentsStore } from "../../../features/documents/stores/useDocumentsStore";

const store = useDocumentsStore();
</script>
