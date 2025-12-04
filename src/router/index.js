import { createRouter, createWebHistory } from "vue-router";
import { setupAuthGuard } from "./guards";

// Auth pages
import LoginPage from "@/features/auth/pages/LoginPage.vue";
import RegisterPage from "@/features/auth/pages/RegisterPage.vue";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage.vue";
// App pages
import OverviewPage from "@/features/overview/pages/OverviewPage.vue";
import DocumentsPage from "@/features/documents/pages/DocumentsPage.vue";

const routes = [
  // Redirect root to overview or login
  {
    path: "/",
    redirect: (to) => {
      // Check if user is logged in
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
    path: "/register",
    name: "Register",
    component: RegisterPage,
    meta: { requiresAuth: false },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPasswordPage,
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

  // Catch all - redirect to login
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
