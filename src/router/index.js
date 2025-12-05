import { createRouter, createWebHistory } from "vue-router";
import { setupAuthGuard } from "./guards";

// Auth pages
import LoginPage from "@/features/auth/pages/LoginPage.vue";
import SignupPage from "@/features/auth/pages/RegisterPage.vue";
import SignupVerificationPage from "@/features/auth/pages/SignupVerificationPage.vue";
import SignupOnboardingPage from "@/features/auth/pages/SignupOnboardingPage.vue";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage.vue";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage.vue";

// App pages
import OverviewPage from "@/features/overview/pages/OverviewPage.vue";
import DocumentsPage from "@/features/documents/pages/DocumentsPage.vue";

const routes = [
  // Redirect root
  {
    path: "/",
    redirect: () => {
      const token = localStorage.getItem("auth_token");
      return token ? "/overview" : "/login";
    },
  },

  // Auth routes (public)
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: { requiresAuth: false },
  },
  {
    path: "/signup",
    name: "Signup",
    component: SignupPage,
    meta: { requiresAuth: false },
  },
  {
    path: "/signup/verify",
    name: "SignupVerify",
    component: SignupVerificationPage,
    meta: { requiresAuth: false },
  },
  {
    path: "/signup/onboarding",
    name: "SignupOnboarding",
    component: SignupOnboardingPage,
    meta: { requiresAuth: false },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPasswordPage,
    meta: { requiresAuth: false },
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPasswordPage,
    meta: { requiresAuth: false },
  },

  // App routes (protected)
  {
    path: "/overview",
    name: "Overview",
    component: OverviewPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/documents",
    name: "Documents",
    component: DocumentsPage,
    meta: { requiresAuth: true },
  },

  // Catch all
  {
    path: "/:catchAll(.*)",
    redirect: "/login",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Setup auth guard
setupAuthGuard(router);

export default router;
