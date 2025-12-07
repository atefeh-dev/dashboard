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

      <!-- Google Drive Info Card - Only show when documents exist -->
      <div
        v-if="!hasNoDocuments"
        class="bg-white rounded-lg border border-gray-200 p-6"
      >
        <div class="flex gap-6 items-center">
          <!-- Left: Image/Illustration -->
          <div class="flex-shrink-0">
            <div
              class="w-44 h-44 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Google_Drive_logo_2013.png"
                alt="Google Drive"
                class="w-full h-full object-contain p-4"
              />
            </div>
          </div>

          <!-- Right: Content -->
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              We don't store any document's files on our server
            </h3>
            <p class="text-sm text-gray-600 mb-4 leading-relaxed">
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
      <div class="bg-white rounded-lg border border-gray-200">
        <!-- Header - Always show -->
        <div v-if="!hasNoDocuments" class="p-6 border-b border-gray-200">
          <div class="flex items-start justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-1">
                Your documents are important, we're keep an eye on them here
              </h2>
              <p class="text-sm text-gray-500">
                Keep track of every document you're working on
              </p>
            </div>
            <div class="flex items-center gap-3">
              <AppButton variant="ghost" size="md" @click="onImport">
                <Upload class="w-4 h-4 mr-2" />
                Import / Export
              </AppButton>
              <AppButton variant="primary" size="md" @click="onCreate">
                <Plus class="w-4 h-4 mr-2" />
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
import DocumentsEmptyState from "../components/DocumentsEmptyState.vue";
import DocumentsTable from "../components/DocumentsTable.vue";
import StatsGrid from "@/components/common/StatsGrid.vue";
import AppButton from "@/components/ui/AppButton.vue";
import { useDocumentsStore } from "@/stores/useDocumentsStore";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Home,
  Plus,
  Upload,
} from "lucide-vue-next";

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
