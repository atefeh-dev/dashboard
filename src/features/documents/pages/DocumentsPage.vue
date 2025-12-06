<template>
  <MainLayout
    :sidebar-open="store.sidebarOpen"
    :active-nav="store.activeNav"
    @close-sidebar="store.toggleSidebar"
    @navigate="store.setActiveNav"
  >
    <!-- Navbar -->
    <template #navbar>
      <div class="flex items-center justify-between gap-4">
        <!-- Left: Breadcrumb -->
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <button
            @click="store.toggleSidebar()"
            class="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <MenuIcon class="w-5 h-5" />
          </button>
          <Home class="w-4 h-4" />
          <span>Workspace Name</span>
          <span>/</span>
          <span class="text-gray-900 font-medium">Documents</span>
        </div>

        <!-- Right: Search -->
        <div class="flex-1 max-w-md">
          <div class="relative">
            <SearchIcon
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            />
            <input
              type="text"
              placeholder="search everything ..."
              class="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              v-model="store.search"
              @input="store.setSearch($event.target.value)"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- Main Content -->
    <div class="space-y-6">
      <!-- Stats Cards -->
      <StatsGrid :stats="store.stats" />

      <!-- Empty State Card -->
      <div class="bg-white rounded-lg border border-gray-200">
        <DocumentsEmptyState @create="onCreate" />
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { computed } from "vue";
import MainLayout from "@/components/layout/MainLayout.vue";
import DocumentsEmptyState from "../components/DocumentsEmptyState.vue";
import StatsGrid from "@/components/common/StatsGrid.vue";
import { useDocumentsStore } from "@/stores/useDocumentsStore";
import { Menu as MenuIcon, Search as SearchIcon, Home } from "lucide-vue-next";

const store = useDocumentsStore();
store.setActiveNav("Documents");

function onCreate() {
  store.addDocument({
    name: "New Document",
    domain: "document.pdf",
    status: "Active",
    categories: ["Draft"],
    rating: "0%",
    direction: "up",
    date: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    tags: 0,
  });
}
</script>
