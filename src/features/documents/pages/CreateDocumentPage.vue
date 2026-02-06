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
      :template="selectedTemplate"
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
      :selected-template="selectedTemplate"
      @continue="completeStep"
      @back="previousStep"
      @update:data="updateReviewData"
    />

    <!-- Step 4: Preview (With Sidebar) -->
    <PreviewStep
      v-if="currentStep === 'preview'"
      :step-data="stepData.preview"
      :template="selectedTemplate"
      :all-step-data="allStepDataForPreview"
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

// Sidebar configuration
const showSidebarForCurrentStep = computed(() => {
  return currentStepIndex.value !== 0;
});

const sidebarData = computed(() => {
  let displayStatus = documentForm.value.status || "Draft";
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

// Form fields configuration
const inputFormFields = computed(() => {
  if (!selectedTemplate.value) {
    console.warn("[Parent] No template selected for input fields");
    return [];
  }

  const template = selectedTemplate.value;

  if (!template.fields || template.fields.length === 0) {
    console.warn("[Parent] Template has no fields defined:", template.name);
    return [];
  }

  console.log("[Parent] Generating input fields from template:", template.name);
  return template.fields;
});

// Data for preview step
const allStepDataForPreview = computed(() => {
  console.log("[Parent] Preparing preview data");
  return {
    details: documentForm.value,
    input: stepData.value.input,
    template: selectedTemplate.value,
  };
});

// Review sections configuration
const reviewSections = computed(() => {
  console.log("[Parent] Generating review sections");
  const sections = [];

  sections.push({
    key: "details",
    title: "Document Details",
    subtitle: "Basic information about your document",
    fields: [
      {
        name: "name",
        label: "Document Name",
        type: "text",
        required: true,
        placeholder: "Enter document name",
      },
      {
        name: "filename",
        label: "File Name",
        type: "text-prefix",
        prefix: "doclast-",
        required: true,
        placeholder: "file-name",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        rows: 5,
        placeholder: "Describe your document",
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
  });

  if (selectedTemplate.value && selectedTemplate.value.fields) {
    console.log(
      "[Parent] Adding template fields section for:",
      selectedTemplate.value.name,
    );

    sections.push({
      key: "input",
      title: selectedTemplate.value.name,
      subtitle: `Information for your ${selectedTemplate.value.name.toLowerCase()}`,
      fields: selectedTemplate.value.fields.map((field) => ({
        name: field.name,
        label: field.label,
        type: field.type,
        required: field.required,
        placeholder: field.placeholder || `Enter ${field.label.toLowerCase()}`,
        options: field.options,
        rows: field.rows,
      })),
    });
  }

  return sections;
});

const allStepData = computed(() => {
  const data = {
    details: documentForm.value,
    input: stepData.value.input,
    review: {
      details: documentForm.value,
      input: stepData.value.input,
    },
    preview: stepData.value.preview,
  };

  console.log("[Parent] allStepData computed:", {
    hasPreviewContent: !!data.preview?.content,
    previewContentLength: data.preview?.content?.length || 0,
  });

  return data;
});

// Watch for step changes and scroll to top
watch(currentStepIndex, async () => {
  await nextTick();

  // Smooth scroll to top
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  // Alternative: instant scroll (if smooth is too slow)
  // window.scrollTo(0, 0);
});
// Autosave setup
const { timeSinceLastSave, scheduleAutosave, forceSave } = useAutosave(
  async () => {
    await saveDraftToStore();
  },
  {
    debounceMs: 500,
    updateIntervalMs: 1000,
  },
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

    console.log(
      "[Parent] Saving draft with preview content length:",
      stepData.value.preview?.content?.length || 0,
    );
    await documentsStore.saveDraft(draftData);
    console.log("[Parent] Draft saved successfully");
  } catch (error) {
    console.error("[Parent] Failed to save draft:", error);

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

// Initialization
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

  try {
    const backupStr = localStorage.getItem("emergency-backup-document");
    if (backupStr) {
      const backup = JSON.parse(backupStr);
      const age = Date.now() - backup.timestamp;
      if (age < 24 * 60 * 60 * 1000) {
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

// Watch for changes
watch(
  () => JSON.stringify(documentForm.value),
  () => {
    console.log("[Parent] documentForm changed, scheduling autosave");
    scheduleAutosave();
  },
);

watch(
  () => JSON.stringify(stepData.value),
  () => {
    console.log("[Parent] stepData changed, scheduling autosave");
    scheduleAutosave();
  },
);

watch([currentStepIndex, documentsSent], () => {
  console.log("[Parent] Navigation/status changed, scheduling autosave");
  scheduleAutosave();
});

if (import.meta.env.DEV) {
  watch(
    () => stepData.value.preview?.content,
    (newValue) => {
      console.log(
        "[Parent] Preview content changed, length:",
        newValue?.length || 0,
      );
    },
  );
}

// Form data updates
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

// Step navigation
async function goToStep(index) {
  if (index <= currentStepIndex.value || completedSteps.value.includes(index)) {
    console.log(`[Parent] Navigating to step ${index}, saving first...`);

    await forceSave();
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 50));

    currentStepIndex.value = index;
    console.log(`[Parent] Navigation to step ${index} complete`);
  }
}

function completeStep(data) {
  const stepId = steps[currentStepIndex.value].id;

  console.log(`[Parent] Completing step: ${stepId}`, data);

  if (data) {
    if (stepId === "details") {
      if (data.template) {
        selectedTemplate.value = data.template;
      }

      const { template, ...formData } = data;
      documentForm.value = { ...documentForm.value, ...formData };
      stepData.value.details = data;

      stepData.value.preview = {
        template: data.template,
        templateName: data.template?.name,
        templateId: data.template?.id,
      };
    } else if (stepId === "input") {
      stepData.value.input = data;
      stepData.value.preview = {
        ...stepData.value.preview,
        input: data,
      };
    } else if (stepId === "preview") {
      // 🔥 CRITICAL FIX: Store preview content from the continue event
      console.log(
        "[Parent] Storing preview content, length:",
        data?.content?.length || 0,
      );
      stepData.value.preview = {
        ...stepData.value.preview,
        ...data,
      };

      // Debug log to verify content is stored
      console.log("[Parent] Preview content stored:", {
        hasContent: !!stepData.value.preview?.content,
        contentLength: stepData.value.preview?.content?.length || 0,
        contentPreview: stepData.value.preview?.content?.substring(0, 100),
      });
    } else {
      stepData.value[stepId] = { ...stepData.value[stepId], ...data };
    }
  }

  if (!completedSteps.value.includes(currentStepIndex.value)) {
    completedSteps.value.push(currentStepIndex.value);
  }

  stepCompletionStatus.value[stepId] = true;

  forceSave();

  if (currentStepIndex.value < steps.length - 1) {
    currentStepIndex.value++;
  }
}

async function previousStep() {
  if (currentStepIndex.value > 0) {
    console.log("[Parent] Going to previous step, saving first...");

    await forceSave();
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 50));

    currentStepIndex.value--;
    console.log(`[Parent] Moved to step ${currentStepIndex.value}`);
  }
}

// Template selection
function selectTemplate(template) {
  console.log("[Parent] Template selected:", template);
  selectedTemplate.value = template;
  scheduleAutosave();
}

// Utility functions
function getStatusVariant(status) {
  const variants = {
    draft: "ghost",
    active: "success",
    archived: "secondary",
    sent: "success",
    completed: "success",
  };
  return variants[status?.toLowerCase()] || "ghost";
}

// Action buttons
async function handleGoBack() {
  await forceSave();
  await new Promise((resolve) => setTimeout(resolve, 100));

  const confirmed = confirm(
    "Your progress has been saved as a draft. Return to documents?",
  );

  if (confirmed) {
    router.push("/documents");
  }
}

async function saveAndExit() {
  await forceSave();
  await new Promise((resolve) => setTimeout(resolve, 200));
  router.push("/documents");
}

function discard() {
  const confirmed = confirm(
    "Are you sure you want to discard this document? All progress will be lost.",
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

// Send documents
async function handleSendDocuments(emailData) {
  try {
    isSaving.value = true;

    const apiPayload = {
      document: {
        name: documentForm.value.name,
        filename: documentForm.value.filename,
        description: documentForm.value.description,
        status: documentForm.value.status,
      },
      template: {
        id: selectedTemplate.value?.id,
        name: selectedTemplate.value?.name,
      },
      inputData: stepData.value.input || {},
      reviewData: {
        details: documentForm.value,
        input: stepData.value.input,
      },
      previewContent: stepData.value.preview?.content || "",
      emailSettings: {
        recipients: emailData.recipients,
        alternativeEmail: emailData.alternativeEmail,
        sendToSelf: emailData.sendToSelf,
        documents: emailData.documents,
      },
      metadata: {
        createdAt: new Date().toISOString(),
        userId: authStore.user?.id,
        draftId: documentsStore.currentDraft?.id,
      },
    };

    console.log("📤 Sending complete data to API:", {
      ...apiPayload,
      previewContentLength: apiPayload.previewContent?.length || 0,
    });

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

// Complete document
async function completeDocument() {
  if (!documentsSent.value) {
    alert("Please send the documents first before completing.");
    return;
  }

  try {
    isSaving.value = true;

    documentForm.value.status = "completed";

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
      stepData.value.preview?.content?.length || 0,
    );
    console.log("Documents Sent:", documentsSent.value);
    console.log("=====================================");

    if (documentsStore.currentDraft) {
      await documentsStore.convertDraftToDocument(
        documentsStore.currentDraft.id,
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
