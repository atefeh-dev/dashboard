<template>
  <div class="layout">
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
        'layout__content',
        { 'layout__content--collapsed': isCollapsed },
      ]"
    >
      <!-- Navbar (sticky header) -->
      <header v-if="$slots.navbar" class="layout__navbar">
        <slot name="navbar" />
      </header>

      <!-- Main Content -->
      <main class="layout__main">
        <div class="layout__container">
          <slot />
        </div>
      </main>
    </div>

    <!-- Mobile Overlay -->
    <div
      v-if="sidebarOpen"
      class="layout__overlay"
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

<style scoped lang="scss">
.layout {
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;

  // Main Content Area
  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    transition: margin-left 0.3s ease;

    @media (min-width: 1024px) {
      margin-left: 280px;
    }

    &--collapsed {
      @media (min-width: 1024px) {
        margin-left: 4rem;
      }
    }
  }

  // Navbar Header - just positioning, no padding/styling
  &__navbar {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #f9fafb; // Match layout background
  }

  // Main Content
  &__main {
    flex: 1;
  }

  // Container for page content
  &__container {
    max-width: 80rem;
    margin: 0 auto;
    padding: 1.25rem 1rem; // 20px 16px
  }

  // Mobile Overlay
  &__overlay {
    display: none;

    @media (max-width: 1023px) {
      display: block;
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(4px);
      z-index: 30;
      animation: fadeIn 0.2s ease;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
