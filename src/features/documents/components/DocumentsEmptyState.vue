<template>
  <div class="empty-state">
    <!-- Background SVG -->
    <img
      src="../../../assets/icons/common/empty-content.svg"
      class="empty-state__background"
      alt="empty state background"
    />

    <!-- Foreground Content -->
    <div class="empty-state__content">
      <div class="empty-state__icon">
        <EmptyIcon class="empty-state__icon-svg" />
      </div>

      <h3 class="empty-state__title">No document created yet</h3>
      <p class="empty-state__description">
        Here you can manage every document you create and of course we'll take
        care of them.
      </p>

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

  &__background {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 70%;
    max-height: 70%;
    pointer-events: none;
    user-select: none;
    z-index: 0;

    opacity: 1; // lower opacity so it’s faint
    /* Better radial fade */
    -webkit-mask-image: radial-gradient(
      circle at center,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0.8) 40%,
      rgba(0, 0, 0, 0.5) 70%,
      rgba(0, 0, 0, 0) 100%
    );
    mask-image: radial-gradient(
      circle at center,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0.8) 40%,
      rgba(0, 0, 0, 0.5) 70%,
      rgba(0, 0, 0, 0) 100%
    );
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: cover;
    mask-size: cover;
  }

  &__content {
    position: relative;
    width: 100%;
    max-width: 22rem;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    margin-top: auto;
    margin-bottom: auto;

    transform: translateY(-25%);
  }

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

  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #181d27;
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  &__description {
    font-size: 1rem;
    color: #535862;
    line-height: 1.75rem;
    margin-bottom: 2rem;
  }
}
</style>
