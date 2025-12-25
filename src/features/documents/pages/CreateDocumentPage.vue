<template>
  <CreateDocumentLayout
    :current-step-index="currentStepIndex"
    :completed-steps="completedSteps"
    :steps="steps"
    :document-title="documentForm.name || 'New Document'"
    :document-status="documentForm.status"
    :last-save-time="timeSinceLastSave"
    :is-saving="isSaving"
    :show-sidebar="showSidebarForCurrentStep"
    :document-info="sidebarData"
    :documents-sent="documentsSent"
    @go-to-step="goToStep"
    @save-and-exit="saveAndExit"
    @go-back="handleGoBack"
    @complete="completeDocument"
    @edit-info="handleEditInfo"
  >
    <!-- Step 1: Details (No Sidebar - full width) -->
    <DetailsStep
      v-if="currentStep === 'details'"
      :form="documentForm"
      :selected-template="selectedTemplate"
      @continue="completeStep"
      @discard="discard"
      @select-template="selectTemplate"
      @update:form="updateFormData"
    />

    <!-- Step 2: Input Forms (With Sidebar) -->
    <InputFormsStep
      v-if="currentStep === 'input'"
      :step-title="steps[1].title"
      :step-description="steps[1].subtitle"
      :form-fields="inputFormFields"
      :step-data="stepData.input"
      @continue="completeStep"
      @back="previousStep"
      @update:data="updateStepData('input', $event)"
    />

    <!-- Step 3: Review (With Sidebar) -->
    <ReviewStep
      v-if="currentStep === 'review'"
      :step-data="allStepData"
      :review-sections="reviewSections"
      @continue="completeStep"
      @back="previousStep"
      @update:data="updateReviewData"
    />

    <!-- Step 4: Preview (With Sidebar) -->
    <PreviewStep
      v-if="currentStep === 'preview'"
      :step-data="stepData.preview"
      @continue="completeStep"
      @back="previousStep"
      @update:data="updateStepData('preview', $event)"
    />

    <!-- Step 5: Document (With Sidebar) -->
    <DocumentStep
      v-if="currentStep === 'document'"
      @finish="handleSendDocuments"
      @back="previousStep"
    />
  </CreateDocumentLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDocumentsStore } from "@/stores/useDocumentsStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useContactsStore } from "@/stores/useContactsStore";
import { useAutosave } from "@/composables/useAutosave";
import CreateDocumentLayout from "@/features/documents/layout/CreateDocumentLayout.vue";
import DetailsStep from "@/features/documents/components/steps/DetailsStep.vue";
import InputFormsStep from "@/features/documents/components/steps/InputFormsStep.vue";
import ReviewStep from "@/features/documents/components/steps/ReviewStep.vue";
import PreviewStep from "@/features/documents/components/steps/PreviewStep.vue";
import DocumentStep from "@/features/documents/components/steps/DocumentStep.vue";

const router = useRouter();
const route = useRoute();
const documentsStore = useDocumentsStore();
const authStore = useAuthStore();
const contactsStore = useContactsStore();

// Step configuration
const steps = [
  { id: "details", title: "Details", subtitle: "Template and information" },
  { id: "input", title: "Input forms", subtitle: "Based on template needs" },
  { id: "review", title: "Review", subtitle: "Overview inputs and edit" },
  { id: "preview", title: "Preview", subtitle: "See data in action" },
  { id: "document", title: "Document", subtitle: "Save or send for action" },
];

const currentStepIndex = ref(0);
const completedSteps = ref([]);
const currentStep = computed(() => steps[currentStepIndex.value].id);
const isSaving = ref(false);

// NEW: Track if documents have been sent
const documentsSent = ref(false);

// Form data
const selectedTemplate = ref(null);
const documentForm = ref({
  name: "",
  filename: "",
  description: "",
  status: "draft",
});

const stepData = ref({
  details: {},
  input: {},
  review: {},
  preview: {},
});

// ========================================
// SIDEBAR CONFIGURATION
// ========================================

// Show sidebar for all steps except Details (step 0)
const showSidebarForCurrentStep = computed(() => {
  return currentStepIndex.value !== 0;
});

