<template>
  <div class="flex items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <slot name="left" />
    </div>

    <div class="flex items-center gap-3">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss"></style>
