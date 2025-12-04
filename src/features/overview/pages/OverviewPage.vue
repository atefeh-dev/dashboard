<template>
  <MainLayout
    :sidebarOpen="store.sidebarOpen"
    :activeNav="store.activeNav"
    @closeSidebar="store.toggleSidebar"
    @navigate="handleNavigate"
  >
    <div class="lg:hidden mb-4">
      <button
        class="p-2 hover:bg-gray-100 rounded-lg"
        @click="store.toggleSidebar"
      >
        <Menu class="w-6 h-6" />
      </button>
    </div>

    <!-- Header -->
    <div class="mb-8">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <nav class="flex items-center gap-2 text-sm">
          <Globe class="w-4 h-4 text-gray-400" />
          <Home class="w-4 h-4 text-gray-400" />
          <span class="text-gray-500">Workspace Name</span>
          <span class="text-gray-400">/</span>
          <span class="text-gray-900 font-semibold">Overview</span>
        </nav>
        <AppSearch
          v-model="store.search"
          placeholder="search everything ..."
          class="w-full sm:max-w-md"
        />
      </div>
    </div>

    <!-- Stats -->
    <StatsGrid :stats="store.stats" />

    <!-- Quick view -->
    <div class="app-card">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">
          Quick view of your data
        </h2>
        <p class="text-sm text-gray-500">
          Keep track of everything you're working on
        </p>
      </div>

      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between gap-4">
          <div class="flex gap-2">
            <button
              v-for="tab in tabs"
              :key="tab"
              @click="store.setActiveTab(tab)"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-lg transition',
                store.activeTab === tab
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50',
              ]"
            >
              {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
            </button>
          </div>
          <AppButton variant="primary">
            <Plus class="w-4 h-4" />
            <span>Add {{ store.activeTab.slice(0, -1) }}</span>
          </AppButton>
        </div>
      </div>

      <OverviewTable />
    </div>
  </MainLayout>
</template>

<script setup>
import { useRouter } from "vue-router";
import MainLayout from "@/components/layout/MainLayout.vue";
import OverviewTable from "../components/OverviewTable.vue";
import StatsGrid from "@/components/common/StatsGrid.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppSearch from "@/components/ui/AppSearch.vue";
import { Menu, Plus, Globe, Home } from "lucide-vue-next";
import { useDocumentsStore } from "../../../stores/useDocumentsStore";

const store = useDocumentsStore();
const router = useRouter();

store.setActiveNav("Overview");

const tabs = ["companies", "people", "documents", "templates"];

const handleNavigate = (label) => {
  store.setActiveNav(label);
  if (label === "Documents") router.push("/documents");
  if (label === "Overview") router.push("/overview");
};
</script>
