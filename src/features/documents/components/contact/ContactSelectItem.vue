<template>
  <div class="contact-item" :class="{ 'contact-item--checked': checked }">
    <AppCheckbox
      :id="`contact-${contact.id}`"
      :model-value="checked"
      @update:modelValue="$emit('toggle', contact.id)"
    >
      <span class="contact-item__text">
        <span class="contact-item__name">
          {{ contact.name }}
        </span>
        <span class="contact-item__role">
          {{ !isexternal ? contact.role : "Added from contacts" }}
        </span>
      </span>
    </AppCheckbox>
  </div>
</template>
<script setup>
import AppCheckbox from "@/components/ui/AppCheckbox.vue";

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
  padding: 1rem;
  background-color: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: all 0.2s ease;

  &--checked {
    border-color: #4539cc;
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
