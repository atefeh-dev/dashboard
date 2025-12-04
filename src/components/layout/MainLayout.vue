<template>
  <div class="flex h-screen bg-gray-50">
    <Sidebar
      :sidebar-open="sidebarOpen"
      :active-nav="activeNav"
      @close="$emit('closeSidebar')"
      @navigate="$emit('navigate', $event)"
    />
    <div class="flex-1 overflow-y-auto">
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <slot />
      </main>
    </div>
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
      @click="$emit('closeSidebar')"
    ></div>
  </div>
</template>

<script setup>
import Sidebar from "./Sidebar.vue";

defineProps({
  sidebarOpen: { type: Boolean, default: false },
  activeNav: { type: String, default: "" },
});

defineEmits(["closeSidebar", "navigate"]);
</script>
