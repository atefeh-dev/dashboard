import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";

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
import NotificationsPage from "@/features/admin/pages/NotificationsPage.vue";

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

  // App routes (protected - accessible by all authenticated users)
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

  // Admin routes (protected - admin only)
  {
    path: "/admin/notifications",
    name: "AdminNotifications",
    component: NotificationsPage,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
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

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Initialize auth if not already done
  if (!authStore.user && authStore.token) {
    await authStore.initAuth();
  }

  const requiresAuth = to.meta.requiresAuth;
  const requiresAdmin = to.meta.requiresAdmin;
  const isAuthenticated = authStore.isAuthenticated;
  const isAdmin = authStore.isAdmin;

  // Public routes
  if (!requiresAuth) {
    // Redirect to overview if already authenticated
    if (isAuthenticated && (to.path === "/login" || to.path === "/signup")) {
      return next("/overview");
    }
    return next();
  }

  // Protected routes
  if (requiresAuth && !isAuthenticated) {
    return next("/login");
  }

  // Admin-only routes
  if (requiresAdmin && !isAdmin) {
    console.warn("Access denied: Admin privileges required");
    return next("/overview"); // Redirect non-admins to overview
  }

  next();
});

export default router;
