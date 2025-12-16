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

defineProps({
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

const handleClick = (sectionId) => {
  emit("section-change", sectionId);
};
</script>

<style scoped lang="scss">
.admin-sidebar {
  width: 16rem;
  height: 100vh;
  padding: 1rem;
  flex-shrink: 0;
  border-right: 1px solid #e5e7eb;
  background-color: #ffffff;
  overflow-y: auto;

  display: none;

  @media (min-width: 1024px) {
    display: block;
  }
}

.admin-sidebar__nav {
  display: flex;
  flex-direction: column;
}

.admin-sidebar__nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: none;
  text-align: left;
  background: transparent;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: #fafafa;
  }

  &--active {
    background-color: #fafafa;
    color: #4539cc;
  }
}

.admin-sidebar__nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #a4a7ae;
}

.admin-sidebar__nav-label {
  flex: 1;
}

.admin-sidebar__nav-badge {
  padding: 0.125rem 0.5rem;
  height: 22px;
  font-size: 0.75rem;
  border-radius: 9999px;
  background-color: #fafafa;
  border: 1px solid #e9eaeb;
  display: flex;
  align-items: center;
  justify-content: center;

  &--special {
    background-color: #f9f5ff;
    border-color: #e9d7fe;
    gap: 0.125rem;
    padding: 0.125rem 0.375rem 0.125rem 0.5rem;
  }
}
</style>
