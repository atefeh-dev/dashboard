<template>
  <div class="documents-header">
    <div class="documents-header__info">
      <h2 class="documents-header__title">{{ title }}</h2>
      <p class="documents-header__subtitle">{{ subtitle }}</p>
    </div>

    <div class="documents-header__actions">
      <AppButton variant="ghost" size="md" @click="$emit('import')">
        <UploadCloudIcon class="documents-header__icon" />
        Import / Export
      </AppButton>

      <AppButton variant="primary" size="md" @click="$emit('create')">
        <PlusIcon class="documents-header__icon" />
        New document
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import AppButton from "@/components/ui/AppButton.vue";
import UploadCloudIcon from "@/assets/icons/common/upload-cloude.svg";
import PlusIcon from "@/assets/icons/common/plus.svg";

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
});
</script>

<style scoped lang="scss">
.documents-header {
  padding: 1.25rem;
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
    color: #181027;
  }

  &__subtitle {
    font-size: 0.875rem;
    color: #535862;
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
