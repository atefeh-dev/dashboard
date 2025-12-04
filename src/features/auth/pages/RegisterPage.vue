<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-logo">
        <span class="text-indigo-600 font-bold text-3xl">doclast |</span>
      </div>

      <h1 class="auth-title">Create your new account</h1>
      <p class="auth-subtitle">
        And take back your documents to their sweet home.
      </p>

      <button class="google-btn" @click="handleGoogleLogin">
        <svg class="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      <div class="auth-divider">
        <span>or</span>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-input"
            :class="{ 'input-error': errors.email }"
            placeholder="you@example.com"
            required
            autocomplete="email"
          />
          <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
        </div>

        <div v-if="authStore.error" class="alert-error">
          {{ authStore.error }}
        </div>

        <AppButton
          type="submit"
          variant="primary"
          :disabled="authStore.isLoading"
          class="w-full"
        >
          <span v-if="!authStore.isLoading">Continue</span>
          <span v-else class="flex items-center gap-2">
            <Loader2 class="w-4 h-4 animate-spin" />
            Creating account...
          </span>
        </AppButton>
      </form>

      <div class="auth-footer">
        <p class="text-xs text-gray-500">
          By signing up, you agree to our
          <a href="#" class="text-indigo-600 hover:text-indigo-700"
            >Terms & Privacy</a
          >.
        </p>
        <p class="text-sm text-gray-600">
          Already have an account?
          <router-link
            to="/login"
            class="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Log in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { Loader2 } from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";
import { useAuthStore } from "@/stores/useAuthStore";

const authStore = useAuthStore();

const form = reactive({
  email: "",
});

const errors = reactive({
  email: "",
});

function validateForm() {
  errors.email = "";

  if (!form.email) {
    errors.email = "Email is required";
    return false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email";
    return false;
  }

  return true;
}

async function handleSubmit() {
  if (!validateForm()) return;

  // In real app, this would be a multi-step registration
  // For now, just use a temporary password
  const tempPassword = "TempPass123!";

  await authStore.register(form.email, tempPassword);
}

function handleGoogleLogin() {
  authStore.loginWithGoogle();
}
</script>

<style scoped lang="scss">
.auth-page {
  min-height: 100vh;
  background-color: #f9fafb; /* gray-50 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem; /* py-12 px-4 */
  text-align: left;
}

.auth-container {
  width: 100%;
  max-width: 28rem; /* max-w-md */
}

.auth-logo {
  text-align: center;
  margin-bottom: 2rem; /* mb-8 */
}

.auth-title {
  font-size: 1.5rem; /* text-2xl */
  font-weight: 600; /* font-semibold */
  color: #111827; /* gray-900 */
  margin-bottom: 1.5rem; /* mb-6 */
}

.google-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem; /* gap-3 */
  padding: 0.75rem 1rem; /* px-4 py-3 */
  background-color: #ffffff;
  border: 1px solid #d1d5db; /* gray-300 */
  border-radius: 0.5rem;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500;
  color: #374151; /* gray-700 */
  transition: background-color 0.2s;
}

.google-btn:hover {
  background-color: #f9fafb; /* gray-50 */
}

.auth-divider {
  position: relative;
  margin: 1.5rem 0; /* my-6 */
}

.auth-divider::before,
.auth-divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 100%;
  height: 1px;
  background-color: #d1d5db; /* gray-300 */
}

.auth-divider span {
  position: relative;
  z-index: 10;
  background-color: #f9fafb; /* gray-50 */
  padding: 0 1rem; /* px-4 */
  font-size: 0.875rem; /* text-sm */
  color: #6b7280; /* gray-500 */
  display: block;
  text-align: center;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space-y-4 */
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* space-y-2 */
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151; /* gray-700 */
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.75rem; /* px-3 py-2.5 */
  border: 1px solid #d1d5db; /* gray-300 */
  border-radius: 0.5rem;
  font-size: 0.875rem; /* text-sm */
  color: #111827; /* gray-900 */
  transition: all 0.2s;
}

.form-input::placeholder {
  color: #9ca3af; /* gray-400 */
}

.form-input:focus {
  outline: none;
  border-color: transparent;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 1); /* ring-indigo-500 */
}

.input-error {
  border-color: #ef4444; /* red-500 */
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 1); /* ring-red-500 */
}

.error-message {
  font-size: 0.875rem; /* text-sm */
  color: #dc2626; /* red-600 */
}

.password-toggle {
  position: absolute;
  right: 0.75rem; /* right-3 */
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af; /* gray-400 */
  transition: color 0.2s;
}

.password-toggle:hover {
  color: #4b5563; /* gray-600 */
}

.alert-error {
  padding: 0.75rem 1rem; /* px-4 py-3 */
  background-color: #fef2f2; /* red-50 */
  border: 1px solid #fecaca; /* red-200 */
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #dc2626; /* red-600 */
}

.auth-footer {
  margin-top: 1.5rem; /* mt-6 */
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* space-y-2 */
}
.auth-subtitle {
  font-size: 0.875rem; /* text-sm */
  color: #4b5563; /* text-gray-600 */
  text-align: left;
  margin-bottom: 1.5rem; /* mb-6 */
}
</style>
