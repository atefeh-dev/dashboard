<template>
  <div class="stats">
    <div v-for="(s, i) in stats" :key="i" class="stats__item">
      <div class="stats__label">{{ s.label }}</div>
      <div class="stats__value">{{ s.value }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: { type: Array, default: () => [] },
});
</script>

<style scoped lang="scss">
.stats {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }

  &__item {
    background: #ffffff;
    padding: 1.3rem;
    border-radius: 0.75rem;
    border: 1px solid #e9eaeb;
    box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05);

    /* ✅ KEY FIX */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 96px; // keeps cards visually equal
  }

  &__label {
    font-size: 0.875rem;
    color: #535862;
    font-weight: 500;
    line-height: 1.25rem;

    /* allow wrap, no forced height */
    word-break: break-word;
  }

  &__value {
    font-size: 1.875rem;
    font-weight: 600;
    color: #181d27;
  }
}
</style>
