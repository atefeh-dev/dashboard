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
          <GoogleDriveIcon />
          {{ buttonLabel }}
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppButton from "@/components/ui/AppButton.vue";
import GoogleDriveAvatar from "../../../assets/images/google-drive-avatar.png";
import GoogleDriveIcon from "../../../assets/icons/common/google_drive.svg";

defineProps({
  image: {
    type: String,
    default: GoogleDriveAvatar,
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
  border: 1px solid #e9eaeb;
  border-left: 0;
  border-radius: 0.75rem;

  // Mobile only - reset border
  @media (max-width: 639px) {
    border-left: 1px solid #e9eaeb;
  }

  &__content {
    display: flex;
    align-items: stretch;
    height: 11rem;

    // Mobile only - below 640px
    @media (max-width: 639px) {
      flex-direction: column;
      height: auto;
    }
  }

  &__image {
    flex-shrink: 0;

    @media (max-width: 639px) {
      width: 100%;
    }
  }

  &__image-wrapper {
    width: 14.938rem;
    height: 100%;
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 639px) {
      width: 100%;
      height: 10rem;
      border-radius: 0;
      border-top-left-radius: 0.75rem;
      border-top-right-radius: 0.75rem;
    }
  }

  &__logo {
    width: 100%;
    height: 100%;
    border-top-left-radius: 0.75rem;
    border-bottom-left-radius: 0.75rem;
    object-fit: fill;

    @media (max-width: 639px) {
      border-bottom-left-radius: 0;
      border-top-right-radius: 0.75rem;
      object-fit: cover;
      object-position: center 20%;
    }
  }

  &__info {
    min-width: 0; // CRITICAL FIX: Allow text to wrap properly
    padding: 1.5rem;

    @media (max-width: 639px) {
      padding: 1.25rem;
    }
  }

  &__title {
    font-size: 1rem;
    font-weight: 600;
    color: #181d27;
    margin-bottom: 0.5rem;
    line-height: 1.4;
    word-wrap: break-word; // optional for large screens

    @media (max-width: 1024px) {
      white-space: normal;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    @media (max-width: 761px) {
      font-size: 0.9375rem;
      white-space: nowrap; // Single line
      overflow: hidden; // Hide overflow
      text-overflow: ellipsis; // Add "..."
    }

    @media (max-width: 639px) {
      font-size: 0.9375rem;
      margin-bottom: 0.625rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__text {
    font-size: 0.875rem;
    color: #535862;
    line-height: 1.6;
    margin-bottom: 1rem;
    word-wrap: break-word;

    // BEST PRACTICE: Use line-clamp to limit text overflow
    display: -webkit-box;
    -webkit-line-clamp: 3; // Show max 3 lines on large screens
    -webkit-box-orient: vertical;
    overflow: hidden;

    // Medium screens (tablet/small desktop) - more restrictive
    @media (max-width: 1319px) {
      -webkit-line-clamp: 2; // Only 2 lines to ensure button stays visible
      font-size: 0.8125rem;
      line-height: 1.5;
    }

    @media (max-width: 639px) {
      font-size: 0.8125rem;
      line-height: 1.5;
      margin-bottom: 1.25rem;
      -webkit-line-clamp: 4; // Allow more lines on mobile since height is auto
    }
  }

  // Button styling - ensure it's always visible
  &__info :deep(button) {
    flex-shrink: 0; // Prevent button from shrinking
    width: auto;

    @media (max-width: 639px) {
      width: 100%;
      justify-content: center;
      font-size: 0.875rem;
    }
  }
}
</style>
