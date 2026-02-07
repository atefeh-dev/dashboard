<template>
  <input
    v-bind="$attrs"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="app-input"
    :class="{
      'app-input--error': error,
      'app-input--password': password,
    }"
    autocomplete="off"
  />
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  error: { type: Boolean, default: false },
  password: { type: Boolean, default: false },
});

defineEmits(["update:modelValue"]);
</script>

<style scoped lang="scss">
.app-input {
  width: 100%;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d5d1d7;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 400;
  color: #717680;
  background-color: #ffffff;
  transition:
    box-shadow 0.2s,
    border-color 0.2s;
  box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05);

  // ✅ FIX: Remove blue autofill background
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: #717680 !important;
    box-shadow: 0 0 0 30px white inset !important;
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: transparent;
    box-shadow: 0 0 0 2px #6366f1;
  }

  &--password {
    padding-right: 2.5rem;
  }

  // ✅ FIX: Error state properly overrides focus
  &--error {
    border-color: #d5d1d7;

    &:focus {
      box-shadow: 0 0 0 2px #ef4444;
    }

    // ✅ FIX: Remove blue autofill on error state too
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px white inset !important;
      -webkit-text-fill-color: #717680 !important;
      box-shadow: 0 0 0 30px white inset !important;
    }
  }
}
</style>
