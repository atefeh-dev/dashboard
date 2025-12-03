<template>
  <div class="table-wrapper">
    <table class="table">
      <thead>
        <tr>
          <th v-for="(col, i) in columns" :key="i">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  columns: { type: Array, default: () => [] },
});
</script>

<style scoped lang="scss"></style>
