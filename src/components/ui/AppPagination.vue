<template>
  <div
    class="pagination px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4"
  >
    <AppButton
      variant="secondary"
      class="w-full sm:w-auto"
      @click="$emit('prev')"
      :disabled="store.currentPage === 1"
    >
      <ArrowLeft class="w-4 h-4 mr-1" /> Previous
    </AppButton>

    <div class="flex-1 flex justify-center gap-1 sm:gap-2 overflow-x-auto">
      <button
        v-for="(p, idx) in pages"
        :key="idx"
        :disabled="p === '...'"
        @click="onClick(p)"
        :class="[
          'w-8 h-8 sm:w-10 sm:h-10 text-sm font-medium rounded-lg flex items-center justify-center flex-shrink-0 transition',
          p === current ? 'text-gray-600' : 'text-gray-500',
          p !== current && p !== '...' ? 'hover:bg-gray-100' : '',
          p === '...' ? 'text-gray-400 cursor-default' : '',
        ]"
        :style="p === current ? activeStyle : null"
      >
        {{ p }}
      </button>
    </div>

    <AppButton
      variant="secondary"
      class="w-full sm:w-auto"
      @click="$emit('next')"
      :disabled="store.currentPage === store.totalPages"
    >
      Next <ArrowRight class="w-4 h-4 ml-1" />
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

const activeStyle = {
  backgroundColor: "rgb(243 244 246)", // gray-100
  color: "rgb(107 114 128)", // gray-600
};

function onClick(p) {
  if (p === "...") return;
  emit("change", Number(p));
}
</script>

<style scoped lang="scss"></style>
