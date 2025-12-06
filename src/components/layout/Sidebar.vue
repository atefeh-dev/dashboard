<template>
  <aside
    :class="[
      'fixed top-0 left-0 h-screen bg-white border-r border-gray-200 flex flex-col z-30 transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-60',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0',
    ]"
  >
    <!-- Header with Logo and Collapse Button -->
    <div class="px-4 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <span
          v-if="!isCollapsed"
          class="text-indigo-600 font-bold text-xl transition-opacity"
          >doclast |</span
        >
        <span
          v-else
          class="text-indigo-600 font-bold text-xl w-full text-center transition-opacity"
          >d</span
        >
        <button
          v-if="!isCollapsed"
          class="p-1.5 hover:bg-gray-100 rounded transition-colors hidden lg:block"
          @click="toggleCollapse"
          :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <ChevronsLeft class="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <!-- Workspace Dropdown -->
      <button
        v-if="!isCollapsed"
        class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Building2 class="w-4 h-4 text-gray-500 flex-shrink-0" />
        <span class="flex-1 text-left">Workspace Name</span>
        <ChevronDown class="w-4 h-4 text-gray-400 flex-shrink-0" />
      </button>

      <!-- Icon only for collapsed state -->
      <button
        v-else
        class="w-full flex items-center justify-center p-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        :title="'Workspace Name'"
      >
        <Building2 class="w-5 h-5 text-gray-500" />
      </button>

      <!-- Expand button when collapsed -->
      <button
        v-if="isCollapsed"
        class="w-full flex items-center justify-center p-1.5 hover:bg-gray-100 rounded transition-colors mt-2 hidden lg:block"
        @click="toggleCollapse"
        :aria-label="'Expand sidebar'"
      >
        <ChevronsRight class="w-5 h-5 text-gray-400" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto px-3 py-2">
      <!-- Overview -->
      <button
        @click="handleClick('Overview', 'Overview')"
        :class="navItemClass('Overview')"
        :title="isCollapsed ? 'Overview' : ''"
      >
        <Home class="w-5 h-5 flex-shrink-0" />
        <span v-if="!isCollapsed" class="flex-1 text-left">Overview</span>
      </button>

      <!-- Notifications with green dot and badge -->
      <button
        @click="handleClick('Notifications')"
        :class="navItemClass('Notifications')"
        :title="isCollapsed ? 'Notifications' : ''"
      >
        <div class="relative">
          <Bell class="w-5 h-5 flex-shrink-0" />
          <span
            v-if="isCollapsed"
            class="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
          ></span>
        </div>
        <template v-if="!isCollapsed">
          <span class="flex-1 text-left">Notifications</span>
          <span class="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
          <span
            class="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded font-medium flex-shrink-0"
            >10</span
          >
        </template>
      </button>

      <!-- Products Section -->
      <div
        v-if="!isCollapsed"
        class="w-full flex items-center gap-2 px-3 py-3 mt-3 mb-0.5 text-xs text-gray-500 font-medium"
      >
        <ChevronRight class="w-4 h-4 flex-shrink-0" />
        <span class="whitespace-nowrap">Products</span>
        <span class="flex-1 h-px bg-gray-200 ml-2"></span>
      </div>
      <div v-else class="w-full h-px bg-gray-200 my-3"></div>

      <button
        @click="handleClick('All Products')"
        :class="navItemClass('All Products')"
        :title="isCollapsed ? 'All Products' : ''"
      >
        <Package class="w-5 h-5 flex-shrink-0" />
        <span v-if="!isCollapsed" class="flex-1 text-left">All Products</span>
      </button>

      <!-- Forms -->
      <button
        @click="handleClick('Forms')"
        :class="navItemClass('Forms')"
        :title="isCollapsed ? 'Forms' : ''"
      >
        <LayoutGrid class="w-5 h-5 flex-shrink-0" />
        <span v-if="!isCollapsed" class="flex-1 text-left">Forms</span>
      </button>

      <!-- Templates -->
      <button
        @click="handleClick('Templates')"
        :class="navItemClass('Templates')"
        :title="isCollapsed ? 'Templates' : ''"
      >
        <FileText class="w-5 h-5 flex-shrink-0" />
        <span v-if="!isCollapsed" class="flex-1 text-left">Templates</span>
      </button>

      <!-- Documents -->
      <button
        @click="handleClick('Documents', 'Documents')"
        :class="navItemClass('Documents')"
        :title="isCollapsed ? 'Documents' : ''"
      >
        <FileText class="w-5 h-5 flex-shrink-0" />
        <span v-if="!isCollapsed" class="flex-1 text-left">Documents</span>
      </button>

      <!-- Automations -->
      <button
        @click="handleClick('Automations')"
        :class="navItemClass('Automations')"
        :title="isCollapsed ? 'Automations' : ''"
      >
        <Zap class="w-5 h-5 flex-shrink-0" />
        <span v-if="!isCollapsed" class="flex-1 text-left">Automations</span>
      </button>

      <!-- Reports -->
      <button
        @click="handleClick('Reports')"
        :class="navItemClass('Reports')"
        :title="isCollapsed ? 'Reports' : ''"
      >
        <BarChart3 class="w-5 h-5 flex-shrink-0" />
        <span v-if="!isCollapsed" class="flex-1 text-left">Reports</span>
      </button>

      <!-- Members and teams -->
      <button
        @click="handleClick('Members and teams')"
        :class="navItemClass('Members and teams')"
        :title="isCollapsed ? 'Members and teams' : ''"
      >
        <Users class="w-5 h-5 flex-shrink-0" />
        <span v-if="!isCollapsed" class="flex-1 text-left"
          >Members and teams</span
        >
      </button>

      <!-- Records Section -->
      <div
        v-if="!isCollapsed"
        class="w-full flex items-center gap-2 px-3 py-3 mt-3 mb-0.5 text-xs text-gray-500 font-medium"
      >
        <ChevronRight class="w-4 h-4 flex-shrink-0" />
        <span class="whitespace-nowrap">Records</span>
        <span class="flex-1 h-px bg-gray-200 ml-2"></span>
      </div>
      <div v-else class="w-full h-px bg-gray-200 my-3"></div>

      <button
        @click="handleClick('Companies')"
        :class="navItemClass('Companies')"
        :title="isCollapsed ? 'Companies' : ''"
      >
        <Building2 class="w-5 h-5 flex-shrink-0" />
        <span v-if="!isCollapsed" class="flex-1 text-left">Companies</span>
      </button>

      <button
        @click="handleClick('People')"
        :class="navItemClass('People')"
        :title="isCollapsed ? 'People' : ''"
      >
        <Users class="w-5 h-5 flex-shrink-0" />
        <span v-if="!isCollapsed" class="flex-1 text-left">People</span>
      </button>

      <!-- Lists Section -->
      <div
        v-if="!isCollapsed"
        class="w-full flex items-center gap-2 px-3 py-3 mt-3 mb-0.5 text-xs text-gray-500 font-medium"
      >
        <ChevronRight class="w-4 h-4 flex-shrink-0" />
        <span class="whitespace-nowrap">Lists</span>
        <span class="flex-1 h-px bg-gray-200 ml-2"></span>
      </div>
      <div v-else class="w-full h-px bg-gray-200 my-3"></div>

      <button
        @click="handleClick('2024 Contracts')"
        :class="navItemClass('2024 Contracts')"
        :title="isCollapsed ? '2024 Contracts' : ''"
      >
        <FolderClosed class="w-5 h-5 flex-shrink-0" />
        <span v-if="!isCollapsed" class="flex-1 text-left">2024 Contracts</span>
      </button>
    </nav>

    <!-- User Footer -->
    <div class="p-4 border-t border-gray-200">
      <div v-if="!isCollapsed" class="flex items-center gap-3">
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
          @click="handleUserMenu"
          class="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
        >
          <MoreVertical class="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <!-- Collapsed user footer - just avatar -->
      <div v-else class="flex justify-center">
        <button
          @click="handleUserMenu"
          class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 hover:ring-2 hover:ring-indigo-500 transition-all"
          title="Olivia Rhye"
        >
          <img
            src="https://i.pravatar.cc/40?img=1"
            alt="Olivia Rhye"
            class="w-full h-full object-cover"
          />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";
import {
  ChevronsLeft,
  ChevronsRight,
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

const emit = defineEmits(["close", "navigate", "toggleCollapse", "userMenu"]);
const router = useRouter();

// Collapsed state
const isCollapsed = ref(false);

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
  emit("toggleCollapse", isCollapsed.value);
}

function handleClick(label, routeName = null) {
  if (routeName) {
    router.push({ name: routeName }).catch(() => {});
  }
  emit("navigate", label);

  // Close on mobile after navigation
  if (window.innerWidth < 1024) {
    emit("close");
  }
}

function handleUserMenu() {
  emit("userMenu");
}

const navItemClass = (label) => [
  "w-full flex items-center gap-3 px-3 py-2 mb-0.5 rounded-lg text-sm transition-colors",
  isCollapsed.value ? "justify-center" : "",
  props.activeNav === label
    ? "bg-gray-100 text-gray-900 font-medium"
    : "text-gray-600 hover:bg-gray-50",
];
</script>
