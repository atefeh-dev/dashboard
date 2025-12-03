import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import "./assets/styles/base.css"; // ← This line is critical
import "./assets/styles/components.scss"; // ← This line is critical

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
