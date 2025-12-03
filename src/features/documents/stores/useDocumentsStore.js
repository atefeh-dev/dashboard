import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useDocumentsStore = defineStore("documents", () => {
  const activeNav = ref("Documents");
  const sidebarOpen = ref(false);
  const currentPage = ref(1);
  const perPage = ref(5);
  const search = ref("");

  const stats = ref([
    { label: "# of total documents", value: 24 },
    { label: "# of drafts", value: 14 },
    { label: "# of pending documents", value: 238 },
    { label: "# of available templates", value: 66 },
  ]);

  const navItems = ref([
    { icon: "Home", label: "Overview" },
    { icon: "Bell", label: "Notifications", badge: 10 },
    { icon: "Package", label: "Products" },
    { icon: "LayoutGrid", label: "Forms" },
    { icon: "FileText", label: "Templates" },
    { icon: "FileText", label: "Documents" },
    { icon: "Zap", label: "Automations" },
    { icon: "BarChart3", label: "Reports" },
    { icon: "Users", label: "Members and teams" },
    { icon: "Building2", label: "Companies" },
    { icon: "Users", label: "People" },
    { icon: "List", label: "Lists" },
    { icon: "FolderClosed", label: "2024 Contracts" },
  ]);

  const documents = ref([
    {
      name: "Ephemeral",
      domain: "ephemeral.io",
      status: "Active",
      categories: ["Customer data", "Admin"],
      rating: "5%",
      direction: "up",
      date: "22 Jan 2025",
      tags: 4,
    },
    {
      name: "Stack3d Lab",
      domain: "stack3dlab.com",
      status: "Active",
      categories: ["Business data", "Admin"],
      rating: "4%",
      direction: "down",
      date: "20 Jan 2025",
      tags: 4,
    },
    {
      name: "Warpspeed",
      domain: "getwarpspeed.com",
      status: "Active",
      categories: ["Customer data", "Financials"],
      rating: "6%",
      direction: "up",
      date: "24 Jan 2025",
      tags: 0,
    },
    {
      name: "CloudWatch",
      domain: "cloudwatch.app",
      status: "Active",
      categories: ["Database access", "Admin"],
      rating: "8%",
      direction: "up",
      date: "26 Jan 2025",
      tags: 0,
    },
    {
      name: "ContrastAI",
      domain: "contrastai.com",
      status: "Active",
      categories: ["Salesforce", "Admin"],
      rating: "1%",
      direction: "down",
      date: "18 Jan 2025",
      tags: 4,
    },
    {
      name: "Convergence",
      domain: "convergence.io",
      status: "Active",
      categories: ["Business data", "Admin"],
      rating: "6%",
      direction: "down",
      date: "28 Jan 2025",
      tags: 4,
    },
    {
      name: "Sisyphus",
      domain: "sisyphus.com",
      status: "Inactive",
      categories: ["Customer data", "Financials"],
      rating: "2%",
      direction: "up",
      date: "16 Jan 2025",
      tags: 0,
    },
  ]);

  const filtered = computed(() => {
    if (!search.value) return documents.value;
    const q = search.value.toLowerCase();
    return documents.value.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.domain.toLowerCase().includes(q) ||
        d.categories.join(" ").toLowerCase().includes(q)
    );
  });

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filtered.value.length / perPage.value))
  );

  const paginated = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    return filtered.value.slice(start, start + perPage.value);
  });

  function setActiveNav(label) {
    activeNav.value = label;
  }
  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
  }
  function goToPage(page) {
    if (page < 1) page = 1;
    if (page > totalPages.value) page = totalPages.value;
    currentPage.value = page;
  }
  function setSearch(q) {
    search.value = q;
    currentPage.value = 1;
  }
  function removeDocument(index) {
    documents.value.splice(index, 1);
  }
  function addDocument(doc) {
    documents.value.unshift(doc);
  }

  return {
    activeNav,
    sidebarOpen,
    currentPage,
    perPage,
    search,
    stats,
    navItems,
    documents,
    filtered,
    paginated,
    totalPages,
    setActiveNav,
    toggleSidebar,
    goToPage,
    setSearch,
    removeDocument,
    addDocument,
  };
});
