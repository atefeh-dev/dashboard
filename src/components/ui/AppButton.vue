<template>
  <button
    :class="[
      'btn',
      `btn-${variant}`,
      { 'opacity-50 cursor-not-allowed': disabled },
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: "primary" },
  disabled: { type: Boolean, default: false },
});
</script>
<style lang="scss">
/* NO scoped - let global styles apply */
</style>
