<template>
  <AuthLayout
    title="Reset password"
    :subtitle="subtitleText"
    :showGoogleButton="false"
    :showDivider="false"
    :isLoading="isLoading"
  >
    <!-- Form Content -->
    <form @submit="onSubmit" class="auth-form">
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
            inputmode="numeric"
            maxlength="1"
            class="auth-form__code-input"
            :class="{ 'auth-form__code-input--error': errors.code }"
            @input="handleCodeInput(index, $event)"
            @keydown="handleCodeKeydown(index, $event)"
            @paste="handlePaste"
          />
        </div>
        <p v-if="errors.code" class="auth-form__error">{{ errors.code }}</p>
      </div>

      <!-- New Password -->
      <div class="auth-form__field">
        <label for="password" class="auth-form__label">New password</label>
        <div class="auth-form__password-wrapper">
          <Field v-slot="{ field, meta }" name="password">
            <AppInput
              v-bind="field"
              id="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your new password"
              :password="true"
              :error="!meta.valid && meta.touched"
            />
          </Field>
          <!-- <button
            type="button"
            class="auth-form__password-toggle"
            @click="showPassword = !showPassword"
          >
            <Eye v-if="!showPassword" class="auth-form__password-icon" />
            <EyeOff v-else class="auth-form__password-icon" />
          </button> -->
        </div>
        <ErrorMessage name="password" class="auth-form__error" />
      </div>

      <!-- Confirm Password -->
      <div class="auth-form__field">
        <label for="confirmPassword" class="auth-form__label"
          >Confirm password</label
        >
        <div class="auth-form__password-wrapper">
          <Field v-slot="{ field, meta }" name="confirmPassword">
            <AppInput
              v-bind="field"
              id="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm your new password"
              :password="true"
              :error="!meta.valid && meta.touched"
            />
          </Field>
          <!-- <button
            type="button"
            class="auth-form__password-toggle"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <Eye v-if="!showConfirmPassword" class="auth-form__password-icon" />
            <EyeOff v-else class="auth-form__password-icon" />
          </button> -->
        </div>
        <ErrorMessage name="confirmPassword" class="auth-form__error" />
      </div>

      <!-- Error Alert -->
      <div v-if="generalError" class="auth-form__alert">
        {{ generalError }}
      </div>

      <!-- Success Alert -->
      <div v-if="success" class="auth-form__alert auth-form__alert--success">
        Password reset successful! Redirecting to login...
      </div>

      <!-- Submit Button -->
      <AppButton
        type="submit"
        variant="primary"
        :disabled="isLoading"
        :loading="isLoading"
        class="auth-form__submit"
      >
        Reset Password
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
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { Eye, EyeOff } from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";
import AppInput from "@/components/ui/AppInput.vue";
import AuthLayout from "../layouts/AuthLayout.vue";
import { useAuthStore } from "@/stores/useAuthStore";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Get email from query params or localStorage
const email = computed(() => {
  return route.query.email || localStorage.getItem("reset_email") || "";
});

const maskedEmail = computed(() => {
  if (!email.value) return "you@doclast.com";
  const [local, domain] = email.value.split("@");
  if (!domain) return email.value;
  const maskedLocal =
    local.length > 2
      ? local[0] + "*".repeat(local.length - 2) + local[local.length - 1]
      : local;
  return `${maskedLocal}@${domain}`;
});

const subtitleText = computed(() => {
  return `We've sent a 4-digit verification code to ${maskedEmail.value}. If you don't see it, please check your spam folder and make sure your email address is spelled correctly.`;
});

const isLoading = ref(false);
const success = ref(false);
const generalError = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Code inputs (not part of VeeValidate form)
const code = reactive(["", "", "", ""]);
const codeInputs = ref([]);

// Validation schema
const schema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password should be minimum 8 characters"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords don't match"),
});

// Setup form with VeeValidate
const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

// Auto-focus first input on mount and check for email
onMounted(() => {
  // Redirect if no email
  if (!email.value) {
    console.warn("No email provided, redirecting to forgot password");
    router.push("/forgot-password");
    return;
  }

  if (codeInputs.value[0]) {
    codeInputs.value[0].focus();
  }
});

function handleCodeInput(index, event) {
  const value = event.target.value;

  // Only allow digits
  if (value && !/^\d$/.test(value)) {
    code[index] = "";
    return;
  }

  // Clear error when user starts typing
  errors.value.code = "";

  // Move to next input if value entered
  if (value && index < 3) {
    codeInputs.value[index + 1]?.focus();
  }
}

function handleCodeKeydown(index, event) {
  // Handle backspace
  if (event.key === "Backspace" && !code[index] && index > 0) {
    codeInputs.value[index - 1]?.focus();
  }

  // Handle arrow keys
  if (event.key === "ArrowLeft" && index > 0) {
    codeInputs.value[index - 1]?.focus();
  }
  if (event.key === "ArrowRight" && index < 3) {
    codeInputs.value[index + 1]?.focus();
  }
}

function handlePaste(event) {
  event.preventDefault();
  const pasteData = event.clipboardData.getData("text");
  const digits = pasteData.replace(/\D/g, "").slice(0, 4);

  digits.split("").forEach((digit, index) => {
    if (index < 4) {
      code[index] = digit;
    }
  });

  // Focus the last filled input or next empty one
  const focusIndex = Math.min(digits.length, 3);
  codeInputs.value[focusIndex]?.focus();
}

// Submit handler
const onSubmit = handleSubmit(async (values) => {
  // Validate code separately (not part of VeeValidate schema)
  const fullCode = code.join("");
  if (fullCode.length !== 4) {
    errors.value.code = "The verification code you entered is incorrect";
    return;
  }

  errors.value.code = "";
  isLoading.value = true;
  generalError.value = "";

  try {
    // Use auth store method
    const result = await authStore.resetPassword(
      email.value,
      fullCode,
      values.password
    );

    if (result.success) {
      success.value = true;
      localStorage.removeItem("reset_email");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      generalError.value = result.error || "Password reset failed";
    }
  } catch (err) {
    generalError.value = err.message || "An error occurred";
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped lang="scss">
@use "../styles/auth.scss";
</style>
