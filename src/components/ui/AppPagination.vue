<template>
  <div class="pagination">
    <!-- Previous -->
    <AppButton
      variant="secondary"
      class="pagination__button"
      @click="$emit('prev')"
      :disabled="store.currentPage === 1"
    >
      <ArrowLeft class="pagination__icon pagination__icon--left" />
      Previous
    </AppButton>

    <!-- Page numbers -->
    <div class="pagination__numbers">
      <button
        v-for="(p, idx) in pages"
        :key="idx"
        :disabled="p === '...'"
        @click="onClick(p)"
        :class="[
          'pagination__number',
          p === current ? 'pagination__number--active' : '',
          p === '...' ? 'pagination__number--ellipsis' : '',
        ]"
      >
        {{ p }}
      </button>
    </div>

    <!-- Next -->
    <AppButton
      variant="secondary"
      class="pagination__button"
      @click="$emit('next')"
      :disabled="store.currentPage === store.totalPages"
    >
      Next
      <ArrowRight class="pagination__icon pagination__icon--right" />
    </AppButton>
  </div>
</template>

<script setup>
import AppButton from "./AppButton.vue";
import { ArrowRight, ArrowLeft } from "lucide-vue-next";
import { useDocumentsStore } from "../../stores/useDocumentsStore";

const store = useDocumentsStore();

const props = defineProps({
  pages: { type: Array, default: () => [] },
  current: { type: Number, default: 1 },
});

const emit = defineEmits(["change", "prev", "next"]);

function onClick(p) {
  if (p === "...") return;
  emit("change", Number(p));
}
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.75rem 1.5rem 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  /* Buttons (Prev / Next) */
  &__button {
    width: 100%;

    @media (min-width: 640px) {
      width: auto;
    }
  }

  /* Page numbers container */
  &__numbers {
    display: flex;
    justify-content: center;
    overflow-x: auto;

    @media (min-width: 640px) {
      // gap: 0.5rem;
    }
  }

  /* Individual page number */
  &__number {
    width: 2.5rem;
    height: 2.5rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #717680;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s ease;
    cursor: pointer;
    flex-shrink: 0;

    @media (min-width: 640px) {
      width: 2.5rem;
      height: 2.5rem;
    }

    &:hover:not(&--active):not(&--ellipsis) {
      background: #f3f4f6;
      color: #374151;
    }
  }

  /* Active (current page) */
  &__number--active {
    background: #fafafa;
    color: #414651;
    cursor: default;
  }

  /* Ellipsis (…) */
  &__number--ellipsis {
    color: #9ca3af;
    cursor: default;
  }

  /* Icons */
  &__icon {
    width: 1rem;
    height: 1rem;

    &--left {
      margin-right: 0.25rem;
    }
    &--right {
      margin-left: 0.25rem;
    }
  }
}
</style>
