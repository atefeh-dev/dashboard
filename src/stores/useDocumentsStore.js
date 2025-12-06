import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useDocumentsStore = defineStore("documents", () => {
  const activeNav = ref("Overview");
  const sidebarOpen = ref(false);
  const currentPage = ref(1);
  const perPage = ref(10);
  const search = ref("");
  const activeTab = ref("companies"); // For Overview tabs

  // All data in one place
  const allData = ref({
    companies: [
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
    ],
    people: [
      {
        name: "John Doe",
        domain: "john@example.com",
        status: "Active",
        categories: ["Developer", "Admin"],
        rating: "8%",
        direction: "up",
        date: "20 Jan 2025",
        tags: 2,
      },
    ],
    documents: [
      {
        name: "Q4 Report",
        domain: "report-2024.pdf",
        status: "Active",
        categories: ["Financial", "Reports"],
        rating: "7%",
        direction: "up",
        date: "25 Jan 2025",
        tags: 3,
      },
    ],
    templates: [
      {
        name: "Invoice Template",
        domain: "invoice.docx",
        status: "Active",
        categories: ["Financial", "Templates"],
        rating: "9%",
        direction: "up",
        date: "15 Jan 2025",
        tags: 0,
      },
    ],
  });

  // Stats - changes based on active page
  const stats = computed(() => {
    if (activeNav.value === "Overview") {
      return [
        { label: "# of companies", value: allData.value.companies.length },
        { label: "# of people", value: allData.value.people.length },
        { label: "# of documents", value: allData.value.documents.length },
        {
          label: "# of available templates",
          value: allData.value.templates.length,
        },
      ];
    } else if (activeNav.value === "Documents") {
      const totalDocs = allData.value.documents?.length || 0;
      return [
        { label: "# of total documents", value: totalDocs },
        { label: "# of drafts", value: 0 },
        { label: "# of pending documents", value: 0 },
        {
          label: "# of available templates",
          value: allData.value.templates.length,
        },
      ];
    }
    return [];
  });

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

  // Get current documents based on active tab or page
  const documents = computed(() => {
    if (activeNav.value === "Overview") {
      return allData.value[activeTab.value] || [];
    } else if (activeNav.value === "Documents") {
      return allData.value.documents || [];
    }
    return allData.value.companies || [];
  });

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
    currentPage.value = 1;
    search.value = "";
  }

  function setActiveTab(tab) {
    activeTab.value = tab;
    currentPage.value = 1;
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
    // Calculate the actual index in the array
    const actualIndex = (currentPage.value - 1) * perPage.value + index;

    // Remove from the correct data source based on context
    if (activeNav.value === "Documents") {
      allData.value.documents.splice(actualIndex, 1);
    } else if (activeNav.value === "Overview") {
      const dataKey = activeTab.value; // companies, people, documents, templates
      allData.value[dataKey].splice(actualIndex, 1);
    }
  }

  function addDocument(doc) {
    // Add to documents array
    allData.value.documents.unshift(doc);
  }

  return {
    activeNav,
    sidebarOpen,
    currentPage,
    perPage,
    search,
    activeTab,
    stats,
    navItems,
    allData,
    documents,
    filtered,
    paginated,
    totalPages,
    setActiveNav,
    setActiveTab,
    toggleSidebar,
    goToPage,
    setSearch,
    removeDocument,
    addDocument,
  };
});
