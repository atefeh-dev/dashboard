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
      <!-- Navbar (if provided) -->
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

    // Desktop: Add left margin for sidebar
    @media (min-width: 1024px) {
      margin-left: 280px;
    }

    // Modifier for collapsed sidebar (future use)
    &--collapsed {
      @media (min-width: 1024px) {
        margin-left: 4rem;
      }
    }
  }

  // Navbar Header
  &__navbar {
    // padding: 1rem 1rem;
    position: sticky;
    top: 0;
    z-index: 10;

    @media (min-width: 640px) {
      // padding: 1rem 1.5rem;
    }

    @media (min-width: 1024px) {
      // padding: 1rem 2rem;
    }
  }

  // Main Content
  &__main {
    flex: 1;
  }

  // Container
  &__container {
    max-width: 80rem; // 1280px
    margin: 0 auto;
    padding: 20px 16px;
    width: 100%;

    @media (min-width: 640px) {
      // padding: 2rem 1.5rem;
    }

    @media (min-width: 1024px) {
      // padding: 2rem 2rem;
    }
  }

  // Mobile Overlay - Light and modern
  &__overlay {
    display: none;

    @media (max-width: 1023px) {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(4px);
      z-index: 30;
      animation: fadeIn 0.2s ease;
    }
  }
}

// Fade-in animation
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
