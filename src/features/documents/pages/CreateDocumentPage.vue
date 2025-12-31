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
      :template="selectedTemplate"
      @continue="completeStep"
      @back="previousStep"
      @update:data="updateStepData('preview', $event)"
    />

    <!-- Step 5: Document (With Sidebar) -->
    <DocumentStep
      v-if="currentStep === 'document'"
      :document-metadata="documentForm"
      :template="selectedTemplate"
      :all-step-data="allStepData"
      @finish="handleSendDocuments"
      @back="previousStep"
    />
  </CreateDocumentLayout>
</template>

<script setup>
/**
 * CREATE DOCUMENT PAGE - MULTI-STEP WORKFLOW
 *
 * This component manages a 5-step document creation workflow with auto-save:
 *
 * STEP 1 - DETAILS:
 *   User enters: name, filename, description, status
 *   Selects: template
 *   → Stored in: documentForm, selectedTemplate
 *
 * STEP 2 - INPUT FORMS:
 *   User fills: dynamic form fields based on template
 *   → Stored in: stepData.input
 *
 * STEP 3 - REVIEW:
 *   User reviews and edits all previous data
 *   → Updates: documentForm, stepData.input
 *
 * STEP 4 - PREVIEW:
 *   User edits document content in rich text editor
 *   → Stored in: stepData.preview.content
 *
 * STEP 5 - DOCUMENT:
 *   User selects recipients and sends documents
 *   Documents use filename from Step 1 (e.g., "accelerator-contract-2025.pdf")
 *   → Triggers API submission with complete payload
 *
 * API PAYLOAD STRUCTURE (sent via handleSendDocuments):
 * {
 *   document: { name, filename, description, status },
 *   template: { id, name },
 *   inputData: { ...form fields from step 2... },
 *   reviewData: { details, input },
 *   previewContent: "...rich text HTML content...",
 *   emailSettings: {
 *     recipients: [...],
 *     alternativeEmail: string | null,
 *     sendToSelf: boolean,
 *     documents: [
 *       { name: "accelerator-contract-2025.pdf", format: "pdf" },
 *       { name: "accelerator-contract-2025.docx", format: "docx" }
 *     ]
 *   },
 *   metadata: { createdAt, userId, draftId }
 * }
 */
import { ref, computed, watch, onMounted, nextTick } from "vue";
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

// ========================================
// STEP CONFIGURATION
// ========================================
const steps = [
  { id: "details", title: "Details", subtitle: "Template and information" },
  { id: "input", title: "Input forms", subtitle: "Based on template needs" },
  { id: "review", title: "Review", subtitle: "Overview inputs and edit" },
  { id: "preview", title: "Preview", subtitle: "See data in action" },
  { id: "document", title: "Document", subtitle: "Save or send for action" },
];

const currentStepIndex = ref(0);
const completedSteps = ref([]);
const stepCompletionStatus = ref({
  details: false,
  input: false,
  review: false,
  preview: false,
  document: false,
});

const currentStep = computed(() => steps[currentStepIndex.value].id);
const isSaving = ref(false);
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
const showSidebarForCurrentStep = computed(() => {
  return currentStepIndex.value !== 0;
});

const sidebarData = computed(() => {
  // Determine display status based on document state
  let displayStatus = documentForm.value.status || "Draft";

  // When documents are sent, show "Sent" status
  if (documentsSent.value) {
    displayStatus = "Sent";
  }

  return {
    title: documentForm.value.name || "Document title",
    lastEdit: timeSinceLastSave.value || "(not saved yet)",
    status: displayStatus,
    statusVariant: getStatusVariant(displayStatus),
    authorName: authStore.user?.name || "User Name",
    authorAvatar: authStore.user?.avatar || "/src/assets/images/av.png",
    templateName: selectedTemplate.value?.name || "Non-Disclosure Agreement",
    templateAuthor: selectedTemplate.value?.author || "doclast",
    templateUpdateDate:
      selectedTemplate.value?.lastUpdate || "December 5, 2025",
    templateTags: selectedTemplate.value?.tags || ["Tag 1", "Tag 2", "Tag 3"],
    checklistItems: checklistItems.value,
  };
});

