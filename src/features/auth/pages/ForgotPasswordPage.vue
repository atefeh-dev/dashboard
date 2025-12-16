<template>
  <AuthLayout
    title="Send password Reset code"
    subtitle="We'll send a 4-digit reset code to your email."
    :showGoogleButton="false"
    :showDivider="false"
    :isLoading="authStore.isLoading"
  >
    <!-- Form Content -->
    <form @submit.prevent="onSubmit" class="auth-form">
      <!-- Email -->
      <div class="auth-form__field">
        <label for="email" class="auth-form__label">Email</label>

        <Field name="email" v-slot="{ field, meta }">
          <AppInput
            v-bind="field"
            id="email"
            type="email"
            placeholder="you@example.com"
            :error="meta.touched && meta.invalid"
          />
        </Field>

        <ErrorMessage name="email" class="auth-form__error" />
      </div>

      <!-- Success Alert -->
      <div v-if="success" class="auth-form__alert auth-form__alert--success">
        Reset code sent! Redirecting...
      </div>

      <!-- Error Alert -->
      <div v-if="authStore.error" class="auth-form__alert">
        {{ authStore.error }}
      </div>

      <!-- Submit Button -->
      <AppButton
        type="submit"
        variant="primary"
        :disabled="authStore.isLoading"
        :loading="authStore.isLoading"
        class="auth-form__submit"
      >
        <span v-if="!authStore.isLoading">Send</span>
        <span v-else class="auth-form__loading">
          <Loader2 class="auth-form__loading-icon" />
          Sending...
        </span>
      </AppButton>
    </form>

    <!-- Footer -->
    <template #footer>
      <div class="auth-footer">
        <p class="auth-footer__text">
          Back to
          <router-link to="/login" class="auth-footer__link">
            Login
          </router-link>
        </p>
      </div>
    </template>
  </AuthLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { Loader2 } from "lucide-vue-next";

import AppButton from "@/components/ui/AppButton.vue";
import AppInput from "@/components/ui/AppInput.vue";
import AuthLayout from "../layouts/AuthLayout.vue";
import { useAuthStore } from "@/stores/useAuthStore";

const authStore = useAuthStore();
const router = useRouter();
const success = ref(false);

/* Validation */
const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
});

/* Form */
const { handleSubmit } = useForm({
  validationSchema: schema,
});

/* Submit */
const onSubmit = handleSubmit(async (values) => {
  const result = await authStore.sendPasswordReset(values.email);

  if (result?.success) {
    success.value = true;

    localStorage.setItem("reset_email", values.email);

    setTimeout(() => {
      router.push({
        name: "ResetPassword",
        query: { email: values.email },
      });
    }, 1500);
  }
});
</script>

<style scoped lang="scss">
@use "../styles/auth.scss";
</style>
