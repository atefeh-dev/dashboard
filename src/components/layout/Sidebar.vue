<template>
  <aside
    :class="[
      'fixed top-0 left-0 h-screen bg-white border-r border-[#E9EAEB] flex flex-col z-30 transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-[280px]',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0',
    ]"
  >
    <!-- Header with Logo and Collapse Button -->
    <div
      class="flex items-center justify-between px-5 py-4"
      v-if="!isCollapsed"
    >
      <div class="flex items-center">
        <DoclastLogo class="h-6" />
      </div>

      <button
        class="p-1 hover:bg-gray-50 rounded transition-colors"
        @click="toggleCollapse"
        aria-label="Collapse sidebar"
      >
        <ChevronIcon class="w-5 h-5 text-[#A4A7AE]" />
      </button>
    </div>

    <!-- Collapsed Header -->
    <div
      v-else
      class="flex items-center justify-center py-4 border-b border-[#E9EAEB]"
    >
      <span class="text-[#4539CC] font-bold text-xl">d</span>
    </div>

    <!-- Workspace Dropdown -->
    <div class="p-5 border-b border-[#E9EAEB]" v-if="!isCollapsed">
      <button
        class="flex items-center gap-2 w-full px-3 py-2 bg-white border border-[#D5D7DA] rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
      >
        <WorkspaceIcon class="w-5 h-5 text-[#A4A7AE] flex-shrink-0" />
        <span class="flex-1 text-left text-sm font-medium text-[#414651]">
          Workspace Name
        </span>
        <ChevronDown class="w-4 h-4 text-[#A4A7AE]" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto p-5 space-y-0.5">
      <!-- Example Nav Item -->
      <button
        v-for="item in menuItems"
        :key="item.label"
        @click="handleClick(item.label, item.route)"
        :class="navItemClass(item.label)"
      >
        <component :is="item.icon" :class="iconClass(item.label)" />
        <span
          v-if="!isCollapsed"
          class="flex-1 text-left text-base font-semibold"
        >
          {{ item.label }}
        </span>
      </button>

      <!-- Example Section Divider -->
      <div v-for="section in sections" :key="section.label">
        <div v-if="!isCollapsed" class="flex items-center gap-2 py-2">
          <SectionIcon class="w-4 h-4 flex-shrink-0 text-[#A4A7AE]" />
          <span class="text-sm font-medium text-[#535862] whitespace-nowrap">
            {{ section.label }}
          </span>
          <div class="flex-1 h-px bg-[#E9EAEB] ml-2 self-center"></div>
        </div>
        <div v-else class="w-full h-px bg-[#E9EAEB] my-2"></div>
      </div>
    </nav>

    <!-- User Footer -->
    <div class="p-5 border-t border-[#E9EAEB]" v-if="!isCollapsed">
      <div class="mb-4">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full"
        >
          <div
            class="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center"
          >
            <div class="w-2 h-2 rounded-full bg-white"></div>
          </div>
          <span class="text-sm font-medium text-indigo-700">Administrator</span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden bg-gray-200"
        >
          <img
            src="https://i.pravatar.cc/40?img=1"
            alt="Olivia Rhye"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold text-[#181D27]">Olivia Rhye</div>
          <div class="text-xs text-[#535862]">
            Active plan: <span class="text-[#4539CC]">Basic</span>
          </div>
        </div>

        <button
          @click="handleUserMenu"
          class="p-1 hover:bg-gray-50 rounded transition-colors flex-shrink-0"
        >
          <MoreVertical class="w-5 h-5 text-[#A4A7AE]" />
        </button>
      </div>
    </div>

    <div v-else class="flex justify-center pb-5">
      <button
        @click="handleUserMenu"
        class="w-10 h-10 rounded overflow-hidden hover:ring-2 hover:ring-indigo-500 transition-all"
      >
        <img
          src="https://i.pravatar.cc/40?img=1"
          alt="Olivia Rhye"
          class="w-full h-full object-cover"
        />
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import OverviewIcon from "../../assets/icons/sidebar/overview.svg?component";
import NotificationIcon from "../../assets/icons/sidebar/notifications.svg?component";
import TemplatesIcon from "../../assets/icons/sidebar/templates.svg?component";
import DocumentsIcon from "../../assets/icons/sidebar/documents.svg?component";
import AutomationsIcon from "../../assets/icons/sidebar/automations.svg?component";
import ReportsIcon from "../../assets/icons/sidebar/reports.svg?component";
import MembersIcon from "../../assets/icons/sidebar/members.svg?component";
import CompaniesIcon from "../../assets/icons/sidebar/companies.svg?component";
import PeopleIcon from "../../assets/icons/sidebar/people.svg?component";
import ContractsIcon from "../../assets/icons/sidebar/contracts.svg?component";
import SectionIcon from "../../assets/icons/sidebar/section.svg?component";
import WorkspaceIcon from "../../assets/icons/sidebar/workspace.svg?component";
import ChevronIcon from "../../assets/icons/sidebar/chervon.svg?component";
import DoclastLogo from "../../assets/icons/logo/doclast-logo.svg?component";
import MoreVertical from "../../assets/icons/sidebar/more-vertical.svg?component";

const props = defineProps({
  sidebarOpen: Boolean,
  activeNav: String,
});

const emit = defineEmits(["close", "navigate", "toggleCollapse", "userMenu"]);
const router = useRouter();

const isCollapsed = ref(false);

const menuItems = [
  { label: "Overview", route: "/overview", icon: OverviewIcon },
  {
    label: "Notifications",
    route: "/admin/notifications",
    icon: NotificationIcon,
  },
  { label: "Templates", route: "/templates", icon: TemplatesIcon },
  { label: "Documents", route: "/documents", icon: DocumentsIcon },
  { label: "Automations", route: "/automations", icon: AutomationsIcon },
  { label: "Reports", route: "/reports", icon: ReportsIcon },
  { label: "Members and teams", route: "/members", icon: MembersIcon },
  { label: "Companies", route: "/companies", icon: CompaniesIcon },
  { label: "People", route: "/people", icon: PeopleIcon },
  { label: "2024 Contracts", route: "/contracts", icon: ContractsIcon },
];

const sections = [
  { label: "Products" },
  { label: "Records" },
  { label: "Lists" },
];

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
  emit("toggleCollapse", isCollapsed.value);
}

function handleClick(label, routePath = null) {
  if (routePath) router.push(routePath).catch(() => {});
  emit("navigate", label);
  if (window.innerWidth < 1024) emit("close");
}

function handleUserMenu() {
  emit("userMenu");
}

const navItemClass = (label) => {
  const isActive = props.activeNav === label;
  return [
    "flex items-center gap-2 px-3 py-2 rounded-md w-full transition-all",
    isCollapsed.value ? "justify-center" : "text-base font-semibold",
    isActive
      ? "text-[#4539CC] bg-[#FAFAFA]"
      : "text-[#414651] hover:bg-[#FAFAFA]",
  ];
};

const iconClass = (label) => {
  const isActive = props.activeNav === label;
  return [
    "w-5 h-5 flex-shrink-0",
    isActive ? "text-[#4539CC]" : "text-[#A4A7AE]",
  ];
};
</script>

<style scoped>
.shadow-xs {
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
}
</style>
