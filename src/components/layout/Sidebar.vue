<template>
  <aside
    :class="[
      'sidebar',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0',
    ]"
  >
    <!-- Header with Logo and Collapse Button -->
    <div class="sidebar-header">
      <div class="flex items-center justify-between mb-4">
        <span class="text-indigo-600 font-bold text-xl">doclast |</span>
        <button
          class="p-1.5 hover:bg-gray-100 rounded transition-colors"
          @click="$emit('close')"
          aria-label="Collapse sidebar"
        >
          <ChevronsLeft class="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <!-- Workspace Dropdown -->
      <button
        class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Building2 class="w-4 h-4 text-gray-500 flex-shrink-0" />
        <span class="flex-1 text-left">Workspace Name</span>
        <ChevronDown class="w-4 h-4 text-gray-400 flex-shrink-0" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto px-3 py-2">
      <!-- Overview -->
      <button
        @click="handleClick('Overview', 'Overview')"
        :class="navItemClass('Overview')"
      >
        <Home class="w-5 h-5 flex-shrink-0" />
        <span class="flex-1 text-left">Overview</span>
      </button>

      <!-- Notifications with green dot and badge -->
      <button
        @click="$emit('navigate', 'Notifications')"
        :class="navItemClass('Notifications')"
      >
        <Bell class="w-5 h-5 flex-shrink-0" />
        <span class="flex-1 text-left">Notifications</span>
        <span class="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
        <span
          class="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded font-medium flex-shrink-0"
          >10</span
        >
      </button>

      <!-- Products Section (always open) -->
      <div
        class="w-full flex items-center gap-2 px-3 py-3 mt-3 mb-0.5 text-xs text-gray-500 font-medium"
      >
        <ChevronRight class="w-4 h-4 flex-shrink-0" />
        <span class="whitespace-nowrap">Products</span>
        <span class="flex-1 h-px bg-gray-200 ml-2"></span>
      </div>

      <button
        @click="$emit('navigate', 'All Products')"
        :class="navItemClass('All Products')"
      >
        <Package class="w-5 h-5 flex-shrink-0" />
        <span class="flex-1 text-left">All Products</span>
      </button>

      <!-- Forms -->
      <button
        @click="$emit('navigate', 'Forms')"
        :class="navItemClass('Forms')"
      >
        <LayoutGrid class="w-5 h-5 flex-shrink-0" />
        <span class="flex-1 text-left">Forms</span>
      </button>

      <!-- Templates -->
      <button
        @click="$emit('navigate', 'Templates')"
        :class="navItemClass('Templates')"
      >
        <FileText class="w-5 h-5 flex-shrink-0" />
        <span class="flex-1 text-left">Templates</span>
      </button>

      <!-- Documents (active) -->
      <button
        @click="handleClick('Documents', 'Documents')"
        :class="navItemClass('Documents')"
      >
        <FileText class="w-5 h-5 flex-shrink-0" />
        <span class="flex-1 text-left">Documents</span>
      </button>

      <!-- Automations -->
      <button
        @click="$emit('navigate', 'Automations')"
        :class="navItemClass('Automations')"
      >
        <Zap class="w-5 h-5 flex-shrink-0" />
        <span class="flex-1 text-left">Automations</span>
      </button>

      <!-- Reports -->
      <button
        @click="$emit('navigate', 'Reports')"
        :class="navItemClass('Reports')"
      >
        <BarChart3 class="w-5 h-5 flex-shrink-0" />
        <span class="flex-1 text-left">Reports</span>
      </button>

      <!-- Members and teams -->
      <button
        @click="$emit('navigate', 'Members and teams')"
        :class="navItemClass('Members and teams')"
      >
        <Users class="w-5 h-5 flex-shrink-0" />
        <span class="flex-1 text-left">Members and teams</span>
      </button>

      <!-- Records Section (always open) -->
      <div
        class="w-full flex items-center gap-2 px-3 py-3 mt-3 mb-0.5 text-xs text-gray-500 font-medium"
      >
        <ChevronRight class="w-4 h-4 flex-shrink-0" />
        <span class="whitespace-nowrap">Records</span>
        <span class="flex-1 h-px bg-gray-200 ml-2"></span>
      </div>

      <button
        @click="$emit('navigate', 'Companies')"
        :class="navItemClass('Companies')"
      >
        <Building2 class="w-5 h-5 flex-shrink-0" />
        <span class="flex-1 text-left">Companies</span>
      </button>

      <button
        @click="$emit('navigate', 'People')"
        :class="navItemClass('People')"
      >
        <Users class="w-5 h-5 flex-shrink-0" />
        <span class="flex-1 text-left">People</span>
      </button>

      <!-- Lists Section (always open) -->
      <div
        class="w-full flex items-center gap-2 px-3 py-3 mt-3 mb-0.5 text-xs text-gray-500 font-medium"
      >
        <ChevronRight class="w-4 h-4 flex-shrink-0" />
        <span class="whitespace-nowrap">Lists</span>
        <span class="flex-1 h-px bg-gray-200 ml-2"></span>
      </div>

      <button
        @click="$emit('navigate', '2024 Contracts')"
        :class="navItemClass('2024 Contracts')"
      >
        <FolderClosed class="w-5 h-5 flex-shrink-0" />
        <span class="flex-1 text-left">2024 Contracts</span>
      </button>
    </nav>

    <!-- User Footer -->
    <div class="sidebar-user">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0"
        >
          <img
            src="https://i.pravatar.cc/40?img=1"
            alt="Olivia Rhye"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-gray-900 truncate">
            Olivia Rhye
          </div>
          <div class="text-xs text-gray-500">Active plan: Basic</div>
        </div>
        <button
          class="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
        >
          <MoreVertical class="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  ChevronsLeft,
  ChevronDown,
  ChevronRight,
  Building2,
  Home,
  Bell,
  Package,
  LayoutGrid,
  FileText,
  Zap,
  BarChart3,
  Users,
  FolderClosed,
  MoreVertical,
} from "lucide-vue-next";

import { useRouter } from "vue-router";

const props = defineProps({
  sidebarOpen: Boolean,
  activeNav: String,
});

const emit = defineEmits(["close", "navigate"]);

const router = useRouter();

/* CLICK HANDLER FIXED */
function handleClick(label, routeName = null) {
  // If routeName provided, navigate via Vue Router
  if (routeName) {
    router.push({ name: routeName }).catch(() => {
      // catch redundant navigation error
    });
  }

  emit("navigate", label);

  if (window.innerWidth < 1024) {
    emit("close");
  }
}

/* ACTIVE LINK CLASS */
const navItemClass = (label) => [
  "w-full flex items-center gap-3 px-3 py-2 mb-0.5 rounded-lg text-sm transition-colors",
  props.activeNav === label
    ? "bg-gray-100 text-gray-900 font-medium"
    : "text-gray-600 hover:bg-gray-50",
];
</script>

<style scoped lang="scss">
/* Minimal scoped styles - most styling via Tailwind */
</style>
