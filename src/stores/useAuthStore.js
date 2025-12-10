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
  const isAdmin = computed(() => user.value?.role === "admin");
  const isUser = computed(() => user.value?.role === "user");

  // Dev users for testing
  const DEV_USERS = {
    admin: {
      email: "admin@admin.com",
      password: "admin",
      userData: {
        id: 1,
        name: "Olivia Rhye",
        email: "admin@admin.com",
        role: "admin",
        avatar: "/src/assets/images/Avatar.png",
      },
    },
    user: {
      email: "user@user.com",
      password: "users",
      userData: {
        id: 2,
        name: "John Doe",
        email: "user@user.com",
        role: "user",
        avatar: "/src/assets/images/Avatar.png",
      },
    },
  };

  // Dev-only login helper
  async function devLogin(userType = "admin") {
    if (import.meta.env.MODE !== "development") {
      console.error("Dev login only available in development mode");
      return { success: false };
    }

    const devUser = DEV_USERS[userType];
    if (!devUser) {
      console.error("Invalid user type");
      return { success: false };
    }

    console.log(`🔧 DEV MODE: Logging in as ${userType}`);
    user.value = devUser.userData;
    token.value = `dev-token-${userType}-${Date.now()}`;
    localStorage.setItem("auth_token", token.value);

    // Redirect based on role
    if (userType === "admin") {
      router.push("/overview");
    } else {
      router.push("/overview"); // Regular users also see overview
    }

    return { success: true };
  }

  // Login function
  async function login(email, password) {
    isLoading.value = true;
    error.value = null;

    try {
      // DEV MODE: Check for dev credentials
      if (import.meta.env.MODE === "development") {
        // Check admin credentials
        if (
          email === DEV_USERS.admin.email &&
          password === DEV_USERS.admin.password
        ) {
          console.log("🔧 DEV MODE: Admin login");
          return await devLogin("admin");
        }
        // Check user credentials
        if (
          email === DEV_USERS.user.email &&
          password === DEV_USERS.user.password
        ) {
          console.log("🔧 DEV MODE: User login");
          return await devLogin("user");
        }
      }

      // Normal login flow (production)
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

      // Redirect based on role
      if (data.user.role === "admin") {
        router.push("/overview");
      } else {
        router.push("/overview");
      }

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
      // DEV MODE: Simulate successful registration
      if (import.meta.env.MODE === "development") {
        console.log("🔧 DEV MODE: Simulating registration");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        user.value = {
          id: Date.now(),
          name: email.split("@")[0],
          email: email,
          role: "user", // New registrations are regular users
          avatar: "/src/assets/images/Avatar.png",
        };
        token.value = "dev-token-" + Date.now();
        localStorage.setItem("auth_token", token.value);
        router.push("/overview");
        return { success: true };
      }

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
      // DEV MODE: Simulate successful password reset request
      if (import.meta.env.MODE === "development") {
        console.log(
          "🔧 DEV MODE: Simulating password reset email sent to",
          email
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { success: true };
      }

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

  async function resetPassword(email, code, password) {
    isLoading.value = true;
    error.value = null;

    try {
      // DEV MODE: Simulate successful password reset
      if (import.meta.env.MODE === "development") {
        console.log("🔧 DEV MODE: Simulating password reset for", email);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Validate code format in dev mode
        if (code.length !== 4 || !/^\d+$/.test(code)) {
          throw new Error("Invalid verification code");
        }

        return { success: true };
      }

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Password reset failed");
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
        // DEV MODE: Auto-login with stored token
        if (import.meta.env.MODE === "development") {
          // Try to restore user from token
          if (token.value.includes("admin")) {
            user.value = DEV_USERS.admin.userData;
          } else {
            user.value = DEV_USERS.user.userData;
          }
          return;
        }

        // TODO: Fetch user data from API using token
      } catch (err) {
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
    isAdmin,
    isUser,
    login,
    register,
    loginWithGoogle,
    sendPasswordReset,
    resetPassword,
    logout,
    initAuth,
    devLogin,
  };
});
