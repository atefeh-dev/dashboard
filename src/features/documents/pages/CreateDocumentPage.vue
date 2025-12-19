<template>
  <CreateDocumentLayout
    :current-step-index="currentStepIndex"
    :completed-steps="completedSteps"
    :steps="steps"
    :document-title="documentForm.name || 'New Document'"
    :document-status="documentForm.status"
    :last-save-time="timeSinceLastSave"
    @go-to-step="goToStep"
    @save-and-exit="saveAndExit"
    @go-back="handleGoBack"
  >
    <!-- Step 1: Details -->
    <DetailsStep
      v-if="currentStep === 'details'"
      :form="documentForm"
      :selected-template="selectedTemplate"
      @continue="completeStep"
      @discard="discard"
      @select-template="selectTemplate"
      @update:form="updateFormData"
    />

    <!-- Step 2: Input Forms -->
    <InputFormsStep
      v-if="currentStep === 'input'"
      :step-data="stepData.input"
      @continue="completeStep"
      @back="previousStep"
      @update:data="updateStepData('input', $event)"
    />

    <!-- Step 3: Review -->
    <ReviewStep
      v-if="currentStep === 'review'"
      :step-data="stepData.review"
      @continue="completeStep"
      @back="previousStep"
      @update:data="updateStepData('review', $event)"
    />

    <!-- Step 4: Preview -->
    <PreviewStep
      v-if="currentStep === 'preview'"
      :step-data="stepData.preview"
      @continue="completeStep"
      @back="previousStep"
      @update:data="updateStepData('preview', $event)"
    />

    <!-- Step 5: Document -->
    <DocumentStep
      v-if="currentStep === 'document'"
      @finish="createDocument"
      @back="previousStep"
    />
  </CreateDocumentLayout>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDocumentsStore } from "@/stores/useDocumentsStore";
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
// AUTOSAVE SETUP USING COMPOSABLE
// ========================================

// Use the autosave composable
const { timeSinceLastSave, scheduleAutosave, forceSave } = useAutosave(
  async () => {
    // This function is called when autosave triggers
    saveDraftToStore();
  },
  {
    debounceMs: 2000, // Save 2 seconds after user stops typing
    updateIntervalMs: 10000, // Update "X minutes ago" every 10 seconds
  }
);

// Save draft to store
function saveDraftToStore() {
  documentsStore.saveDraft({
    currentStep: currentStepIndex.value,
    completedSteps: completedSteps.value,
    formData: documentForm.value,
    selectedTemplate: selectedTemplate.value,
    stepData: stepData.value,
    name: documentForm.value.name || "Untitled Document",
  });
}

// ========================================
// INITIALIZATION
// ========================================

// Initialize or load draft on mount
const draftId = route.query.draftId;

if (draftId) {
  // Load existing draft
  const draft = documentsStore.loadDraft(draftId);
  if (draft) {
    currentStepIndex.value = draft.currentStep;
    completedSteps.value = [...draft.completedSteps];
    documentForm.value = { ...draft.formData };
    selectedTemplate.value = draft.selectedTemplate;
    stepData.value = { ...draft.stepData };
  }
} else {
  // Create new draft
  documentsStore.createDraft();
}

// ========================================
// WATCH FOR CHANGES (TRIGGERS AUTOSAVE)
// ========================================

// Watch for changes and trigger autosave
watch(
  [documentForm, stepData, currentStepIndex, completedSteps],
  () => {
    scheduleAutosave(); // This debounces the save
  },
  { deep: true }
);

// ========================================
// FORM DATA UPDATES
// ========================================

// Update form data from DetailsStep
function updateFormData(updates) {
  documentForm.value = { ...documentForm.value, ...updates };
}

// Update step-specific data
function updateStepData(step, data) {
  stepData.value[step] = { ...stepData.value[step], ...data };
}

// ========================================
// STEP NAVIGATION
// ========================================

function goToStep(index) {
  // Allow navigation to completed steps or current step
  if (index <= currentStepIndex.value || completedSteps.value.includes(index)) {
    currentStepIndex.value = index;
    forceSave(); // Save immediately when navigating
  }
}

function completeStep() {
  // Mark current step as completed
  if (!completedSteps.value.includes(currentStepIndex.value)) {
    completedSteps.value.push(currentStepIndex.value);
  }

  // Save before moving forward
  forceSave();

  // Move to next step
  if (currentStepIndex.value < steps.length - 1) {
    currentStepIndex.value++;
  } else {
    // All steps completed
    createDocument();
  }
}

function previousStep() {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
    forceSave(); // Save when going back
  }
}

// ========================================
// TEMPLATE SELECTION
// ========================================

function selectTemplate(template) {
  selectedTemplate.value = template;
  forceSave(); // Save template selection immediately
}

// ========================================
// ACTION BUTTONS (FIXED!)
// ========================================

// Handle "Back to documents" button
function handleGoBack() {
  // Save before leaving
  forceSave();

  // Show confirmation
  const confirmed = confirm(
    "Your progress has been saved as a draft. Return to documents?"
  );

  if (confirmed) {
    router.push("/documents");
  }
}

// Handle "Save & Exit" button
function saveAndExit() {
  forceSave(); // Save immediately

  // Small delay to ensure save completes
  setTimeout(() => {
    router.push("/documents");
  }, 100);
}

// Handle "Discard" button
function discard() {
  const confirmed = confirm(
    "Are you sure you want to discard this document? All progress will be lost."
  );

  if (confirmed) {
    // Delete the current draft
    if (documentsStore.currentDraft) {
      documentsStore.deleteDraft(documentsStore.currentDraft.id);
    }
    router.push("/documents");
  }
}

// Handle "Finish" button - Convert draft to final document
function createDocument() {
  console.log("Creating document:", documentForm.value);

  // Convert draft to final document
  if (documentsStore.currentDraft) {
    documentsStore.convertDraftToDocument(documentsStore.currentDraft.id);
  }

  // Navigate back to documents
  router.push("/documents");
}
</script>

<style scoped>
/* No styles needed - all in CreateDocumentLayout */
</style>
