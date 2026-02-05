<template>
  <input
    v-bind="$attrs"
    type="date"
    :value="modelValue ?? ''"
    class="app-date-picker"
    :class="{
      'app-date-picker--error': error,
      'app-date-picker--disabled': disabled,
    }"
    :disabled="disabled"
    @input="handleInput"
  />
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  error: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  min: {
    type: String,
    default: "",
  },
  max: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

function handleInput(event) {
  const value = event.target.value;
  emit("update:modelValue", value);
}
</script>

<style scoped lang="scss">
.app-date-picker {
  width: 100%;
  padding: 0.625rem 1rem;
  border: 1px solid #d5d1d7;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #111827;
  background-color: #ffffff;
  cursor: pointer;
  outline: none;
  transition:
    box-shadow 0.2s,
    border-color 0.2s;
  box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05);
  font-family: inherit;

  // Style the calendar icon
  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }
  }

  // Focus state
  &:focus {
    outline: none;
    border-color: transparent;
    box-shadow: 0 0 0 1px #4539cc;
  }

  // Hover state
  &:hover:not(:disabled) {
    border-color: #b5b0b8;
  }

  // Error state
  &--error {
    border-color: #d92d20;

    &:focus {
      box-shadow: 0 0 0 1px #d92d20;
    }
  }

  // Disabled state
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f9fafb;

    &::-webkit-calendar-picker-indicator {
      cursor: not-allowed;
      opacity: 0.3;
    }
  }

  // Placeholder text styling (for browsers that support it)
  &::-webkit-datetime-edit-text {
    color: #9ca3af;
  }

  &::-webkit-datetime-edit-month-field,
  &::-webkit-datetime-edit-day-field,
  &::-webkit-datetime-edit-year-field {
    color: #9ca3af;
  }

  // When date is selected, change color to normal
  &:not(:placeholder-shown) {
    &::-webkit-datetime-edit-month-field,
    &::-webkit-datetime-edit-day-field,
    &::-webkit-datetime-edit-year-field {
      color: #111827;
    }
  }

  // Firefox specific styles
  &::-moz-focus-inner {
    border: 0;
  }
}
</style>
