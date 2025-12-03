<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
      @click="$emit('closeSidebar')"
    ></div>

    <!-- Sidebar -->
    <Sidebar
      :sidebarOpen="sidebarOpen"
      :activeNav="activeNav"
      @close="$emit('closeSidebar')"
      @navigate="onNavigate"
    />

    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
      <div class="p-4 sm:p-6 lg:p-8">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "@/components/layout/Sidebar.vue";

const props = defineProps({
  sidebarOpen: { type: Boolean, default: false },
  activeNav: { type: String, default: "" },
});

const emit = defineEmits(["closeSidebar", "navigate"]);

function onNavigate(label) {
  emit("navigate", label);
}
</script>

<style scoped lang="scss"></style>
