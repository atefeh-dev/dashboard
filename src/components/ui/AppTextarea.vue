<template>
  <textarea
    v-bind="$attrs"
    :value="modelValue"
    class="app-textarea"
    :class="{
      'app-textarea--error': error,
    }"
    @input="$emit('update:modelValue', $event.target.value)"
  ></textarea>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  error: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["update:modelValue"]);
</script>

<style scoped lang="scss">
.app-textarea {
  width: 100%;
  padding: 0.75rem 0.875rem;
  border: 1px solid #d5d7da;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  line-height: 1.5;
  resize: vertical;
  color: #717680;
  outline: none;
  transition: all 0.2s;
  box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05);

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border: 2px solid #4539cc;
    // box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &--error {
    border-color: #d5d1d7;

    &:focus {
      border: 2px dashed #d92d20;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  }
}
</style>
