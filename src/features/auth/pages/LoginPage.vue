<template>
  <AuthLayout
    title="Welcome back"
    :isLoading="authStore.isLoading"
    @google-login="handleGoogleLogin"
  >
    <!-- Form Content -->
    <form @submit="onSubmit" class="auth-form">
      <!-- Email -->
      <div class="auth-form__field">
        <label for="email" class="auth-form__label">Email</label>
        <Field v-slot="{ field, meta }" name="email" v-model="formValues.email">
          <AppInput
            v-bind="field"
            id="email"
            type="email"
            placeholder="you@example.com"
            :error="!meta.valid && meta.touched"
          />
        </Field>
        <ErrorMessage name="email" class="auth-form__error" />
      </div>

      <!-- Password -->
      <div class="auth-form__field">
        <label for="password" class="auth-form__label">Password</label>
        <div class="auth-form__password-wrapper">
          <Field
            v-slot="{ field, meta }"
            name="password"
            v-model="formValues.password"
          >
            <AppInput
              v-bind="field"
              id="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              :password="true"
              :error="!meta.valid && meta.touched"
            />
          </Field>
        </div>
        <ErrorMessage name="password" class="auth-form__error" />
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
        <span v-if="!authStore.isLoading">Continue</span>
        <span v-else class="auth-form__loading">
          <Loader2 class="auth-form__loading-icon" />
          Signing in...
        </span>
      </AppButton>
    </form>

    <!-- Footer -->
    <template #footer>
      <div class="auth-footer">
        <p class="auth-footer__text">
          Don't have an account yet?
          <router-link to="/signup" class="auth-footer__link">
            Sign up
          </router-link>
        </p>
        <p class="auth-footer__text">
          Forgot password?
          <router-link to="/forgot-password" class="auth-footer__link">
            Reset
          </router-link>
        </p>
      </div>
    </template>
  </AuthLayout>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { useForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { Eye, EyeOff, Loader2 } from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";
import AppInput from "@/components/ui/AppInput.vue";
import AuthLayout from "../layouts/AuthLayout.vue";
import { useAuthStore } from "@/stores/useAuthStore";

const authStore = useAuthStore();
const isDev = computed(() => import.meta.env.MODE === "development");
const showPassword = ref(false);

// Validation schema
const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Password must be at least 5 characters"),
});

// Form values
const formValues = reactive({
  email: isDev.value ? "admin@admin.com" : "",
  password: isDev.value ? "admin" : "",
});

// Setup form with VeeValidate
const { handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: formValues,
});

// Submit handler
const onSubmit = handleSubmit(async (values) => {
  await authStore.login(values.email, values.password);
});

function handleGoogleLogin() {
  authStore.loginWithGoogle();
}
</script>

<style scoped lang="scss">
@use "../styles/auth.scss";
</style>
