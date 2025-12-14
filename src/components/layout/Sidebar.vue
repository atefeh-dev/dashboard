<template>
  <aside :class="['sidebar', { 'sidebar--open': sidebarOpen }]">
    <!-- Header with Logo and Collapse Button -->
    <div class="sidebar__header">
      <div class="sidebar__logo">
        <DoclastLogo class="sidebar__logo-image" />
      </div>
      <button
        class="sidebar__collapse-btn"
        @click="handleCollapse"
        aria-label="Toggle sidebar"
      >
        <ChevronIcon class="sidebar__collapse-icon" />
      </button>
    </div>

    <!-- Workspace Dropdown -->
    <div class="sidebar__workspace">
      <button class="sidebar__workspace-btn">
        <WorkspaceIcon class="sidebar__workspace-icon" />
        <span class="sidebar__workspace-text">Workspace Name</span>
        <ChevronDown class="sidebar__workspace-chevron" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="sidebar__nav">
      <!-- Overview -->
      <button
        @click="handleClick('Overview')"
        :class="getNavItemClass('Overview')"
      >
        <OverviewIcon :class="getIconClass('Overview')" />
        <span class="sidebar__nav-text">Overview</span>
      </button>

      <!-- Notifications -->
      <button
        @click="handleClick('Notifications')"
        :class="getNavItemClass('Notifications')"
      >
        <NotificationIcon :class="getIconClass('Notifications')" />
        <div class="sidebar__nav-content">
          <span class="sidebar__nav-label">
            Notifications
            <span class="sidebar__notification-dot"></span>
          </span>
          <span class="sidebar__notification-badge">10</span>
        </div>
      </button>

      <!-- Products Divider -->
      <div class="sidebar__divider">
        <SectionIcon class="sidebar__divider-icon" />
        <span class="sidebar__divider-text">Products</span>
        <div class="sidebar__divider-line"></div>
      </div>

      <!-- Templates -->
      <button
        @click="handleClick('Templates')"
        :class="getNavItemClass('Templates')"
      >
        <TemplatesIcon :class="getIconClass('Templates')" />
        <span class="sidebar__nav-text">Templates</span>
      </button>

      <!-- Documents -->
      <button
        @click="handleClick('Documents')"
        :class="getNavItemClass('Documents')"
      >
        <DocumentsIcon :class="getIconClass('Documents')" />
        <span class="sidebar__nav-text">Documents</span>
      </button>

      <!-- Automations -->
      <button
        @click="handleClick('Automations')"
        :class="getNavItemClass('Automations')"
      >
        <AutomationsIcon :class="getIconClass('Automations')" />
        <span class="sidebar__nav-text">Automations</span>
      </button>

      <!-- Reports -->
      <button
        @click="handleClick('Reports')"
        :class="getNavItemClass('Reports')"
      >
        <ReportsIcon :class="getIconClass('Reports')" />
        <span class="sidebar__nav-text">Reports</span>
      </button>

      <!-- Members and teams -->
      <button
        @click="handleClick('Members and teams')"
        :class="getNavItemClass('Members and teams')"
      >
        <MembersIcon :class="getIconClass('Members and teams')" />
        <span class="sidebar__nav-text">Members and teams</span>
      </button>

      <!-- Records Divider -->
      <div class="sidebar__divider">
        <SectionIcon class="sidebar__divider-icon" />
        <span class="sidebar__divider-text">Records</span>
        <div class="sidebar__divider-line"></div>
      </div>

      <!-- Companies -->
      <button
        @click="handleClick('Companies')"
        :class="getNavItemClass('Companies')"
      >
        <CompaniesIcon :class="getIconClass('Companies')" />
        <span class="sidebar__nav-text">Companies</span>
      </button>

      <!-- People -->
      <button @click="handleClick('People')" :class="getNavItemClass('People')">
        <PeopleIcon :class="getIconClass('People')" />
        <span class="sidebar__nav-text">People</span>
      </button>

      <!-- Lists Divider -->
      <div class="sidebar__divider">
        <SectionIcon class="sidebar__divider-icon" />
        <span class="sidebar__divider-text">Lists</span>
        <div class="sidebar__divider-line"></div>
      </div>

      <!-- 2024 Contracts -->
      <button
        @click="handleClick('2024 Contracts')"
        :class="getNavItemClass('2024 Contracts')"
      >
        <ContractsIcon :class="getIconClass('2024 Contracts')" />
        <span class="sidebar__nav-text">2024 Contracts</span>
      </button>
    </nav>

    <!-- User Footer -->
    <div class="sidebar__footer">
      <!-- Admin Badge -->
      <AdminBadge v-if="authStore.isAdmin" />

      <!-- User Card -->
      <div class="sidebar__user-card">
        <div class="sidebar__user-avatar">
          <img
            :src="
              authStore.isAdmin
                ? authStore.user?.adminAvatar ||
                  authStore.user?.avatar ||
                  avatarImage
                : authStore.user?.avatar || avatarImage
            "
            :alt="authStore.user?.name || 'User'"
            class="sidebar__user-image"
            @error="handleImageError"
          />
        </div>

        <div class="sidebar__user-info">
          <div class="sidebar__user-name">
            {{ authStore.user?.name || "User" }}
          </div>
          <div v-if="!authStore.isAdmin" class="sidebar__user-plan">
            Active plan: <span class="sidebar__user-plan-name">Basic</span>
          </div>
          <div v-else class="sidebar__admin-plan">
            <span class="sidebar__admin-plan-name">Administrator</span>
          </div>
        </div>

        <button
          @click="handleUserMenu"
          class="sidebar__user-menu"
          aria-label="User menu"
        >
          <ActiveplanIcon />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import AdminBadge from "../common/AdminSideBarBadge.vue";
