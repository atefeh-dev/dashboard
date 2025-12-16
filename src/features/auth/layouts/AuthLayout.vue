<template>
  <div class="auth-layout">
    <div class="auth-layout__container">
      <!-- Logo -->
      <div class="auth-layout__logo">
        <DoclastLogo />
      </div>

      <!-- Title -->
      <h2 class="auth-layout__title">{{ title }}</h2>

      <!-- Subtitle (optional) -->
      <p v-if="subtitle" class="auth-layout__subtitle">{{ subtitle }}</p>

      <!-- Google Button -->
      <AppButton
        v-if="showGoogleButton"
        variant="ghost"
        :disabled="isLoading"
        class="auth-layout__google-btn"
        @click="$emit('google-login')"
      >
        <GoogleIcon />
        <span>Continue with Google</span>
      </AppButton>

      <!-- Divider -->
      <div v-if="showDivider" class="auth-layout__divider">
        <div class="auth-layout__divider-line"></div>
        <span class="auth-layout__divider-text">or</span>
      </div>

      <!-- Form Content (slot) -->
      <div class="auth-layout__content">
        <slot />
      </div>

      <!-- Footer Links (slot) -->
      <div class="auth-layout__footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
import AppButton from "@/components/ui/AppButton.vue";
import GoogleIcon from "@/assets/icons/common/google.svg";
import DoclastLogo from "@/assets/icons/logo/doclast-logo.svg";

defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: null,
  },
  showGoogleButton: {
    type: Boolean,
    default: true,
  },
  showDivider: {
    type: Boolean,
    default: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["google-login"]);
</script>

<style scoped lang="scss">
.auth-layout {
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;

  @media (max-width: 639px) {
    padding: 2rem 1rem;
  }

  &__container {
    width: 100%;
    max-width: 18.75rem;
  }

  &__logo {
    text-align: left;
    margin-bottom: 2.5rem;

    svg {
      display: inline-block;
    }
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #000000;
    text-align: left;
    margin-bottom: 1.5rem;
    line-height: 1.3;

    @media (max-width: 639px) {
      font-size: 1.375rem;
    }
  }

  &__subtitle {
    font-size: 1rem;
    color: #717680;
    font-weight: 600;
    text-align: left;
    margin-bottom: 1.25rem;
    line-height: 1.5;
  }

  &__google-btn {
    width: 100%;
    margin-bottom: 0;
  }

  &__divider {
    position: relative;
    margin: 1.25rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__divider-line {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #d1d5db;
    transform: translateY(-50%);
  }

  &__divider-text {
    position: relative;
    padding: 0 1rem;
    background-color: #f9fafb;
    color: #181d27;
    font-size: 1rem;
    font-weight: 600;
  }

  &__footer {
    margin-top: 1.25rem;
  }
}
</style>
