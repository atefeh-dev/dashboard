<template>
  <MainLayout
    :sidebar-open="store.sidebarOpen"
    :active-nav="store.activeNav"
    @close-sidebar="store.toggleSidebar"
    @navigate="store.setActiveNav"
  >
    <!-- Navbar -->
    <template #navbar>
      <Navbar
        :breadcrumbs="['Workspace Name', 'Documents']"
        :model-value="store.search"
        @update:model-value="store.setSearch"
        @toggle-sidebar="store.toggleSidebar"
      />
    </template>

    <!-- Main Content -->
    <div class="documents">
      <!-- Stats Cards -->
      <div class="documents__stats">
        <StatsGrid :stats="store.stats" />
      </div>
      <!-- Google Drive Info Card -->
      <GoogleDriveInfoCard
        v-if="!hasNoDocuments"
        @connect="() => console.log('Connect to Google Drive')"
      />
      <!-- Documents Section -->
      <div
        :class="[
          'documents__card',
          { 'documents__card--no-overflow': hasNoDocuments },
        ]"
      >
        <!-- Header - Always show -->
        <DocumentsHeader
          v-if="!hasNoDocuments"
          title="Your documents are important, we're keep an eye on them here"
          subtitle="Keep track of every document you're working on"
          @create="onCreate"
          @import="onImport"
        />
        <!-- Show Empty State only when no documents -->
        <DocumentsEmptyState v-if="hasNoDocuments" @create="onCreate" />
        <!-- Show Table when documents exist -->
        <DocumentsTable v-else />
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { computed } from "vue";
import MainLayout from "@/components/layout/MainLayout.vue";
import GoogleDriveInfoCard from "../components/GoogleDriveInfoCard.vue";
import Navbar from "@/components/layout/Navbar.vue";
import DocumentsEmptyState from "../components/DocumentsEmptyState.vue";
import DocumentsTable from "../components/DocumentsTable.vue";
import StatsGrid from "@/components/common/StatsGrid.vue";
import DocumentsHeader from "../components/DocumentsHeader.vue";
import { useDocumentsStore } from "@/stores/useDocumentsStore";

const store = useDocumentsStore();
store.setActiveNav("Documents");

// Check if documents are actually empty
const hasNoDocuments = computed(() => {
  return store.allData.documents.length === 0;
});

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

function onImport() {
  console.log("Import / Export clicked");
}
</script>

<style scoped lang="scss">
.documents {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  // Documents Card
  &__card {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  &__action-icon {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }
}
</style>

<style scoped lang="scss">
.documents__card--no-overflow {
  overflow: visible;
}
</style>
