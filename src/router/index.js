import { createRouter, createWebHistory } from "vue-router";
import DocumentsPage from "@/features/documents/pages/DocumentsPage.vue";

const routes = [
  { path: "/", redirect: "/documents" },
  { path: "/documents", component: DocumentsPage },
  { path: "/:catchAll(.*)", redirect: "/documents" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