// Sidebar data (for steps 1-4)
const sidebarData = computed(() => ({
  title: documentForm.value.name || "Document title",
  lastEdit: timeSinceLastSave.value || "(not saved yet)",
  status: documentForm.value.status || "Draft",
  statusVariant: getStatusVariant(documentForm.value.status),
  authorName: authStore.user?.name || "User Name",
  authorAvatar: authStore.user?.avatar || "/src/assets/images/av.png",
  templateName: selectedTemplate.value?.name || "Non-Disclosure Agreement",
  templateAuthor: selectedTemplate.value?.author || "doclast",
  templateUpdateDate: selectedTemplate.value?.lastUpdate || "December 5, 2025",
  templateTags: selectedTemplate.value?.tags || ["Tag 1", "Tag 2", "Tag 3"],
  checklistItems: checklistItems.value,
}));

// Dynamic checklist based on STEP completion
const checklistItems = computed(() => {
  return steps.map((step, index) => ({
    title: step.title,
    subtitle: step.subtitle,
    completed: completedSteps.value.includes(index),
    active: currentStepIndex.value === index,
  }));
});

// ========================================
// FORM FIELDS CONFIGURATION (Step 2)
// ========================================

const inputFormFields = [
  {
    name: "yourName",
    label: "Name of your document",
    type: "text",
    placeholder: "For example Accelerator Contract 2025",
    required: true,
    hint: "This is a hint text to help user.",
  },
  {
    name: "yourEmail",
    label: "Your email address",
    type: "email",
    placeholder: "john.doe@example.com",
    required: true,
    hint: "We'll send confirmation to this email",
  },
  {
    name: "companyName",
    label: "Company name",
    type: "text",
    placeholder: "Acme Corporation",
    required: false,
  },
  {
    name: "role",
    label: "Your role",
    type: "select",
    required: true,
    options: [
      { value: "", label: "Select your role" },
      { value: "ceo", label: "CEO" },
      { value: "manager", label: "Manager" },
      { value: "employee", label: "Employee" },
    ],
  },
  {
    name: "additionalInfo",
    label: "Description",
    type: "textarea",
    placeholder: "Provide some details about what this document for ...",
    rows: 5,
    required: false,
  },
];

// ========================================
// REVIEW SECTIONS CONFIGURATION (Step 3)
// ========================================

const reviewSections = [
  {
    key: "details",
    title: "Document Details",
    subtitle: "Template and information",
    fields: [
      {
        name: "name",
        label: "Name of your document",
        type: "text",
        placeholder: "For example Accelerator Contract 2025",
        required: true,
      },
      {
        name: "filename",
        label: "File name to save",
        type: "text-prefix",
        prefix: "doclast-",
        placeholder: "accelerator-contract-2025",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Provide some details about what this document for ...",
        rows: 4,
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "draft", label: "Draft" },
          { value: "active", label: "Active" },
          { value: "archived", label: "Archived" },
        ],
      },
    ],
  },
  {
    key: "input",
    title: "Your details",
    subtitle: "Please provide your name and email",
    fields: [
      {
        name: "yourName",
        label: "Name of your document",
        type: "text",
        placeholder: "For example Accelerator Contract 2025",
        required: true,
      },
      {
        name: "yourEmail",
        label: "Your email address",
        type: "email",
        placeholder: "john.doe@example.com",
        required: true,
      },
      {
        name: "companyName",
        label: "Company name",
        type: "text",
        placeholder: "Acme Corporation",
        required: false,
      },
      {
        name: "role",
        label: "Your role",
        type: "select",
        options: [
          { value: "ceo", label: "CEO" },
          { value: "manager", label: "Manager" },
          { value: "employee", label: "Employee" },
        ],
      },
      {
        name: "additionalInfo",
        label: "Description",
        type: "textarea",
        placeholder: "Provide some details about what this document for ...",
        rows: 4,
      },
    ],
  },
];

// All step data for review
const allStepData = computed(() => ({
  details: documentForm.value,
  input: stepData.value.input,
}));

// ========================================
// AUTOSAVE SETUP
// ========================================

const { timeSinceLastSave, scheduleAutosave, forceSave } = useAutosave(
  async () => {
    await saveDraftToStore();
  },
  {
    debounceMs: 2000,
    updateIntervalMs: 10000,
  }
);

async function saveDraftToStore() {
  isSaving.value = true;
  try {
    await documentsStore.saveDraft({
      currentStep: currentStepIndex.value,
      completedSteps: completedSteps.value,
      formData: documentForm.value,
      selectedTemplate: selectedTemplate.value,
      stepData: stepData.value,
      name: documentForm.value.name || "Untitled Document",
      documentsSent: documentsSent.value,
    });
  } finally {
    isSaving.value = false;
  }
}

// ========================================
// INITIALIZATION
// ========================================

const draftId = route.query.draftId;

