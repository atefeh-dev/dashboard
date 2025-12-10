<template>
  <div class="stats">
    <div v-for="(s, i) in stats" :key="i" class="stats__item">
      <div class="stats__label">{{ s.label }}</div>
      <div class="stats__value">{{ s.value }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  stats: { type: Array, default: () => [] },
});
</script>

<style scoped lang="scss">
.stats {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem; // 16px
  margin-bottom: 1.25rem; // 20px

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }

  &__item {
    background: #ffffff;
    padding: 1.5rem; // 24px
    border-radius: 0.5rem; // 8px
    border: 1px solid #e5e7eb; // gray-200
  }

  &__label {
    font-size: 0.875rem; // 14px
    color: #4b5563; // gray-600
    margin-bottom: 0.5rem; // 8px
  }

  &__value {
    font-size: 1.875rem; // 30px
    font-weight: 600;
    color: #111827; // gray-900
  }
}
</style>
