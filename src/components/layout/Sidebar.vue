<template>
  <aside :class="['sidebar', { 'sidebar--open': sidebarOpen }]">
    <!-- Header with Logo and Collapse Button -->
    <div class="sidebar__header">
      <div class="sidebar__logo">
        <DoclastLogo class="sidebar__logo-image" />
      </div>

      <!-- Collapse Button (for future use) -->
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
        @click="handleClick('Overview', '/overview')"
        :class="getNavItemClass('Overview')"
      >
        <OverviewIcon :class="getIconClass('Overview')" />
        <span class="sidebar__nav-text">Overview</span>
      </button>

      <!-- Notifications -->
      <button
        @click="handleClick('Notifications', '/admin/notifications')"
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
        @click="handleClick('Documents', '/documents')"
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
      <div class="admin-badge">
        <div class="admin-badge__wrapper">
          <div class="admin-badge__icon">
            <div class="admin-badge__icon-dot"></div>
          </div>
          <span class="admin-badge__label">Administrator</span>
        </div>
      </div>
      <div class="sidebar__user-card">
        <div class="sidebar__user-avatar">
          <img
            src="../../assets/images/Avatar.png"
            alt="Olivia Rhye"
            class="sidebar__user-image"
          />
        </div>

        <div class="sidebar__user-info">
          <div class="sidebar__user-name">Olivia Rhye</div>
          <div class="sidebar__user-plan">
            Active plan: <span class="sidebar__user-plan-name">Basic</span>
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
import { useRouter } from "vue-router";
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

function handleCollapse() {
  // Do nothing for now - ready for future implementation
  console.log("Collapse clicked - ready for future implementation");
  emit("toggleCollapse");
}

function handleClick(label, routePath = null) {
  if (routePath) {
    router.push(routePath).catch(() => {});
  }
  emit("navigate", label);

  // Close sidebar on mobile after navigation
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
// ============================================
// Sidebar Block (BEM)
// ============================================
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

  // Mobile: hidden by default
  @media (max-width: 1023px) {
    transform: translateX(-100%);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.15);
  }

  // Desktop: always visible
  @media (min-width: 1024px) {
    transform: translateX(0);
  }

  // Modifier for mobile open state
  &--open {
    transform: translateX(0);
  }

  // Header
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

  // Workspace
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

  // Navigation
  &__nav {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 1.25rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;

    // Custom scrollbar
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
    font-weight: 400;

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

  // Dividers
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

  // Footer
  &__footer {
    padding: 1.25rem;
    border-top: 1px solid #e9eaeb;
  }

  &__user-card {
    display: flex;
    align-items: center;
    height: 4rem; // 64px
    gap: 1rem; // 16px
    padding: 0.75rem; // 12px
    background: #ffffff;
    border: 0.0625rem solid #e9eaeb; // 1px
    border-radius: 0.75rem; // 12px
    // box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  &__user-avatar {
    width: 2.5rem; // 40px
    height: 2.5rem; // 40px
    border-radius: 0.25rem; // 4px
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 0 0 0.0625rem rgba(0, 0, 0, 0.08);
  }

  &__user-image {
    width: 100%;
    height: 100%;
    object-fit: cover;

    // INNER border (1px, black, 8%)
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

  &__user-plan-name {
    color: #4539cc;
    font-weight: 400;
  }

  &__user-menu {
    width: 2rem; // 32px
    height: 2rem; // 32px
    padding: 0.375rem; // 6px
    border-radius: 0.375rem; // 6px
    cursor: pointer;
    transition: background-color 0.2s;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0.0625rem solid rgba(10, 13, 18, 0.05); // 1px
    box-shadow: 0 0.0625rem 0.125rem rgba(10, 13, 18, 0.05); // 1px 2px

    &:hover {
      background-color: #e5e7eb;
    }

    &:active {
      transform: scale(0.95);
    }
  }

  &__user-menu-icon {
    width: 20px;
    height: 20px;
  }
}
</style>
