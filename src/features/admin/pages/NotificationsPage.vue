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

    <!-- Break out of MainLayout's max-w and padding constraints -->
    <div class="-mx-4 sm:-mx-6 lg:-mx-8 -my-8">
      <div class="flex min-h-screen">
        <!-- Second Sidebar (Admin Navigation) -->
        <aside
          class="hidden lg:block w-[280px] flex-shrink-0 border-r border-gray-200 bg-white px-6 py-8"
        >
          <nav class="space-y-1">
            <button
              @click="activeSection = 'My details'"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left group',
                activeSection === 'My details'
                  ? 'bg-gray-50 text-gray-900'
                  : 'text-gray-700 hover:bg-gray-50',
              ]"
            >
              <User class="w-5 h-5 text-gray-400" />
              <span class="flex-1 text-sm font-normal">My details</span>
              <ChevronRight
                class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </button>

            <button
              @click="activeSection = 'Notifications'"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left group',
                activeSection === 'Notifications'
                  ? 'bg-gray-50 text-gray-900'
                  : 'text-gray-700 hover:bg-gray-50',
              ]"
            >
              <Bell class="w-5 h-5 text-gray-400" />
              <span class="flex-1 text-sm font-normal">Notifications</span>
              <span
                class="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md"
                >10</span
              >
            </button>

            <div class="h-px bg-gray-200 my-2"></div>

            <button
              @click="activeSection = 'Analytics'"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left group',
                activeSection === 'Analytics'
                  ? 'bg-gray-50 text-gray-900'
                  : 'text-gray-700 hover:bg-gray-50',
              ]"
            >
              <BarChart3 class="w-5 h-5 text-gray-400" />
              <span class="flex-1 text-sm font-normal">Analytics</span>
              <ChevronRight
                class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </button>

            <button
              @click="activeSection = 'Saved reports'"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left group',
                activeSection === 'Saved reports'
                  ? 'bg-gray-50 text-gray-900'
                  : 'text-gray-700 hover:bg-gray-50',
              ]"
            >
              <FileText class="w-5 h-5 text-gray-400" />
              <span class="flex-1 text-sm font-normal">Saved reports</span>
              <ChevronRight
                class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </button>

            <div class="h-px bg-gray-200 my-2"></div>

            <button
              @click="activeSection = 'My details 2'"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left group',
                activeSection === 'My details 2'
                  ? 'bg-gray-50 text-gray-900'
                  : 'text-gray-700 hover:bg-gray-50',
              ]"
            >
              <User class="w-5 h-5 text-gray-400" />
              <span class="flex-1 text-sm font-normal">My details</span>
              <ChevronRight
                class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </button>

            <button
              @click="activeSection = 'User reports'"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left group',
                activeSection === 'User reports'
                  ? 'bg-gray-50 text-gray-900'
                  : 'text-gray-700 hover:bg-gray-50',
              ]"
            >
              <FileText class="w-5 h-5 text-gray-400" />
              <span class="flex-1 text-sm font-normal">User reports</span>
              <span
                class="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md"
                >10</span
              >
            </button>

            <div class="h-px bg-gray-200 my-2"></div>

            <button
              @click="activeSection = 'Settings'"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left group',
                activeSection === 'Settings'
                  ? 'bg-gray-50 text-gray-900'
                  : 'text-gray-700 hover:bg-gray-50',
              ]"
            >
              <Settings class="w-5 h-5 text-gray-400" />
              <span class="flex-1 text-sm font-normal">Settings</span>
              <ChevronRight
                class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </button>
          </nav>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 min-w-0 px-8 py-8 bg-gray-50">
          <div class="max-w-5xl">
            <div class="mb-12">
              <h1 class="text-3xl font-semibold text-gray-900 mb-2">
                Notifications
              </h1>
              <p class="text-sm text-gray-600">
                Select when and how you'll be notified.
              </p>
            </div>

            <!-- General Notifications Section -->
            <div class="mb-12">
              <div class="flex gap-8">
                <!-- Left: Section Description -->
                <div class="w-[370px] flex-shrink-0">
                  <h2 class="text-sm font-semibold text-gray-900 mb-1">
                    General notifications
                  </h2>
                  <p class="text-sm text-gray-600">
                    Select when you'll be notified when the following changes
                    occur.
                  </p>
                </div>

                <!-- Right: First Row -->
                <div class="flex-1">
                  <NotificationRowSimple
                    label="I'm mentioned in a message"
                    :selected="generalNotifications.mentioned"
                    @update="generalNotifications.mentioned = $event"
                  />
                </div>
              </div>

              <!-- Remaining rows (right side only with 512px lines) -->
              <div class="flex gap-8">
                <div class="w-[370px] flex-shrink-0"></div>
                <div class="flex-1 space-y-0">
                  <div class="border-t border-gray-200"></div>
                  <NotificationRowSimple
                    label="Someone replies to any message"
                    :selected="generalNotifications.replies"
                    @update="generalNotifications.replies = $event"
                  />
                  <div class="border-t border-gray-200"></div>
                  <NotificationRowSimple
                    label="I'm assigned a task"
                    :selected="generalNotifications.assigned"
                    @update="generalNotifications.assigned = $event"
                  />
                  <div class="border-t border-gray-200"></div>
                  <NotificationRowSimple
                    label="A task is overdue"
                    :selected="generalNotifications.overdue"
                    @update="generalNotifications.overdue = $event"
                  />
                  <div class="border-t border-gray-200"></div>
                  <NotificationRowSimple
                    label="A task status is updated"
                    :selected="generalNotifications.taskStatus"
                    @update="generalNotifications.taskStatus = $event"
                  />
                </div>
              </div>
            </div>

            <!-- Big horizontal divider (888px - spans both columns) -->
            <div
              class="border-t border-gray-200 mb-12"
              style="max-width: 888px"
            ></div>

            <!-- Summary Notifications Section -->
            <div>
              <div class="flex gap-8">
                <!-- Left: Section Description -->
                <div class="w-[370px] flex-shrink-0">
                  <h2 class="text-sm font-semibold text-gray-900 mb-1">
                    Summary notifications
                  </h2>
                  <p class="text-sm text-gray-600">
                    Select when you'll be notified when the following summaries
                    or report are ready.
                  </p>
                </div>

                <!-- Right: First Row -->
                <div class="flex-1">
                  <NotificationRowSimple
                    label="Daily summary"
                    :selected="summaryNotifications.daily"
                    @update="summaryNotifications.daily = $event"
                  />
                </div>
              </div>

              <!-- Remaining rows (right side only with 512px lines) -->
              <div class="flex gap-8">
                <div class="w-[370px] flex-shrink-0"></div>
                <div class="flex-1 space-y-0">
                  <div class="border-t border-gray-200"></div>
                  <NotificationRowSimple
                    label="Weekly summary"
                    :selected="summaryNotifications.weekly"
                    @update="summaryNotifications.weekly = $event"
                  />
                  <div class="border-t border-gray-200"></div>
                  <NotificationRowSimple
                    label="Monthly summary"
                    :selected="summaryNotifications.monthly"
                    @update="summaryNotifications.monthly = $event"
                  />
                  <div class="border-t border-gray-200"></div>
                  <NotificationRowSimple
                    label="Quarterly summary"
                    :selected="summaryNotifications.quarterly"
                    @update="summaryNotifications.quarterly = $event"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import MainLayout from "@/components/layout/MainLayout.vue";
import NotificationRowSimple from "../components/NotificationRowSimple.vue";
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
