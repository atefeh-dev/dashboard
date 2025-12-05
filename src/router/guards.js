import { useAuthStore } from "@/stores/useAuthStore";

export function setupAuthGuard(router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const publicPages = [
      "/login",
      "/signup",
      "/forgot-password",
      "/reset-password",
    ];

    // Allow all signup steps
    const isSignupFlow = to.path.startsWith("/signup");
    const isPublic = publicPages.includes(to.path) || isSignupFlow;

    // Special check for reset password - must have email in query or localStorage
    if (to.path === "/reset-password") {
      const hasEmail = to.query.email || localStorage.getItem("reset_email");
      if (!hasEmail) {
        console.warn(
          "No email for reset password, redirecting to forgot password"
        );
        return next("/forgot-password");
      }
    }

    // Redirect to login if trying to access protected route without auth
    if (!isPublic && !authStore.isAuthenticated) {
      return next("/login");
    }

    // Redirect to overview if authenticated user tries to access public pages (except signup flow)
    if (isPublic && authStore.isAuthenticated && !isSignupFlow) {
      return next("/overview");
    }

    next();
  });
}
