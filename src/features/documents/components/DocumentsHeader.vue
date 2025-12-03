<template>
  <div class="mb-8">
    <!-- Flex container: becomes column on small screens -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6"
    >
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm flex-shrink-0">
        <HomeIcon class="w-4 h-4 text-gray-400" />
        <span class="text-gray-500">Workspace Name</span>
        <span class="text-gray-400">/</span>
        <span class="text-gray-900 font-semibold">Documents</span>
      </nav>

      <!-- Search Box -->
      <div class="w-full sm:max-w-md">
        <div class="relative">
          <SearchIcon
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          />
          <input
            v-model="store.search"
            type="text"
            placeholder="search everything ..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-400"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Home as HomeIcon, Search as SearchIcon } from "lucide-vue-next";
import { useDocumentsStore } from "@/features/documents/stores/useDocumentsStore";

const store = useDocumentsStore();
</script>

<style scoped lang="scss"></style>
