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
              <FlagIcon class="notifications-page__nav-icon" />
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
              <NotificationsIcon class="notifications-page__nav-icon" />
              <span class="notifications-page__nav-label">Notifications</span>

              <span
                class="notifications-page__nav-badge"
                id="notifications-badge"
                >10 <ChevronRightIcon class="notifications-page__nav-chevron" />
              </span>
            </button>

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
              <LineChartIcon class="notifications-page__nav-icon" />
              <span class="notifications-page__nav-label">Analytics</span>
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
              <StarIcon class="notifications-page__nav-icon" />
              <span class="notifications-page__nav-label">Saved reports</span>
            </button>

            <!-- <button
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
              <Flag class="notifications-page__nav-chevron" />
            </button> -->

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
              <NotificationsIcon class="notifications-page__nav-icon" />
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
              <SettingsIcon class="notifications-page__nav-icon" />
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
                    <NotificationRowSimple
                      label="I'm assigned a task"
                      :selected="generalNotifications.assigned"
                      @update="generalNotifications.assigned = $event"
                    />
                    <NotificationRowSimple
                      label="A task is overdue"
                      :selected="generalNotifications.overdue"
                      @update="generalNotifications.overdue = $event"
                    />
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

import FlagIcon from "@/assets/icons/sidebar/flag.svg";
import NotificationsIcon from "@/assets/icons/sidebar/notifications.svg";
import LineChartIcon from "@/assets/icons/sidebar/line-chart.svg";
import StarIcon from "@/assets/icons/sidebar/star.svg";
import SettingsIcon from "@/assets/icons/sidebar/settings.svg";
import ChevronRightIcon from "@/assets/icons/sidebar/chervon-right.svg";

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
    width: 16rem;
    flex-shrink: 0;
    border-right: 1px solid #e5e7eb;
    background-color: #ffffff;
    padding: 1.5rem 1rem;

    @media (min-width: 1024px) {
      display: block;
    }
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }
  &__nav-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.5rem;
    font-size: 0.875rem;
    border-radius: 0.375rem;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
    text-align: left;
    color: #414651;
    font-weight: 600;

    &:hover {
      background-color: #fafafa;
    }

    &--active {
      color: #4539cc;
      background-color: #fafafa;
      font-weight: 600;
    }
  }

  &__nav-icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    color: #a4a7ae;

    &--active {
      color: #4539cc;
    }
  }

  &__nav-label {
    flex: 1;
    font-size: 1rem;
    color: #414651;
    font-weight: 600;
  }

  &__nav-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    min-width: 30px;
    height: 22px;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 9999px;
    background-color: #fafafa;
    border: 1px solid #e9eaeb;
  }
  #notifications-badge {
    background-color: #f9f5ff;
    border: 1px solid #e9d7fe;
    padding: 0.125rem 0.375rem 0.125rem 0.5rem;
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
    margin-bottom: 2rem;
    border-bottom: 1px solid #e5e7eb;

    @media (max-width: 639px) {
      margin-bottom: 2rem;
    }
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #181d27;
    margin-bottom: 0.5rem;
    line-height: 1.2;

    @media (max-width: 639px) {
      font-size: 1.5rem;
    }
  }

  &__subtitle {
    font-size: 1rem;
    color: #535862;
    line-height: 1.5;
    padding-bottom: 1.063rem;
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
    color: #414651;
    margin-bottom: 0.25rem;
    line-height: 1.4;

    @media (min-width: 768px) and (max-width: 1199px) {
      font-size: 0.8125rem;
    }
  }

  &__section-description {
    font-size: 0.875rem;
    color: #535862;
    font-weight: 400;
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
