<template>
  <nav class="navbar">
    <div class="navbar__container">
      <!-- Left Section -->
      <div class="navbar__left">
        <slot name="left">
          <!-- Default: Mobile toggle + Breadcrumb -->
          <button
            v-if="!hideToggle"
            class="navbar__mobile-toggle"
            @click="$emit('toggleSidebar')"
            aria-label="Toggle sidebar"
          >
            <Menu class="navbar__mobile-icon" />
          </button>

          <div v-if="breadcrumbs.length > 0" class="navbar__breadcrumb">
            <OverviewIcon class="navbar__breadcrumb-icon" />
            <template v-for="(item, index) in breadcrumbs" :key="index">
              <ChevronRightIcon class="navbar__breadcrumb-separator" />
              <span
                class="navbar__breadcrumb-item"
                :class="{
                  'navbar__breadcrumb-item--current':
                    index === breadcrumbs.length - 1,
                }"
              >
                {{ item }}
              </span>
            </template>
          </div>
        </slot>
      </div>

      <!-- Right Section -->
      <div class="navbar__right">
        <slot name="right">
          <!-- Default: Search -->
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
        </slot>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { Menu } from "lucide-vue-next";
import ChevronRightIcon from "../../assets/icons/common/chevron-right.svg";
import OverviewIcon from "../../assets/icons/sidebar/overview.svg";
import SearchIcon from "../../assets/icons/common/search.svg";

defineProps({
  breadcrumbs: {
    type: Array,
    default: () => [],
  },
  searchPlaceholder: {
    type: String,
    default: "search everything ...",
  },
  modelValue: {
    type: String,
    default: "",
  },
  hideToggle: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["toggleSidebar", "update:modelValue"]);
</script>

<style scoped lang="scss">
.navbar {
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 20;

  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.5rem;
    max-width: 100%;
    margin: 0 auto;
  }

  // Left section
  &__left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
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
    flex-shrink: 0;

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
    font-size: 0.875rem;
    font-weight: 500;
    gap: 0.375rem;
    min-width: 0;
    overflow: hidden;

    @media (min-width: 640px) {
      display: flex;
    }
  }

  &__breadcrumb-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: #9ca3af;
    flex-shrink: 0;
  }

  &__breadcrumb-item {
    color: #6b7280;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &--current {
      color: #111827;
      font-weight: 600;
    }
  }

  &__breadcrumb-separator {
    color: #d1d5db;
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
  }

  // Right section
  &__right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  // Search
  &__search {
    position: relative;
    width: 100%;
    max-width: 20rem;
  }

  &__search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.25rem;
    height: 1.25rem;
    color: #9ca3af;
    pointer-events: none;
  }

  &__search-input {
    width: 100%;
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    font-size: 0.875rem;
    font-weight: 400;
    color: #111827;
    background-color: #ffffff;
    border: 1px solid #d5d7da;
    border-radius: 0.5rem;
    outline: none;
    transition: all 0.2s;
    box-shadow: 0 1px 2px rgba(10, 13, 18, 0.05);

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
