<template>
  <aside class="admin-sidebar">
    <nav class="admin-sidebar__nav">
      <button
        v-for="item in navItems"
        :key="item.id"
        @click="handleClick(item.id)"
        :class="[
          'admin-sidebar__nav-item',
          { 'admin-sidebar__nav-item--active': activeSection === item.id },
        ]"
      >
        <component :is="item.icon" class="admin-sidebar__nav-icon" />
        <span class="admin-sidebar__nav-label">{{ item.label }}</span>

        <span
          v-if="item.badge"
          :class="[
            'admin-sidebar__nav-badge',
            { 'admin-sidebar__nav-badge--special': item.badgeSpecial },
          ]"
        >
          {{ item.badge }}
          <component
            v-if="item.showChevron"
            :is="ChevronRightIcon"
            class="admin-sidebar__nav-chevron"
          />
        </span>
      </button>

      <button
        @click="handleClick('Settings')"
        :class="[
          'admin-sidebar__nav-item',
          { 'admin-sidebar__nav-item--active': activeSection === 'Settings' },
        ]"
      >
        <SettingsIcon class="admin-sidebar__nav-icon" />
        <span class="admin-sidebar__nav-label">Settings</span>
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import FlagIcon from "@/assets/icons/sidebar/flag.svg";
import NotificationsIcon from "@/assets/icons/sidebar/notifications.svg";
import LineChartIcon from "@/assets/icons/sidebar/line-chart.svg";
import StarIcon from "@/assets/icons/sidebar/star.svg";
import SettingsIcon from "@/assets/icons/sidebar/settings.svg";
import ChevronRightIcon from "@/assets/icons/sidebar/chervon-right.svg";

const props = defineProps({
  activeSection: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["section-change"]);

const navItems = computed(() => [
  {
    id: "My details",
    label: "My details",
    icon: FlagIcon,
    showChevron: true,
  },
  {
    id: "Notifications",
    label: "Notifications",
    icon: NotificationsIcon,
    badge: "10",
    badgeSpecial: true,
    showChevron: true,
  },
  {
    id: "Analytics",
    label: "Analytics",
    icon: LineChartIcon,
  },
  {
    id: "Saved reports",
    label: "Saved reports",
    icon: StarIcon,
  },
  {
    id: "User reports",
    label: "User reports",
    icon: NotificationsIcon,
    badge: "10",
  },
]);

const showDividerAfterReports = computed(() => true);

const handleClick = (sectionId) => {
  emit("section-change", sectionId);
};
</script>

<style scoped lang="scss">
.admin-sidebar {
  display: none;
  width: 16rem;
  flex-shrink: 0;
  border-right: 1px solid #e5e7eb;
  background-color: #ffffff;
  overflow-y: auto;

  @media (min-width: 1024px) {
    display: block;
  }

  &__nav {
    display: flex;
    flex-direction: column;
    padding: 1.5rem 1rem;
    margin-left: 1rem;
  }

  &__nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0.5rem;
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
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 9999px;
    background-color: #fafafa;
    border: 1px solid #e9eaeb;

    &--special {
      background-color: #f9f5ff;
      border: 1px solid #e9d7fe;
      padding: 0.125rem 0.375rem 0.125rem 0.5rem;
    }
  }

  &__nav-chevron {
    flex-shrink: 0;
  }

  &__nav-divider {
    height: 1px;
    background-color: #e5e7eb;
    margin: 0.5rem 0;
  }
}
</style>
