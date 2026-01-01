<template>
  <select
    v-bind="$attrs"
    :value="modelValue ?? ''"
    class="app-select"
    @change="handleChange"
  >
    <!-- Placeholder ONLY when no value -->
    <option v-if="!modelValue && placeholder" value="" disabled>
      {{ placeholder }}
    </option>

    <slot />
  </select>
</template>

<script setup>
const props = defineProps({
  modelValue: [String, Number],
  placeholder: {
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
});

const emit = defineEmits(["update:modelValue"]);

function handleChange(event) {
  const value = event.target.value;
  emit("update:modelValue", value);
}
</script>

<style scoped lang="scss">
.app-select {
  width: 100%;
  padding: 0.625rem 2.5rem 0.625rem 1rem;
  border: 1px solid #d5d1d7;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #111827;
  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  cursor: pointer;
  outline: none;
  appearance: none;
  transition: box-shadow 0.2s, border-color 0.2s;
  box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05);

  &:focus {
    outline: none;
    border-color: transparent;
    box-shadow: 0 0 0 1px #4539cc;
  }

  &--error {
    border-color: #d92d20;

    &:focus {
      box-shadow: 0 0 0 1px #d92d20;
    }
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f9fafb;
  }

  // Style placeholder text differently
  &--placeholder {
    color: #9ca3af;
  }
}
</style>
