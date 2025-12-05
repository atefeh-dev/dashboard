<template>
  <component
    :is="componentType"
    :class="buttonClasses"
    :disabled="isDisabled"
    :type="buttonType"
    :to="to"
    :href="href"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  // Variant
  variant: {
    type: String,
    default: "primary",
    validator: (value) =>
      ["primary", "secondary", "ghost", "danger"].includes(value),
  },

  // State
  disabled: {
    type: Boolean,
    default: false,
  },

  // Loading state
  loading: {
    type: Boolean,
    default: false,
  },

  // Size
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },

  // Button type
  type: {
    type: String,
    default: "button",
  },

  // Router link
  to: {
    type: [String, Object],
    default: null,
  },

  // External link
  href: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["click"]);

// Determine component type
const componentType = computed(() => {
  if (props.to) return RouterLink;
  if (props.href) return "a";
  return "button";
});

// Button type (only for actual buttons)
const buttonType = computed(() => {
  if (componentType.value === "button") return props.type;
  return undefined;
});

// Disabled state
const isDisabled = computed(() => {
  if (componentType.value !== "button") return undefined;
  return props.disabled || props.loading;
});

// Button classes
const buttonClasses = computed(() => {
  return [
    "btn",
    `btn-${props.variant}`,
    `btn-${props.size}`,
    {
      "btn-disabled": props.disabled || props.loading,
      "btn-loading": props.loading,
    },
  ];
});

// Click handler
function handleClick(event) {
  if (props.disabled || props.loading) {
    event.preventDefault();
    return;
  }
  emit("click", event);
}
</script>

<style lang="scss">
/* Button uses global .btn classes from components.scss */
</style>
