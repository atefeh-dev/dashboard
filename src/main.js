import { createApp } from "vue";
import { createPinia } from "pinia";
import { configure } from "vee-validate";
import router from "./router";
import App from "./App.vue";
import "./assets/styles/base.css";
import "./assets/styles/components.scss";

// Configure vee-validate
configure({
  validateOnInput: false,
  validateOnChange: false,
  validateOnModelUpdate: false,
  validateOnBlur: true,
});

// Create app and pinia
const app = createApp(App);
const pinia = createPinia();

// Use plugins
app.use(pinia);
app.use(router);

// Mount the app
app.mount("#app");

// REMOVED: Don't manually call initAuth here
// The router guard will handle it automatically on first navigation
