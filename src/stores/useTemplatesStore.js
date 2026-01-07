import { defineStore } from "pinia";
import { ref, computed } from "vue";
import NdaTemplate from "../templates/nda.html?raw";
import EmploymentContractTemplate from "../templates/employment-contract.html?raw";
import ServiceAgreementTemplate from "../templates/service-agreement.html?raw";
import PartnershipAgreementTemplate from "../templates/partnership-agreement.html?raw";
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
      // Define the fields this template needs
      fields: [
        {
          name: "effectiveDate",
          label: "Effective Date",
          type: "date",
          required: true,
        },
        {
          name: "disclosingPartyName",
          label: "Disclosing Party Name",
          type: "text",
          required: true,
        },
        {
          name: "disclosingPartyAddress",
          label: "Disclosing Party Address",
          type: "textarea",
          required: true,
        },
        {
          name: "disclosingPartyEmail",
          label: "Disclosing Party Email",
          type: "email",
          required: true,
        },
        {
          name: "receivingPartyName",
          label: "Receiving Party Name",
          type: "text",
          required: true,
        },
        {
          name: "receivingPartyAddress",
          label: "Receiving Party Address",
          type: "textarea",
          required: true,
        },
        {
          name: "receivingPartyEmail",
          label: "Receiving Party Email",
          type: "email",
          required: true,
        },
        {
          name: "purpose",
          label: "Purpose of Disclosure",
          type: "textarea",
          required: true,
          rows: 4,
        },
      ],
      content: NdaTemplate,
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
          label: "Effective Date",
          type: "date",
          required: true,
        },
        {
          name: "employerName",
          label: "Employer Name",
          type: "text",
          required: true,
        },
        {
          name: "employerEmail",
          label: "Employer Email",
          type: "email",
          required: true,
        },
        {
          name: "employeeName",
          label: "Employee Name",
          type: "text",
          required: true,
        },
        {
          name: "employeeEmail",
          label: "Employee Email",
          type: "email",
          required: true,
        },
        {
          name: "position",
          label: "Job Title / Position",
          type: "text",
          required: true,
        },
        {
          name: "workLocation",
          label: "Work Location",
          type: "text",
          required: true,
        },
        {
          name: "salary",
          label: "Salary",
          type: "text",
          required: true,
        },
      ],
      content: EmploymentContractTemplate,
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
          label: "Effective Date",
          type: "date",
          required: true,
        },
        {
          name: "clientName",
          label: "Client Name",
          type: "text",
          required: true,
        },
        {
          name: "clientEmail",
          label: "Client Email",
          type: "email",
          required: true,
        },
        {
          name: "providerName",
          label: "Service Provider Name",
          type: "text",
          required: true,
        },
        {
          name: "providerEmail",
          label: "Service Provider Email",
          type: "email",
          required: true,
        },
        {
          name: "servicesDescription",
          label: "Description of Services",
          type: "textarea",
          required: true,
          rows: 5,
        },
        {
          name: "serviceTerm",
          label: "Service Term",
          type: "text",
          required: true,
        },
        {
          name: "serviceFee",
          label: "Service Fee",
          type: "text",
          required: true,
        },
        {
          name: "paymentTerms",
          label: "Payment Terms",
          type: "textarea",
          required: true,
          rows: 4,
        },
        {
          name: "terminationNotice",
          label: "Termination Notice Period",
          type: "text",
          required: true,
        },
      ],
      content: ServiceAgreementTemplate,
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
        },
        {
          name: "partnerOneName",
          label: "Partner One Name",
          type: "text",
          required: true,
        },
        {
          name: "partnerOneEmail",
          label: "Partner One Email",
          type: "email",
          required: true,
        },
        {
          name: "partnerTwoName",
          label: "Partner Two Name",
          type: "text",
          required: true,
        },
        {
          name: "partnerTwoEmail",
          label: "Partner Two Email",
          type: "email",
          required: true,
        },
        {
          name: "partnershipPurpose",
          label: "Purpose of Partnership",
          type: "textarea",
          required: true,
          rows: 4,
        },
        {
          name: "partnerOneContribution",
          label: "Partner One Contribution",
          type: "text",
          required: true,
        },
        {
          name: "partnerTwoContribution",
          label: "Partner Two Contribution",
          type: "text",
          required: true,
        },
        {
          name: "partnerOneShare",
          label: "Partner One Profit/Loss Share",
          type: "text",
          required: true,
        },
        {
          name: "partnerTwoShare",
          label: "Partner Two Profit/Loss Share",
          type: "text",
          required: true,
        },
        {
          name: "partnershipTerm",
          label: "Partnership Term",
          type: "text",
          required: true,
        },
      ],
      content: PartnershipAgreementTemplate,
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
        },
        {
          name: "consultantName",
          label: "Consultant Name",
          type: "text",
          required: true,
        },
        {
          name: "consultantEmail",
          label: "Consultant Email",
          type: "email",
          required: true,
        },
        {
          name: "clientName",
          label: "Client Name",
          type: "text",
          required: true,
        },
        {
          name: "clientEmail",
          label: "Client Email",
          type: "email",
          required: true,
        },
        {
          name: "consultingServices",
          label: "Consulting Services Description",
          type: "textarea",
          required: true,
          rows: 5,
        },
        {
          name: "hourlyRate",
          label: "Hourly Rate or Project Fee",
          type: "text",
          required: true,
        },
        {
          name: "projectDuration",
          label: "Expected Project Duration",
          type: "text",
          required: true,
        },
      ],
      content: `<div style="max-width: 800px; margin: 0 auto; padding: 40px 20px; font-family: 'Georgia', serif; line-height: 1.8; color: #1a1a1a;">
  <h1 style="text-align: center; font-size: 28px; font-weight: bold; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 3px solid #8b5cf6; padding-bottom: 15px;">Consulting Agreement</h1>

  <p style="margin-bottom: 20px; text-align: justify;">This Consulting Agreement (the "Agreement") is entered into as of <strong>{{effectiveDate}}</strong> (the "Effective Date") by and between:</p>

  <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%); border-left: 5px solid #8b5cf6; border-radius: 8px;">
    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #6b21a8;">CONSULTANT</h3>
    <p style="margin: 8px 0;"><strong>Name:</strong> {{consultantName}}</p>
    <p style="margin: 8px 0;"><strong>Email:</strong> {{consultantEmail}}</p>
  </div>

  <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #ffedd5 0%, #fff7ed 100%); border-left: 5px solid #f97316; border-radius: 8px;">
    <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #9a3412;">CLIENT</h3>
    <p style="margin: 8px 0;"><strong>Name:</strong> {{clientName}}</p>
    <p style="margin: 8px 0;"><strong>Email:</strong> {{clientEmail}}</p>
  </div>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #6b21a8; border-bottom: 2px solid #c4b5fd; padding-bottom: 8px;">1. CONSULTING SERVICES</h2>
  <p style="margin-bottom: 16px; text-align: justify;">The Consultant agrees to provide the following consulting services to the Client:</p>
  <div style="padding: 15px; background-color: #f9fafb; border-radius: 6px; margin-bottom: 20px;">
    <p style="text-align: justify; white-space: pre-wrap;">{{consultingServices}}</p>
  </div>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #6b21a8; border-bottom: 2px solid #c4b5fd; padding-bottom: 8px;">2. COMPENSATION</h2>
  <p style="margin-bottom: 16px; text-align: justify;">The Client shall compensate the Consultant at a rate of <strong>{{hourlyRate}}</strong> for services rendered under this Agreement.</p>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #6b21a8; border-bottom: 2px solid #c4b5fd; padding-bottom: 8px;">3. TERM</h2>
  <p style="margin-bottom: 16px; text-align: justify;">The expected duration of this consulting engagement is <strong>{{projectDuration}}</strong>, commencing on the Effective Date. This Agreement may be extended or terminated by mutual written agreement of both parties.</p>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #6b21a8; border-bottom: 2px solid #c4b5fd; padding-bottom: 8px;">4. PAYMENT TERMS</h2>
  <p style="margin-bottom: 16px; text-align: justify;">Payment terms are as follows:</p>
  <ul style="margin-left: 25px; margin-bottom: 20px;">
    <li style="margin-bottom: 10px;">Invoices will be submitted bi-weekly or monthly</li>
    <li style="margin-bottom: 10px;">Payment is due within thirty (30) days of invoice receipt</li>
    <li style="margin-bottom: 10px;">Late payments may incur interest charges at 1.5% per month</li>
  </ul>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #6b21a8; border-bottom: 2px solid #c4b5fd; padding-bottom: 8px;">5. INDEPENDENT CONTRACTOR STATUS</h2>
  <p style="margin-bottom: 16px; text-align: justify;">The Consultant is engaged as an independent contractor and not as an employee. The Consultant is responsible for all applicable taxes, insurance, and other obligations arising from this independent contractor status.</p>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #6b21a8; border-bottom: 2px solid #c4b5fd; padding-bottom: 8px;">6. CONFIDENTIALITY AND INTELLECTUAL PROPERTY</h2>
  <p style="margin-bottom: 16px; text-align: justify;">The Consultant agrees to maintain strict confidentiality regarding all proprietary information and trade secrets of the Client. Any intellectual property developed during the course of this engagement shall be owned by the Client unless otherwise agreed in writing.</p>

  <h2 style="font-size: 20px; font-weight: bold; margin-top: 35px; margin-bottom: 15px; color: #6b21a8; border-bottom: 2px solid #c4b5fd; padding-bottom: 8px;">7. TERMINATION</h2>
  <p style="margin-bottom: 16px; text-align: justify;">Either party may terminate this Agreement with thirty (30) days written notice. Upon termination, the Consultant shall be compensated for all work completed up to the termination date.</p>

  <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px;">
      <div>
        <p style="margin-bottom: 30px;"><strong>CONSULTANT:</strong></p>
        <div style="border-bottom: 2px solid #000; width: 100%; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Signature</p>
        <p style="margin-top: 20px; font-size: 14px;">{{consultantName}}</p>
        <div style="border-bottom: 2px solid #000; width: 150px; margin-top: 30px; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Date</p>
      </div>
      <div>
        <p style="margin-bottom: 30px;"><strong>CLIENT:</strong></p>
        <div style="border-bottom: 2px solid #000; width: 100%; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Signature</p>
        <p style="margin-top: 20px; font-size: 14px;">{{clientName}}</p>
        <div style="border-bottom: 2px solid #000; width: 150px; margin-top: 30px; margin-bottom: 8px;"></div>
        <p style="font-size: 14px; color: #6b7280;">Date</p>
      </div>
    </div>
  </div>
</div>`,
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

    // Handle both data structures: { items: [...] } or direct array [...]
    const inputFormsData =
      currentDocument.value.inputForms?.items ||
      currentDocument.value.inputForms ||
      [];

    console.log("[Templates Store] Input forms data:", inputFormsData);

    // Get the first item's data for simple placeholders
    const firstItem =
      Array.isArray(inputFormsData) && inputFormsData.length > 0
        ? inputFormsData[0]
        : {};

    console.log("[Templates Store] First item data:", firstItem);

    // Replace all {{variable}} placeholders with actual values
    content = content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = firstItem[key];

      if (value !== undefined && value !== null && value !== "") {
        console.log(`[Templates Store] Replacing {{${key}}} with:`, value);
        return String(value);
      }

      console.warn(`[Templates Store] No value found for {{${key}}}`);
      return match; // Keep placeholder if no value
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
            (tag) => tag.toLowerCase() === selectedTag.toLowerCase()
          )
        );
      });
    }

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

  function updateDetails(detailsData) {
    currentDocument.value.details = {
      ...currentDocument.value.details,
      ...JSON.parse(JSON.stringify(detailsData)),
    };
    console.log(
      "[Templates Store] Updated details:",
      currentDocument.value.details
    );
  }

  function updateInputForms(formsData) {
    // Handle both structures: { items: [...] } or direct [...]
    if (formsData?.items && Array.isArray(formsData.items)) {
      currentDocument.value.inputForms = JSON.parse(
        JSON.stringify(formsData.items)
      );
    } else if (Array.isArray(formsData)) {
      currentDocument.value.inputForms = JSON.parse(JSON.stringify(formsData));
    } else {
      currentDocument.value.inputForms = [];
    }

    console.log(
      "[Templates Store] Updated input forms:",
      currentDocument.value.inputForms
    );
  }

  function updatePreview(previewData) {
    currentDocument.value.preview = {
      ...currentDocument.value.preview,
      ...previewData,
    };
    console.log(
      "[Templates Store] Updated preview:",
      currentDocument.value.preview
    );
  }

  function updateDocument(documentData) {
    currentDocument.value.document = {
      ...currentDocument.value.document,
      ...documentData,
    };
    console.log(
      "[Templates Store] Updated document:",
      currentDocument.value.document
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
