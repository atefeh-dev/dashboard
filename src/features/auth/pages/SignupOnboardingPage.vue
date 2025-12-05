<!-- features/auth/pages/SignupOnboardingPage.vue -->
<template>
  <div
    class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12"
  >
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="text-indigo-600 font-bold text-3xl">doclast |</h1>
      </div>

      <!-- Title & Subtitle -->
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">
        Get Started with doclast
      </h2>
      <p class="text-sm text-gray-600 mb-8">
        We are very happy to see you here, please tell us a little more about
        yourself so that we can help you better together from now on.
      </p>

      <!-- Onboarding Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- First Name -->
        <div>
          <label
            for="firstName"
            class="block text-sm font-medium text-gray-700 mb-2"
            >First name</label
          >
          <input
            id="firstName"
            v-model="form.firstName"
            type="text"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            :class="{ 'border-red-500 focus:ring-red-500': errors.firstName }"
            required
          />
          <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">
            {{ errors.firstName }}
          </p>
        </div>

        <!-- Last Name -->
        <div>
          <label
            for="lastName"
            class="block text-sm font-medium text-gray-700 mb-2"
            >Last name</label
          >
          <input
            id="lastName"
            v-model="form.lastName"
            type="text"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            :class="{ 'border-red-500 focus:ring-red-500': errors.lastName }"
            required
          />
          <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">
            {{ errors.lastName }}
          </p>
        </div>

        <!-- Password -->
        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-2"
            >Choose a password</label
          >
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              :class="{ 'border-red-500 focus:ring-red-500': errors.password }"
              required
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
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">
            {{ errors.password }}
          </p>
        </div>

        <!-- Workspace Name -->
        <div>
          <label
            for="workspace"
            class="block text-sm font-medium text-gray-700 mb-2"
            >Name your workspace</label
          >
          <input
            id="workspace"
            v-model="form.workspaceName"
            type="text"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            :class="{
              'border-red-500 focus:ring-red-500': errors.workspaceName,
            }"
            placeholder='for example "Personal"'
            required
          />
          <p v-if="errors.workspaceName" class="mt-1 text-sm text-red-600">
            {{ errors.workspaceName }}
          </p>
        </div>

        <!-- Error Alert -->
        <div
          v-if="generalError"
          class="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
        >
          {{ generalError }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <span v-if="!isLoading">Continue</span>
          <span v-else class="flex items-center justify-center gap-2">
            <Loader2 class="w-4 h-4 animate-spin" />
            Creating your account...
          </span>
        </button>
      </form>

      <!-- Footer -->
      <div class="mt-6 text-center">
        <p class="text-xs text-gray-500">
          By signing up, you agree to our
          <a href="#" class="text-indigo-600 hover:text-indigo-700"
            >Terms & Privacy</a
          >.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Eye, EyeOff, Loader2 } from "lucide-vue-next";
import { useAuthStore } from "@/stores/useAuthStore";

const router = useRouter();
const authStore = useAuthStore();

// State
const showPassword = ref(false);
const isLoading = ref(false);
const generalError = ref("");

const form = reactive({
  firstName: "",
  lastName: "",
  password: "",
  workspaceName: "",
});

const errors = reactive({
  firstName: "",
  lastName: "",
  password: "",
  workspaceName: "",
});

// Check if user came from verification
onMounted(() => {
  const email = sessionStorage.getItem("signup_email");
  const code = sessionStorage.getItem("verification_code");

  if (!email || !code) {
    // Redirect back to register if no verification
    router.push("/register");
  }
});

// Validation
function validateForm() {
  // Clear errors
  errors.firstName = "";
  errors.lastName = "";
  errors.password = "";
  errors.workspaceName = "";
  generalError.value = "";

  let isValid = true;

  if (!form.firstName.trim()) {
    errors.firstName = "We need this for how we can call your name";
    isValid = false;
  }

  if (!form.lastName.trim()) {
    errors.lastName = "We need this too";
    isValid = false;
  }

  if (!form.password) {
    errors.password = "Password is required";
    isValid = false;
  } else if (form.password.length < 8) {
    errors.password = "Password should be minimum 8 characters";
    isValid = false;
  }

  if (!form.workspaceName.trim()) {
    errors.workspaceName = "We need this for your new document's home name";
    isValid = false;
  }

  return isValid;
}

// Submit
async function handleSubmit() {
  if (!validateForm()) return;

  isLoading.value = true;

  try {
    const email = sessionStorage.getItem("signup_email");
    const verificationCode = sessionStorage.getItem("verification_code");

    // TODO: API call to complete registration
    const response = await fetch("/api/auth/register/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        verificationCode,
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password,
        workspaceName: form.workspaceName,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Registration failed");
    }

    const data = await response.json();

    // Clear session storage
    sessionStorage.removeItem("signup_email");
    sessionStorage.removeItem("verification_code");

    // Auto-login with returned token
    authStore.user = data.user;
    authStore.token = data.token;
    localStorage.setItem("auth_token", data.token);

    // Redirect to overview
    router.push("/overview");
  } catch (err) {
    generalError.value =
      err.message || "Something went wrong. Please try again.";
  } finally {
    isLoading.value = false;
  }
}
</script>
