<template>
  <div class="mb-8">
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6"
    >
      <nav class="flex items-center gap-2 text-sm flex-shrink-0">
        <HomeIcon class="w-4 h-4 text-gray-400" />
        <span class="text-gray-500">Workspace Name</span>
        <span class="text-gray-400">/</span>
        <span class="text-gray-900 font-semibold">Documents</span>
      </nav>

      <AppSearch
        v-model="store.search"
        placeholder="Search everything ..."
        class="w-full sm:max-w-md"
      />
    </div>
  </div>
</template>

<script setup>
import { Home as HomeIcon } from "lucide-vue-next";
import AppSearch from "@/components/ui/AppSearch.vue";
import { useDocumentsStore } from "../stores/useDocumentsStore";

const store = useDocumentsStore();
</script>

<style scoped></style>
