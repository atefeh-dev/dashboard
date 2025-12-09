<!-- features/auth/pages/SignupVerificationPage.vue - VeeValidate version -->
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
      <h2 class="text-2xl font-semibold text-gray-900 text-center mb-2">
        Create your new account
      </h2>
      <p class="text-sm text-gray-600 text-center mb-6">
        And take back your documents to their sweet home.
      </p>

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

      <!-- Email Display -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Email</label
        >
        <div
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-gray-50"
        >
          {{ email }}
        </div>
      </div>

      <!-- Success Message -->
      <p class="text-sm text-gray-600 mb-4">
        We sent a 4-digit verification code to your inbox.
      </p>

      <!-- Verification Form -->
      <form @submit="onSubmit" class="space-y-4">
        <!-- Verification Code Inputs -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Verification code</label
          >
          <div class="flex gap-3 mb-2">
            <input
              v-for="(digit, index) in code"
              :key="index"
              :ref="(el) => (codeInputs[index] = el)"
              v-model="code[index]"
              type="text"
              maxlength="1"
              inputmode="numeric"
              pattern="[0-9]"
              @input="handleCodeInput(index, $event)"
              @keydown="handleKeyDown(index, $event)"
              @paste="handlePaste"
              class="w-16 h-16 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              :class="{ 'border-red-500 focus:ring-red-500': codeError }"
            />
          </div>
          <p v-if="codeError" class="text-sm text-red-600">
            {{ codeError }}
          </p>
        </div>

        <!-- Submit Button -->
        <AppButton
          type="submit"
          variant="primary"
          :disabled="isLoading || !isCodeComplete"
          :loading="isLoading"
          class="w-full"
        >
          <span v-if="!isLoading">Continue</span>
          <span v-else class="flex items-center justify-center gap-2">
            <Loader2 class="w-4 h-4 animate-spin" />
            Verifying...
          </span>
        </AppButton>
      </form>

      <!-- Footer Links -->
      <div class="mt-6 text-center space-y-2">
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
            class="text-indigo-600 hover:text-indigo-700 font-medium ml-1"
          >
            Log in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { Loader2 } from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";

const router = useRouter();

// State
const email = ref("");
const code = reactive(["", "", "", ""]);
const codeInputs = ref([]);
const isLoading = ref(false);
const codeError = ref("");

// Validation schema (empty for now, code validation is custom)
const schema = yup.object({});

// Setup form with VeeValidate
const { handleSubmit } = useForm({
  validationSchema: schema,
});

// Computed
const isCodeComplete = computed(() => code.every((digit) => digit !== ""));

// On mount - get email from session
onMounted(() => {
  const storedEmail = sessionStorage.getItem("signup_email");

  if (!storedEmail) {
    // No email stored, redirect back to signup
    router.replace("/signup");
    return;
  }

  email.value = storedEmail;

  // Auto-focus first input
  setTimeout(() => {
    codeInputs.value[0]?.focus();
  }, 100);
});

// Submit handler
const onSubmit = handleSubmit(async () => {
  codeError.value = "";

  if (!isCodeComplete.value) {
    codeError.value = "Please enter the complete verification code";
    return;
  }

  const verificationCode = code.join("");
  isLoading.value = true;

  try {
    // TODO: API call to verify code
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Store verification code
    sessionStorage.setItem("verification_code", verificationCode);

    // Navigate to onboarding using replace
    await router.replace("/signup/onboarding");
  } catch (err) {
    codeError.value = "The verification code you entered is incorrect";
    // Clear code
    code.forEach((_, i) => (code[i] = ""));
    codeInputs.value[0]?.focus();
  } finally {
    isLoading.value = false;
  }
});

function handleCodeInput(index, event) {
  const value = event.target.value;

  // Only allow digits
  if (!/^\d*$/.test(value)) {
    code[index] = "";
    return;
  }

  code[index] = value;

  // Move to next input
  if (value && index < 3) {
    codeInputs.value[index + 1]?.focus();
  }

  // Clear error when user starts typing
  if (codeError.value) {
    codeError.value = "";
  }
}

function handleKeyDown(index, event) {
  // Handle backspace
  if (event.key === "Backspace" && !code[index] && index > 0) {
    codeInputs.value[index - 1]?.focus();
  }

  // Handle arrow keys
  if (event.key === "ArrowLeft" && index > 0) {
    event.preventDefault();
    codeInputs.value[index - 1]?.focus();
  }

  if (event.key === "ArrowRight" && index < 3) {
    event.preventDefault();
    codeInputs.value[index + 1]?.focus();
  }
}

function handlePaste(event) {
  event.preventDefault();
  const pastedData = event.clipboardData.getData("text").trim();

  // Only process if it's 4 digits
  if (/^\d{4}$/.test(pastedData)) {
    pastedData.split("").forEach((digit, index) => {
      if (index < 4) {
        code[index] = digit;
      }
    });

    // Focus last input
    codeInputs.value[3]?.focus();
  }
}

function handleGoogleLogin() {
  console.log("Google OAuth not implemented");
}
</script>
