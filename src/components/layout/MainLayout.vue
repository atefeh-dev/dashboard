<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar
      :sidebar-open="sidebarOpen"
      :active-nav="activeNav"
      @close="$emit('closeSidebar')"
      @navigate="$emit('navigate', $event)"
      @toggle-collapse="handleSidebarCollapse"
      @user-menu="$emit('userMenu')"
    />

    <!-- Main Content Area -->
    <div
      :class="[
        'flex-1 flex flex-col min-h-screen transition-all duration-300',
        isCollapsed ? 'lg:pl-16' : 'lg:pl-60',
      ]"
    >
      <!-- Navbar (if provided) -->
      <header
        v-if="$slots.navbar"
        class="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-10"
      >
        <slot name="navbar" />
      </header>

      <!-- Main Content -->
      <main class="flex-1">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <slot />
        </div>
      </main>
    </div>

    <!-- Mobile Overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
      @click="$emit('closeSidebar')"
    ></div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Sidebar from "./Sidebar.vue";

defineProps({
  sidebarOpen: { type: Boolean, default: false },
  activeNav: { type: String, default: "" },
});

const emit = defineEmits(["closeSidebar", "navigate", "userMenu"]);

const isCollapsed = ref(false);

function handleSidebarCollapse(collapsed) {
  isCollapsed.value = collapsed;
}
</script>
