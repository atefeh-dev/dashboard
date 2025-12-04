import { useAuthStore } from "@/stores/useAuthStore";

export function setupAuthGuard(router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    const publicPages = ["/login", "/register", "/forgot-password"];
    const authRequired = !publicPages.includes(to.path);

    if (authRequired && !authStore.isAuthenticated) {
      // Redirect to login if trying to access protected page
      return next("/login");
    }

    if (!authRequired && authStore.isAuthenticated) {
      // Redirect to overview if already logged in
      return next("/overview");
    }

    next();
  });
}
