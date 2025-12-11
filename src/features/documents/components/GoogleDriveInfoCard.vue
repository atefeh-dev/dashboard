<template>
  <div class="gdrive-card">
    <div class="gdrive-card__content">
      <!-- Image -->
      <div class="gdrive-card__image">
        <div class="gdrive-card__image-wrapper">
          <img :src="image" alt="Google Drive" class="gdrive-card__logo" />
        </div>
      </div>

      <!-- Text -->
      <div class="gdrive-card__info">
        <h3 class="gdrive-card__title">{{ title }}</h3>
        <p class="gdrive-card__text">{{ description }}</p>

        <AppButton variant="secondary" size="md" @click="$emit('connect')">
          {{ buttonLabel }}
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppButton from "@/components/ui/AppButton.vue";

defineProps({
  image: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/4/4e/Google_Drive_logo_2013.png",
  },
  title: {
    type: String,
    default: "We don't store any document's files on our server",
  },
  description: {
    type: String,
    default:
      "DocLast does not store documents on its servers to ensure your security. Therefore, if you need to store your documents, you can connect your workspace to Google Drive to access all your files in your own place.",
  },
  buttonLabel: {
    type: String,
    default: "Connect to Google Drive",
  },
});
</script>

<style scoped lang="scss">
.gdrive-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;

  &__content {
    display: flex;
    gap: 1.5rem;
    align-items: center;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__image {
    flex-shrink: 0;
  }

  &__image-wrapper {
    width: 11rem;
    height: 11rem;
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 1rem;
  }

  &__info {
    flex: 1;
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  &__text {
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 1rem;
  }
}
</style>