const checklistItems = computed(() => {
  return steps.map((step, index) => ({
    title: step.title,
    subtitle: step.subtitle,
    completed: stepCompletionStatus.value[step.id],
    visited: completedSteps.value.includes(index),
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
    type: "select",
    name: "role",
    label: "Your role",
    required: true,
    placeholder: "Select your role",
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

const allStepData = computed(() => ({
  details: documentForm.value,
  input: stepData.value.input,
  review: {
    details: documentForm.value,
    input: stepData.value.input,
  },
  preview: stepData.value.preview,
}));

// ========================================
// AUTOSAVE SETUP (FIXED - FASTER CONFIG)
// ========================================
const { timeSinceLastSave, scheduleAutosave, forceSave } = useAutosave(
  async () => {
    await saveDraftToStore();
  },
  {
    debounceMs: 500, // FIXED: Faster (was 2000)
    updateIntervalMs: 1000, // Update every second for navbar display
  }
);

async function saveDraftToStore() {
  isSaving.value = true;
  try {
    const draftData = {
      currentStep: currentStepIndex.value,
      completedSteps: completedSteps.value,
      stepCompletionStatus: stepCompletionStatus.value,
      formData: documentForm.value,
      selectedTemplate: selectedTemplate.value,
      stepData: stepData.value,
      name: documentForm.value.name || "Untitled Document",
      documentsSent: documentsSent.value,
    };

    console.log("[Parent] Saving draft:", draftData);
    await documentsStore.saveDraft(draftData);
    console.log("[Parent] Draft saved successfully");
  } catch (error) {
    console.error("[Parent] Failed to save draft:", error);

    // Emergency backup to localStorage
    try {
      const backup = {
        documentForm: documentForm.value,
        stepData: stepData.value,
        currentStep: currentStepIndex.value,
        timestamp: Date.now(),
      };
      localStorage.setItem("emergency-backup-document", JSON.stringify(backup));
      console.warn("[Parent] Emergency backup saved to localStorage");
    } catch (backupError) {
      console.error("[Parent] Emergency backup also failed:", backupError);
    }
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
    console.log("[Parent] Loading draft:", draft);
    currentStepIndex.value = draft.currentStep;
    completedSteps.value = [...draft.completedSteps];
    stepCompletionStatus.value = { ...draft.stepCompletionStatus } || {};
    documentForm.value = { ...draft.formData };
    selectedTemplate.value = draft.selectedTemplate;
    stepData.value = { ...draft.stepData };
    documentsSent.value = draft.documentsSent || false;
  }
} else {
  documentsStore.createDraft();

  // Try to restore from emergency backup
  try {
    const backupStr = localStorage.getItem("emergency-backup-document");
    if (backupStr) {
      const backup = JSON.parse(backupStr);
      const age = Date.now() - backup.timestamp;
      if (age < 24 * 60 * 60 * 1000) {
        // 24 hours
        console.warn("[Parent] Restoring from emergency backup");
        setTimeout(() => {
          if (
            confirm("We found unsaved changes. Would you like to restore them?")
          ) {
            if (backup.documentForm) documentForm.value = backup.documentForm;
            if (backup.stepData) stepData.value = backup.stepData;
            if (backup.currentStep !== undefined)
              currentStepIndex.value = backup.currentStep;
            console.log("[Parent] Backup restored");
          } else {
            localStorage.removeItem("emergency-backup-document");
          }
        }, 500);
      } else {
        localStorage.removeItem("emergency-backup-document");
      }
    }
  } catch (error) {
    console.error("[Parent] Failed to restore emergency backup:", error);
  }
}

onMounted(async () => {
  try {
    await contactsStore.fetchContacts();
  } catch (error) {
    console.error("Failed to load contacts:", error);
  }
});

// ========================================
// OPTIMIZED WATCH FOR CHANGES (FIXED)
// ========================================
// Watch individual objects with JSON stringify for better performance
watch(
  () => JSON.stringify(documentForm.value),
  () => {
    console.log("[Parent] documentForm changed, scheduling autosave");
    scheduleAutosave();
  }
);

watch(
  () => JSON.stringify(stepData.value),
  () => {
    console.log("[Parent] stepData changed, scheduling autosave");
    scheduleAutosave();
  }
);

watch([currentStepIndex, documentsSent], () => {
  console.log("[Parent] Navigation/status changed, scheduling autosave");
  scheduleAutosave();
});

// Debug logging in development
if (import.meta.env.DEV) {
  watch(
    () => stepData.value.input,
    (newValue) => {
      console.log("[Parent] Input step data changed:", newValue);
    },
    { deep: true }
  );

  watch(currentStepIndex, (newIndex, oldIndex) => {
    console.log(`[Parent] Navigation: Step ${oldIndex} → Step ${newIndex}`);
  });
}

// ========================================
// FORM DATA UPDATES
// ========================================
function updateFormData(updates) {
  console.log("[Parent] Updating form data:", updates);
  documentForm.value = { ...documentForm.value, ...updates };
}

function updateStepData(step, data) {
  console.log(`[Parent] Updating ${step} data:`, data);
  stepData.value[step] = { ...stepData.value[step], ...data };
}

function updateReviewData(data) {
  if (data.details) {
    documentForm.value = { ...documentForm.value, ...data.details };
  }

  Object.keys(data).forEach((key) => {
    if (key !== "details") {
      stepData.value[key] = { ...stepData.value[key], ...data[key] };
    }
  });
}

// ========================================
// STEP NAVIGATION (FIXED - ASYNC/AWAIT)
// ========================================
async function goToStep(index) {
  if (index <= currentStepIndex.value || completedSteps.value.includes(index)) {
    console.log(`[Parent] Navigating to step ${index}, saving first...`);

    // FIXED: Wait for save to complete
    await forceSave();
    await nextTick();

    // Small delay to ensure store updates
    await new Promise((resolve) => setTimeout(resolve, 50));

    currentStepIndex.value = index;
    console.log(`[Parent] Navigation to step ${index} complete`);
  }
}

async function completeStep() {
  const currentStepId = steps[currentStepIndex.value].id;
  console.log(`[Parent] Completing step: ${currentStepId}`);

  // Mark step as completed
  if (!completedSteps.value.includes(currentStepIndex.value)) {
    completedSteps.value.push(currentStepIndex.value);
  }

  // Mark step as properly completed
  stepCompletionStatus.value[currentStepId] = true;

  // FIXED: Wait for save to complete
  await forceSave();
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 50));

  if (currentStepIndex.value < steps.length - 1) {
    currentStepIndex.value++;
    console.log(`[Parent] Moved to step ${currentStepIndex.value}`);
  }
}

async function previousStep() {
  if (currentStepIndex.value > 0) {
    console.log("[Parent] Going to previous step, saving first...");

    // FIXED: Wait for save to complete
    await forceSave();
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 50));

    currentStepIndex.value--;
    console.log(`[Parent] Moved to step ${currentStepIndex.value}`);
  }
}

// ========================================
// TEMPLATE SELECTION
// ========================================
function selectTemplate(template) {
  console.log("[Parent] Template selected:", template);
  selectedTemplate.value = template;
  scheduleAutosave(); // Changed from forceSave to scheduleAutosave
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function getStatusVariant(status) {
  const variants = {
    draft: "ghost",
    active: "success",
    archived: "secondary",
    sent: "success", // ← Add support for "Sent" status
    completed: "success", // ← Add support for "Completed" status
  };
  return variants[status?.toLowerCase()] || "ghost";
}

// ========================================
// ACTION BUTTONS
// ========================================
async function handleGoBack() {
  await forceSave();

  // Wait a bit to ensure save completes
  await new Promise((resolve) => setTimeout(resolve, 100));

  const confirmed = confirm(
    "Your progress has been saved as a draft. Return to documents?"
  );

  if (confirmed) {
    router.push("/documents");
  }
}

async function saveAndExit() {
  await forceSave();

  // Wait to ensure save completes
  await new Promise((resolve) => setTimeout(resolve, 200));

  router.push("/documents");
}

function discard() {
  const confirmed = confirm(
    "Are you sure you want to discard this document? All progress will be lost."
  );

  if (confirmed) {
    if (documentsStore.currentDraft) {
      documentsStore.deleteDraft(documentsStore.currentDraft.id);
    }

    localStorage.removeItem("emergency-backup-document");
    router.push("/documents");
  }
}

async function handleEditInfo() {
  await forceSave();
  await nextTick();

  currentStepIndex.value = 0;
}

// ========================================
// SEND DOCUMENTS
// ========================================
async function handleSendDocuments(emailData) {
  try {
    isSaving.value = true;

    // Prepare complete data payload for API
    const apiPayload = {
      // Document metadata from Details step
      document: {
        name: documentForm.value.name,
        filename: documentForm.value.filename,
        description: documentForm.value.description,
        status: documentForm.value.status,
      },
      // Template information
      template: {
        id: selectedTemplate.value?.id,
        name: selectedTemplate.value?.name,
      },
      // Input form data (Step 2)
      inputData: stepData.value.input || {},
      // Review data (Step 3)
      reviewData: {
        details: documentForm.value,
        input: stepData.value.input,
      },
      // Preview content (Step 4) - the edited document content
      previewContent: stepData.value.preview?.content || "",
      // Email recipients and settings (Step 5)
      emailSettings: {
        recipients: emailData.recipients,
        alternativeEmail: emailData.alternativeEmail,
        sendToSelf: emailData.sendToSelf,
        documents: emailData.documents,
      },
      // Metadata
      metadata: {
        createdAt: new Date().toISOString(),
        userId: authStore.user?.id,
        draftId: documentsStore.currentDraft?.id,
      },
    };

    console.log("📤 Sending complete data to API:", apiPayload);

    // TODO: Replace with actual API call
    // const response = await fetch('/api/documents/send', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(apiPayload)
    // });
    // const result = await response.json();

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("✅ Documents sent successfully!");

    documentsSent.value = true;
    stepCompletionStatus.value.document = true;

    await forceSave();

    alert("Documents sent successfully! You can now complete the workflow.");
  } catch (error) {
    console.error("❌ Failed to send documents:", error);
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

    documentForm.value.status = "completed";

    // Log the complete document data structure for reference
    console.log("📋 COMPLETE DOCUMENT DATA STRUCTURE:");
    console.log("=====================================");
    console.log("Document Metadata:", {
      name: documentForm.value.name,
      filename: documentForm.value.filename,
      description: documentForm.value.description,
      status: documentForm.value.status,
    });
    console.log("Template:", {
      id: selectedTemplate.value?.id,
      name: selectedTemplate.value?.name,
    });
    console.log("Input Data:", stepData.value.input);
    console.log(
      "Preview Content Length:",
      stepData.value.preview?.content?.length || 0
    );
    console.log("Documents Sent:", documentsSent.value);
    console.log("=====================================");

    if (documentsStore.currentDraft) {
      await documentsStore.convertDraftToDocument(
        documentsStore.currentDraft.id
      );
    }

    localStorage.removeItem("emergency-backup-document");

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
