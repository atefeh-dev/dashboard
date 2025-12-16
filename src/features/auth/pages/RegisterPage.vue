<template>
  <AuthLayout
    title="Create your new account"
    subtitle="And take back your documents to their sweet home."
    :isLoading="isLoading"
    @google-login="handleGoogleLogin"
  >
    <!-- Form Content -->
    <form @submit.prevent="onSubmit" class="auth-form">
      <div class="auth-form__field">
        <label for="email" class="auth-form__label">Email</label>

        <Field name="email" v-slot="{ field, meta }">
          <AppInput
            v-bind="field"
            id="email"
            type="email"
            placeholder="you@example.com"
            :error="meta.touched && meta.invalid"
          />
        </Field>

        <ErrorMessage name="email" class="auth-form__error" />
      </div>

      <div v-if="generalError" class="auth-form__alert">
        {{ generalError }}
      </div>

      <AppButton type="submit" class="auth-form__submit"> Continue </AppButton>
    </form>

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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import AppButton from "@/components/ui/AppButton.vue";
import AppInput from "@/components/ui/AppInput.vue";
import AuthLayout from "../layouts/AuthLayout.vue";

const router = useRouter();
const isLoading = ref(false);
const generalError = ref("");

// Validation schema
const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
});

// Setup form with VeeValidate
const { handleSubmit, setFieldValue } = useForm({
  validationSchema: schema,
});

// On mount - load existing email if user is returning to edit
onMounted(() => {
  const storedEmail = sessionStorage.getItem("signup_email");
  if (storedEmail) {
    setFieldValue("email", storedEmail);
  }

  // Clear verification code if user comes back to change email
  sessionStorage.removeItem("verification_code");
});

// Submit handler
const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  generalError.value = "";

  try {
    // TODO: Check if email exists
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Store email in session
    sessionStorage.setItem("signup_email", values.email);

    // Navigate to verify page
    await router.push("/signup/verify");
  } catch (err) {
    generalError.value = "Something went wrong. Please try again.";
  } finally {
    isLoading.value = false;
  }
});

function handleGoogleLogin() {
  console.log("Google OAuth not implemented");
}
</script>

<style scoped lang="scss">
@use "../styles/auth.scss";
</style>
