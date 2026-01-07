<template>
  <div class="document-step">
    <ErrorBoundary
      fallback-title="Document Step Error"
      fallback-message="Something went wrong. Your selections have been saved."
      @error="handleError"
      @recover="handleRecover"
    >
      <!-- Header Section -->
      <div class="document-step__header">
        <h2 class="document-step__heading">Here are your documents</h2>
        <p class="document-step__subheading">
          Ready for download and distribution
        </p>
      </div>

      <!-- Horizontal Divider -->
      <div class="document-step__divider"></div>

      <!-- ROW 1: Export Documents Section -->
      <div class="document-step__section-row">
        <div class="document-step__section-header">
          <h3 class="document-step__subsection-title">Export documents</h3>
          <p class="document-step__subsection-subtitle">
            Download your generated documents
          </p>
        </div>

        <div class="document-step__section-content">
          <!-- Debug Info (Development Only)
          <div v-if="showDebugInfo" class="debug-info">
            <details>
              <summary>🔍 Debug Info</summary>
              <div class="debug-info__content">
                <p><strong>Has Content:</strong> {{ !!documentContent }}</p>
                <p>
                  <strong>Content Length:</strong>
                  {{ documentContent?.length || 0 }}
                </p>
                <p><strong>Content Preview:</strong></p>
                <pre>{{ documentContent?.substring(0, 200) }}...</pre>
                <button @click="previewContentInBrowser" class="debug-btn">
                  Preview Content
                </button>
              </div>
            </details>
          </div> -->
          <div
            v-if="!isGenerating && generatedDocuments.length > 0"
            class="document-list"
          >
            <div
              v-for="doc in generatedDocuments"
              :key="doc.id"
              class="document-card"
            >
              <div class="document-card__info">
                <div class="document-card__icon">
                  <PdfIcon />
                </div>
                <div class="document-card__details">
                  <h4 class="document-card__name">{{ doc.displayName }}</h4>
                  <p class="document-card__meta">
                    {{ doc.size }} • {{ doc.format.toUpperCase() }}
                  </p>
                </div>
              </div>
              <AppButton
                variant="secondary"
                size="sm"
                @click="downloadDocument(doc)"
                :disabled="isDownloading[doc.id]"
              >
                <Loader
                  v-if="isDownloading[doc.id]"
                  class="button-icon animate-spin"
                />
                <Download v-else class="button-icon" />
                {{ isDownloading[doc.id] ? "Downloading..." : "Download" }}
              </AppButton>
            </div>
          </div>

          <!-- Generating State -->
          <div v-else-if="isGenerating" class="loading-state">
            <Loader class="loading-state__spinner" />
            <p class="loading-state__text">Preparing your documents...</p>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state">
            <FileText class="empty-state__icon" />
            <p class="empty-state__text">
              No documents available. Please complete previous steps.
            </p>
          </div>
        </div>
      </div>

      <!-- Horizontal Divider Between Sections -->
      <div class="document-step__divider"></div>

      <!-- ROW 2: Email Section -->
      <div class="document-step__section-row">
        <div class="document-step__section-header">
          <h3 class="document-step__subsection-title">
            Email this
            {{ generatedDocuments.length > 1 ? "(these)" : "" }} document{{
              generatedDocuments.length > 1 ? "s" : ""
            }}
          </h3>
          <p class="document-step__subsection-subtitle">
            Send to contacts via email
          </p>
        </div>

        <div class="document-step__section-content">
          <!-- Email Recipients from Input Step -->
          <div v-if="inputRecipients.length > 0" class="email-recipients">
            <ContactSelectItem
              v-for="recipient in inputRecipients"
              :key="recipient.id"
              :contact="recipient"
              :checked="isRecipientSelected(recipient.id)"
              :is-external="false"
              @toggle="toggleRecipient"
            />
          </div>

          <!-- Internal Contacts -->
          <div v-if="internalContacts.length > 0" class="email-recipients">
            <div class="recipient-section-label">Your contacts:</div>
            <ContactSelectItem
              v-for="recipient in internalContacts"
              :key="recipient.id"
              :contact="recipient"
              :checked="isRecipientSelected(recipient.id)"
              :is-external="false"
              @toggle="toggleRecipient"
            />
          </div>

          <!-- Selected External Contacts -->
          <div
            v-if="selectedExternalContacts.length > 0"
            class="email-recipients"
          >
            <ContactSelectItem
              v-for="contact in selectedExternalContacts"
              :key="contact.id"
              :contact="contact"
              :checked="isRecipientSelected(contact.id)"
              :is-external="true"
              @toggle="toggleRecipient"
            />
          </div>

          <!-- Add Contact Dropdown -->
          <div class="add-contact">
            <p class="add-contact__label">Add from your contacts</p>
            <AppSelect
              v-model="selectedContactId"
              class="add-contact__select"
              @update:model-value="handleContactSelect"
              :disabled="isSending"
            >
              <option value="" selected hidden>Select from People</option>
              <option
                v-for="contact in availableExternalContacts"
                :key="contact.id"
                :value="contact.id"
              >
                {{ contact.name }} ({{ contact.email }})
              </option>
            </AppSelect>
          </div>

          <!-- Alternative Email -->
          <AppAlternativeEmailInput
            v-model="alternativeEmail"
            v-model:enabled="sendToAlternativeEmail"
            :disabled="isSending"
            @error="handleAlternativeEmailError"
          />

          <!-- My Email Checkbox -->
          <div class="my-email">
            <input
              type="checkbox"
              id="my-email"
              v-model="sendToMyEmail"
              class="my-email__checkbox"
              :disabled="isSending"
            />
            <label for="my-email" class="my-email__label">
              <span class="my-email__check-box">
                <CheckIcon v-if="sendToMyEmail" class="my-email__check-icon" />
              </span>
              <span class="my-email__text">
                Send to my email
                <span class="my-email__address">{{ userEmail }}</span>
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- Validation Errors -->
      <transition name="fade">
        <div v-if="validationErrors.length > 0" class="validation-errors">
          <AlertCircle class="validation-errors__icon" />
          <div class="validation-errors__content">
            <p class="validation-errors__title">Please fix the following:</p>
            <ul class="validation-errors__list">
              <li v-for="(error, index) in validationErrors" :key="index">
                {{ error }}
              </li>
            </ul>
          </div>
        </div>
      </transition>

      <!-- Action Buttons -->
      <div class="document-step__actions">
        <AppButton
          variant="blank"
          @click="handleBack"
          :disabled="isSending || isGenerating"
        >
          <Loader v-if="isSaving" class="document-step__icon animate-spin" />
          <ArrowNarrowLetIcon />
          {{ isSaving ? "Saving..." : "Back" }}
        </AppButton>
        <AppButton
          variant="primary"
          size="md"
          @click="sendDocuments"
          :disabled="
            isSending || generatedDocuments.length === 0 || isGenerating
          "
        >
          <Loader v-if="isSending" class="document-step__icon animate-spin" />
          {{ isSending ? "Sending..." : "Send" }}
        </AppButton>
      </div>

      <!-- Keyboard Shortcuts Hint -->
      <div class="keyboard-hints">
        <kbd class="kbd">{{ shortcutLabels.alt }}</kbd>
        <kbd class="kbd">{{ shortcutLabels.left }}</kbd>
        Back
        <span class="keyboard-hints__separator">•</span>
        <kbd class="kbd">{{ shortcutLabels.mod }}</kbd>
        <kbd class="kbd">{{ shortcutLabels.enter }}</kbd>
        Send
      </div>
    </ErrorBoundary>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import { storeToRefs } from "pinia";