import ActiveplanIcon from "../../assets/icons/sidebar/active-plan.svg";
import OverviewIcon from "../../assets/icons/sidebar/overview.svg";
import NotificationIcon from "../../assets/icons/sidebar/notifications.svg";
import TemplatesIcon from "../../assets/icons/sidebar/templates.svg";
import DocumentsIcon from "../../assets/icons/sidebar/documents.svg";
import AutomationsIcon from "../../assets/icons/sidebar/automations.svg";
import ReportsIcon from "../../assets/icons/sidebar/reports.svg";
import MembersIcon from "../../assets/icons/sidebar/members.svg";
import CompaniesIcon from "../../assets/icons/sidebar/companies.svg";
import PeopleIcon from "../../assets/icons/sidebar/people.svg";
import ContractsIcon from "../../assets/icons/sidebar/contracts.svg";
import SectionIcon from "../../assets/icons/sidebar/section.svg";
import WorkspaceIcon from "../../assets/icons/sidebar/workspace.svg";
import ChevronIcon from "../../assets/icons/sidebar/chervon.svg";
import DoclastLogo from "../../assets/icons/logo/doclast-logo.svg";
import { ChevronDown } from "lucide-vue-next";

const props = defineProps({
  sidebarOpen: Boolean,
  activeNav: String,
});

const emit = defineEmits(["close", "navigate", "userMenu", "toggleCollapse"]);
const router = useRouter();
const authStore = useAuthStore();

// Route map: Only include implemented routes
// If route doesn't exist here, clicking will just console.log
const routeMap = {
  // User routes (clean URLs)
  Overview: {
    admin: "/admin/overview",
    user: "/overview",
  },
  Documents: {
    admin: "/admin/documents",
    user: "/documents",
  },
  // Admin-only routes
  Notifications: {
    admin: "/admin/notifications",
    user: null, // User notifications not implemented yet
  },

  // Add routes here as you implement them:
  // Templates: { admin: "/admin/templates", user: "/templates" },
  // Automations: { admin: "/admin/automations", user: "/automations" },
  // Reports: { admin: "/admin/reports", user: "/reports" },
  // "Members and teams": { admin: "/admin/members", user: "/members" },
  // Companies: { admin: "/admin/companies", user: "/companies" },
  // People: { admin: "/admin/people", user: "/people" },
  // "2024 Contracts": { admin: "/admin/contracts", user: "/contracts" },
};

function handleCollapse() {
  console.log("Collapse clicked - ready for future implementation");
  emit("toggleCollapse");
}

function handleClick(label) {
  const routes = routeMap[label];

  if (!routes) {
    // Route not in map at all - log it
    console.log(`Clicked: ${label} (route not yet implemented)`);
    return; // Don't navigate, don't emit
  }

  // Get the appropriate route based on user role
  const targetRoute = authStore.isAdmin ? routes.admin : routes.user;

  if (!targetRoute) {
    // Route exists for other role but not this one
    console.log(
      `Clicked: ${label} (not available for ${
        authStore.isAdmin ? "admin" : "user"
      } yet)`
    );
    return; // Don't navigate, don't emit
  }

  // Navigate to the route
  router.push(targetRoute).catch((err) => {
    console.error("Navigation error:", err);
  });

  // Emit navigate event (this updates activeNav)
  emit("navigate", label);

  // Close sidebar on mobile
  if (window.innerWidth < 1024) {
    emit("close");
  }
}

