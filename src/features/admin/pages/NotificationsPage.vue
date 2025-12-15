<template>
  <MainLayout
    :sidebarOpen="sidebarOpen"
    :activeNav="'Notifications'"
    @closeSidebar="toggleSidebar"
    @navigate="handleNavigate"
    variant="admin"
  >
    <!-- Mobile menu button -->
    <div class="notifications-page__mobile-menu">
      <button class="notifications-page__mobile-btn" @click="toggleSidebar">
        <Menu class="notifications-page__mobile-icon" />
      </button>
    </div>

    <!-- ADMIN PAGE LAYOUT -->
    <div class="admin-layout">
      <AdminSidebar
        :activeSection="activeSection"
        @section-change="handleSectionChange"
      />

      <NotificationsContent
        v-model:generalNotifications="generalNotifications"
        v-model:summaryNotifications="summaryNotifications"
      />
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
};
</script>

<style scoped lang="scss">
.notifications-page__mobile-menu {
  display: block;
  margin-bottom: 1rem;

  @media (min-width: 1024px) {
    display: none;
  }
}

.notifications-page__mobile-btn {
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #f3f4f6;
  }
}

.notifications-page__mobile-icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* ✅ ADMIN LAYOUT FIX */
.admin-layout {
  display: flex;
  align-items: flex-start;
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
