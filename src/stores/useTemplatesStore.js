import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useTemplatesStore = defineStore("templates", () => {
  // Filters state
  const searchQuery = ref("");
  const statusFilter = ref("verified");
  const typeFilter = ref("all");
  // const selectedTags = ref(["nda", "non-disclosure"]); // Initial tags from Figma
  const selectedTags = ref([]); // Initial tags from Figma

  // Mock templates data with content
  const templates = ref([
    {
      id: 1,
      name: "Non Disclosure Agreement",
      author: "doclast",
      lastUpdate: "December 5, 2025",
      tags: ["nda", "legal", "confidential", "agreement"],
      status: "verified",
      type: "agreement",
      content: `<p>No aspect of nature on this beach is more mysterious to me than the flights of these shore-bird constellations. The constellation forms, as I have hinted, in an instant of time, and in that same instant develops its own will.</p>

<p>Birds which have been feeding yards away from each other, each one individually busy for his individual body's sake, suddenly rise into the new volition as one, coast as one, till as one, and as one wheel off on the course the new group will has determined.</p>

<p>There is no such thing, I may say, as a lead bird or guide. Had I more space I should like nothing better than to discuss this new will and its instant of origin, but I do not want to crowd this part of my chapter, and must therefore leave the problem to all who study the psychic relations of the individual to the herd, the herd to the surrounding many.</p>

<p>My special interest is rather the instant and synchronous obedience of each speeding body to the new volition. By what means, by what methods of communication does this will so suffuse the living constellation that its dozen or more tiny brains know it and obey it in such an instancy of time?</p>

<p>Are we to believe that these birds, all of them, are machina, as Descartes long ago insisted, mere mechanisms of flesh and bone so exquisitely alike that each cogwheel brain, encountering the same environmental forces, synchronously lets slip the same mechanic ratchet? or is there some psychic relation between these creatures? Does some current flow through them and between them as they fly?</p>

<p>Schools of fish, I am told, make similar mass changes of direction. I saw such a thing once, but of that more anon.</p>

<p>The afternoon sun sinks red as fire, the tide climbs the beach, its foam a strange crimson; miles out, a freighter goes north, emerging from the shoals.</p>

<p>We need another and a wiser and perhaps a more mystical concept of animals. Remote from universal nature, and living by complicated artifice, man in civilization surveys the creature through the glass of his knowledge and sees thereby a feather magnified and the whole image in distortion.</p>`,
    },
    {
      id: 2,
      name: "Employment Contract",
      author: "doclast",
      lastUpdate: "December 4, 2025",
      tags: ["employment", "contract", "legal"],
      status: "verified",
      type: "contract",
      content: `<h2>Employment Contract</h2>
<p>This Employment Contract is entered into between the Employer and the Employee...</p>
<p><strong>Terms and Conditions:</strong></p>
<ul>
  <li>Position and Duties</li>
  <li>Compensation and Benefits</li>
  <li>Working Hours</li>
  <li>Termination Conditions</li>
</ul>`,
    },
    {
      id: 3,
      name: "Service Agreement",
      author: "doclast",
      lastUpdate: "December 3, 2025",
      tags: ["service", "agreement", "business"],
      status: "verified",
      type: "agreement",
      content: `<h2>Service Agreement</h2>
<p>This Service Agreement outlines the terms and conditions for services provided...</p>`,
    },
    {
      id: 4,
      name: "Partnership Agreement",
      author: "doclast",
      lastUpdate: "December 2, 2025",
      tags: ["partnership", "business", "legal"],
      status: "verified",
      type: "agreement",
      content: `<h2>Partnership Agreement</h2>
<p>This Partnership Agreement is made between the partners to establish...</p>`,
    },
    {
      id: 5,
      name: "Consulting Agreement",
      author: "doclast",
      lastUpdate: "December 1, 2025",
      tags: ["consulting", "service", "agreement"],
      status: "verified",
      type: "agreement",
      content: `<h2>Consulting Agreement</h2>
<p>This Consulting Agreement sets forth the terms under which consulting services will be provided...</p>`,
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

  // Get template by ID
  function getTemplateById(id) {
    return templates.value.find((t) => t.id === id);
  }

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
    clearAllTags();
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
    getTemplateById,
  };
});
