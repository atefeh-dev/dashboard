<template>
  <div
    class="app-input-prefix"
    :class="{
      'app-input-prefix--error': error,
      'app-input-prefix--focused': isFocused,
    }"
  >
    <span class="app-input-prefix__prefix">{{ prefix }}</span>
    <input
      v-bind="$attrs"
      :value="modelValue"
      class="app-input-prefix__field"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="isFocused = true"
      @blur="isFocused = false"
      autocomplete="new-password"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  modelValue: [String, Number],
  prefix: {
    type: String,
    required: true,
  },
  error: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["update:modelValue"]);

const isFocused = ref(false);
</script>

<style scoped lang="scss">
.app-input-prefix {
  display: flex;
  align-items: stretch;
  width: 100%;
  border: 1px solid #d5d1d7;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: #ffffff;
  transition:
    box-shadow 0.2s,
    border-color 0.2s;
  box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05);

  &--focused {
    outline: none;
    border-color: transparent;
    box-shadow: 0 0 0 2px #6366f1;
  }

  &--error {
    border-color: #d5d1d7;

    &.app-input-prefix--focused {
      box-shadow: 0 0 0 2px #ef4444;
    }
  }

  &__prefix {
    display: flex;
    align-items: center;
    padding: 0.625rem 0.75rem 0.625rem 0.875rem;
    font-size: 0.875rem;
    color: #535862;
    /* background-color: #f9fafb; */
    border-right: 1px solid #d5d7da;
    white-space: nowrap;
  }

  &__field {
    flex: 1;
    padding: 0.625rem 0.875rem;
    border: none;
    font-size: 1rem;
    color: #717680;
    font-weight: 400;
    background: transparent;
    outline: none;
    min-width: 0;

    &::placeholder {
      color: #9ca3af;
    }
  }
}
</style>
