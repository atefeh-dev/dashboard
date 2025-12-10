<template>
  <nav class="navbar">
    <div class="navbar__container">
      <!-- Left: Mobile Menu + Breadcrumb -->
      <div class="navbar__left">
        <!-- Mobile Menu Button -->
        <button
          class="navbar__mobile-toggle"
          @click="$emit('toggleSidebar')"
          aria-label="Toggle sidebar"
        >
          <Menu class="navbar__mobile-icon" />
        </button>

        <!-- Breadcrumb -->
        <div class="navbar__breadcrumb">
          <OverviewIcon class="navbar__breadcrumb-icon" />
          <ChevronRightIcon class="navbar__breadcrumb-separator" />

          <span class="navbar__breadcrumb-item">{{ workspaceName }}</span>
          <ChevronRightIcon
            class="navbar__breadcrumb-secound-separator"
            id="second-separator"
          />
          <span class="navbar__breadcrumb-current">{{ currentPage }}</span>
        </div>
      </div>

      <!-- Right: Search -->
      <div class="navbar__right">
        <div class="navbar__search">
          <SearchIcon class="navbar__search-icon" />
          <input
            type="text"
            :placeholder="searchPlaceholder"
            class="navbar__search-input"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
          />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { Menu, Home, Search } from "lucide-vue-next";
import ChevronRightIcon from "../../assets/icons/common/chevron-right.svg";
import OverviewIcon from "../../assets/icons/sidebar/overview.svg";
import SearchIcon from "../../assets/icons/common/search.svg";

defineProps({
  workspaceName: {
    type: String,
    default: "Workspace Name",
  },
  currentPage: {
    type: String,
    required: true,
  },
  searchPlaceholder: {
    type: String,
    default: "search everything ...",
  },
  modelValue: {
    type: String,
    default: "",
  },
});

defineEmits(["toggleSidebar", "update:modelValue"]);
</script>

<style scoped lang="scss">
.navbar {
  background-color: transparent;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;

  // Modifier for white background (if needed)
  &--solid {
    background-color: #ffffff;
  }

  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem; /* already rem */
    padding-top: 1rem; /* 16px */
    padding-bottom: 1.3125rem; /* 21px */
    padding-left: 1rem;
    padding-right: 1rem;
    max-width: 80rem; /* already rem */
    margin: 0 auto;

    @media (min-width: 640px) {
      // padding: 1rem 1.5rem;
    }

    @media (min-width: 1024px) {
      // padding: 1rem 2rem;
    }
  }

  // Left section
  &__left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  // Mobile toggle button
  &__mobile-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border: none;
    background: transparent;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s;

    @media (min-width: 1024px) {
      display: none;
    }

    &:hover {
      background-color: #f3f4f6;
    }

    &:active {
      background-color: #e5e7eb;
    }
  }

  &__mobile-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: #6b7280;
  }

  // Breadcrumb
  &__breadcrumb {
    display: none;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    font-size: 0.875rem;

    @media (min-width: 640px) {
      display: flex;
    }
  }

  &__breadcrumb-icon {
    width: 20px;
    height: 20px;
    color: #9ca3af;
    flex-shrink: 0;
  }

  &__breadcrumb-item {
    color: #717680;

    white-space: nowrap;
  }

  &__breadcrumb-separator {
    color: #d1d5db;
  }
  .navbar__breadcrumb-separator[id="second-separator"] {
    stroke: rgba(211, 211, 211, 0.264);
  }

  &__breadcrumb-current {
    color: #414651;
    white-space: nowrap;
  }

  // Right section
  &__right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    max-width: 320px;
  }

  // Search
  &__search {
    position: relative;
    width: 100%;
  }

  &__search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: #9ca3af;
    pointer-events: none;
  }

  &__search-input {
    width: 100%;
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    font-size: 1rem;
    font-weight: 400;
    color: #717680;
    background-color: #ffffff;
    border: 1px solid #d5d7da;
    border-radius: 0.5rem; // 8px
    outline: none;
    transition: all 0.2s;
    box-shadow: 0 0.0625rem 0.125rem rgba(10, 13, 18, 0.05);

    &::placeholder {
      color: #9ca3af;
    }

    &:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
  }
}
</style>
