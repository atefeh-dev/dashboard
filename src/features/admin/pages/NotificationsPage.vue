<template>
  <MainLayout
    :sidebarOpen="sidebarOpen"
    :activeNav="'Notifications'"
    @closeSidebar="toggleSidebar"
    @navigate="handleNavigate"
  >
    <!-- Mobile menu button -->
    <div class="lg:hidden mb-4">
      <button class="p-2 hover:bg-gray-100 rounded-lg" @click="toggleSidebar">
        <Menu class="w-6 h-4" />
      </button>
    </div>

    <!-- ========================================================= -->
    <!-- CORRECT TWO-SIDEBAR LAYOUT (COPY–PASTE SOLUTION)          -->
    <!-- ========================================================= -->

    <!-- Break out of MainLayout padding so sub-sidebar aligns with global -->
    <div class="flex -mx-4 sm:-mx-6 lg:-mx-8 w-full">
      <!-- Sub Sidebar -->
      <aside
        class="hidden lg:block w-[280px] flex-shrink-0 px-4 sm:px-6 lg:px-8"
      >
        <div class="sticky top-6">
          <div class="bg-white rounded-lg border border-gray-200 p-4">
            <nav class="space-y-1">
              <button
                v-for="item in navItems"
                :key="item.name"
                @click="activeSection = item.name"
                :class="[
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left group',
                  activeSection === item.name
                    ? 'bg-gray-50 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50',
                ]"
              >
                <component :is="item.icon" class="w-5 h-5 text-gray-400" />
                <span class="flex-1 text-sm font-normal">{{ item.name }}</span>
                <span
                  v-if="item.count"
                  class="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md"
                >
                  {{ item.count }}
                </span>
                <ChevronRight
                  v-else
                  class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </button>
            </nav>
          </div>
        </div>
      </aside>

      <!-- Main content (restore padding here) -->
      <main class="flex-1 min-w-0 px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <h1 class="text-3xl font-semibold text-gray-900 mb-2">
            Notifications
          </h1>
          <p class="text-sm text-gray-600">
            Select when and how you'll be notified.
          </p>
        </div>

        <div class="space-y-10">
          <!-- General Notifications -->
          <section>
            <h2 class="text-sm font-semibold text-gray-900 mb-1">
              General notifications
            </h2>
            <p class="text-sm text-gray-600 mb-6">
              Select when you'll be notified when the following changes occur.
            </p>

            <div class="space-y-4">
              <NotificationRow
                label="I'm mentioned in a message"
                :selected="generalNotifications.mentioned"
                @update="generalNotifications.mentioned = $event"
              />
              <NotificationRow
                label="Someone replies to any message"
                :selected="generalNotifications.replies"
                @update="generalNotifications.replies = $event"
              />
              <NotificationRow
                label="I'm assigned a task"
                :selected="generalNotifications.assigned"
                @update="generalNotifications.assigned = $event"
              />
              <NotificationRow
                label="A task is overdue"
                :selected="generalNotifications.overdue"
                @update="generalNotifications.overdue = $event"
              />
              <NotificationRow
                label="A task status is updated"
                :selected="generalNotifications.taskStatus"
                @update="generalNotifications.taskStatus = $event"
              />
            </div>
          </section>

          <!-- Summary Notifications -->
          <section>
            <h2 class="text-sm font-semibold text-gray-900 mb-1">
              Summary notifications
            </h2>
            <p class="text-sm text-gray-600 mb-6">
              Select when you'll be notified when the following summaries or
              report are ready.
            </p>

            <div class="space-y-4">
              <NotificationRow
                label="Daily summary"
                :selected="summaryNotifications.daily"
                @update="summaryNotifications.daily = $event"
              />
              <NotificationRow
                label="Weekly summary"
                :selected="summaryNotifications.weekly"
                @update="summaryNotifications.weekly = $event"
              />
              <NotificationRow
                label="Monthly summary"
                :selected="summaryNotifications.monthly"
                @update="summaryNotifications.monthly = $event"
              />
              <NotificationRow
                label="Quarterly summary"
                :selected="summaryNotifications.quarterly"
                @update="summaryNotifications.quarterly = $event"
              />
            </div>
          </section>
        </div>
      </main>
    </div>

    <!-- END LAYOUT -->
  </MainLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import MainLayout from "@/components/layout/MainLayout.vue";
import NotificationRow from "../components/NotificationRow.vue";
import {
  Menu,
  User,
  Bell,
  BarChart3,
  FileText,
  Settings,
  ChevronRight,
} from "lucide-vue-next";

const router = useRouter();
const sidebarOpen = ref(false);
const activeSection = ref("Notifications");

const navItems = [
  { name: "My details", icon: User },
  { name: "Notifications", icon: Bell, count: 10 },
  { name: "Analytics", icon: BarChart3 },
  { name: "Saved reports", icon: FileText },
  { name: "User reports", icon: FileText, count: 10 },
  { name: "Settings", icon: Settings },
];

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
</script>
