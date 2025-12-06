<template>
  <div class="flex items-center justify-between gap-4">
    <!-- Left Side -->
    <div class="flex items-center gap-3">
      <!-- Mobile Menu Button -->
      <button
        @click="$emit('toggleSidebar')"
        class="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Menu class="w-5 h-5" />
      </button>

      <!-- Breadcrumb or Title -->
      <slot name="left">
        <h1 class="text-xl font-semibold text-gray-900">{{ title }}</h1>
      </slot>
    </div>

    <!-- Right Side -->
    <div class="flex items-center gap-3">
      <slot name="right">
        <!-- Search Button -->
        <button
          class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="Search"
        >
          <Search class="w-5 h-5" />
        </button>

        <!-- Notifications Button -->
        <button
          class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="Notifications"
        >
          <Bell class="w-5 h-5" />
          <span
            class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"
          ></span>
        </button>

        <!-- User Avatar -->
        <button
          class="w-8 h-8 rounded-full overflow-hidden bg-gray-200 hover:ring-2 hover:ring-indigo-500 transition-all"
          title="User menu"
        >
          <img
            src="https://i.pravatar.cc/32?img=1"
            alt="User"
            class="w-full h-full object-cover"
          />
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { Menu, Search, Bell } from "lucide-vue-next";

defineProps({
  title: {
    type: String,
    default: "",
  },
});

defineEmits(["toggleSidebar"]);
</script>
