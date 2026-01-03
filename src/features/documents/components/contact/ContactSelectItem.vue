<template>
  <div class="contact-item" :class="{ 'contact-item--checked': checked }">
    <input
      type="checkbox"
      :id="`contact-${contact.id}`"
      :checked="checked"
      @change="$emit('toggle', contact.id)"
      class="contact-item__checkbox"
    />
    <label :for="`contact-${contact.id}`" class="contact-item__label">
      <span class="contact-item__name">
        {{ contact.name }}
      </span>
      <span class="contact-item__role">
        {{ !isexternal ? contact.role : "Added from contacts" }}
      </span>
    </label>
  </div>
</template>

<script setup>
defineProps({
  contact: { type: Object, required: true },
  checked: { type: Boolean, default: false },
  isexternal: { type: Boolean, default: false },
});

defineEmits(["toggle"]);
</script>

<style scoped lang="scss">
.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: all 0.2s ease;

  &--checked {
    border-color: #4539cc;
  }

  &__checkbox {
    cursor: pointer;
    appearance: auto;
    -webkit-appearance: checkbox;
    -moz-appearance: checkbox;
    width: 16px;
    height: 16px;
  }

  &__label {
    display: flex;
    flex-direction: row;
    gap: 5px;
    cursor: pointer;
  }

  &__name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #414651;
  }

  &__role {
    font-size: 0.875rem;
    color: #535862;
    font-weight: 400;
    display: flex;
    align-items: center;
  }
}
</style>
