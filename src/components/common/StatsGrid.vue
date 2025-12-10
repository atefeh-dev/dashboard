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
  gap: 8px;
  margin-bottom: 1.25rem; // 20px

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }

  &__item {
    background: #ffffff;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid #e9eaeb;
    box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05);
  }

  &__label {
    font-size: 0.875rem; // 14px
    color: #535862; // gray-600
    font-weight: 500;
  }

  &__value {
    font-size: 1.875rem; // 30px
    font-weight: 600;
    color: #181d27; // gray-900
  }
}
</style>
