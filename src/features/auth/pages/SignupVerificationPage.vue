<template>
  <AuthLayout
    title="Create your new account"
    subtitle="And take back your documents to their sweet home."
    :isLoading="isLoading"
    @google-login="handleGoogleLogin"
  >
    <!-- Form Content -->
    <div class="auth-form">
      <!-- Email Display -->
      <div class="auth-form__field">
        <label class="auth-form__label">Email</label>
        <div class="auth-form__email-display">
          {{ email }}
        </div>
      </div>

      <!-- Success Message -->
      <p class="auth-form__message">
        We sent a 4-digit verification code to your inbox.
      </p>

      <!-- Verification Form -->
      <form @submit="onSubmit">
        <!-- Verification Code Inputs -->
        <div class="auth-form__field">
          <label class="auth-form__label">Verification code</label>
          <div class="auth-form__code-inputs">
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
              class="auth-form__code-input"
              :class="{ 'auth-form__code-input--error': codeError }"
            />
          </div>
          <p v-if="codeError" class="auth-form__error">
            {{ codeError }}
          </p>
        </div>

        <!-- Submit Button -->
        <AppButton
          type="submit"
          variant="primary"
          :disabled="isLoading || !isCodeComplete"
          class="auth-form__submit"
        >
          <span v-if="!isLoading">Continue</span>
          <span v-else class="auth-form__loading">
            <Loader2 class="auth-form__loading-icon" />
            Verifying...
          </span>
        </AppButton>
      </form>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="auth-footer">
        <p class="auth-footer__terms">
          By signing up, you agree to our
          <a href="#" class="auth-footer__terms-link">Terms & Privacy</a>.
        </p>
        <p class="auth-footer__text">
          Already have an account?
          <router-link to="/login" class="auth-footer__link">
            Log in
          </router-link>
        </p>
      </div>
    </template>
  </AuthLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { Loader2 } from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";
import AuthLayout from "../layouts/AuthLayout.vue";

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

<style scoped lang="scss">
@use "../styles/auth.scss";
</style>
