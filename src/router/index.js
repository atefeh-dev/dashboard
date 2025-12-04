import { createRouter, createWebHistory } from "vue-router";
import OverviewPage from "@/features/overview/pages/OverviewPage.vue";
import DocumentsPage from "@/features/documents/pages/DocumentsPage.vue";

const routes = [
  { path: "/", redirect: "/overview" },
  { path: "/overview", name: "Overview", component: OverviewPage },
  { path: "/documents", name: "Documents", component: DocumentsPage },
  { path: "/:catchAll(.*)", redirect: "/overview" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
