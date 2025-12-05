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
          Reset code sent! Redirecting...
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
import { useRouter } from "vue-router";
import { Loader2 } from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";
import { useAuthStore } from "@/stores/useAuthStore";

const authStore = useAuthStore();
const router = useRouter();
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

    // Store email for next step
    localStorage.setItem("reset_email", form.email);

    // Redirect to reset password verification page
    setTimeout(() => {
      router.push({
        name: "ResetPassword",
        query: { email: form.email },
      });
    }, 1500);
  }
}
</script>

<style scoped lang="scss"></style>
