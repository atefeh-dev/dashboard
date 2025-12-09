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
      <!-- Logo -->
      <div class="flex items-center">
        <DoclastLogo class="h-22.64" />
      </div>

      <!-- Collapse Button -->
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
    <div class="p-5" v-if="!isCollapsed">
      <button
        class="flex items-center gap-2 w-full px-3 py-2 bg-white border border-[#D5D7DA] rounded-lg hover:bg-gray-50 transition-colors shadow-xs"
      >
        <WorkspaceIcon class="w-5 h-5 text-[#A4A7AE] flex-shrink-0" />
        <span class="flex-1 text-left text-[#414651] text-sm font-normal"
          >Workspace Name</span
        >
        <ChevronDown class="w-4 h-4 text-[#A4A7AE] flex-shrink-0" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto p-5 pt-0 space-y-0.5">
      <!-- Overview -->
      <button
        @click="handleClick('Overview', '/overview')"
        :class="navItemClass('Overview')"
      >
        <OverviewIcon
          class="w-5 h-5 flex-shrink-0"
          :class="IconClass('Overview')"
        />
        <span v-if="!isCollapsed" class="flex-1 text-left text-sm font-normal"
          >Overview</span
        >
      </button>

      <!-- Notifications -->
      <button
        @click="handleClick('Notifications', '/admin/notifications')"
        :class="navItemClass('Notifications')"
      >
        <NotificationIcon
          class="w-5 h-5 flex-shrink-0 relative"
          :class="IconClass('Notifications')"
        />
        <span v-if="!isCollapsed" class="flex-1 text-left text-sm font-normal"
          >Notifications</span
        >
        <span
          v-if="!isCollapsed"
          class="w-2 h-2 rounded-full bg-[#17B26A] flex-shrink-0"
        ></span>
        <span
          v-if="!isCollapsed"
          class="px-2 py-0.5 bg-[#F2F4F7] text-[#344054] text-xs font-medium rounded-full flex-shrink-0"
          >10</span
        >
      </button>

      <!-- Products Divider -->
      <div v-if="!isCollapsed" class="flex items-center gap-2 py-2">
        <SectionIcon class="w-4 text-[#A4A7AE] flex-shrink-0 align-middle" />
        <span class="text-xs font-medium text-[#535862] whitespace-nowraps"
          >Products</span
        >
        <div class="flex-1 h-px bg-[#E9EAEB] ml-2"></div>
      </div>
      <div v-else class="w-full h-px bg-[#E9EAEB] my-2"></div>

      <!-- Templates -->
      <button
        @click="handleClick('Templates')"
        :class="navItemClass('Templates')"
      >
        <TemplatesIcon
          class="w-5 h-5 flex-shrink-0"
          :class="IconClass('Templates')"
        />
        <span v-if="!isCollapsed" class="flex-1 text-left text-sm font-normal"
          >Templates</span
        >
      </button>

      <!-- Documents -->
      <button
        @click="handleClick('Documents', '/documents')"
        :class="navItemClass('Documents')"
      >
        <DocumentsIcon
          class="w-5 h-5 flex-shrink-0"
          :class="IconClass('Documents')"
        />
        <span v-if="!isCollapsed" class="flex-1 text-left text-sm font-normal"
          >Documents</span
        >
      </button>

      <!-- Automations -->
      <button
        @click="handleClick('Automations')"
        :class="navItemClass('Automations')"
      >
        <AutomationsIcon
          class="w-5 h-5 flex-shrink-0"
          :class="IconClass('Automations')"
        />
        <span v-if="!isCollapsed" class="flex-1 text-left text-sm font-normal"
          >Automations</span
        >
      </button>

      <!-- Reports -->
      <button @click="handleClick('Reports')" :class="navItemClass('Reports')">
        <ReportsIcon
          class="w-5 h-5 flex-shrink-0"
          :class="IconClass('Reports')"
        />
        <span v-if="!isCollapsed" class="flex-1 text-left text-sm font-normal"
          >Reports</span
        >
      </button>

      <!-- Members and teams -->
      <button
        @click="handleClick('Members and teams')"
        :class="navItemClass('Members and teams')"
      >
        <MembersIcon
          class="w-5 h-5 flex-shrink-0"
          :class="IconClass('Members and teams')"
        />
        <span v-if="!isCollapsed" class="flex-1 text-left text-sm font-normal"
          >Members and teams</span
        >
      </button>

      <!-- Records Divider -->
      <div v-if="!isCollapsed" class="flex items-center gap-1 py-2">
        <SectionIcon class="w-4 text-[#A4A7AE] flex-shrink-0 align-middle" />
        <span class="text-xs font-medium text-[#535862] whitespace-nowrap"
          >Records</span
        >
        <div class="flex-1 h-px bg-[#E9EAEB] ml-2"></div>
      </div>
      <div v-else class="w-full h-px bg-[#E9EAEB] my-2"></div>

      <!-- Companies -->
      <button
        @click="handleClick('Companies')"
        :class="navItemClass('Companies')"
      >
        <CompaniesIcon
          class="w-5 h-5 flex-shrink-0"
          :class="IconClass('Companies')"
        />
        <span v-if="!isCollapsed" class="flex-1 text-left text-sm font-normal"
          >Companies</span
        >
      </button>

      <!-- People -->
      <button @click="handleClick('People')" :class="navItemClass('People')">
        <PeopleIcon
          class="w-5 h-5 flex-shrink-0"
          :class="IconClass('People')"
        />
        <span v-if="!isCollapsed" class="flex-1 text-left text-sm font-normal"
          >People</span
        >
      </button>

      <!-- Lists Divider -->
      <div v-if="!isCollapsed" class="flex items-center gap-1 py-2">
        <SectionIcon class="w-4 text-[#A4A7AE] flex-shrink-0 align-middle" />
        <span class="text-xs font-medium text-[#535862] whitespace-nowrap"
          >Lists</span
        >
        <div class="flex-1 h-px bg-[#E9EAEB] ml-2"></div>
      </div>
      <div v-else class="w-full h-px bg-[#E9EAEB] my-2"></div>

      <!-- 2024 Contracts -->
      <button
        @click="handleClick('2024 Contracts')"
        :class="navItemClass('2024 Contracts')"
      >
        <ContractsIcon
          class="w-5 h-5 flex-shrink-0"
          :class="IconClass('2024 Contracts')"
        />
        <span v-if="!isCollapsed" class="flex-1 text-left text-sm font-normal"
          >2024 Contracts</span
        >
      </button>
    </nav>

    <!--User Footer -->
    <div class="p-5 border-t border-[#E9EAEB]" v-if="!isCollapsed">
      <!-- Administrator Badge (shown when user is admin) -->
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
        <!-- Avatar -->
        <div
          class="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden bg-gray-200"
        >
          <img
            src="https://i.pravatar.cc/40?img=1"
            alt="Olivia Rhye"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Name and Plan -->
        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold text-[#181D27]">Olivia Rhye</div>
          <div class="text-xs text-[#535862]">
            Active plan: <span class="text-[#4539CC]">Basic</span>
          </div>
        </div>

        <!-- Menu Button -->
        <button
          @click="handleUserMenu"
          class="p-1 hover:bg-gray-50 rounded transition-colors flex-shrink-0"
        >
          <MoreVertical class="w-5 h-5 text-[#A4A7AE]" />
        </button>
      </div>
    </div>

    <!-- Collapsed User Footer -->
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

const props = defineProps({
  sidebarOpen: Boolean,
  activeNav: String,
});

const emit = defineEmits(["close", "navigate", "toggleCollapse", "userMenu"]);
const router = useRouter();

const isCollapsed = ref(false);

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
  emit("toggleCollapse", isCollapsed.value);
}

function handleClick(label, routePath = null) {
  if (routePath) {
    router.push(routePath).catch(() => {});
  }
  emit("navigate", label);

  if (window.innerWidth < 1024) {
    emit("close");
  }
}

function handleUserMenu() {
  emit("userMenu");
}

const navItemClass = (label) => {
  const isActive = props.activeNav === label;
  return [
    "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors w-full",
    isCollapsed.value ? "justify-center" : "",
    isActive
      ? "text-[#4539CC] bg-[#FAFAFA] font-semibold"
      : "text-[#414651] hover:bg-[#FAFAFA] font-normal",
  ];
};
const IconClass = (label) => {
  const isActive = props.activeNav === label;
  return [
    "w-5 h-5 flex-shrink-0",
    isActive ? "text-[#4539CC]" : "text-[#A4A7AE]",
  ];
};
</script>

<style scoped>
.shadow-xs {
  box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05);
}
</style>
