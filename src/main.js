import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import "./assets/styles/base.css";
import "./assets/styles/components.scss";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Initialize auth state from localStorage
import { useAuthStore } from "./stores/useAuthStore";
const authStore = useAuthStore();
authStore.initAuth();

app.mount("#app");
