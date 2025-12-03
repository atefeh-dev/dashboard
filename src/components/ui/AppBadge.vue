<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    :type="type"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (value) =>
      ["primary", "secondary", "ghost", "danger"].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
  type: {
    type: String,
    default: "button",
  },
});

defineEmits(["click"]);

const buttonClasses = computed(() => {
  return [
    "btn",
    `btn-${props.variant}`,
    `btn-${props.size}`,
    {
      "btn-disabled": props.disabled,
    },
  ];
});
</script>

<style scoped lang="scss">
// Component uses global .btn classes from components.scss
// Add only component-specific overrides here if needed
</style>
