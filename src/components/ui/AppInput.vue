<template>
  <input
    v-bind="$attrs"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="app-input"
  />
</template>

<script setup>
const props = defineProps({
  modelValue: [String, Number],
});
</script>

<style scoped lang="scss"></style>
