<template>
  <div
    class="pagination px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4"
  >
    <app-button
      class="btn btn-secondary w-full sm:w-auto"
      @click="$emit('prev')"
    >
      <ArrowLeft class="w-4 h-4" />
      <span>Previous</span>
    </app-button>

    <div class="flex gap-1 sm:gap-2 overflow-x-auto">
      <button
        v-for="(p, idx) in pages"
        :key="idx"
        :disabled="p === '...'"
        @click="onClick(p)"
        :class="[
          'w-8 h-8 sm:w-10 sm:h-10 text-sm font-medium rounded-lg flex-shrink-0 flex items-center justify-center transition',

          // ACTIVE — text darker, NO hover
          p === current ? 'text-gray-600' : 'text-gray-500',

          // INACTIVE — hover only for non-active, non-ellipsis
          p !== current && p !== '...' ? 'hover:bg-gray-100' : '',

          // ELLIPSIS
          p === '...' ? 'text-gray-400 cursor-default' : '',
        ]"
        :style="p === current ? activeStyle : null"
      >
        {{ p }}
      </button>
    </div>

    <app-button @click="$emit('next')" variant="secondary">
      <span>Next</span>
      <ArrowRight class="w-4 h-4" />
    </app-button>
  </div>
</template>

<script setup>
import AppButton from "./AppButton.vue";
import {
  ArrowRight as ArrowRight,
  ArrowLeft as ArrowLeft,
} from "lucide-vue-next";

const props = defineProps({
  pages: { type: Array, default: () => [] },
  current: { type: Number, default: 1 },
});

const emit = defineEmits(["change", "prev", "next"]);

// ACTIVE colors EXACTLY as requested
const activeStyle = {
  backgroundColor: "rgb(243 244 246)", // gray-100
  color: "rgb(107 114 128)", // gray-600
};

function onClick(p) {
  if (p === "...") return;
  const num = Number(p);
  if (!Number.isNaN(num)) emit("change", num);
}
</script>

<style scoped lang="scss"></style>
