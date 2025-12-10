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
        current-page="Documents"
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

      <!-- Google Drive Info Card - Only show when documents exist -->
      <div v-if="!hasNoDocuments" class="documents__gdrive-card">
        <div class="documents__gdrive-content">
          <!-- Left: Image/Illustration -->
          <div class="documents__gdrive-image">
            <div class="documents__gdrive-image-wrapper">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Google_Drive_logo_2013.png"
                alt="Google Drive"
                class="documents__gdrive-logo"
              />
            </div>
          </div>

          <!-- Right: Content -->
          <div class="documents__gdrive-info">
            <h3 class="documents__gdrive-title">
              We don't store any document's files on our server
            </h3>
            <p class="documents__gdrive-text">
              DocLast does not store documents on its servers to ensure your
              security. Therefore, if you need to store your documents, you can
              connect your workspace to Google Drive to access all your files in
              your own place.
            </p>
            <AppButton variant="secondary" size="md">
              Connect to Google Drive
            </AppButton>
          </div>
        </div>
      </div>

      <!-- Documents Section -->
      <div class="documents__card">
        <!-- Header - Always show -->
        <div v-if="!hasNoDocuments" class="documents__header">
          <div class="documents__header-content">
            <div class="documents__header-info">
              <h2 class="documents__header-title">
                Your documents are important, we're keep an eye on them here
              </h2>
              <p class="documents__header-subtitle">
                Keep track of every document you're working on
              </p>
            </div>
            <div class="documents__header-actions">
              <AppButton variant="ghost" size="md" @click="onImport">
                <Upload class="documents__action-icon" />
                Import / Export
              </AppButton>
              <AppButton variant="primary" size="md" @click="onCreate">
                <Plus class="documents__action-icon" />
                New document
              </AppButton>
            </div>
          </div>
        </div>

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
import Navbar from "@/components/layout/Navbar.vue";
import DocumentsEmptyState from "../components/DocumentsEmptyState.vue";
import DocumentsTable from "../components/DocumentsTable.vue";
import StatsGrid from "@/components/common/StatsGrid.vue";
import AppButton from "@/components/ui/AppButton.vue";
import { useDocumentsStore } from "@/stores/useDocumentsStore";
import { Plus, Upload } from "lucide-vue-next";

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

  // Google Drive Card
  &__gdrive-card {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1.5rem;
  }

  &__gdrive-content {
    display: flex;
    gap: 1.5rem;
    align-items: center;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__gdrive-image {
    flex-shrink: 0;
  }

  &__gdrive-image-wrapper {
    width: 11rem;
    height: 11rem;
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__gdrive-logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 1rem;
  }

  &__gdrive-info {
    flex: 1;
  }

  &__gdrive-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  &__gdrive-text {
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  // Documents Card
  &__card {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  // Header
  &__header {
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  &__header-content {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  &__header-info {
    flex: 1;
  }

  &__header-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
  }

  &__header-subtitle {
    font-size: 0.875rem;
    color: #6b7280;
  }

  &__header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;

    @media (max-width: 768px) {
      width: 100%;
      flex-direction: column;
    }
  }

  &__action-icon {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }
}
</style>
