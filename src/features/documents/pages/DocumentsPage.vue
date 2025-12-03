<template>
  <MainLayout
    :sidebarOpen="store.sidebarOpen"
    :navItems="store.navItems"
    :activeNav="store.activeNav"
    @closeSidebar="store.toggleSidebar"
    @navigate="store.setActiveNav"
  >
    <div class="lg:hidden mb-4">
      <button
        class="p-2 hover:bg-gray-100 rounded-lg"
        @click="store.toggleSidebar"
      >
        <MenuIcon class="w-6 h-6" />
      </button>
    </div>

    <DocumentsHeader />

    <StatsGrid :stats="store.stats" />

    <InfoCard>
      <template #title
        >We don't store any document's files on our server</template
      >
      <template #body>
        DocLast does not store documents on its servers to ensure your security.
        Therefore, if you need to store your documents, you can connect your
        workspace to Google Drive to access all your files in your own place.
      </template>
    </InfoCard>

    <div class="app-card">
      <div class="p-4 sm:p-6 border-b border-gray-200">
        <DocumentsFilters @create="onCreate" @import="onImport" />
      </div>

      <DocumentsTable />
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/components/layout/MainLayout.vue";
import DocumentsHeader from "../components/DocumentsHeader.vue";
import DocumentsFilters from "../components/DocumentsFilters.vue";
import DocumentsTable from "../components/DocumentsTable.vue";
import StatsGrid from "@/components/common/StatsGrid.vue";
import InfoCard from "@/components/common/InfoCard.vue";
import { useDocumentsStore } from "../stores/useDocumentsStore";
import { Menu as MenuIcon, Search as SearchIcon } from "lucide-vue-next";

const store = useDocumentsStore();

function onCreate() {
  store.addDocument({
    name: "New Doc",
    domain: "example.com",
    status: "Active",
    categories: ["Other"],
    rating: "0%",
    direction: "up",
    date: new Date().toLocaleDateString("en-GB"),
    tags: 0,
  });
}

function onImport() {
  window.alert("Import / Export clicked");
}
</script>

<style scoped lang="scss"></style>
