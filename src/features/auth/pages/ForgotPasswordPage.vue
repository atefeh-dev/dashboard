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

      <form @submit="onSubmit" class="auth-form">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <Field
            id="email"
            name="email"
            type="email"
            v-model="email"
            class="form-input"
            :class="{ 'input-error': errors.email }"
            placeholder="you@example.com"
            autocomplete="email"
          />
          <ErrorMessage name="email" class="error-message" />
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { Loader2 } from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";
import { useAuthStore } from "@/stores/useAuthStore";

const authStore = useAuthStore();
const router = useRouter();
const success = ref(false);

// Validation schema
const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
});

// Setup form with VeeValidate
const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schema,
});

// Define field with two-way binding
const [email] = defineField("email");

// Submit handler
const onSubmit = handleSubmit(async (values) => {
  const result = await authStore.sendPasswordReset(values.email);

  if (result.success) {
    success.value = true;
    // Store email for next step
    localStorage.setItem("reset_email", values.email);

    // Redirect to reset password verification page
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
.error-message {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #ef4444;
}

.input-error {
  border-color: #ef4444;

  &:focus {
    box-shadow: 0 0 0 2px #ef4444;
  }
}

.alert-success {
  padding: 0.75rem 1rem;
  background-color: #d1fae5;
  border: 1px solid #6ee7b7;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #065f46;
}

.alert-error {
  padding: 0.75rem 1rem;
  background-color: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #991b1b;
}
</style>
