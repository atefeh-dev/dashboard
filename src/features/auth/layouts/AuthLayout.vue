<template>
  <div class="auth-layout">
    <div class="auth-layout__container">
      <!-- Logo -->
      <div class="auth-layout__logo">
        <DoclastLogo />
      </div>

      <!-- Title -->
      <h2
        class="auth-layout__title"
        :class="{ 'auth-layout__title--forgot': variant === 'forgot' }"
      >
        {{ title }}
      </h2>

      <!-- Subtitle (optional) -->
      <p
        v-if="subtitle"
        class="auth-layout__subtitle"
        :class="{ 'auth-layout__subtitle--forgot': variant === 'forgot' }"
      >
        {{ subtitle }}
      </p>

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
        <span v-if="dividerText" class="auth-layout__divider-text">
          {{ dividerText }}
        </span>
      </div>

      <!-- Form Content -->
      <div class="auth-layout__content">
        <slot />
      </div>

      <!-- Footer -->
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
  dividerText: {
    type: String,
    default: "or",
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: "", // ""| forgot
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
    color: #000;
    text-align: left;
    margin-bottom: 1.5rem;
    line-height: 1.3;

    @media (max-width: 639px) {
      font-size: 1.375rem;
    }

    &--forgot {
      margin-bottom: 0.625rem;
    }
  }

  &__subtitle {
    font-size: 0.875rem;
    color: #4b5563;
    text-align: left;
    margin-bottom: 1.5rem;
    line-height: 1.5;

    &--forgot {
      font-size: 1rem;
      font-weight: 600;
      color: #717680;
      margin-bottom: 1.25rem;
    }
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
    inset: 0;
    height: 1px;
    margin: auto 0;
    background-color: #d1d5db;
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
