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
        <!-- Second Sidebar (Admin Navigation) -->
        <aside class="notifications-page__sidebar">
          <nav class="notifications-page__nav">
            <button
              @click="activeSection = 'My details'"
              :class="[
                'notifications-page__nav-item',
                {
                  'notifications-page__nav-item--active':
                    activeSection === 'My details',
                },
              ]"
            >
              <User class="notifications-page__nav-icon" />
              <span class="notifications-page__nav-label">My details</span>
              <ChevronRight class="notifications-page__nav-chevron" />
            </button>

            <button
              @click="activeSection = 'Notifications'"
              :class="[
                'notifications-page__nav-item',
                {
                  'notifications-page__nav-item--active':
                    activeSection === 'Notifications',
                },
              ]"
            >
              <Bell class="notifications-page__nav-icon" />
              <span class="notifications-page__nav-label">Notifications</span>
              <span class="notifications-page__nav-badge">10</span>
            </button>

            <div class="notifications-page__nav-divider"></div>

            <button
              @click="activeSection = 'Analytics'"
              :class="[
                'notifications-page__nav-item',
                {
                  'notifications-page__nav-item--active':
                    activeSection === 'Analytics',
                },
              ]"
            >
              <BarChart3 class="notifications-page__nav-icon" />
              <span class="notifications-page__nav-label">Analytics</span>
              <ChevronRight class="notifications-page__nav-chevron" />
            </button>

            <button
              @click="activeSection = 'Saved reports'"
              :class="[
                'notifications-page__nav-item',
                {
                  'notifications-page__nav-item--active':
                    activeSection === 'Saved reports',
                },
              ]"
            >
              <FileText class="notifications-page__nav-icon" />
              <span class="notifications-page__nav-label">Saved reports</span>
              <ChevronRight class="notifications-page__nav-chevron" />
            </button>

            <div class="notifications-page__nav-divider"></div>

            <button
              @click="activeSection = 'My details 2'"
              :class="[
                'notifications-page__nav-item',
                {
                  'notifications-page__nav-item--active':
                    activeSection === 'My details 2',
                },
              ]"
            >
              <User class="notifications-page__nav-icon" />
              <span class="notifications-page__nav-label">My details</span>
              <ChevronRight class="notifications-page__nav-chevron" />
            </button>

            <button
              @click="activeSection = 'User reports'"
              :class="[
                'notifications-page__nav-item',
                {
                  'notifications-page__nav-item--active':
                    activeSection === 'User reports',
                },
              ]"
            >
              <FileText class="notifications-page__nav-icon" />
              <span class="notifications-page__nav-label">User reports</span>
              <span class="notifications-page__nav-badge">10</span>
            </button>

            <div class="notifications-page__nav-divider"></div>

            <button
              @click="activeSection = 'Settings'"
              :class="[
                'notifications-page__nav-item',
                {
                  'notifications-page__nav-item--active':
                    activeSection === 'Settings',
                },
              ]"
            >
              <Settings class="notifications-page__nav-icon" />
              <span class="notifications-page__nav-label">Settings</span>
              <ChevronRight class="notifications-page__nav-chevron" />
            </button>
          </nav>
        </aside>

        <!-- Main Content Area -->
        <main class="notifications-page__main">
          <div class="notifications-page__container">
            <div class="notifications-page__header">
              <h1 class="notifications-page__title">Notifications</h1>
              <p class="notifications-page__subtitle">
                Select when and how you'll be notified.
              </p>
            </div>

            <!-- General Notifications Section -->
            <div class="notifications-page__section">
              <div class="notifications-page__section-row">
                <!-- Left: Section Description -->
                <div class="notifications-page__section-left">
                  <h2 class="notifications-page__section-title">
                    General notifications
                  </h2>
                  <p class="notifications-page__section-description">
                    Select when you'll be notified when the following changes
                    occur.
                  </p>
                </div>

                <!-- Right: First Row -->
                <div class="notifications-page__section-right">
                  <NotificationRowSimple
                    label="I'm mentioned in a message"
                    :selected="generalNotifications.mentioned"
                    @update="generalNotifications.mentioned = $event"
                  />
                </div>
              </div>

              <!-- Remaining rows -->
              <div
                class="notifications-page__section-row notifications-page__section-row--no-title"
              >
                <div class="notifications-page__section-spacer"></div>
                <div class="notifications-page__section-right">
                  <div class="notifications-page__section-list">
                    <div class="notifications-page__section-divider"></div>
                    <NotificationRowSimple
                      label="Someone replies to any message"
                      :selected="generalNotifications.replies"
                      @update="generalNotifications.replies = $event"
                    />
                    <div class="notifications-page__section-divider"></div>
                    <NotificationRowSimple
                      label="I'm assigned a task"
                      :selected="generalNotifications.assigned"
                      @update="generalNotifications.assigned = $event"
                    />
                    <div class="notifications-page__section-divider"></div>
                    <NotificationRowSimple
                      label="A task is overdue"
                      :selected="generalNotifications.overdue"
                      @update="generalNotifications.overdue = $event"
                    />
                    <div class="notifications-page__section-divider"></div>
                    <NotificationRowSimple
                      label="A task status is updated"
                      :selected="generalNotifications.taskStatus"
                      @update="generalNotifications.taskStatus = $event"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Big horizontal divider -->
            <div class="notifications-page__big-divider"></div>

            <!-- Summary Notifications Section -->
            <div class="notifications-page__section">
              <div class="notifications-page__section-row">
                <!-- Left: Section Description -->
                <div class="notifications-page__section-left">
                  <h2 class="notifications-page__section-title">
                    Summary notifications
                  </h2>
                  <p class="notifications-page__section-description">
                    Select when you'll be notified when the following summaries
                    or report are ready.
                  </p>
                </div>

                <!-- Right: First Row -->
                <div class="notifications-page__section-right">
                  <NotificationRowSimple
                    label="Daily summary"
                    :selected="summaryNotifications.daily"
                    @update="summaryNotifications.daily = $event"
                  />
                </div>
              </div>

              <!-- Remaining rows -->
              <div
                class="notifications-page__section-row notifications-page__section-row--no-title"
              >
                <div class="notifications-page__section-spacer"></div>
                <div class="notifications-page__section-right">
                  <div class="notifications-page__section-list">
                    <div class="notifications-page__section-divider"></div>
                    <NotificationRowSimple
                      label="Weekly summary"
                      :selected="summaryNotifications.weekly"
                      @update="summaryNotifications.weekly = $event"
                    />
                    <div class="notifications-page__section-divider"></div>
                    <NotificationRowSimple
                      label="Monthly summary"
                      :selected="summaryNotifications.monthly"
                      @update="summaryNotifications.monthly = $event"
                    />
                    <div class="notifications-page__section-divider"></div>
                    <NotificationRowSimple
                      label="Quarterly summary"
                      :selected="summaryNotifications.quarterly"
                      @update="summaryNotifications.quarterly = $event"
                    />
                  </div>
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

