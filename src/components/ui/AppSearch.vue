<template>
  <div class="input">
    <div class="input__icon">
      <slot name="icon">
        <svg v-if="false" />
      </slot>
    </div>

    <input
      type="text"
      class="input__field"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "Search..." },
});
</script>

<style scoped lang="scss">
.input {
  position: relative;
  width: 100%;

  &__icon {
    position: absolute;
    left: 0.75rem; // 12px
    top: 50%;
    width: 20px;
    height: 20px;
    transform: translateY(-50%);
    color: #9ca3af; // gray-400
    pointer-events: none;
    display: flex;
    align-items: center;
  }

  &__field {
    width: 100%;
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    border: 1px solid #d1d5db; // gray-300
    border-radius: 0.5rem; // 8px
    font-size: 0.875rem; // 14px
    outline: none;
    transition: all 0.2s ease;

    &::placeholder {
      color: #9ca3af;
    }

    &:focus {
      border-color: #9ca3af; // gray-400
      box-shadow: 0 0 0 2px rgba(156, 163, 175, 0.2);
    }
  }
}
</style>