import { FileText, Loader, Send, AlertCircle, Download } from "lucide-vue-next";
import AppAlternativeEmailInput from "@/components/ui/AppAlternativeEmailInput.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppSelect from "@/components/ui/AppSelect.vue";
import ErrorBoundary from "./ErrorBoundary.vue";
import ContactSelectItem from "../contact/ContactSelectItem.vue";
import CheckIcon from "@/assets/icons/common/check.svg";
import { useContactsStore } from "@/stores/useContactsStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTemplatesStore } from "@/stores/useTemplatesStore";
import {
  downloadPDF,
  generatePDFPrintFallback,
  previewContent,
} from "@/composables/pdfGenerator";
import { cleanContentForPDF } from "@/composables/pdfContentCleaner";
import ArrowNarrowLetIcon from "@/assets/icons/common/arrow-narrow-left.svg";
import {
  useKeyboardShortcuts,
  getShortcutLabels,
} from "@/composables/useKeyboardShortcuts";
import PdfIcon from "@/assets/icons/common/pdf-icon.svg";

// Props & Emits
const props = defineProps({
  stepData: {
    type: Object,
    default: () => ({}),
  },
  documentMetadata: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  template: {
    type: Object,
    required: true,
    default: null,
  },
  allStepData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["finish", "back", "update:data"]);

// Stores
const contactsStore = useContactsStore();
const authStore = useAuthStore();
const templatesStore = useTemplatesStore();
const { internalContacts, externalContacts } = storeToRefs(contactsStore);
const shortcutLabels = getShortcutLabels();

// State
const selectedRecipientIds = ref([]);
const selectedContactId = ref("");
const sendToAlternativeEmail = ref(false);
const alternativeEmail = ref("");
const sendToMyEmail = ref(false);
const isSending = ref(false);
const isSaving = ref(false);
const isGenerating = ref(false);
const isDownloading = ref({});
const alternativeEmailError = ref("");
const validationErrors = ref([]);

// Show debug info in development
const showDebugInfo = computed(() => import.meta.env.DEV);

// Computed
const userEmail = computed(() => authStore.user?.email || "user@doclast.com");

// Get document content from preview step
const documentContent = computed(() => {
  const content =
    props.allStepData?.preview?.content ||
    templatesStore.populatedDocumentContent ||
    "";

  console.log("[Document Step] Content check:", {
    fromPreview: !!props.allStepData?.preview?.content,
    fromStore: !!templatesStore.populatedDocumentContent,
    hasContent: !!content,
    contentLength: content?.length || 0,
    contentPreview: content?.substring(0, 100),
  });

  return content;
});

// Extract recipients from input step
const inputRecipients = computed(() => {
  const recipients = [];
  const inputData = props.allStepData?.input || {};

  const extractEmails = (data) => {
    if (Array.isArray(data)) {
      data.forEach((item) => extractEmails(item));
    } else if (typeof data === "object" && data !== null) {
      Object.entries(data).forEach(([key, value]) => {
        if (
          key.toLowerCase().includes("email") &&
          typeof value === "string" &&
          value.includes("@")
        ) {
          const id = `input-${key}-${value}`;
          const name = extractNameForEmail(key, data);

          recipients.push({
            id,
            name: name || value.split("@")[0],
            email: value,
            role: extractRoleForEmail(key),
            source: "input",
          });
        } else if (typeof value === "object") {
          extractEmails(value);
        }
      });
    }
  };

  extractEmails(inputData);

  console.log("📧 Input recipients extracted:", recipients);
  return recipients;
});

function extractNameForEmail(emailKey, data) {
  const nameKey = emailKey.replace("Email", "Name").replace("email", "name");
  if (data[nameKey]) {
    return data[nameKey];
  }

  const patterns = ["Name", "name", "PartyName", "partyName"];
  for (const pattern of patterns) {
    const key = emailKey.replace(/Email|email/, pattern);
    if (data[key]) {
      return data[key];
    }
  }

  return "";
}

function extractRoleForEmail(emailKey) {
  const lower = emailKey.toLowerCase();
  if (lower.includes("disclosing")) return "Disclosing Party";
  if (lower.includes("receiving")) return "Receiving Party";
  if (lower.includes("employer")) return "Employer";
  if (lower.includes("employee")) return "Employee";
  if (lower.includes("provider")) return "Provider";
  if (lower.includes("client")) return "Client";
  if (lower.includes("consultant")) return "Consultant";
  if (lower.includes("partner")) return "Partner";
  return "Recipient";
}

const generatedDocuments = computed(() => {
  if (!documentContent.value) return [];

  const baseFilename = props.documentMetadata?.filename || "untitled-document";
  const documentName = props.documentMetadata?.name || "Untitled Document";

  return [
    {
      id: 1,
      name: `${baseFilename}.pdf`,
      displayName: `${documentName} (PDF)`,
      size: estimateSize(documentContent.value),
      status: "completed",
      format: "pdf",
    },
  ];
});

const selectedExternalContacts = computed(() => {
  return externalContacts.value.filter((contact) =>
    selectedRecipientIds.value.includes(contact.id)
  );
});

const availableExternalContacts = computed(() => {
  return externalContacts.value.filter(
    (contact) => !selectedRecipientIds.value.includes(contact.id)
  );
});

const documentStepData = computed(() => ({
  selectedRecipientIds: selectedRecipientIds.value,
  sendToAlternativeEmail: sendToAlternativeEmail.value,
  alternativeEmail: alternativeEmail.value,
  sendToMyEmail: sendToMyEmail.value,
}));

// Helper Functions
function estimateSize(content) {
  const bytes = new Blob([content]).size;
  return bytes >= 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`;
}

function restoreState(data) {
  if (data.selectedRecipientIds) {
    selectedRecipientIds.value = [...data.selectedRecipientIds];
  }
  if (data.sendToAlternativeEmail !== undefined) {
    sendToAlternativeEmail.value = data.sendToAlternativeEmail;
  }
  if (data.alternativeEmail) {
    alternativeEmail.value = data.alternativeEmail;
  }
  if (data.sendToMyEmail !== undefined) {
    sendToMyEmail.value = data.sendToMyEmail;
  }
  if (!sendToAlternativeEmail.value) {
    alternativeEmail.value = "";
    alternativeEmailError.value = "";
  }
}

// Preview content in browser (for debugging)
function previewContentInBrowser() {
  const cleanedContent = cleanContentForPDF(documentContent.value);
  previewContent(cleanedContent);
}

// PDF Download Function with Content Cleaning
async function downloadDocument(doc) {
  if (!documentContent.value) {
    alert(
      "No document content available. Please go back to the Preview step and ensure the document has loaded."
    );
    return;
  }

  // Additional validation
  if (
    documentContent.value.trim() === "" ||
    documentContent.value === "<p></p>"
  ) {
    alert(
      "The document appears to be empty. Please go back to the Preview step and wait for the content to load."
    );
    return;
  }

  try {
    console.log("[Document Step] Starting PDF download for:", doc.name);
    console.log(
      "[Document Step] Original content length:",
      documentContent.value.length
    );

    isDownloading.value[doc.id] = true;

    // Clean the content before PDF export
    const cleanedContent = cleanContentForPDF(documentContent.value);

    console.log("[Document Step] Content cleaned for PDF export");
    console.log(
      "[Document Step] Cleaned content length:",
      cleanedContent.length
    );
    console.log(
      "[Document Step] Cleaned content preview:",
      cleanedContent.substring(0, 200)
    );

    if (!cleanedContent || cleanedContent.trim() === "") {
      throw new Error("Content cleaning resulted in empty output");
    }

    // Use the cleaned content for PDF generation
    await downloadPDF(
      cleanedContent,
      props.documentMetadata?.filename || "document",
      {
        margin: [15, 15, 15, 15],
        filename: doc.name,
      }
    );

    console.log("[Document Step] PDF download completed successfully");
  } catch (error) {
    console.error("[Document Step] PDF download failed:", error);

    const retry = confirm(
      `Failed to download PDF: ${error.message}\n\nWould you like to try the print dialog method instead?`
    );

    if (retry) {
      const cleanedContent = cleanContentForPDF(documentContent.value);
      generatePDFPrintFallback(
        cleanedContent,
        props.documentMetadata?.filename || "document"
      );
    }
  } finally {
    isDownloading.value[doc.id] = false;
  }
}

// Contact Management
function isRecipientSelected(id) {
  return selectedRecipientIds.value.includes(id);
}

function toggleRecipient(id) {
  const index = selectedRecipientIds.value.indexOf(id);
  if (index > -1) {
    selectedRecipientIds.value.splice(index, 1);
  } else {
    selectedRecipientIds.value.push(id);
  }
}

function handleContactSelect(contactId) {
  const numericId = Number(contactId);
  if (contactId && !selectedRecipientIds.value.includes(numericId)) {
    selectedRecipientIds.value.push(numericId);
    selectedContactId.value = "";
  }
}

// Alternative Email
function handleAlternativeEmailError(error) {
  if (!sendToAlternativeEmail.value) {
    alternativeEmailError.value = "";
    validationErrors.value = validationErrors.value.filter((e) => {
      const lowerError = e.toLowerCase();
      return (
        !lowerError.includes("alternative") &&
        !lowerError.includes("enter an alternative") &&
        !lowerError.includes("email is required")
      );
    });
    return;
  }

  alternativeEmailError.value = error || "";
  if (!error) {
    validationErrors.value = validationErrors.value.filter(
      (e) => !e.toLowerCase().includes("alternative")
    );
  }
}

// Validation
function validateForm() {
  validationErrors.value = [];

  const hasRecipients = selectedRecipientIds.value.length > 0;
  const hasValidAlternativeEmail =
    sendToAlternativeEmail.value &&
    alternativeEmail.value &&
    !alternativeEmailError.value;
  const hasSelfEmail = sendToMyEmail.value;

  if (!hasRecipients && !hasValidAlternativeEmail && !hasSelfEmail) {
    validationErrors.value.push("Please select at least one recipient");
  }

  if (sendToAlternativeEmail.value === true) {
    if (!alternativeEmail.value?.trim()) {
      validationErrors.value.push(
        "Please enter an alternative email address or uncheck the option"
      );
    } else if (alternativeEmailError.value) {
      validationErrors.value.push(alternativeEmailError.value);
    }
  }

  if (generatedDocuments.value.length === 0) {
    validationErrors.value.push(
      "No documents available. Please complete previous steps."
    );
  }

  return validationErrors.value.length === 0;
}

// Navigation
async function handleBack() {
  if (isSending.value || isSaving.value || isGenerating.value) return;

  try {
    isSaving.value = true;
    emit("update:data", documentStepData.value);
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));
    emit("back");
  } catch (error) {
    console.error("[Document Step] Failed to go back:", error);
    alert("Failed to save your progress. Please try again.");
  } finally {
    isSaving.value = false;
  }
}

async function sendDocuments() {
  if (
    isSending.value ||
    generatedDocuments.value.length === 0 ||
    isGenerating.value
  )
    return;

  if (!validateForm()) {
    const errorElement = document.querySelector(".validation-errors");
    errorElement?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  try {
    isSending.value = true;

    const allRecipients = [
      ...inputRecipients.value.filter((r) =>
        selectedRecipientIds.value.includes(r.id)
      ),
      ...contactsStore.getContactsByIds(
        selectedRecipientIds.value.filter((id) => typeof id === "number")
      ),
    ];

    const emailData = {
      recipients: allRecipients.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        role: r.role || "Recipient",
        source: r.source || "contacts",
      })),
      alternativeEmail: sendToAlternativeEmail.value
        ? alternativeEmail.value
        : null,
      sendToSelf: sendToMyEmail.value,
      documents: generatedDocuments.value.map((d) => ({
        id: d.id,
        name: d.name,
        displayName: d.displayName,
        size: d.size,
        format: d.format,
      })),
      documentMetadata: {
        name: props.documentMetadata?.name,
        filename: props.documentMetadata?.filename,
        description: props.documentMetadata?.description,
        status: props.documentMetadata?.status,
      },
      template: {
        id: props.template?.id,
        name: props.template?.name,
      },
      cleanedContent: cleanContentForPDF(documentContent.value),
      allStepData: props.allStepData,
    };

    console.log(
      "[Document Step] Sending with recipients:",
      emailData.recipients
    );

    await nextTick();
    emit("finish", emailData);
  } catch (error) {
    console.error("[Document Step] Failed to send:", error);
    validationErrors.value = ["Failed to send documents. Please try again."];
  } finally {
    isSending.value = false;
  }
}

// Error Handling
function handleError(errorInfo) {
  console.error("[Document Step] Error:", errorInfo);
  if (documentStepData.value) {
    localStorage.setItem(
      "emergency-backup-document-step",
      JSON.stringify({
        data: documentStepData.value,
        timestamp: Date.now(),
      })
    );
  }
}

function handleRecover() {
  const backupStr = localStorage.getItem("emergency-backup-document-step");
  if (backupStr) {
    try {
      const backup = JSON.parse(backupStr);
      restoreState(backup.data || backup);
      alert("Your selections have been restored successfully.");
    } catch (e) {
      console.error("Failed to restore backup:", e);
    }
  }
}

// Lifecycle
onMounted(async () => {
  await contactsStore.fetchContacts();

  if (props.stepData && Object.keys(props.stepData).length > 0) {
    restoreState(props.stepData);
  } else {
    const autoSelectIds = [
      ...inputRecipients.value.map((r) => r.id),
      ...internalContacts.value.map((c) => c.id),
    ];
    selectedRecipientIds.value = autoSelectIds;
  }

  console.log(
    "[Document Step] Mounted with input recipients:",
    inputRecipients.value
  );

  // Log content availability
  console.log("[Document Step] Content available:", {
    hasContent: !!documentContent.value,
    contentLength: documentContent.value?.length || 0,
  });
});

onBeforeUnmount(() => {
  if (documentStepData.value) {
    emit("update:data", documentStepData.value);
  }
});

// Watchers
watch(
  sendToAlternativeEmail,
  (newValue, oldValue) => {
    if (oldValue === true && newValue === false) {
      alternativeEmailError.value = "";
      alternativeEmail.value = "";
      validationErrors.value = validationErrors.value.filter((e) => {
        const lowerError = e.toLowerCase();
        return (
          !lowerError.includes("alternative") &&
          !lowerError.includes("enter an alternative") &&
          !lowerError.includes("email is required")
        );
      });
    }
  },
  { flush: "sync" }
);

// Keyboard Shortcuts
useKeyboardShortcuts({
  back: {
    shortcut: { key: "ArrowLeft", alt: true },
    handler: () => {
      if (!isSending.value && !isSaving.value && !isGenerating.value) {
        handleBack();
      }
    },
    description: "Go back",
  },
  send: {
    shortcut: { key: "Enter", mod: true },
    handler: () => {
      if (
        !isSending.value &&
        !isGenerating.value &&
        generatedDocuments.value.length > 0
      ) {
        sendDocuments();
      }
    },
    description: "Send documents",
  },
});
</script>

<style scoped lang="scss">
@use "./stepStyles.scss";

.debug-info {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 0.5rem;

  summary {
    cursor: pointer;
    font-weight: 600;
    color: #92400e;
    margin-bottom: 0.5rem;
  }

  &__content {
    margin-top: 0.75rem;
    font-size: 0.875rem;

    p {
      margin: 0.5rem 0;
    }

    pre {
      background: #ffffff;
      padding: 0.5rem;
      border-radius: 0.25rem;
      overflow-x: auto;
      font-size: 0.75rem;
    }
  }

  .debug-btn {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.875rem;

    &:hover {
      background: #2563eb;
    }
  }
}

.recipient-section-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.document-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  margin-bottom: 0.75rem;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  &__info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;

    flex-shrink: 0;
  }

  &__details {
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.25rem 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__meta {
    font-size: 0.8125rem;
    color: #6b7280;
    margin: 0;
  }
}

.button-icon {
  width: 1rem;
  height: 1rem;

  &.animate-spin {
    animation: spin 1s linear infinite;
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background-color: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 0.75rem;

  &__spinner {
    width: 2.5rem;
    height: 2.5rem;
    color: #3b82f6;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  &__text {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Rest of existing styles...
.document-step {
  &__header {
    margin-bottom: 1.5rem;
  }

  &__heading {
    font-size: 1.25rem;
    font-weight: 600;
    color: #181d27;
    margin: 0 0 0.5rem 0;
    line-height: 1.3;
  }

  &__subheading {
    font-size: 0.875rem;
    color: #535862;
    margin: 0;
    font-weight: 400;
    line-height: 1.5;
  }

  &__divider {
    height: 1px;
    background-color: #e5e7eb;
    margin: 1.5rem 0;
  }

  &__section-row {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2rem;
    align-items: start;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  &__section-header {
    min-width: 200px;
    padding-top: 0.25rem;
    flex-shrink: 0;
  }

  &__section-content {
    flex: 1;
    min-width: 0;
  }

  &__subsection-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
    line-height: 1.4;
  }

  &__subsection-subtitle {
    font-size: 0.875rem;
    color: #535862;
    margin: 0;
    font-weight: 400;
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding-top: 1.25rem;
    margin-top: 2rem;
    border-top: 1px solid #e5e7eb;
  }

  &__icon {
    width: 1rem;
    height: 1rem;

    &.animate-spin {
      animation: spin 1s linear infinite;
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background-color: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 0.75rem;

  &__icon {
    width: 3rem;
    height: 3rem;
    color: #9ca3af;
    margin-bottom: 1rem;
  }

  &__text {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
    text-align: center;
  }
}

.email-recipients {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.add-contact {
  margin-bottom: 1.5rem;

  &__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #414651;
    margin: 0 0 0.5rem 0;
  }

  &__select {
    width: 100%;
  }
}

.my-email {
  display: flex;
  align-items: center;
  margin: 1rem 0;

  &__checkbox {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    width: 0;
    height: 0;
  }

  &__label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
  }

  &__check-box {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    border: 2px solid #d1d5db;
    border-radius: 4px;
    background-color: #ffffff;
    transition: all 0.2s ease;

    .my-email__checkbox:checked + .my-email__label & {
      background-color: #4539cc;
      border-color: #4539cc;
    }
  }

  &__check-icon {
    width: 12px;
    height: 12px;
    color: #ffffff;
  }

  &__text {
    font-size: 0.875rem;
    font-weight: 500;
    color: #414651;
    user-select: none;
  }

  &__address {
    font-size: 0.875rem;
    color: #535862;
    font-weight: 400;
    margin-left: 0.25rem;
  }
}

.validation-errors {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-left: 4px solid #ef4444;
  border-radius: 0.5rem;
  margin-top: 1.5rem;

  &__icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    color: #ef4444;
  }

  &__content {
    flex: 1;
  }

  &__title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #991b1b;
    margin: 0 0 0.5rem 0;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 0.8125rem;
    color: #991b1b;

    li {
      margin-bottom: 0.25rem;

      &:last-child {
        margin-bottom: 0;
      }

      &::before {
        content: "• ";
        margin-right: 0.25rem;
      }
    }
  }
}
</style>