if (draftId) {
  const draft = documentsStore.loadDraft(draftId);
  if (draft) {
    currentStepIndex.value = draft.currentStep;
    completedSteps.value = [...draft.completedSteps];
    documentForm.value = { ...draft.formData };
    selectedTemplate.value = draft.selectedTemplate;
    stepData.value = { ...draft.stepData };
    documentsSent.value = draft.documentsSent || false;
  }
} else {
  documentsStore.createDraft();
}

// Load contacts on mount
onMounted(async () => {
  try {
    await contactsStore.fetchContacts();
  } catch (error) {
    console.error("Failed to load contacts:", error);
  }
});

// ========================================
// WATCH FOR CHANGES
// ========================================

watch(
  [documentForm, stepData, currentStepIndex, completedSteps, documentsSent],
  () => {
    scheduleAutosave();
  },
  { deep: true }
);

// ========================================
// FORM DATA UPDATES
// ========================================

function updateFormData(updates) {
  documentForm.value = { ...documentForm.value, ...updates };
}

function updateStepData(step, data) {
  stepData.value[step] = { ...stepData.value[step], ...data };
}

function updateReviewData(data) {
  // Update document form from details section
  if (data.details) {
    documentForm.value = { ...documentForm.value, ...data.details };
  }

  // Update step data from other sections
  Object.keys(data).forEach((key) => {
    if (key !== "details") {
      stepData.value[key] = { ...stepData.value[key], ...data[key] };
    }
  });
}

// ========================================
// STEP NAVIGATION
// ========================================

function goToStep(index) {
  if (index <= currentStepIndex.value || completedSteps.value.includes(index)) {
    currentStepIndex.value = index;
    forceSave();
  }
}

function completeStep() {
  if (!completedSteps.value.includes(currentStepIndex.value)) {
    completedSteps.value.push(currentStepIndex.value);
  }

  forceSave();

  if (currentStepIndex.value < steps.length - 1) {
    currentStepIndex.value++;
  }
}

function previousStep() {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
    forceSave();
  }
}

// ========================================
// TEMPLATE SELECTION
// ========================================

function selectTemplate(template) {
  selectedTemplate.value = template;
  forceSave();
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function getStatusVariant(status) {
  const variants = {
    draft: "ghost",
    active: "success",
    archived: "secondary",
  };
  return variants[status] || "ghost";
}

// ========================================
// ACTION BUTTONS
// ========================================

function handleGoBack() {
  forceSave();
  const confirmed = confirm(
    "Your progress has been saved as a draft. Return to documents?"
  );
  if (confirmed) {
    router.push("/documents");
  }
}

function saveAndExit() {
  forceSave();
  setTimeout(() => {
    router.push("/documents");
  }, 100);
}

function discard() {
  const confirmed = confirm(
    "Are you sure you want to discard this document? All progress will be lost."
  );
  if (confirmed) {
    if (documentsStore.currentDraft) {
      documentsStore.deleteDraft(documentsStore.currentDraft.id);
    }
    router.push("/documents");
  }
}

function handleEditInfo() {
  // Navigate back to details step
  currentStepIndex.value = 0;
  forceSave();
}

// ========================================
// SEND DOCUMENTS (from DocumentStep)
// ========================================

async function handleSendDocuments(emailData) {
  try {
    isSaving.value = true;

    // TODO: Replace with actual API call
    // await documentsStore.sendDocuments(documentForm.value.id, emailData);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Sending documents to:", emailData);

    // Mark documents as sent
    documentsSent.value = true;

    // Save the updated state
    await forceSave();

    // Show success message (you can use a toast notification here)
    alert("Documents sent successfully! You can now complete the workflow.");
  } catch (error) {
    console.error("Failed to send documents:", error);
    alert("Failed to send documents. Please try again.");
  } finally {
    isSaving.value = false;
  }
}

// ========================================
// COMPLETE DOCUMENT
// ========================================

async function completeDocument() {
  if (!documentsSent.value) {
    alert("Please send the documents first before completing.");
    return;
  }

  try {
    isSaving.value = true;

    // Mark document as completed
    documentForm.value.status = "completed";

    if (documentsStore.currentDraft) {
      await documentsStore.convertDraftToDocument(
        documentsStore.currentDraft.id
      );
    }

    router.push({
      name: "documents",
      query: { success: "Document completed successfully" },
    });
  } catch (error) {
    console.error("Failed to complete document:", error);
    alert("Failed to complete document. Please try again.");
  } finally {
    isSaving.value = false;
  }
}
</script>

<style scoped>
/* No styles needed */
</style>
