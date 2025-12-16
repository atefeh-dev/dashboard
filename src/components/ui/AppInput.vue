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
  />
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  error: { type: Boolean, default: false },
  password: { type: Boolean, default: false },
});
</script>

<style scoped lang="scss">
.app-input {
  width: 100%;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  border: 1px solid #d5d1d7;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #111827;
  transition: box-shadow 0.2s, border-color 0.2s;
  box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05);

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

  &--error {
    border-color: #d5d1d7;

    &:focus {
      box-shadow: 0 0 0 2px #ef4444;
    }
  }
}
</style>
