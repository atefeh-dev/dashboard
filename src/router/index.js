import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";

// Auth pages
import LoginPage from "@/features/auth/pages/LoginPage.vue";
import RegisterPage from "@/features/auth/pages/RegisterPage.vue";
import SignupVerificationPage from "@/features/auth/pages/SignupVerificationPage.vue";
import SignupOnboardingPage from "@/features/auth/pages/SignupOnboardingPage.vue";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage.vue";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage.vue";

// User pages (clean URLs - no prefix)
import OverviewPage from "@/features/overview/pages/OverviewPage.vue";
import DocumentsPage from "@/features/documents/pages/DocumentsPage.vue";
// import NotificationsPage from "@/features/notifications/pages/NotificationsPage.vue";

// Admin pages (with /admin prefix)
import AdminNotificationsPage from "@/features/admin/pages/NotificationsPage.vue";

const routes = [
  // ========================================
  // ROOT REDIRECT
  // ========================================
  {
    path: "/",
    redirect: () => {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) return "/login";
      return authStore.isAdmin ? "/admin/overview" : "/overview";
    },
  },

  // ========================================
  // AUTH ROUTES (Public)
  // ========================================
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: {
      requiresAuth: false,
      redirectIfAuth: true,
    },
  },
  {
    path: "/signup",
    name: "Signup",
    component: RegisterPage,
    meta: {
      requiresAuth: false,
      redirectIfAuth: true,
    },
  },
  {
    path: "/signup/verify",
    name: "SignupVerify",
    component: SignupVerificationPage,
    meta: {
      requiresAuth: false,
      redirectIfAuth: true,
      requiresSessionData: "signup_email",
    },
  },
  {
    path: "/signup/onboarding",
    name: "SignupOnboarding",
    component: SignupOnboardingPage,
    meta: {
      requiresAuth: false,
      redirectIfAuth: true,
      requiresSessionData: ["signup_email", "verification_code"],
    },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPasswordPage,
    meta: {
      requiresAuth: false,
      redirectIfAuth: true,
    },
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPasswordPage,
    meta: {
      requiresAuth: false,
      redirectIfAuth: true,
      requiresResetEmail: true,
    },
  },

  // ========================================
  // USER ROUTES (Clean URLs - No Prefix)
  // ========================================
  {
    path: "/overview",
    name: "Overview",
    component: OverviewPage,
    meta: { requiresAuth: true, userOnly: true },
  },
  {
    path: "/documents",
    name: "Documents",
    component: DocumentsPage,
    meta: { requiresAuth: true, userOnly: true },
  },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   component: NotificationsPage,
  //   meta: { requiresAuth: true, userOnly: true },
  // },
  // {
  //   path: "/templates",
  //   name: "Templates",
  //   component: TemplatesPage,
  //   meta: { requiresAuth: true, userOnly: true },
  // },

  // ========================================
  // ADMIN ROUTES (With /admin Prefix)
  // ========================================
  {
    path: "/admin",
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: "",
        redirect: "/admin/overview",
      },
      {
        path: "overview",
        name: "AdminOverview",
        component: OverviewPage, // Reuse same component
      },
      {
        path: "documents",
        name: "AdminDocuments",
        component: DocumentsPage, // Reuse same component
      },
      {
        path: "notifications",
        name: "AdminNotifications",
        component: AdminNotificationsPage,
      },
      // Add more admin-specific routes here
    ],
  },

  // ========================================
  // CATCH ALL
  // ========================================
  {
    path: "/:catchAll(.*)",
    redirect: "/login",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ========================================
// NAVIGATION GUARD (Single Source of Truth)
// ========================================
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Initialize auth if needed
  if (!authStore.user && authStore.token) {
    await authStore.initAuth();
  }

  const requiresAuth = to.meta.requiresAuth;
  const requiresAdmin = to.meta.requiresAdmin;
  const userOnly = to.meta.userOnly;
  const redirectIfAuth = to.meta.redirectIfAuth;
  const isAuthenticated = authStore.isAuthenticated;
  const isAdmin = authStore.isAdmin;

  // ========================================
  // 1. HANDLE PUBLIC AUTH ROUTES
  // ========================================
  if (requiresAuth === false) {
    // Redirect authenticated users away from auth pages
    if (redirectIfAuth && isAuthenticated) {
      console.log("Authenticated user accessing auth page, redirecting...");
      return next(isAdmin ? "/admin/overview" : "/overview");
    }

    // Check for required session data for signup flow
    if (to.meta.requiresSessionData) {
      const required = Array.isArray(to.meta.requiresSessionData)
        ? to.meta.requiresSessionData
        : [to.meta.requiresSessionData];

      const missingData = required.some((key) => !sessionStorage.getItem(key));

      if (missingData) {
        console.warn("Missing required session data, redirecting to signup");
        return next("/signup");
      }
    }

    // Check for reset password email requirement
    if (to.meta.requiresResetEmail) {
      const hasEmail = to.query.email || localStorage.getItem("reset_email");
      if (!hasEmail) {
        console.warn(
          "No email for reset password, redirecting to forgot password"
        );
        return next("/forgot-password");
      }
    }

    return next();
  }

  // ========================================
  // 2. HANDLE PROTECTED ROUTES
  // ========================================

  // Check authentication
  if (requiresAuth && !isAuthenticated) {
    console.warn("Access denied: Authentication required");
    return next("/login");
  }

  // Admin-only routes (/admin/*)
  if (requiresAdmin && !isAdmin) {
    console.warn("Access denied: Admin privileges required");
    return next("/overview");
  }

  // User-only routes (clean URLs) - prevent admin from accessing
  if (userOnly && isAdmin) {
    console.warn("Admins should use /admin routes");
    return next("/admin" + to.path); // Redirect to admin version
  }

  next();
});

export default router;
