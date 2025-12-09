<template>
  <div
    class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12"
  >
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="text-indigo-600 font-bold text-3xl">doclast |</h1>
      </div>

      <!-- Title -->
      <h2 class="text-2xl font-semibold text-gray-900 text-center mb-6">
        Welcome back
      </h2>

      <!-- Dev Mode Banner -->
      <div
        v-if="isDev"
        class="mb-6 px-4 py-3 bg-yellow-50 border border-yellow-300 rounded-lg"
      >
        <p class="text-sm text-yellow-800">
          🔧 Dev Mode: Use <strong>admin@admin.com</strong> /
          <strong>admin</strong> for quick login
        </p>
      </div>

      <!-- Google Button -->
      <button
        type="button"
        @click="handleGoogleLogin"
        class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-6"
      >
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

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-gray-50 text-gray-500 font-medium">or</span>
        </div>
      </div>

      <!-- Form -->
      <form @submit="onSubmit" class="space-y-4">
        <!-- Email -->
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-2"
            >Email</label
          >
          <Field
            id="email"
            name="email"
            type="email"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            :class="{ 'border-red-500 focus:ring-red-500': errors.email }"
            placeholder="you@example.com"
          />
          <ErrorMessage name="email" class="mt-1 text-sm text-red-600" />
        </div>

        <!-- Password -->
        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-2"
            >Password</label
          >
          <div class="relative">
            <Field
              id="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              :class="{ 'border-red-500 focus:ring-red-500': errors.password }"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Eye v-if="!showPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>
          </div>
          <ErrorMessage name="password" class="mt-1 text-sm text-red-600" />
        </div>

        <!-- Error Alert -->
        <div
          v-if="authStore.error"
          class="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
        >
          {{ authStore.error }}
        </div>

        <!-- Submit Button -->
        <AppButton
          type="submit"
          variant="primary"
          :disabled="authStore.isLoading"
          :loading="authStore.isLoading"
          class="w-full"
        >
          <span v-if="!authStore.isLoading">Continue</span>
          <span v-else class="flex items-center justify-center gap-2">
            <Loader2 class="w-4 h-4 animate-spin" />
            Signing in...
          </span>
        </AppButton>
      </form>

      <!-- Footer Links -->
      <div class="mt-6 space-y-2 text-center">
        <p class="text-sm text-gray-600">
          Don't have an account yet?
          <router-link
            to="/signup"
            class="text-indigo-600 hover:text-indigo-700 font-medium ml-1"
          >
            Sign up
          </router-link>
        </p>
        <p class="text-sm text-gray-600">
          Forgot password?
          <router-link
            to="/forgot-password"
            class="text-indigo-600 hover:text-indigo-700 font-medium ml-1"
          >
            Reset
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { Eye, EyeOff, Loader2 } from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";
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

// Setup form with VeeValidate
const { handleSubmit, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    email: isDev.value ? "admin@admin.com" : "",
    password: isDev.value ? "admin" : "",
  },
});

// Submit handler
const onSubmit = handleSubmit(async (values) => {
  await authStore.login(values.email, values.password);
});

function handleGoogleLogin() {
  authStore.loginWithGoogle();
}
</script>
