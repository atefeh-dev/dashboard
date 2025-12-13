<template>
  <div class="empty-state">
    <!-- Background SVG -->
    <img
      src="../../../assets/icons/common/empty-content.svg"
      class="empty-state__background"
    />

    <!-- Foreground Content -->
    <div class="empty-state__content">
      <!-- Icon -->
      <div class="empty-state__icon">
        <EmptyIcon class="empty-state__icon-svg" />
      </div>

      <!-- Title -->
      <h3 class="empty-state__title">No document created yet</h3>

      <!-- Description -->
      <p class="empty-state__description">
        Here you can manage every document you create and of course we'll take
        care of them.
      </p>

      <!-- CTA Button -->
      <AppButton
        variant="primary"
        size="md"
        @click="$emit('create')"
        class="empty-state__button"
      >
        <PlusIcon class="empty-state__button-icon" />
        Create your first document
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import AppButton from "@/components/ui/AppButton.vue";
import EmptyIcon from "@/assets/icons/common/export.svg";
import PlusIcon from "../../../assets/icons/common/plus.svg";
import EmptyContentPic from "../../../assets/icons/common/empty-content.svg";

defineEmits(["create"]);
</script>

<style scoped lang="scss">
.empty-state {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 720px;
  padding: 2rem 1rem;

  @media (min-width: 768px) {
    min-height: calc(100vh - 200px);
  }

  // Background SVG - FINAL FIX
  &__background {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // CRITICAL: No width/height = auto-centers based on SVG's intrinsic size
    max-width: 70%;
    max-height: 70%;
    pointer-events: none;
    user-select: none;
    z-index: 0;
    opacity: 0.7;

    color: #e9eaeb;

    /* Radial fade mask */
    -webkit-mask-image: radial-gradient(
      circle,
      circle,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 1) 40%,
      rgba(0, 0, 0, 0.6) 60%,
      rgba(0, 0, 0, 0.2) 75%,
      rgba(0, 0, 0, 0) 100%
    );
    mask-image: radial-gradient(
      circle,
      circle,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 1) 40%,
      rgba(0, 0, 0, 0.6) 60%,
      rgba(0, 0, 0, 0.2) 75%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  // Foreground Content
  &__content {
    position: relative;
    width: 100%;
    max-width: 22rem;
    z-index: 10;
    margin-top: 19%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  // Icon Container
  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.5rem;
    height: 3.5rem;
    margin-bottom: 1.25rem;
    background-color: #ffffff;
    border: 1px solid #d5d7da;
    border-radius: 0.75rem;
    box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05);
  }

  &__icon-svg {
    width: 1.75rem;
    height: 1.75rem;
    margin-left: 0.313rem;
  }

  // Title
  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #181d27;
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  // Description
  &__description {
    font-size: 1rem;
    color: #535862;
    line-height: 1.75rem;
    margin-bottom: 2rem;
  }
}
</style>
