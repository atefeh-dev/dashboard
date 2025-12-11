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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  border-bottom: 1px solid #e5e7eb;

  @media (max-width: 639px) {
    flex-direction: column;
    padding: 1rem;
  }

  &__info {
    flex: 1;
    min-width: 0; // allows truncation
  }

  &__title {
    font-size: 1rem; // desktop default
    font-weight: 600;
    color: #181d27;
    margin-bottom: 0.5rem;
    line-height: 1.4;

    // Desktop: single line with ellipsis
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    // Tablet / smaller screens: clamp 2 lines
    @media (max-width: 1024px) {
      white-space: normal;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    @media (max-width: 639px) {
      font-size: 0.9375rem;
    }
  }

  &__subtitle {
    font-size: 0.875rem;
    color: #535862;
    line-height: 1.5;

    // Ellipsis / line clamp for all screens
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;

    @media (max-width: 639px) {
      font-size: 0.8125rem;
      line-height: 1.5;
      -webkit-line-clamp: 1; // allow slightly more lines on mobile
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;

    @media (max-width: 639px) {
      width: 100%;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    :deep(button) {
      flex-shrink: 0;

      @media (max-width: 639px) {
        flex: 1;
        font-size: 0.875rem;
        padding: 0.625rem 0.875rem;
      }
    }
  }

  &__icon {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
    flex-shrink: 0;

    @media (max-width: 639px) {
      width: 0.875rem;
      height: 0.875rem;
      margin-right: 0.375rem;
    }
  }
}
</style>
