<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-logo">
        <span class="text-indigo-600 font-bold text-3xl">doclast |</span>
      </div>

      <h1 class="auth-title">Reset password</h1>
      <p class="auth-subtitle">
        We've sent a 4-digit verification code to
        <strong>{{ maskedEmail }}</strong
        >. If you don't see it, please check your spam folder and make sure your
        email address is spelled correctly.
      </p>

      <form @submit="onSubmit" class="auth-form">
        <!-- Verification Code Input -->
        <div class="form-group">
          <label class="form-label">Verification code</label>
          <div class="code-inputs">
            <input
              v-for="(digit, index) in code"
              :key="index"
              :ref="(el) => (codeInputs[index] = el)"
              v-model="code[index]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              class="code-input"
              :class="{ 'input-error': errors.code }"
              @input="handleCodeInput(index, $event)"
              @keydown="handleCodeKeydown(index, $event)"
              @paste="handlePaste"
            />
          </div>
          <p v-if="errors.code" class="error-message">{{ errors.code }}</p>
        </div>

        <!-- New Password -->
        <div class="form-group">
          <label for="password" class="form-label">New password</label>
          <div class="relative">
            <Field
              id="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              :class="{ 'input-error': errors.password }"
              placeholder="Enter your new password"
              autocomplete="new-password"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
            >
              <Eye v-if="!showPassword" :size="20" />
              <EyeOff v-else :size="20" />
            </button>
          </div>
          <ErrorMessage name="password" class="error-message" />
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label for="confirmPassword" class="form-label"
            >Confirm password</label
          >
          <div class="relative">
            <Field
              id="confirmPassword"
              name="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-input"
              :class="{ 'input-error': errors.confirmPassword }"
              placeholder="Confirm your new password"
              autocomplete="new-password"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <Eye v-if="!showConfirmPassword" :size="20" />
              <EyeOff v-else :size="20" />
            </button>
          </div>
          <ErrorMessage name="confirmPassword" class="error-message" />
        </div>

        <!-- Error Alert -->
        <div v-if="generalError" class="alert-error">
          {{ generalError }}
        </div>

        <!-- Success Alert -->
        <div v-if="success" class="alert-success">
          Password reset successful! Redirecting to login...
        </div>

        <AppButton
          type="submit"
          variant="primary"
          :disabled="isLoading"
          :loading="isLoading"
          class="w-full"
        >
          Reset Password
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
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { Eye, EyeOff } from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";
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
.code-inputs {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.code-input {
  width: 4rem;
  height: 4rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  color: #111827;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: transparent;
    box-shadow: 0 0 0 2px #6366f1;
  }

  &.input-error {
    border-color: #ef4444;

    &:focus {
      box-shadow: 0 0 0 2px #ef4444;
    }
  }

  /* Remove number input arrows */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    appearance: textfield;
    -moz-appearance: textfield;
  }
}

.relative {
  position: relative;
}

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

.alert-error {
  padding: 0.75rem 1rem;
  background-color: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #991b1b;
}

.alert-success {
  padding: 0.75rem 1rem;
  background-color: #d1fae5;
  border: 1px solid #6ee7b7;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #065f46;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  transition: color 0.2s;

  &:hover {
    color: #4b5563;
  }
}
</style>
