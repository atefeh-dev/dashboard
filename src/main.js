import { createApp } from "vue";
import { createPinia } from "pinia";
import { configure } from "vee-validate";
import router from "./router";
import App from "./App.vue";
import "./assets/styles/base.css";
import "./assets/styles/components.scss";

configure({
  validateOnInput: false,
  validateOnChange: false,
  validateOnModelUpdate: false,
  validateOnBlur: true,
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Initialize auth state from localStorage
import { useAuthStore } from "./stores/useAuthStore";
const authStore = useAuthStore(pinia);
authStore.initAuth();

app.mount("#app");
