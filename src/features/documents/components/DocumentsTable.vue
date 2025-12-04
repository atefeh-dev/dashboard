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
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(doc, i) in store.paginated"
            :key="i"
            class="hover:bg-gray-50"
          >
            <td>
              <div class="font-medium text-gray-900">{{ doc.name }}</div>
              <div class="text-sm text-gray-500">{{ doc.domain }}</div>
            </td>

            <td>
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

            <td>
              <span
                class="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded"
              >
                <span
                  :class="
                    doc.direction === 'up' ? 'text-green-500' : 'text-red-500'
                  "
                  >{{ doc.direction === "up" ? "↑" : "↓" }}</span
                >
                Active
              </span>
            </td>

            <td>
              <span
                :class="[
                  'inline-flex items-center gap-1 text-sm',
                  doc.direction === 'up' ? 'text-green-600' : 'text-red-600',
                ]"
              >
                {{ doc.direction === "up" ? "↑" : "↓" }} {{ doc.rating }}
              </span>
            </td>

            <td class="text-sm text-gray-500">{{ doc.date }}</td>

            <td>
              <div class="flex gap-2">
                <button
                  class="p-1 text-gray-400 hover:text-gray-600"
                  @click="remove(i)"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
                <button class="p-1 text-gray-400 hover:text-gray-600">
                  <EditIcon class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="store.paginated.length === 0">
            <td class="px-4 py-6 text-center text-gray-500" colspan="6">
              No documents found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AppPagination
      :pages="pagesArray"
      :current="store.currentPage"
      @change="store.goToPage"
      @prev="prev"
      @next="next"
    />
  </div>
</template>

<script setup>
import AppPagination from "@/components/ui/AppPagination.vue";
import { useDocumentsStore } from "../../../stores/useDocumentsStore";
import { computed } from "vue";
import { Trash2 as TrashIcon, Edit as EditIcon } from "lucide-vue-next";

const store = useDocumentsStore();

const pagesArray = computed(() => {
  // create a simple pages array like [1,2,3,'...',8,9,10]
  const total = store.totalPages;
  const cur = store.currentPage;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const res = [1, 2, 3];
  if (cur > 4) res.push("...");
  const start = Math.max(4, cur - 1);
  const end = Math.min(total - 3, cur + 1);
  for (let i = start; i <= end; i++) res.push(i);
  if (cur < total - 3) res.push("...");
  res.push(total - 2, total - 1, total);
  return [...new Set(res)].slice(0, 9);
});

function prev() {
  store.goToPage(store.currentPage - 1);
}
function next() {
  store.goToPage(store.currentPage + 1);
}
function remove(i) {
  store.removeDocument((store.currentPage - 1) * store.perPage + i);
}
</script>

<style scoped lang="scss"></style>
