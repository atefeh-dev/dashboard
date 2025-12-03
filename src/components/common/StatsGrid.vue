<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
    <div
      v-for="(s, i) in stats"
      :key="i"
      class="bg-white p-6 rounded-lg border border-gray-200"
    >
      <div class="text-sm text-gray-600 mb-2">{{ s.label }}</div>
      <div class="text-3xl font-semibold text-gray-900">{{ s.value }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  stats: { type: Array, default: () => [] },
});
</script>

<style scoped lang="scss"></style>
