import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useTemplatesStore = defineStore("templates", () => {
  // Filters state
  const searchQuery = ref("");
  const statusFilter = ref("verified");
  const typeFilter = ref("all");
  const selectedTags = ref(["nda", "non-disclosure"]); // Initial tags from Figma

  // Mock templates data
  const templates = ref([
    {
      id: 1,
      name: "Non Disclosure Agreement",
      author: "doclast",
      lastUpdate: "December 5, 2025",
      tags: ["nda", "legal", "confidential", "agreement"],
      status: "verified",
      type: "agreement",
    },
    {
      id: 2,
      name: "Employment Contract",
      author: "doclast",
      lastUpdate: "December 4, 2025",
      tags: ["employment", "contract", "legal"],
      status: "verified",
      type: "contract",
    },
    {
      id: 3,
      name: "Service Agreement",
      author: "doclast",
      lastUpdate: "December 3, 2025",
      tags: ["service", "agreement", "business"],
      status: "verified",
      type: "agreement",
    },
    {
      id: 4,
      name: "Partnership Agreement",
      author: "doclast",
      lastUpdate: "December 2, 2025",
      tags: ["partnership", "business", "legal"],
      status: "verified",
      type: "agreement",
    },
    {
      id: 5,
      name: "Consulting Agreement",
      author: "doclast",
      lastUpdate: "December 1, 2025",
      tags: ["consulting", "service", "agreement"],
      status: "verified",
      type: "agreement",
    },
  ]);

  // Computed: Filtered templates based on all filters
  const filteredTemplates = computed(() => {
    let result = templates.value;

    // Filter by status
    if (statusFilter.value !== "all") {
      result = result.filter((t) => t.status === statusFilter.value);
    }

    // Filter by type
    if (typeFilter.value !== "all") {
      result = result.filter((t) => t.type === typeFilter.value);
    }

    // Filter by selected tags (exact match - template must have ALL selected tags)
    if (selectedTags.value.length > 0) {
      result = result.filter((template) => {
        return selectedTags.value.every((selectedTag) =>
          template.tags.some(
            (tag) => tag.toLowerCase() === selectedTag.toLowerCase()
          )
        );
      });
    }

    // Filter by search query (matches name or tags)
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        (template) =>
          template.name.toLowerCase().includes(query) ||
          template.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return result;
  });

  // Get all unique tags from all templates
  const allAvailableTags = computed(() => {
    const tagsSet = new Set();
    templates.value.forEach((template) => {
      template.tags.forEach((tag) => tagsSet.add(tag.toLowerCase()));
    });
    return Array.from(tagsSet).sort();
  });

  // Actions
  function setSearchQuery(query) {
    searchQuery.value = query;
  }

  function setStatusFilter(status) {
    statusFilter.value = status;
  }

  function setTypeFilter(type) {
    typeFilter.value = type;
  }

  function addTag(tag) {
    const normalizedTag = tag.toLowerCase().trim();
    if (normalizedTag && !selectedTags.value.includes(normalizedTag)) {
      selectedTags.value.push(normalizedTag);
    }
  }

  function removeTag(tag) {
    const index = selectedTags.value.findIndex(
      (t) => t.toLowerCase() === tag.toLowerCase()
    );
    if (index > -1) {
      selectedTags.value.splice(index, 1);
    }
  }

  function clearAllTags() {
    selectedTags.value = [];
  }

  function resetFilters() {
    searchQuery.value = "";
    statusFilter.value = "verified";
    typeFilter.value = "all";
    selectedTags.value = [];
  }

  return {
    // State
    searchQuery,
    statusFilter,
    typeFilter,
    selectedTags,
    templates,

    // Computed
    filteredTemplates,
    allAvailableTags,

    // Actions
    setSearchQuery,
    setStatusFilter,
    setTypeFilter,
    addTag,
    removeTag,
    clearAllTags,
    resetFilters,
  };
});
