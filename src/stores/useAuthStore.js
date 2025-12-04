import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();

  // State
  const user = ref(null);
  const token = ref(localStorage.getItem("auth_token") || null);
  const isLoading = ref(false);
  const error = ref(null);

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value);

  // Actions
  async function login(email, password) {
    isLoading.value = true;
    error.value = null;

    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }

      const data = await response.json();

      // Store token and user data
      token.value = data.token;
      user.value = data.user;
      localStorage.setItem("auth_token", data.token);

      // Redirect to overview
      router.push("/overview");

      return { success: true };
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      isLoading.value = false;
    }
  }

  async function register(email, password) {
    isLoading.value = true;
    error.value = null;

    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
      }

      const data = await response.json();

      // Auto-login after registration
      token.value = data.token;
      user.value = data.user;
      localStorage.setItem("auth_token", data.token);

      router.push("/overview");

      return { success: true };
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      isLoading.value = false;
    }
  }

  async function loginWithGoogle() {
    // TODO: Implement Google OAuth
    console.log("Google login not implemented yet");
  }

  async function sendPasswordReset(email) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to send reset code");
      }

      return { success: true };
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem("auth_token");
    router.push("/login");
  }

  // Initialize user from token on app load
  async function initAuth() {
    if (token.value) {
      try {
        // TODO: Fetch user data from API using token
        // const response = await fetch('/api/auth/me', {
        //   headers: { 'Authorization': `Bearer ${token.value}` }
        // });
        // user.value = await response.json();
      } catch (err) {
        // Token invalid, clear it
        logout();
      }
    }
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    loginWithGoogle,
    sendPasswordReset,
    logout,
    initAuth,
  };
});