function handleUserMenu() {
  emit("userMenu");
}

function getNavItemClass(label) {
  const isActive = props.activeNav === label;
  return ["sidebar__nav-item", { "sidebar__nav-item--active": isActive }];
}

function getIconClass(label) {
  const isActive = props.activeNav === label;
  return ["sidebar__nav-icon", { "sidebar__nav-icon--active": isActive }];
}
</script>

<style scoped lang="scss">
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background-color: #ffffff;
  border-right: 1px solid #e9eaeb;
  display: flex;
  flex-direction: column;
  z-index: 40;
  transition: transform 0.3s ease;

  @media (max-width: 1023px) {
    transform: translateX(-100%);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.15);
  }

  @media (min-width: 1024px) {
    transform: translateX(0);
  }

  &--open {
    transform: translateX(0);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
  }

  &__logo {
    display: flex;
    align-items: center;
  }

  &__logo-image {
    height: 22.64px;
  }

  &__collapse-btn {
    padding: 0.25rem;
    border: none;
    background: transparent;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f9fafb;
    }

    &:active {
      background-color: #f3f4f6;
    }
  }

  &__collapse-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: #a4a7ae;
  }

  &__workspace {
    padding: 0 1.25rem 1.25rem;
  }

  &__workspace-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem 0.75rem;
    background-color: #ffffff;
    border: 1px solid #d5d7da;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s;
    box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05);

    &:hover {
      background-color: #f9fafb;
    }
  }

  &__workspace-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: #a4a7ae;
    flex-shrink: 0;
  }

  &__workspace-text {
    flex: 1;
    text-align: left;
    color: #414651;
    font-size: 0.875rem;
    font-weight: 400;
  }

  &__workspace-chevron {
    width: 1rem;
    height: 1rem;
    color: #a4a7ae;
    flex-shrink: 0;
  }

  &__nav {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 1.25rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #d5d7da;
      border-radius: 3px;

      &:hover {
        background: #a4a7ae;
      }
    }
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

  &__nav-text {
    flex: 1;
    text-align: left;
    font-size: 1rem;
  }

  &__nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
  }

  &__nav-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__notification-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background-color: #17b26a;
  }

  &__notification-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 30px;
    height: 22px;
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 9999px;
    background-color: #fafafa;
    border: 1px solid #e9eaeb;
  }

  &__divider {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
  }

  &__divider-icon {
    width: 1rem;
    color: #a4a7ae;
    flex-shrink: 0;
  }

  &__divider-text {
    font-size: 0.75rem;
    font-weight: 500;
    color: #535862;
    white-space: nowrap;
  }

  &__divider-line {
    flex: 1;
    height: 1px;
    background-color: #e9eaeb;
    margin-left: 0.5rem;
  }

  &__footer {
    padding: 1.25rem;
  }

  &__user-card {
    display: flex;
    align-items: center;
    height: 4rem;
    gap: 1rem;
    padding: 0.75rem;
    background: #ffffff;
    border: 0.0625rem solid #e9eaeb;
    border-radius: 0.75rem;
  }

  &__user-avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.25rem;
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 0 0 0.0625rem rgba(0, 0, 0, 0.08);
    background-color: #e5e7eb;
  }

  &__user-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__user-info {
    flex: 1;
    min-width: 0;
  }

  &__user-name {
    font-size: 14px;
    font-weight: 500;
    color: #181d27;
    margin-bottom: 0.125rem;
  }

  &__user-plan {
    font-size: 12px;
    font-weight: 400;
    color: #535862;
  }
  &__admin-plan {
    font-size: 14px;
    font-weight: 400;
    color: #535862;
  }
  &__user-plan-name {
    color: #4539cc;
    font-weight: 400;
  }

  &__user-menu {
    width: 2rem;
    height: 2rem;
    padding: 0.375rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0.0625rem solid rgba(10, 13, 18, 0.05);
    box-shadow: 0 0.0625rem 0.125rem rgba(10, 13, 18, 0.05);

    &:hover {
      background-color: transparent;
    }

    &:active {
      transform: scale(0.95);
    }
  }
}
</style>
