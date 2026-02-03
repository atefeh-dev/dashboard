/**
 * @file useTemplatesStore.js
 * @location src/stores/useTemplatesStore.js
 *
 * Template store with comprehensive validation rules
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import ConsultingAgreementTemplateContent from "../templates/consulting-agreement.html?raw";
import EmploymentContractTemplateContent from "../templates/employment-contract.html?raw";
import ServiceAgreementTemplateContent from "../templates/service-agreement.html?raw";
import NDATemplateContent from "../templates/nda.html?raw";
import PartnerShipAgreementTemplateContent from "../templates/partnership-agreement.html?raw";

export const useTemplatesStore = defineStore("document", () => {
  const templates = ref([
    {
      id: 1,
      name: "Non Disclosure Agreement",
      author: "doclast",
      lastUpdate: "December 5, 2025",
      tags: ["nda", "legal", "confidential", "agreement"],
      status: "verified",
      type: "agreement",
      fields: [
        {
          name: "effectiveDate",
          label: "Effective Date",
          type: "date",
          required: true,
          placeholder: "Select effective date",
          hint: "The date when this agreement becomes effective",
          validation: {
            pattern: null,
            minLength: null,
            maxLength: null,
            customMessage: null,
          },
        },
        {
          name: "disclosingPartyName",
          label: "Disclosing Party Name",
          type: "text",
          required: true,
          placeholder: "Enter full legal name",
          hint: "The party who will be sharing confidential information",
          validation: {
            pattern: "^[a-zA-Z\\s\\.,&'-]+$",
            minLength: 3,
            maxLength: 100,
            customMessage:
              "Please enter a valid name (letters, spaces, and common punctuation only)",
          },
        },
        {
          name: "disclosingPartyAddress",
          label: "Disclosing Party Address",
          type: "textarea",
          required: true,
          rows: 3,
          placeholder: "Enter complete address",
          hint: "Full mailing address including city, state, and zip code",
          validation: {
            pattern: null,
            minLength: 10,
            maxLength: 500,
            customMessage: null,
          },
        },
        {
          name: "disclosingPartyEmail",
          label: "Disclosing Party Email",
          type: "email",
          required: true,
          placeholder: "email@example.com",
          hint: "Primary contact email for the disclosing party",
          validation: {
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            minLength: null,
            maxLength: 100,
            customMessage: "Please enter a valid email address",
          },
        },
        {
          name: "receivingPartyName",
          label: "Receiving Party Name",
          type: "text",
          required: true,
          placeholder: "Enter full legal name",
          hint: "The party who will be receiving confidential information",
          validation: {
            pattern: "^[a-zA-Z\\s\\.,&'-]+$",
            minLength: 3,
            maxLength: 100,
            customMessage:
              "Please enter a valid name (letters, spaces, and common punctuation only)",
          },
        },
        {
          name: "receivingPartyAddress",
          label: "Receiving Party Address",
          type: "textarea",
          required: true,
          rows: 3,
          placeholder: "Enter complete address",
          hint: "Full mailing address including city, state, and zip code",
          validation: {
            pattern: null,
            minLength: 10,
            maxLength: 500,
            customMessage: null,
          },
        },
        {
          name: "receivingPartyEmail",
          label: "Receiving Party Email",
          type: "email",
          required: true,
          placeholder: "email@example.com",
          hint: "Primary contact email for the receiving party",
          validation: {
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            minLength: null,
            maxLength: 100,
            customMessage: "Please enter a valid email address",
          },
        },
        {
          name: "purpose",
          label: "Purpose of Disclosure",
          type: "textarea",
          required: true,
          rows: 4,
          placeholder:
            "Describe the specific purpose for sharing confidential information",
          hint: "Be specific about why confidential information will be shared",
          validation: {
            pattern: null,
            minLength: 20,
            maxLength: 1000,
            customMessage: null,
          },
        },
      ],
      content: NDATemplateContent,
    },
    {
      id: 2,
      name: "Employment Contract",
      author: "doclast",
      lastUpdate: "December 4, 2025",
      tags: ["employment", "contract", "legal"],
      status: "verified",
      type: "contract",
      fields: [
        {
          name: "effectiveDate",
          label: "Employment Start Date",
          type: "date",
          required: true,
          placeholder: "Select start date",
          hint: "The date the employee will begin work",
          validation: {
            pattern: null,
            minLength: null,
            maxLength: null,
            customMessage: null,
          },
        },
        {
          name: "employerName",
          label: "Employer Name",
          type: "text",
          required: true,
          placeholder: "Enter company/employer name",
          hint: "Legal name of the employing entity",
          validation: {
            pattern: "^[a-zA-Z0-9\\s\\.,&'-]+$",
            minLength: 2,
            maxLength: 100,
            customMessage: "Please enter a valid company name",
          },
        },
        {
          name: "employerEmail",
          label: "Employer Contact Email",
          type: "email",
          required: true,
          placeholder: "hr@company.com",
          hint: "HR or primary contact email",
          validation: {
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            minLength: null,
            maxLength: 100,
            customMessage: "Please enter a valid email address",
          },
        },
        {
          name: "employeeName",
          label: "Employee Full Name",
          type: "text",
          required: true,
          placeholder: "Enter employee's full legal name",
          hint: "As it appears on official documents",
          validation: {
            pattern: "^[a-zA-Z\\s\\.,'-]+$",
            minLength: 3,
            maxLength: 100,
            customMessage:
              "Please enter a valid name (letters, spaces, and common punctuation only)",
          },
        },
        {
          name: "employeeEmail",
          label: "Employee Email",
          type: "email",
          required: true,
          placeholder: "employee@email.com",
          hint: "Employee's work or personal email",
          validation: {
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            minLength: null,
            maxLength: 100,
            customMessage: "Please enter a valid email address",
          },
        },
        {
          name: "position",
          label: "Job Title / Position",
          type: "text",
          required: true,
          placeholder: "e.g., Senior Software Engineer",
          hint: "Official job title",
          validation: {
            pattern: "^[a-zA-Z0-9\\s\\.,/-]+$",
            minLength: 3,
            maxLength: 100,
            customMessage: "Please enter a valid job title",
          },
        },
        {
          name: "workLocation",
          label: "Primary Work Location",
          type: "text",
          required: true,
          placeholder: "e.g., New York Office, Remote",
          hint: "Where the employee will primarily work",
          validation: {
            pattern: "^[a-zA-Z0-9\\s\\.,/-]+$",
            minLength: 3,
            maxLength: 200,
            customMessage: "Please enter a valid location",
          },
        },
        {
          name: "salary",
          label: "Annual Salary",
          type: "text",
          required: true,
          placeholder: "e.g., $75,000 per year",
          hint: "Base salary and payment frequency",
          validation: {
            pattern:
              "^\\$?[0-9,]+(\\.\\d{2})?\\s*(per\\s+(year|month|hour|week)|annually|monthly|hourly|weekly)?$",
            minLength: 5,
            maxLength: 100,
            customMessage:
              "Please enter a valid salary format (e.g., $75,000 per year or $50/hour)",
          },
        },
      ],
      content: EmploymentContractTemplateContent,
    },
    {
      id: 3,
      name: "Service Agreement",
      author: "doclast",
      lastUpdate: "December 3, 2025",
      tags: ["service", "agreement", "business"],
      status: "verified",
      type: "agreement",
      fields: [
        {
          name: "effectiveDate",
          label: "Agreement Start Date",
          type: "date",
          required: true,
          placeholder: "Select start date",
          hint: "When services will begin",
          validation: {
            pattern: null,
            minLength: null,
            maxLength: null,
            customMessage: null,
          },
        },
        {
          name: "clientName",
          label: "Client Name",
          type: "text",
          required: true,
          placeholder: "Enter client name or company",
          hint: "Individual or organization receiving services",
          validation: {
            pattern: "^[a-zA-Z0-9\\s\\.,&'-]+$",
            minLength: 2,
            maxLength: 100,
            customMessage: "Please enter a valid name",
          },
        },
        {
          name: "clientEmail",
          label: "Client Email",
          type: "email",
          required: true,
          placeholder: "client@email.com",
          hint: "Primary contact email",
          validation: {
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            minLength: null,
            maxLength: 100,
            customMessage: "Please enter a valid email address",
          },
        },
        {
          name: "providerName",
          label: "Service Provider Name",
          type: "text",
          required: true,
          placeholder: "Enter provider name",
          hint: "Individual or company providing services",
          validation: {
            pattern: "^[a-zA-Z0-9\\s\\.,&'-]+$",
            minLength: 2,
            maxLength: 100,
            customMessage: "Please enter a valid name",
          },
        },
        {
          name: "providerEmail",
          label: "Provider Email",
          type: "email",
          required: true,
          placeholder: "provider@email.com",
          hint: "Service provider contact email",
          validation: {
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            minLength: null,
            maxLength: 100,
            customMessage: "Please enter a valid email address",
          },
        },
        {
          name: "servicesDescription",
          label: "Description of Services",
          type: "textarea",
          required: true,
          rows: 5,
          placeholder: "Describe the services to be provided in detail",
          hint: "Be specific about deliverables, scope, and expectations",
          validation: {
            pattern: null,
            minLength: 50,
            maxLength: 2000,
            customMessage: null,
          },
        },
        {
          name: "serviceTerm",
          label: "Service Term / Duration",
          type: "text",
          required: true,
          placeholder: "e.g., 6 months, Ongoing, Project-based",
          hint: "How long services will be provided",
          validation: {
            pattern:
              "^(\\d+\\s+(day|days|week|weeks|month|months|year|years)|ongoing|project-based|indefinite|until completion)$",
            minLength: 3,
            maxLength: 100,
            customMessage:
              "Please enter a valid duration (e.g., 6 months, 3 weeks, Ongoing, Project-based)",
          },
        },
        {
          name: "serviceFee",
          label: "Service Fee / Rate",
          type: "text",
          required: true,
          placeholder: "e.g., $5,000/month, $150/hour",
          hint: "Compensation amount and frequency",
          validation: {
            pattern:
              "^\\$?[0-9,]+(\\.\\d{2})?\\s*(/|per)?\\s*(hour|month|year|week|project|day)?$",
            minLength: 5,
            maxLength: 100,
            customMessage:
              "Please enter a valid fee format (e.g., $5,000/month, $150/hour, $10,000 per project)",
          },
        },
        {
          name: "paymentTerms",
          label: "Payment Terms",
          type: "textarea",
          required: true,
          rows: 4,
          placeholder: "Describe payment schedule and conditions",
          hint: "Include due dates, accepted payment methods, late fees, etc.",
          validation: {
            pattern: null,
            minLength: 20,
            maxLength: 1000,
            customMessage: null,
          },
        },
        {
          name: "terminationNotice",
          label: "Termination Notice Period",
          type: "text",
          required: true,
          placeholder: "e.g., 30 days written notice",
          hint: "Required notice period for ending the agreement",
          validation: {
            pattern:
              "^\\d+\\s+(day|days|week|weeks|month|months)\\s*(written\\s+notice|notice)?$",
            minLength: 5,
            maxLength: 100,
            customMessage:
              "Please enter a valid notice period (e.g., 30 days written notice, 2 weeks notice)",
          },
        },
      ],
      content: ServiceAgreementTemplateContent,
    },
    {
      id: 4,
      name: "Partnership Agreement",
      author: "doclast",
      lastUpdate: "December 2, 2025",
      tags: ["partnership", "business", "legal"],
      status: "verified",
      type: "agreement",
      fields: [
        {
          name: "effectiveDate",
          label: "Effective Date",
          type: "date",
          required: true,
          placeholder: "Select effective date",
          hint: "The date when the partnership becomes effective",
          validation: {
            pattern: null,
            minLength: null,
            maxLength: null,
            customMessage: null,
          },
        },
        {
          name: "partnerOneName",
          label: "Partner One Name",
          type: "text",
          required: true,
          placeholder: "Enter full legal name",
          hint: "Full legal name of the first partner",
          validation: {
            pattern: "^[a-zA-Z\\s\\.,'-]+$",
            minLength: 2,
            maxLength: 100,
            customMessage:
              "Please enter a valid name (letters, spaces, and common punctuation only)",
          },
        },
        {
          name: "partnerOneEmail",
          label: "Partner One Email",
          type: "email",
          required: true,
          placeholder: "email@example.com",
          hint: "Primary contact email for partner one",
          validation: {
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            minLength: null,
            maxLength: 100,
            customMessage: "Please enter a valid email address",
          },
        },
        {
          name: "partnerTwoName",
          label: "Partner Two Name",
          type: "text",
          required: true,
          placeholder: "Enter full legal name",
          hint: "Full legal name of the second partner",
          validation: {
            pattern: "^[a-zA-Z\\s\\.,'-]+$",
            minLength: 2,
            maxLength: 100,
            customMessage:
              "Please enter a valid name (letters, spaces, and common punctuation only)",
          },
        },
        {
          name: "partnerTwoEmail",
          label: "Partner Two Email",
          type: "email",
          required: true,
          placeholder: "email@example.com",
          hint: "Primary contact email for partner two",
          validation: {
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            minLength: null,
            maxLength: 100,
            customMessage: "Please enter a valid email address",
          },
        },
        {
          name: "partnershipPurpose",
          label: "Purpose of Partnership",
          type: "textarea",
          required: true,
          rows: 4,
          placeholder: "Describe the partnership purpose and goals",
          hint: "Be specific about objectives, scope, and intended activities",
          validation: {
            pattern: null,
            minLength: 20,
            maxLength: 1000,
            customMessage: null,
          },
        },
        {
          name: "partnerOneContribution",
          label: "Partner One Contribution",
          type: "text",
          required: true,
          placeholder: "Describe cash, assets, or services contributed",
          hint: "Include approximate values or percentages if applicable",
          validation: {
            pattern: null,
            minLength: 3,
            maxLength: 300,
            customMessage: null,
          },
        },
        {
          name: "partnerTwoContribution",
          label: "Partner Two Contribution",
          type: "text",
          required: true,
          placeholder: "Describe cash, assets, or services contributed",
          hint: "Include approximate values or percentages if applicable",
          validation: {
            pattern: null,
            minLength: 3,
            maxLength: 300,
            customMessage: null,
          },
        },
        {
          name: "partnerOneShare",
          label: "Partner One Profit/Loss Share",
          type: "text",
          required: true,
          placeholder: "e.g., 50%",
          hint: "Profit and loss sharing percentage for partner one",
          validation: {
            pattern: "^(100|[1-9]?\\d)\\s*%?$",
            minLength: 2,
            maxLength: 50,
            customMessage:
              "Please enter a valid percentage (e.g., 50%, 33.33%, 25)",
          },
        },
        {
          name: "partnerTwoShare",
          label: "Partner Two Profit/Loss Share",
          type: "text",
          required: true,
          placeholder: "e.g., 50%",
          hint: "Profit and loss sharing percentage for partner two",
          validation: {
            pattern: "^(100|[1-9]?\\d)\\s*%?$",
            minLength: 2,
            maxLength: 50,
            customMessage:
              "Please enter a valid percentage (e.g., 50%, 33.33%, 25)",
          },
        },
        {
          name: "partnershipTerm",
          label: "Partnership Term",
          type: "text",
          required: true,
          placeholder: "e.g., 3 years, Ongoing",
          hint: "Length or duration of the partnership",
          validation: {
            pattern:
              "^(\\d+\\s+(day|days|week|weeks|month|months|year|years)|ongoing|indefinite|perpetual)$",
            minLength: 3,
            maxLength: 100,
            customMessage:
              "Please enter a valid duration (e.g., 3 years, 6 months, Ongoing)",
          },
        },
      ],
      content: PartnerShipAgreementTemplateContent,
    },
    {
      id: 5,
      name: "Consulting Agreement",
      author: "doclast",
      lastUpdate: "December 1, 2025",
      tags: ["consulting", "service", "agreement"],
      status: "verified",
      type: "agreement",
      fields: [
        {
          name: "effectiveDate",
          label: "Effective Date",
          type: "date",
          required: true,
          placeholder: "Select effective date",
          hint: "When the consulting engagement begins",
          validation: {
            pattern: null,
            minLength: null,
            maxLength: null,
            customMessage: null,
          },
        },
        {
          name: "consultantName",
          label: "Consultant Name",
          type: "text",
          required: true,
          placeholder: "Enter consultant name",
          hint: "Individual or firm providing consulting services",
          validation: {
            pattern: "^[a-zA-Z0-9\\s\\.,&'-]+$",
            minLength: 2,
            maxLength: 100,
            customMessage: "Please enter a valid name",
          },
        },
        {
          name: "consultantEmail",
          label: "Consultant Email",
          type: "email",
          required: true,
          placeholder: "consultant@email.com",
          hint: "Primary contact email for consultant",
          validation: {
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            minLength: null,
            maxLength: 100,
            customMessage: "Please enter a valid email address",
          },
        },
        {
          name: "clientName",
          label: "Client Name",
          type: "text",
          required: true,
          placeholder: "Enter client name",
          hint: "Organization engaging consultant",
          validation: {
            pattern: "^[a-zA-Z0-9\\s\\.,&'-]+$",
            minLength: 2,
            maxLength: 100,
            customMessage: "Please enter a valid name",
          },
        },
        {
          name: "clientEmail",
          label: "Client Email",
          type: "email",
          required: true,
          placeholder: "client@company.com",
          hint: "Client contact email",
          validation: {
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            minLength: null,
            maxLength: 100,
            customMessage: "Please enter a valid email address",
          },
        },
        {
          name: "consultingServices",
          label: "Consulting Services Description",
          type: "textarea",
          required: true,
          rows: 5,
          placeholder: "Detail the consulting services to be provided",
          hint: "Include scope, deliverables, and expected outcomes",
          validation: {
            pattern: null,
            minLength: 50,
            maxLength: 2000,
            customMessage: null,
          },
        },
        {
          name: "hourlyRate",
          label: "Hourly Rate or Project Fee",
          type: "text",
          required: true,
          placeholder: "e.g., $200/hour or $50,000 fixed",
          hint: "Compensation structure",
          validation: {
            pattern:
              "^\\$?[0-9,]+(\\.\\d{2})?\\s*(/|per)?\\s*(hour|project|day|week|month|fixed)?$",
            minLength: 5,
            maxLength: 100,
            customMessage:
              "Please enter a valid rate (e.g., $200/hour, $50,000 fixed, $1,500 per day)",
          },
        },
        {
          name: "projectDuration",
          label: "Expected Project Duration",
          type: "text",
          required: true,
          placeholder: "e.g., 3 months, 6 weeks",
          hint: "Estimated timeframe for completion",
          validation: {
            pattern: "^\\d+\\s+(day|days|week|weeks|month|months|year|years)$",
            minLength: 3,
            maxLength: 100,
            customMessage:
              "Please enter a valid duration (e.g., 3 months, 6 weeks, 1 year)",
          },
        },
        {
          name: "paymentTerms",
          label: "Payment Terms",
          type: "textarea",
          required: true,
          rows: 4,
          placeholder: "Describe payment schedule and conditions",
          hint: "Include due dates, accepted payment methods, late fees, etc.",
          validation: {
            pattern: null,
            minLength: 20,
            maxLength: 1000,
            customMessage: null,
          },
        },
        {
          name: "terminationNotice",
          label: "Termination Notice Period",
          type: "text",
          required: true,
          placeholder: "e.g., 30 days written notice",
          hint: "Required notice period for ending the agreement",
          validation: {
            pattern:
              "^\\d+\\s+(day|days|week|weeks|month|months)\\s*(written\\s+notice|notice)?$",
            minLength: 5,
            maxLength: 100,
            customMessage:
              "Please enter a valid notice period (e.g., 30 days written notice, 2 weeks notice)",
          },
        },
      ],
      content: ConsultingAgreementTemplateContent,
    },
  ]);

  const currentDocument = ref({
    details: {
      templateId: null,
      name: "",
      filename: "",
      description: "",
      status: "draft",
    },
    inputForms: [],
    preview: {
      content: "",
    },
    document: {
      selectedRecipientIds: [],
      sendToAlternativeEmail: false,
      alternativeEmail: "",
      sendToMyEmail: false,
    },
  });

  // Filters state
  const searchQuery = ref("");
  const statusFilter = ref("verified");
  const typeFilter = ref("all");
  const selectedTags = ref([]);

  const populatedDocumentContent = computed(() => {
    const template = getTemplateById(currentDocument.value.details.templateId);
    if (!template || !template.content) {
      console.warn("[Templates Store] No template found or no content");
      return "";
    }

    let content = template.content;
    console.log("[Templates Store] Populating template:", template.name);

    const inputFormsData =
      currentDocument.value.inputForms?.items ||
      currentDocument.value.inputForms ||
      [];

    console.log("[Templates Store] Input forms data:", inputFormsData);

    const firstItem =
      Array.isArray(inputFormsData) && inputFormsData.length > 0
        ? inputFormsData[0]
        : {};

    console.log("[Templates Store] First item data:", firstItem);

    content = content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = firstItem[key];

      if (value !== undefined && value !== null && value !== "") {
        console.log(`[Templates Store] Replacing {{${key}}} with:`, value);
        return String(value);
      }

      console.warn(`[Templates Store] No value found for {{${key}}}`);
      return match;
    });

    console.log("[Templates Store] Content population complete");
    return content;
  });

  const filteredTemplates = computed(() => {
    let result = templates.value;

    if (statusFilter.value !== "all") {
      result = result.filter((t) => t.status === statusFilter.value);
    }

    if (typeFilter.value !== "all") {
      result = result.filter((t) => t.type === typeFilter.value);
    }

    if (selectedTags.value.length > 0) {
      result = result.filter((template) => {
        return selectedTags.value.every((selectedTag) =>
          template.tags.some(
            (tag) => tag.toLowerCase() === selectedTag.toLowerCase(),
          ),
        );
      });
    }

    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        (template) =>
          template.name.toLowerCase().includes(query) ||
          template.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    return result;
  });

  const allAvailableTags = computed(() => {
    const tagsSet = new Set();
    templates.value.forEach((template) => {
      template.tags.forEach((tag) => tagsSet.add(tag.toLowerCase()));
    });
    return Array.from(tagsSet).sort();
  });

  function getTemplateById(id) {
    return templates.value.find((t) => t.id === id);
  }

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
      (t) => t.toLowerCase() === tag.toLowerCase(),
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

  function updateDetails(detailsData) {
    currentDocument.value.details = {
      ...currentDocument.value.details,
      ...JSON.parse(JSON.stringify(detailsData)),
    };
    console.log(
      "[Templates Store] Updated details:",
      currentDocument.value.details,
    );
  }

  function updateInputForms(formsData) {
    if (formsData?.items && Array.isArray(formsData.items)) {
      currentDocument.value.inputForms = JSON.parse(
        JSON.stringify(formsData.items),
      );
    } else if (Array.isArray(formsData)) {
      currentDocument.value.inputForms = JSON.parse(JSON.stringify(formsData));
    } else {
      currentDocument.value.inputForms = [];
    }

    console.log(
      "[Templates Store] Updated input forms:",
      currentDocument.value.inputForms,
    );
  }

  function updatePreview(previewData) {
    currentDocument.value.preview = {
      ...currentDocument.value.preview,
      ...previewData,
    };
    console.log(
      "[Templates Store] Updated preview:",
      currentDocument.value.preview,
    );
  }

  function updateDocument(documentData) {
    currentDocument.value.document = {
      ...currentDocument.value.document,
      ...documentData,
    };
    console.log(
      "[Templates Store] Updated document:",
      currentDocument.value.document,
    );
  }

  function resetDocument() {
    currentDocument.value = {
      details: {
        templateId: null,
        name: "",
        filename: "",
        description: "",
        status: "draft",
      },
      inputForms: [],
      preview: {
        content: "",
      },
      document: {
        selectedRecipientIds: [],
        sendToAlternativeEmail: false,
        alternativeEmail: "",
        sendToMyEmail: false,
      },
    };
  }

  return {
    searchQuery,
    statusFilter,
    typeFilter,
    selectedTags,
    templates,
    currentDocument,
    filteredTemplates,
    allAvailableTags,
    populatedDocumentContent,
    setSearchQuery,
    setStatusFilter,
    setTypeFilter,
    addTag,
    removeTag,
    clearAllTags,
    resetFilters,
    getTemplateById,
    updateDetails,
    updateInputForms,
    updatePreview,
    updateDocument,
    resetDocument,
  };
});
