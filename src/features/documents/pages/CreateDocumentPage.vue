<template>
  <CreateDocumentLayout
    :current-step-index="currentStepIndex"
    :completed-steps="completedSteps"
    :steps="steps"
    :document-title="documentForm.name || 'New Document'"
    :document-status="documentForm.status"
    @go-to-step="goToStep"
    @save-and-exit="saveAndExit"
  >
    <!-- Step 1: Details -->
    <DetailsStep
      v-if="currentStep === 'details'"
      :form="documentForm"
      :selected-template="selectedTemplate"
      @continue="completeStep"
      @discard="discard"
      @select-template="selectTemplate"
    />

    <!-- Step 2: Input Forms -->
    <InputFormsStep
      v-if="currentStep === 'input'"
      @continue="completeStep"
      @back="previousStep"
    />

    <!-- Step 3: Review -->
    <ReviewStep
      v-if="currentStep === 'review'"
      @continue="completeStep"
      @back="previousStep"
    />

    <!-- Step 4: Preview -->
    <PreviewStep
      v-if="currentStep === 'preview'"
      @continue="completeStep"
      @back="previousStep"
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import CreateDocumentLayout from "@/features/documents/layout/CreateDocumentLayout.vue";
import DetailsStep from "@/features/documents/components/steps/DetailsStep.vue";
import InputFormsStep from "@/features/documents/components/steps/InputFormsStep.vue";
import ReviewStep from "@/features/documents/components/steps/ReviewStep.vue";
import PreviewStep from "@/features/documents/components/steps/PreviewStep.vue";
import DocumentStep from "@/features/documents/components/steps/DocumentStep.vue";

const router = useRouter();

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

// Step navigation
function goToStep(index) {
  // Allow navigation to completed steps or current step
  if (index <= currentStepIndex.value || completedSteps.value.includes(index)) {
    currentStepIndex.value = index;
  }
}

function completeStep() {
  // Mark current step as completed (if not already)
  if (!completedSteps.value.includes(currentStepIndex.value)) {
    completedSteps.value.push(currentStepIndex.value);
  }

  // Move to next step
  if (currentStepIndex.value < steps.length - 1) {
    currentStepIndex.value++;
  } else {
    // All steps completed, create document
    createDocument();
  }
}

function previousStep() {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
  }
}

function selectTemplate(template) {
  selectedTemplate.value = template;
}

// Actions
function saveAndExit() {
  router.push("/documents");
}

function discard() {
  if (confirm("Are you sure you want to discard this document?")) {
    router.push("/documents");
  }
}

function createDocument() {
  console.log("Creating document:", documentForm.value);
  // Add to documents store
  // useDocumentsStore().addDocument(documentForm.value);
  router.push("/documents");
}
</script>

<style scoped>
/* No styles needed - all in CreateDocumentLayout */
</style>
