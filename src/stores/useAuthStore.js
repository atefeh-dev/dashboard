// stores/useAuthStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import AvatarImage from "../assets/images/av.png";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();

  // State - DON'T read localStorage on initialization
  const user = ref(null);
  const token = ref(null); // Initialize as null, load later
  const isLoading = ref(false);
  const error = ref(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const isAdmin = computed(() => user.value?.role === "admin");

  // Mock users for development
  const mockUsers = {
    "admin@admin.com": {
      email: "admin@admin.com",
      password: "admin",
      user: {
        id: 1,
        email: "admin@admin.com",
        role: "admin",
        name: "Olivia Rhye",
        avatar: AvatarImage,
      },
    },
    "user@user.com": {
      email: "user@user.com",
      password: "users",
      user: {
        id: 2,
        email: "user@user.com",
        role: "user",
        name: "Olivia Rhye",
        avatar: AvatarImage,
      },
    },
  };

  // Actions
  async function login(email, password) {
    isLoading.value = true;
    error.value = null;

    try {
      // DEVELOPMENT MODE: Use mock auth
      if (import.meta.env.MODE === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

        const mockUser = mockUsers[email];

        if (!mockUser || mockUser.password !== password) {
          throw new Error("Invalid email or password");
        }

        // Mock successful login
        const mockToken = `mock-token-${Date.now()}`;

        user.value = mockUser.user;
        token.value = mockToken;

        // Save to localStorage
        localStorage.setItem("auth_token", mockToken);
        localStorage.setItem("auth_user", JSON.stringify(mockUser.user));

        // Role-based redirect
        const redirectPath =
          mockUser.user.role === "admin" ? "/admin/overview" : "/overview";

        await router.push(redirectPath);

        return { success: true };
      }

      // PRODUCTION MODE: Use real API
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

      // Set auth state
      user.value = data.user;
      token.value = data.token;
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));

      // Role-based redirect
      const redirectPath =
        data.user.role === "admin" ? "/admin/overview" : "/overview";

      await router.push(redirectPath);

      return { success: true };
    } catch (err) {
      error.value = err.message || "Login failed";
      console.error("Login error:", err);
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  }

  async function loginWithGoogle() {
    console.log("Google OAuth not implemented");
  }

  async function sendPasswordReset(email) {
    isLoading.value = true;
    error.value = null;

    try {
      // DEVELOPMENT MODE: Mock password reset
      if (import.meta.env.MODE === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log("Mock: Password reset code sent to", email);
        return { success: true };
      }

      // PRODUCTION MODE: Real API
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
      error.value = err.message || "Failed to send reset code";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  }

  async function resetPassword(email, code, newPassword) {
    isLoading.value = true;
    error.value = null;

    try {
      // DEVELOPMENT MODE: Mock password reset
      if (import.meta.env.MODE === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Simple validation
        if (code !== "1234") {
          throw new Error("Invalid verification code");
        }

        console.log("Mock: Password reset successful for", email);
        return { success: true };
      }

      // PRODUCTION MODE: Real API
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Password reset failed");
      }

      return { success: true };
    } catch (err) {
      error.value = err.message || "Password reset failed";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  }

  // Initialize auth by loading from localStorage
  async function initAuth() {
    try {
      // Load token from localStorage
      const storedToken = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("auth_user");

      if (!storedToken || !storedUser) {
        console.log("No stored auth data found");
        return;
      }

      // DEVELOPMENT MODE: Use stored data
      if (import.meta.env.MODE === "development") {
        token.value = storedToken;
        user.value = JSON.parse(storedUser);
        console.log("Auth restored from localStorage:", user.value);
        return;
      }

      // PRODUCTION MODE: Validate token with API
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Token validation failed");
      }

      const data = await response.json();
      token.value = storedToken;
      user.value = data.user;
      localStorage.setItem("auth_user", JSON.stringify(data.user));

      console.log("Auth validated with API:", user.value);
    } catch (err) {
      console.error("Auth initialization failed:", err);
      // Clear invalid auth data
      logout();
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    router.push("/login");
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,

    // Getters
    isAuthenticated,
    isAdmin,

    // Actions
    login,
    loginWithGoogle,
    sendPasswordReset,
    resetPassword,
    initAuth,
    logout,
  };
});
