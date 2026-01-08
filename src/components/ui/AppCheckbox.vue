<template>
  <div class="app-checkbox">
    <input
      :id="id"
      type="checkbox"
      class="app-checkbox__input"
      :checked="modelValue"
      :disabled="disabled"
      @change="$emit('update:modelValue', $event.target.checked)"
    />

    <label :for="id" class="app-checkbox__label">
      <span class="app-checkbox__box">
        <CheckIcon v-if="modelValue" class="app-checkbox__icon" />
      </span>

      <span class="app-checkbox__text">
        <slot />
      </span>
    </label>
  </div>
</template>

<script setup>
import CheckIcon from "@/assets/icons/common/check.svg";

defineProps({
  modelValue: Boolean,
  disabled: Boolean,
  id: {
    type: String,
    required: true,
  },
});

defineEmits(["update:modelValue"]);
</script>

<style scoped lang="scss">
.app-checkbox {
  display: flex;
  align-items: center;

  &__input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &__label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
  }

  &__box {
    width: 16px;
    height: 16px;
    border: 2px solid #d1d5db;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    .app-checkbox__input:checked + .app-checkbox__label & {
      background-color: #4539cc;
      border-color: #4539cc;
    }

    .app-checkbox__input:disabled + .app-checkbox__label & {
      opacity: 0.5;
    }
  }

  &__icon {
    width: 12px;
    height: 12px;
    color: white;
  }

  &__text {
    font-size: 0.875rem;
    font-weight: 500;
    color: #414651;

    .app-checkbox__input:disabled + .app-checkbox__label & {
      opacity: 0.5;
    }
  }
}
</style>
