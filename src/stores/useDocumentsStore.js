import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useDocumentsStore = defineStore("documents", () => {
  const activeNav = ref("Overview");
  const sidebarOpen = ref(false);
  const currentPage = ref(1);
  const perPage = ref(10);
  const search = ref("");
  const activeTab = ref("companies");

  // Draft management
  const currentDraft = ref(null);
  const lastSavedAt = ref(null);

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
      {
        name: "DataSync",
        domain: "datasync.io",
        status: "Active",
        categories: ["Analytics", "Admin"],
        rating: "7%",
        direction: "up",
        date: "15 Jan 2025",
        tags: 2,
      },
      {
        name: "FlowMetrics",
        domain: "flowmetrics.com",
        status: "Active",
        categories: ["Business data", "Reports"],
        rating: "9%",
        direction: "up",
        date: "19 Jan 2025",
        tags: 3,
      },
      {
        name: "SecureVault",
        domain: "securevault.app",
        status: "Active",
        categories: ["Security", "Admin"],
        rating: "5%",
        direction: "down",
        date: "21 Jan 2025",
        tags: 1,
      },
      {
        name: "TeamHub",
        domain: "teamhub.io",
        status: "Active",
        categories: ["Collaboration", "Teams"],
        rating: "3%",
        direction: "up",
        date: "23 Jan 2025",
        tags: 5,
      },
      {
        name: "ProjectCore",
        domain: "projectcore.com",
        status: "Active",
        categories: ["Project mgmt", "Admin"],
        rating: "6%",
        direction: "up",
        date: "17 Jan 2025",
        tags: 2,
      },
      {
        name: "CloudBase",
        domain: "cloudbase.io",
        status: "Active",
        categories: ["Database", "Infrastructure"],
        rating: "8%",
        direction: "up",
        date: "14 Jan 2025",
        tags: 0,
      },
      {
        name: "ApiGateway",
        domain: "apigateway.dev",
        status: "Active",
        categories: ["API", "Developer"],
        rating: "4%",
        direction: "down",
        date: "13 Jan 2025",
        tags: 1,
      },
      {
        name: "MonitorPro",
        domain: "monitorpro.io",
        status: "Active",
        categories: ["Monitoring", "Admin"],
        rating: "7%",
        direction: "up",
        date: "12 Jan 2025",
        tags: 3,
      },
      {
        name: "BackupMax",
        domain: "backupmax.com",
        status: "Active",
        categories: ["Backup", "Security"],
        rating: "2%",
        direction: "down",
        date: "11 Jan 2025",
        tags: 0,
      },
      {
        name: "AutoScale",
        domain: "autoscale.cloud",
        status: "Active",
        categories: ["Infrastructure", "DevOps"],
        rating: "9%",
        direction: "up",
        date: "10 Jan 2025",
        tags: 2,
      },
      {
        name: "LogStream",
        domain: "logstream.io",
        status: "Active",
        categories: ["Logging", "Developer"],
        rating: "5%",
        direction: "up",
        date: "09 Jan 2025",
        tags: 1,
      },
      {
        name: "CacheFast",
        domain: "cachefast.net",
        status: "Active",
        categories: ["Performance", "Infrastructure"],
        rating: "6%",
        direction: "up",
        date: "08 Jan 2025",
        tags: 0,
      },
      {
        name: "QueueMaster",
        domain: "queuemaster.io",
        status: "Active",
        categories: ["Messaging", "Infrastructure"],
        rating: "3%",
        direction: "down",
        date: "07 Jan 2025",
        tags: 2,
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
      {
        name: "Jane Smith",
        domain: "jane@example.com",
        status: "Active",
        categories: ["Designer", "Creative"],
        rating: "7%",
        direction: "up",
        date: "19 Jan 2025",
        tags: 1,
      },
      {
        name: "Mike Johnson",
        domain: "mike@example.com",
        status: "Active",
        categories: ["Manager", "Leadership"],
        rating: "9%",
        direction: "up",
        date: "18 Jan 2025",
        tags: 3,
      },
      {
        name: "Sarah Williams",
        domain: "sarah@example.com",
        status: "Active",
        categories: ["Developer", "Frontend"],
        rating: "6%",
        direction: "down",
        date: "17 Jan 2025",
        tags: 2,
      },
      {
        name: "David Brown",
        domain: "david@example.com",
        status: "Active",
        categories: ["DevOps", "Infrastructure"],
        rating: "8%",
        direction: "up",
        date: "16 Jan 2025",
        tags: 1,
      },
      {
        name: "Emily Davis",
        domain: "emily@example.com",
        status: "Active",
        categories: ["Product", "Strategy"],
        rating: "5%",
        direction: "up",
        date: "15 Jan 2025",
        tags: 0,
      },
      {
        name: "Chris Wilson",
        domain: "chris@example.com",
        status: "Active",
        categories: ["Sales", "Business"],
        rating: "7%",
        direction: "up",
        date: "14 Jan 2025",
        tags: 2,
      },
      {
        name: "Amanda Taylor",
        domain: "amanda@example.com",
        status: "Active",
        categories: ["Marketing", "Content"],
        rating: "4%",
        direction: "down",
        date: "13 Jan 2025",
        tags: 1,
      },
      {
        name: "Robert Lee",
        domain: "robert@example.com",
        status: "Active",
        categories: ["Developer", "Backend"],
        rating: "9%",
        direction: "up",
        date: "12 Jan 2025",
        tags: 3,
      },
      {
        name: "Lisa Anderson",
        domain: "lisa@example.com",
        status: "Active",
        categories: ["HR", "Operations"],
        rating: "6%",
        direction: "up",
        date: "11 Jan 2025",
        tags: 0,
      },
      {
        name: "James Martinez",
        domain: "james@example.com",
        status: "Active",
        categories: ["Finance", "Accounting"],
        rating: "3%",
        direction: "down",
        date: "10 Jan 2025",
        tags: 1,
      },
      {
        name: "Patricia Garcia",
        domain: "patricia@example.com",
        status: "Active",
        categories: ["Legal", "Compliance"],
        rating: "7%",
        direction: "up",
        date: "09 Jan 2025",
        tags: 2,
      },
      {
        name: "Thomas Rodriguez",
        domain: "thomas@example.com",
        status: "Active",
        categories: ["Support", "Customer"],
        rating: "5%",
        direction: "up",
        date: "08 Jan 2025",
        tags: 1,
      },
      {
        name: "Linda Hernandez",
        domain: "linda@example.com",
        status: "Active",
        categories: ["Design", "UX"],
        rating: "8%",
        direction: "up",
        date: "07 Jan 2025",
        tags: 2,
      },
      {
        name: "Daniel Moore",
        domain: "daniel@example.com",
        status: "Active",
        categories: ["Developer", "Mobile"],
        rating: "6%",
        direction: "down",
        date: "06 Jan 2025",
        tags: 0,
      },
      {
        name: "Barbara Jackson",
        domain: "barbara@example.com",
        status: "Active",
        categories: ["Product", "Management"],
        rating: "7%",
        direction: "up",
        date: "05 Jan 2025",
        tags: 1,
      },
      {
        name: "Paul White",
        domain: "paul@example.com",
        status: "Active",
        categories: ["Security", "Engineering"],
        rating: "9%",
        direction: "up",
        date: "04 Jan 2025",
        tags: 3,
      },
      {
        name: "Nancy Harris",
        domain: "nancy@example.com",
        status: "Active",
        categories: ["Data", "Analytics"],
        rating: "4%",
        direction: "down",
        date: "03 Jan 2025",
        tags: 0,
      },
      {
        name: "Mark Clark",
        domain: "mark@example.com",
        status: "Active",
        categories: ["QA", "Testing"],
        rating: "6%",
        direction: "up",
        date: "02 Jan 2025",
        tags: 2,
      },
      {
        name: "Carol Lewis",
        domain: "carol@example.com",
        status: "Active",
        categories: ["Design", "Brand"],
        rating: "5%",
        direction: "up",
        date: "01 Jan 2025",
        tags: 1,
      },
    ],
    documents: [
      {
        name: "Q4 Report",
        domain: "report-2024.pdf",
        status: "Inactive",
        categories: ["Financial", "Reports"],
        rating: "7%",
        direction: "up",
        date: "25 Jan 2025",
        tags: 3,
      },
      {
        name: "Product Roadmap",
        domain: "roadmap-2025.pdf",
        status: "Active",
        categories: ["Product", "Planning"],
        rating: "8%",
        direction: "up",
        date: "24 Jan 2025",
        tags: 2,
      },
      {
        name: "Design System",
        domain: "design-system.pdf",
        status: "Active",
        categories: ["Design", "Documentation"],
        rating: "6%",
        direction: "up",
        date: "23 Jan 2025",
        tags: 1,
      },
      {
        name: "API Documentation",
        domain: "api-docs.pdf",
        status: "Active",
        categories: ["Developer", "Technical"],
        rating: "9%",
        direction: "up",
        date: "22 Jan 2025",
        tags: 4,
      },
      {
        name: "Marketing Strategy",
        domain: "marketing-q1.pdf",
        status: "Active",
        categories: ["Marketing", "Strategy"],
        rating: "5%",
        direction: "down",
        date: "21 Jan 2025",
        tags: 2,
      },
      {
        name: "Sales Deck",
        domain: "sales-deck.pdf",
        status: "Active",
        categories: ["Sales", "Presentation"],
        rating: "7%",
        direction: "up",
        date: "20 Jan 2025",
        tags: 3,
      },
      {
        name: "User Research",
        domain: "user-research.pdf",
        status: "Active",
        categories: ["UX", "Research"],
        rating: "6%",
        direction: "up",
        date: "19 Jan 2025",
        tags: 1,
      },
      {
        name: "Technical Specs",
        domain: "tech-specs.pdf",
        status: "Active",
        categories: ["Engineering", "Documentation"],
        rating: "8%",
        direction: "up",
        date: "18 Jan 2025",
        tags: 2,
      },
      {
        name: "Brand Guidelines",
        domain: "brand-guide.pdf",
        status: "Active",
        categories: ["Brand", "Design"],
        rating: "4%",
        direction: "down",
        date: "17 Jan 2025",
        tags: 0,
      },
      {
        name: "Security Policy",
        domain: "security-policy.pdf",
        status: "Active",
        categories: ["Security", "Policy"],
        rating: "9%",
        direction: "up",
        date: "16 Jan 2025",
        tags: 3,
      },
      {
        name: "HR Handbook",
        domain: "hr-handbook.pdf",
        status: "Active",
        categories: ["HR", "Policy"],
        rating: "5%",
        direction: "up",
        date: "15 Jan 2025",
        tags: 1,
      },
      {
        name: "Budget 2025",
        domain: "budget-2025.xlsx",
        status: "Active",
        categories: ["Finance", "Planning"],
        rating: "7%",
        direction: "up",
        date: "14 Jan 2025",
        tags: 2,
      },
      {
        name: "Competitor Analysis",
        domain: "competitor-analysis.pdf",
        status: "Active",
        categories: ["Strategy", "Research"],
        rating: "6%",
        direction: "up",
        date: "13 Jan 2025",
        tags: 1,
      },
      {
        name: "Customer Feedback",
        domain: "feedback-q4.pdf",
        status: "Active",
        categories: ["Customer", "Insights"],
        rating: "8%",
        direction: "up",
        date: "12 Jan 2025",
        tags: 2,
      },
      {
        name: "Training Materials",
        domain: "training-docs.pdf",
        status: "Active",
        categories: ["HR", "Training"],
        rating: "3%",
        direction: "down",
        date: "11 Jan 2025",
        tags: 0,
      },
      {
        name: "Architecture Diagram",
        domain: "architecture.pdf",
        status: "Active",
        categories: ["Engineering", "Documentation"],
        rating: "9%",
        direction: "up",
        date: "10 Jan 2025",
        tags: 4,
      },
      {
        name: "Meeting Notes",
        domain: "meeting-notes.pdf",
        status: "Active",
        categories: ["General", "Notes"],
        rating: "4%",
        direction: "down",
        date: "09 Jan 2025",
        tags: 1,
      },
      {
        name: "Legal Contract",
        domain: "contract-vendor.pdf",
        status: "Active",
        categories: ["Legal", "Contract"],
        rating: "7%",
        direction: "up",
        date: "08 Jan 2025",
        tags: 2,
      },
      {
        name: "Onboarding Guide",
        domain: "onboarding.pdf",
        status: "Active",
        categories: ["HR", "Documentation"],
        rating: "6%",
        direction: "up",
        date: "07 Jan 2025",
        tags: 1,
      },
      {
        name: "Performance Review",
        domain: "perf-review.pdf",
        status: "Active",
        categories: ["HR", "Assessment"],
        rating: "5%",
        direction: "up",
        date: "06 Jan 2025",
        tags: 0,
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
      {
        name: "Contract Template",
        domain: "contract.docx",
        status: "Active",
        categories: ["Legal", "Templates"],
        rating: "8%",
        direction: "up",
        date: "14 Jan 2025",
        tags: 1,
      },
      {
        name: "Proposal Template",
        domain: "proposal.docx",
        status: "Active",
        categories: ["Sales", "Templates"],
        rating: "7%",
        direction: "up",
        date: "13 Jan 2025",
        tags: 0,
      },
      {
        name: "Report Template",
        domain: "report.docx",
        status: "Active",
        categories: ["Reports", "Templates"],
        rating: "6%",
        direction: "down",
        date: "12 Jan 2025",
        tags: 2,
      },
      {
        name: "Email Template",
        domain: "email.html",
        status: "Active",
        categories: ["Marketing", "Templates"],
        rating: "8%",
        direction: "up",
        date: "11 Jan 2025",
        tags: 1,
      },
      {
        name: "Presentation Template",
        domain: "presentation.pptx",
        status: "Active",
        categories: ["Presentation", "Templates"],
        rating: "9%",
        direction: "up",
        date: "10 Jan 2025",
        tags: 0,
      },
      {
        name: "Meeting Agenda",
        domain: "agenda.docx",
        status: "Active",
        categories: ["Meetings", "Templates"],
        rating: "5%",
        direction: "up",
        date: "09 Jan 2025",
        tags: 1,
      },
      {
        name: "Project Brief",
        domain: "brief.docx",
        status: "Active",
        categories: ["Project", "Templates"],
        rating: "7%",
        direction: "up",
        date: "08 Jan 2025",
        tags: 2,
      },
      {
        name: "Status Update",
        domain: "status.docx",
        status: "Active",
        categories: ["Reports", "Templates"],
        rating: "6%",
        direction: "up",
        date: "07 Jan 2025",
        tags: 0,
      },
      {
        name: "Job Description",
        domain: "job-desc.docx",
        status: "Active",
        categories: ["HR", "Templates"],
        rating: "8%",
        direction: "up",
        date: "06 Jan 2025",
        tags: 1,
      },
      {
        name: "User Story",
        domain: "user-story.docx",
        status: "Active",
        categories: ["Product", "Templates"],
        rating: "4%",
        direction: "down",
        date: "05 Jan 2025",
        tags: 0,
      },
      {
        name: "Bug Report",
        domain: "bug-report.docx",
        status: "Active",
        categories: ["QA", "Templates"],
        rating: "7%",
        direction: "up",
        date: "04 Jan 2025",
        tags: 2,
      },
      {
        name: "Feature Spec",
        domain: "feature-spec.docx",
        status: "Active",
        categories: ["Product", "Templates"],
        rating: "9%",
        direction: "up",
        date: "03 Jan 2025",
        tags: 1,
      },
      {
        name: "Design Brief",
        domain: "design-brief.docx",
        status: "Active",
        categories: ["Design", "Templates"],
        rating: "6%",
        direction: "up",
        date: "02 Jan 2025",
        tags: 0,
      },
      {
        name: "Test Plan",
        domain: "test-plan.docx",
        status: "Active",
        categories: ["QA", "Templates"],
        rating: "5%",
        direction: "up",
        date: "01 Jan 2025",
        tags: 1,
      },
      {
        name: "Release Notes",
        domain: "release-notes.docx",
        status: "Active",
        categories: ["Engineering", "Templates"],
        rating: "8%",
        direction: "up",
        date: "31 Dec 2024",
        tags: 2,
      },
      {
        name: "Requirements Doc",
        domain: "requirements.docx",
        status: "Active",
        categories: ["Product", "Templates"],
        rating: "7%",
        direction: "up",
        date: "30 Dec 2024",
        tags: 1,
      },
      {
        name: "Change Request",
        domain: "change-request.docx",
        status: "Active",
        categories: ["Project", "Templates"],
        rating: "4%",
        direction: "down",
        date: "29 Dec 2024",
        tags: 0,
      },
      {
        name: "Risk Assessment",
        domain: "risk-assessment.docx",
        status: "Active",
        categories: ["Project", "Templates"],
        rating: "6%",
        direction: "up",
        date: "28 Dec 2024",
        tags: 1,
      },
      {
        name: "Retrospective",
        domain: "retrospective.docx",
        status: "Active",
        categories: ["Agile", "Templates"],
        rating: "9%",
        direction: "up",
        date: "27 Dec 2024",
        tags: 2,
      },
    ],
    // Drafts array for storing work in progress
    drafts: [],
  });

  // Stats - dynamic based on actual data
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
      const draftCount = allData.value.drafts?.length || 0;
      return [
        {
          label: "# of total documents",
          value: allData.value.documents.length,
        },
        { label: "# of drafts", value: draftCount },
        { label: "# of pending documents", value: 0 },
        {
          label: "# of available templates",
          value: allData.value.templates.length,
        },
      ];
    }
    return [];
  });

  // Get current documents based on context
  const documents = computed(() => {
    if (activeNav.value === "Overview") {
      return allData.value[activeTab.value] || [];
    } else if (activeNav.value === "Documents") {
      return allData.value.documents || [];
    }
    return [];
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
    const actualIndex = (currentPage.value - 1) * perPage.value + index;

    if (activeNav.value === "Documents") {
      allData.value.documents.splice(actualIndex, 1);
    } else if (activeNav.value === "Overview") {
      const dataKey = activeTab.value;
      allData.value[dataKey].splice(actualIndex, 1);
    }
  }

  function addDocument(doc) {
    allData.value.documents.unshift(doc);
  }

  // ========================================
  // DRAFT MANAGEMENT FUNCTIONS
  // ========================================

  function createDraft() {
    const draft = {
      id: `draft-${Date.now()}`,
      name: "Untitled Document",
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentStep: 0,
      completedSteps: [],
      formData: {
        name: "",
        filename: "",
        description: "",
        status: "draft",
      },
      selectedTemplate: null,
      stepData: {
        details: {},
        input: {},
        review: {},
        preview: {},
      },
    };

    allData.value.drafts.unshift(draft);
    currentDraft.value = draft;
    lastSavedAt.value = new Date().toISOString();

    console.log("✅ Draft created:", draft.id);
    return draft;
  }

  function loadDraft(draftId) {
    const draft = allData.value.drafts.find((d) => d.id === draftId);
    if (draft) {
      currentDraft.value = draft;
      lastSavedAt.value = draft.updatedAt;
      console.log("✅ Draft loaded:", draftId);
    } else {
      console.warn("⚠️ Draft not found:", draftId);
    }
    return draft;
  }

  function saveDraft(updates) {
    if (!currentDraft.value) {
      console.log("No current draft, creating new one...");
      return createDraft();
    }

    // Update the draft
    Object.assign(currentDraft.value, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    // Update in drafts array
    const index = allData.value.drafts.findIndex(
      (d) => d.id === currentDraft.value.id
    );
    if (index !== -1) {
      allData.value.drafts[index] = { ...currentDraft.value };
    }

    lastSavedAt.value = new Date().toISOString();
    console.log("💾 Draft saved:", currentDraft.value.id);

    return currentDraft.value;
  }

  function deleteDraft(draftId) {
    const index = allData.value.drafts.findIndex((d) => d.id === draftId);
    if (index !== -1) {
      allData.value.drafts.splice(index, 1);
      console.log("🗑️ Draft deleted:", draftId);
    }
    if (currentDraft.value?.id === draftId) {
      currentDraft.value = null;
      lastSavedAt.value = null;
    }
  }

  function clearCurrentDraft() {
    currentDraft.value = null;
    lastSavedAt.value = null;
  }

  function convertDraftToDocument(draftId) {
    const draft = allData.value.drafts.find((d) => d.id === draftId);
    if (!draft) return null;

    const document = {
      name: draft.formData.name || "Untitled Document",
      domain: draft.formData.filename || "document.pdf",
      status: "Active",
      categories: ["Document"],
      rating: "0%",
      direction: "up",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      tags: 0,
    };

    addDocument(document);
    deleteDraft(draftId);

    console.log("✅ Draft converted to document:", document.name);
    return document;
  }

  return {
    activeNav,
    sidebarOpen,
    currentPage,
    perPage,
    search,
    activeTab,
    stats,
    allData,
    documents,
    filtered,
    paginated,
    totalPages,
    currentDraft,
    lastSavedAt,
    setActiveNav,
    setActiveTab,
    toggleSidebar,
    goToPage,
    setSearch,
    removeDocument,
    addDocument,
    // Draft functions
    createDraft,
    loadDraft,
    saveDraft,
    deleteDraft,
    clearCurrentDraft,
    convertDraftToDocument,
  };
});
