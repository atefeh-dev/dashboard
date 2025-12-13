<template>
  <MainLayout
    :sidebar-open="store.sidebarOpen"
    :active-nav="store.activeNav"
    @close-sidebar="store.toggleSidebar"
    @navigate="handleNavigate"
  >
    <!-- Navbar -->
    <template #navbar>
      <Navbar
        :breadcrumbs="['Workspace Name', 'Overview']"
        :model-value="store.search"
        @update:model-value="store.setSearch"
        @toggle-sidebar="store.toggleSidebar"
      />
    </template>

    <!-- Main Content -->
    <div class="overview">
      <!-- Stats -->
      <div class="overview__stats">
        <StatsGrid :stats="store.stats" />
      </div>

      <!-- Quick view -->
      <div class="overview__card">
        <!-- Header -->
        <div class="overview__card-header">
          <h2 class="overview__card-title">Quick view of your data</h2>
          <p class="overview__card-subtitle">
            Keep track of everything you're working on
          </p>
        </div>

        <!-- Tabs and Actions -->
        <div class="overview__toolbar">
          <!-- Tabs - segmented control style -->
          <div class="overview__tabs">
            <button
              v-for="(tab, index) in tabs"
              :key="tab"
              @click="store.setActiveTab(tab)"
              :class="[
                'overview__tab',
                {
                  'overview__tab--active': store.activeTab === tab,
                  'overview__tab--with-divider': index !== tabs.length - 1,
                },
              ]"
            >
              {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
            </button>
          </div>

          <!-- Add Button -->
          <AppButton variant="primary" class="overview__add-btn">
            <Plus class="overview__add-icon" />
            <span>Add {{ store.activeTab.slice(0, -1) }}</span>
          </AppButton>
        </div>

        <!-- Table -->
        <OverviewTable />
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { useRouter } from "vue-router";
import MainLayout from "@/components/layout/MainLayout.vue";
import Navbar from "@/components/layout/Navbar.vue";
import OverviewTable from "../components/OverviewTable.vue";
import StatsGrid from "@/components/common/StatsGrid.vue";
import AppButton from "@/components/ui/AppButton.vue";
import { Plus } from "lucide-vue-next";
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

<style scoped lang="scss">
.overview {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  // Card
  &__card {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  // Card Header
  &__card-header {
    padding: 1.25rem 1.5rem 1.313rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  &__card-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #181d27;
  }

  &__card-subtitle {
    font-size: 0.875rem;
    color: #535862;
    font-weight: 400;
  }

  // Toolbar
  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 1.5rem;

    @media (max-width: 640px) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  // Tabs
  &__tabs {
    display: inline-flex;
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05);
  }

  &__tab {
    position: relative;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #414651;
    background-color: #ffffff;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;

    &:hover:not(&--active) {
      color: #111827;
      background-color: #f9fafb;
    }

    &--active {
      color: #252d37;
      background-color: #fafafa;
    }

    &--with-divider::after {
      content: "";
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      background-color: #e5e7eb;
    }
  }

  // Add Button
  &__add-btn {
    flex-shrink: 0;

    @media (max-width: 640px) {
      width: 100%;
    }
  }

  &__add-icon {
    width: 1rem;
    height: 1rem;
  }
}
</style>
