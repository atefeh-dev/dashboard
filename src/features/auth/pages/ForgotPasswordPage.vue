<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-logo">
        <span class="text-indigo-600 font-bold text-3xl">doclast |</span>
      </div>

      <h1 class="auth-title">Send password Reset code</h1>
      <p class="auth-subtitle">
        We'll send a 4-digit reset code to your email.
      </p>

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

        <!-- Success message -->
        <div v-if="success" class="alert-success">
          Reset code sent! Check your email.
        </div>

        <!-- Error message -->
        <div v-if="authStore.error" class="alert-error">
          {{ authStore.error }}
        </div>

        <AppButton
          type="submit"
          variant="primary"
          :disabled="authStore.isLoading"
          class="w-full"
        >
          <span v-if="!authStore.isLoading">Send</span>
          <span v-else class="flex items-center gap-2">
            <Loader2 class="w-4 h-4 animate-spin" />
            Sending...
          </span>
        </AppButton>
      </form>

      <div class="auth-footer">
        <router-link
          to="/login"
          class="text-sm text-gray-600 hover:text-gray-900"
        >
          Back to
          <span class="text-indigo-600 hover:text-indigo-700 font-medium"
            >Login</span
          >
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Loader2 } from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";
import { useAuthStore } from "@/stores/useAuthStore";

const authStore = useAuthStore();
const success = ref(false);

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

  const result = await authStore.sendPasswordReset(form.email);

  if (result.success) {
    success.value = true;
    // In real app, redirect to verification code page
    setTimeout(() => {
      // router.push('/reset-password-verify');
    }, 2000);
  }
}
</script>

<style scoped lang="scss">
.auth-page {
  min-height: 100vh;
  background-color: #f9fafb; /* gray-50 */
  display: flex;
  align-items: center;
  justify-content: celnter;
  padding: 3rem 1rem; /* py-12 px-4 */
}

.auth-container {
  width: 100%;
  max-width: 28rem; /* max-w-md */
}

.auth-logo {
  text-align: left;
  margin-bottom: 2rem;
}

.auth-title {
  font-size: 1.5rem; /* text-2xl */
  font-weight: 600; /* font-semibold */
  color: #111827; /* gray-900 */
  text-align: left;
  margin-bottom: 0.5rem; /* mb-2 */
}

.auth-subtitle {
  font-size: 0.875rem; /* text-sm */
  color: #4b5563; /* gray-600 */
  text-align: left;
  margin-bottom: 1.5rem; /* mb-6 */
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
  font-size: 0.875rem; /* text-sm */
  font-weight: 500;
  color: #374151; /* gray-700 */
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.75rem; /* px-3 py-2.5 */
  border: 1px solid #d1d5db; /* gray-300 */
  border-radius: 0.5rem; /* rounded-lg */
  font-size: 0.875rem;
  color: #111827; /* gray-900 */
  transition: all 0.2s;
}

.form-input::placeholder {
  color: #9ca3af; /* gray-400 */
}

.form-input:focus {
  outline: none;
  border-color: transparent;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 1); /* ring-2 ring-indigo-500 */
}

.input-error {
  border-color: #ef4444; /* red-500 */
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 1); /* red ring */
}

.error-message {
  font-size: 0.875rem;
  color: #dc2626; /* red-600 */
}

.alert-success {
  padding: 0.75rem 1rem; /* px-4 py-3 */
  background-color: #ecfdf5; /* green-50 */
  border: 1px solid #bbf7d0; /* green-200 */
  border-radius: 0.5rem; /* rounded-lg */
  font-size: 0.875rem; /* text-sm */
  color: #16a34a; /* green-600 */
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
}
</style>
