<template>
  <div class="documents-header">
    <div class="documents-header__info">
      <h2 class="documents-header__title">{{ title }}</h2>
      <p class="documents-header__subtitle">{{ subtitle }}</p>
    </div>

    <div class="documents-header__actions">
      <AppButton variant="ghost" size="md" @click="$emit('import')">
        <Upload class="documents-header__icon" />
        Import / Export
      </AppButton>

      <AppButton variant="primary" size="md" @click="$emit('create')">
        <Plus class="documents-header__icon" />
        New document
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import AppButton from "@/components/ui/AppButton.vue";
import { Upload, Plus } from "lucide-vue-next";

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
});
</script>

<style scoped lang="scss">
.documents-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  &__info {
    flex: 1;
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
  }

  &__subtitle {
    font-size: 0.875rem;
    color: #6b7280;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    @media (max-width: 768px) {
      width: 100%;
      flex-direction: column;
    }
  }

  &__icon {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }
}
</style>