<style scoped lang="scss">
.notifications-page {
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;

  // Mobile menu
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

  // Sidebar
  &__sidebar {
    display: none;
    width: 280px;
    flex-shrink: 0;
    border-right: 1px solid #e5e7eb;
    background-color: #ffffff;
    padding: 2rem 1.5rem;

    @media (min-width: 1024px) {
      display: block;
    }
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__nav-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
    text-align: left;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #374151;

    &:hover {
      background-color: #f9fafb;

      .notifications-page__nav-chevron {
        opacity: 1;
      }
    }

    &--active {
      background-color: #f9fafb;
      color: #111827;
    }
  }

  &__nav-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: #9ca3af;
    flex-shrink: 0;
  }

  &__nav-label {
    flex: 1;
    font-size: 0.875rem;
    font-weight: 400;
  }

  &__nav-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.125rem 0.5rem;
    background-color: #f3f4f6;
    color: #374151;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 0.375rem;
    line-height: 1.25;
    min-width: 1.5rem;
  }

  &__nav-chevron {
    width: 1rem;
    height: 1rem;
    color: #9ca3af;
    opacity: 0;
    transition: opacity 0.2s;
    flex-shrink: 0;
  }

  &__nav-divider {
    height: 1px;
    background-color: #e5e7eb;
    margin: 0.5rem 0;
  }

  // Main content
  &__main {
    flex: 1;
    min-width: 0;
    padding: 2rem;
    background-color: #f9fafb;

    @media (max-width: 1023px) {
      padding: 2rem 1.5rem;
    }

    @media (max-width: 639px) {
      padding: 1.5rem 1rem;
    }
  }

  &__container {
    max-width: 100%;
    width: 100%;
  }

  &__header {
    margin-bottom: 3rem;

    @media (max-width: 639px) {
      margin-bottom: 2rem;
    }
  }

  &__title {
    font-size: 1.875rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
    line-height: 1.2;

    @media (max-width: 639px) {
      font-size: 1.5rem;
    }
  }

  &__subtitle {
    font-size: 0.875rem;
    color: #4b5563;
    line-height: 1.5;
  }

  // Section
  &__section {
    margin-bottom: 3rem;

    &:last-child {
      margin-bottom: 0;
    }

    @media (max-width: 639px) {
      margin-bottom: 2rem;
    }
  }

  &__section-row {
    display: flex;
    gap: 2rem;
    align-items: flex-start;

    @media (min-width: 768px) and (max-width: 1199px) {
      gap: 1rem;
    }

    @media (max-width: 767px) {
      flex-direction: column;
      gap: 1rem;
    }

    &--no-title {
      @media (max-width: 767px) {
        .notifications-page__section-spacer {
          display: none;
        }
      }
    }
  }

  &__section-left {
    width: 280px;
    flex-shrink: 0;

    @media (min-width: 768px) and (max-width: 1199px) {
      width: 180px;
    }

    @media (max-width: 767px) {
      width: 100%;
    }
  }

  &__section-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
    line-height: 1.4;

    @media (min-width: 768px) and (max-width: 1199px) {
      font-size: 0.8125rem;
    }
  }

  &__section-description {
    font-size: 0.875rem;
    color: #4b5563;
    line-height: 1.5;

    @media (min-width: 768px) and (max-width: 1199px) {
      font-size: 0.8125rem;
      line-height: 1.4;
    }
  }

  &__section-right {
    flex: 1;
    min-width: 0;
    width: 100%;

    @media (max-width: 639px) {
      width: 100%;
    }
  }

  &__section-spacer {
    width: 280px;
    flex-shrink: 0;

    @media (min-width: 768px) and (max-width: 1199px) {
      width: 180px;
    }

    @media (max-width: 767px) {
      display: none;
    }
  }

  &__section-list {
    display: flex;
    flex-direction: column;
  }

  &__section-divider {
    border-top: 1px solid #e5e7eb;
  }

  // Big divider
  &__big-divider {
    border-top: 1px solid #e5e7eb;
    margin-bottom: 3rem;
    max-width: calc(280px + 2rem + 512px);

    @media (min-width: 768px) and (max-width: 1199px) {
      max-width: calc(180px + 1rem + 512px);
    }

    @media (max-width: 767px) {
      margin-bottom: 2rem;
      max-width: 100%;
    }
  }
}
</style>
