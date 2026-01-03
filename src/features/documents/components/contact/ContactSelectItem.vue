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
      <span class="contact-item__check-wrapper">
        <CheckIcon v-if="checked" class="contact-item__check-icon" />
      </span>
      <span class="contact-item__text">
        <span class="contact-item__name">
          {{ contact.name }}
        </span>
        <span class="contact-item__role">
          {{ !isexternal ? contact.role : "Added from contacts" }}
        </span>
      </span>
    </label>
  </div>
</template>

<script setup>
import CheckIcon from "@/assets/icons/common/check.svg"; // Update path to your icon

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

  // Hide the default checkbox
  &__checkbox {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    width: 0;
    height: 0;
  }

  &__label {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    flex: 1;
  }

  // Custom checkbox wrapper
  &__check-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    border: 2px solid #d1d5db;
    border-radius: 4px;
    background-color: #ffffff;
    transition: all 0.2s ease;

    // When checked, change background
    .contact-item__checkbox:checked + .contact-item__label & {
      background-color: #4539cc;
      border-color: #4539cc;
    }

    // Hover effect
    .contact-item__label:hover & {
      border-color: #9ca3af;
    }

    .contact-item__checkbox:checked + .contact-item__label:hover & {
      background-color: #5145d4;
      border-color: #5145d4;
    }
  }

  // Custom check icon
  &__check-icon {
    width: 12px;
    height: 12px;
    color: #ffffff;
    animation: checkAppear 0.2s ease;
  }

  @keyframes checkAppear {
    from {
      opacity: 0;
      transform: scale(0.5);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  &__text {
    display: flex;
    flex-direction: row;
    gap: 5px;
    flex: 1;
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
