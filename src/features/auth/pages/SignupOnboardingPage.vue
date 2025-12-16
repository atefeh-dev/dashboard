<template>
  <AuthLayout
    title="Get Started with doclast"
    subtitle="We are very happy to see you here, please tell us a little more about yourself so that we can help you better together from now on."
    :showGoogleButton="false"
    :showDivider="false"
    :isLoading="isLoading"
  >
    <!-- Form Content -->
    <form @submit.prevent="onSubmit" class="auth-form">
      <div class="auth-form__field">
        <label class="auth-form__label">First name</label>

        <Field name="firstName" v-slot="{ field, meta }">
          <AppInput v-bind="field" :error="meta.touched && meta.invalid" />
        </Field>

        <ErrorMessage name="firstName" class="auth-form__error" />
      </div>

      <div class="auth-form__field">
        <label class="auth-form__label">Last name</label>

        <Field name="lastName" v-slot="{ field, meta }">
          <AppInput v-bind="field" :error="meta.touched && meta.invalid" />
        </Field>

        <ErrorMessage name="lastName" class="auth-form__error" />
      </div>

      <div class="auth-form__field">
        <label class="auth-form__label">Password</label>

        <Field name="password" v-slot="{ field, meta }">
          <AppInput
            v-bind="field"
            :type="showPassword ? 'text' : 'password'"
            :password="true"
            :error="meta.touched && meta.invalid"
          />
        </Field>

        <ErrorMessage name="password" class="auth-form__error" />
      </div>

      <div class="auth-form__field">
        <label class="auth-form__label">Workspace name</label>

        <Field name="workspaceName" v-slot="{ field, meta }">
          <AppInput
            v-bind="field"
            placeholder='for example "Personal"'
            :error="meta.touched && meta.invalid"
          />
        </Field>

        <ErrorMessage name="workspaceName" class="auth-form__error" />
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
      </div>
    </template>
  </AuthLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { Eye, EyeOff, Loader2 } from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";
import AppInput from "@/components/ui/AppInput.vue";
import AuthLayout from "../layouts/AuthLayout.vue";
import { useAuthStore } from "@/stores/useAuthStore";

const router = useRouter();
const authStore = useAuthStore();

// State
const showPassword = ref(false);
const isLoading = ref(false);
const generalError = ref("");

// Validation schema
const schema = yup.object({
  firstName: yup
    .string()
    .required("We need this for how we can call your name")
    .trim(),
  lastName: yup.string().required("We need this too").trim(),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password should be minimum 8 characters"),
  workspaceName: yup
    .string()
    .required("We need this for your new document's home name")
    .trim(),
});

// Setup form with VeeValidate
const { handleSubmit, errors } = useForm({
  validationSchema: schema,
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

// Submit handler
const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  generalError.value = "";

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
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        password: values.password,
        workspaceName: values.workspaceName.trim(),
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
});
</script>

<style scoped lang="scss">
@use "../styles/auth.scss";
</style>
