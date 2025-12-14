<template>
  <MainLayout
    :sidebarOpen="sidebarOpen"
    :activeNav="'Notifications'"
    @closeSidebar="toggleSidebar"
    @navigate="handleNavigate"
  >
    <!-- Mobile menu button -->
    <div class="notifications-page__mobile-menu">
      <button class="notifications-page__mobile-btn" @click="toggleSidebar">
        <Menu class="notifications-page__mobile-icon" />
      </button>
    </div>

    <!-- Break out of MainLayout's max-w and padding constraints -->
    <div class="-mx-4 sm:-mx-6 lg:-mx-8 -my-8">
      <div class="notifications-page">
        <!-- Admin Sidebar -->
        <AdminSidebar
          :activeSection="activeSection"
          @section-change="handleSectionChange"
        />

        <!-- Main Content -->
        <NotificationsContent
          v-model:generalNotifications="generalNotifications"
          v-model:summaryNotifications="summaryNotifications"
        />
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Menu } from "lucide-vue-next";
import MainLayout from "@/components/layout/MainLayout.vue";
import AdminSidebar from "../components/AdminSidebar.vue";
import NotificationsContent from "../components/NotificationsContent.vue";

const router = useRouter();
const sidebarOpen = ref(false);
const activeSection = ref("Notifications");

const generalNotifications = ref({
  mentioned: "In-app",
  replies: "None",
  assigned: "Email",
  overdue: "In-app",
  taskStatus: "Email",
});

const summaryNotifications = ref({
  daily: "Email",
  weekly: "In-app",
  monthly: "None",
  quarterly: "Email",
});

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const handleNavigate = (label) => {
  if (label === "Overview") router.push("/overview");
  if (label === "Documents") router.push("/documents");
  if (label === "Notifications") router.push("/admin/notifications");
};

const handleSectionChange = (sectionId) => {
  activeSection.value = sectionId;
  console.log("Section changed to:", sectionId);
  // Add navigation logic here when routes are implemented
};
</script>

<style scoped lang="scss">
.notifications-page {
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;

  &__mobile-menu {
    display: block;
    margin-bottom: 1rem;

    @media (min-width: 1024px) {
      display: none;
    }
  }

  &__mobile-btn {
    padding: 0.5rem;
    background: transparent;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f3f4f6;
    }
  }

  &__mobile-icon {
    width: 1.5rem;
    height: 1rem;
  }
}
</style>
