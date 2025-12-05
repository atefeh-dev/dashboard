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

  // Dev-only bypass login (MOVE THIS BEFORE RETURN)
  async function devLogin() {
    if (import.meta.env.MODE !== "development") {
      console.error("Dev login only available in development mode");
      return { success: false };
    }

    console.log("🔧 DEV MODE: Bypassing authentication");

    // Mock user data
    user.value = {
      id: 1,
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
    };

    token.value = "dev-token-12345";
    localStorage.setItem("auth_token", "dev-token-12345");

    router.push("/overview");

    return { success: true };
  }

  // Login function
  async function login(email, password) {
    isLoading.value = true;
    error.value = null;

    try {
      // DEV MODE: Check for admin/admin
      if (
        import.meta.env.MODE === "development" &&
        email === "admin@admin.com" &&
        password === "admin"
      ) {
        console.log("🔧 DEV MODE: Using dev credentials");
        return await devLogin();
      }

      // Normal login flow
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

  async function register(email, password) {
    isLoading.value = true;
    error.value = null;

    try {
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

  async function initAuth() {
    if (token.value) {
      try {
        // TODO: Fetch user data from API using token
      } catch (err) {
        logout();
      }
    }
  }

  // RETURN AT THE END
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
    devLogin,
  };
});
