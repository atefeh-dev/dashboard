<template>
  <div class="document-step">
    <ErrorBoundary
      fallback-title="Document Step Error"
      fallback-message="Something went wrong. Your selections have been saved."
      @error="handleError"
      @recover="handleRecover"
    >
      <!-- Documents Export Section -->
      <div class="document-step__section">
        <h2 class="document-step__heading">Here are your documents</h2>
        <p class="document-step__subheading">
          Generated from your template and ready to send
        </p>

        <div class="document-step__subsection">
          <h3 class="document-step__subsection-title">Export documents</h3>
          <p class="document-step__subsection-subtitle">
            You can download them here
          </p>

          <div v-if="generatedDocuments.length > 0" class="document-list">
            <DocumentExportList
              :documents="generatedDocuments"
              @download="downloadDocument"
            />
          </div>
          <div v-else class="empty-state">
            <FileText class="empty-state__icon" />
            <p class="empty-state__text">
              No documents generated. Please complete previous steps.
            </p>
          </div>
        </div>
      </div>

      <!-- Email Section -->
      <div class="document-step__section">
        <h3 class="document-step__subsection-title">
          Email
          {{ generatedDocuments.length > 1 ? "these" : "this" }} document{{
            generatedDocuments.length > 1 ? "s" : ""
          }}
        </h3>
        <p class="document-step__subsection-subtitle">
          Send to contacts or alternative email
        </p>

        <!-- Selected Recipients (Internal Contacts) -->
        <div v-if="internalContacts.length > 0" class="email-recipients">
          <ContactSelectItem
            v-for="recipient in internalContacts"
            :key="recipient.id"
            :contact="recipient"
            :checked="isRecipientSelected(recipient.id)"
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
            @toggle="toggleRecipient"
            :isexternal="true"
          />
        </div>

        <!-- Add External Contact Dropdown -->
        <div class="add-contact">
          <p class="add-contact__label">Add from your contacts</p>
          <AppSelect
            v-model="selectedContactId"
            class="add-contact__select"
            @update:model-value="handleContactSelect"
            :disabled="isSending"
          >
            <option value="" disabled>Select from People</option>
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
        <div class="alternative-email">
          <input
            type="checkbox"
            id="alt-email"
            v-model="sendToAlternativeEmail"
            class="alternative-email__checkbox"
            :disabled="isSending"
            @change="handleAlternativeEmailToggle"
          />
          <label for="alt-email" class="alternative-email__label">
            Send to an alternative email
          </label>
        </div>

        <transition name="fade">
          <div v-if="sendToAlternativeEmail" class="alternative-email__input">
            <Mail class="alternative-email__icon" />
            <input
              type="email"
              v-model="alternativeEmail"
              placeholder="email@example.com"
              class="alternative-email__field"
              :class="{
                'alternative-email__field--error': alternativeEmailError,
              }"
              :disabled="isSending"
              @blur="validateAlternativeEmail"
              @input="alternativeEmailError = ''"
            />
            <transition name="fade">
              <div v-if="alternativeEmailError" class="field-error">
                {{ alternativeEmailError }}
              </div>
            </transition>
          </div>
        </transition>

        <!-- Send to My Email -->
        <div class="my-email">
          <input
            type="checkbox"
            id="my-email"
            v-model="sendToMyEmail"
            class="my-email__checkbox"
            :disabled="isSending"
          />
          <label for="my-email" class="my-email__label">
            Send to my email
            <span class="my-email__address">{{ userEmail }}</span>
          </label>
        </div>

        <!-- Validation Error Summary -->
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
      </div>

      <!-- Action Buttons -->
      <div class="document-step__actions">
        <AppButton variant="ghost" @click="handleBack" :disabled="isSending">
          <Loader v-if="isSaving" class="document-step__icon animate-spin" />
          <ChevronLeft v-else class="document-step__icon" />
          {{ isSaving ? "Saving..." : "Back" }}
        </AppButton>
        <AppButton
          variant="primary"
          size="lg"
          @click="sendDocuments"
          :disabled="isSending || generatedDocuments.length === 0"
        >
          <Loader v-if="isSending" class="document-step__icon animate-spin" />
          <Send v-else class="document-step__icon" />
          {{ isSending ? "Sending..." : "Send Documents" }}
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
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import { storeToRefs } from "pinia";
import {
  FileText,
  Mail,
  ChevronLeft,
  Loader,
  Send,
  AlertCircle,
} from "lucide-vue-next";
import DocumentExportList from "../document-export/DocumentExportList.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppSelect from "@/components/ui/AppSelect.vue";
import ErrorBoundary from "./ErrorBoundary.vue";
import { useContactsStore } from "@/stores/useContactsStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useFormPersistence } from "@/composables/useFormPersistence";
import {
  useKeyboardShortcuts,
  getShortcutLabels,
} from "@/composables/useKeyboardShortcuts";
import ContactSelectItem from "../contact/ContactSelectItem.vue";

const props = defineProps({
  stepData: {
    type: Object,
    default: () => ({}),
  },
  // NEW: Accept document metadata from parent
  documentMetadata: {
    type: Object,
    default: () => ({}),
  },
  // NEW: Accept selected template
  template: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["finish", "back", "update:data"]);

// Stores
const contactsStore = useContactsStore();
const authStore = useAuthStore();

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
const alternativeEmailError = ref("");
const validationErrors = ref([]);

const userEmail = computed(() => authStore.user?.email || "user@doclast.com");

// ============================================
// GENERATE DOCUMENTS FROM USER'S FILENAME
// ============================================
const generatedDocuments = computed(() => {
  // Get filename from documentMetadata (from Details step)
  const baseFilename = props.documentMetadata?.filename || "untitled-document";
  const documentName = props.documentMetadata?.name || "Untitled Document";
  const templateName = props.template?.name || "Document";

  // Generate documents based on template
  // Usually you'd have PDF, DOCX, etc. versions
  const documents = [];

  // PDF version (primary)
  documents.push({
    id: 1,
    name: `${baseFilename}.pdf`,
    displayName: `${documentName} (PDF)`,
    size: calculateEstimatedSize("pdf"),
    status: "completed",
    format: "pdf",
  });

  // DOCX version (editable)
  documents.push({
    id: 2,
    name: `${baseFilename}.docx`,
    displayName: `${documentName} (Word)`,
    size: calculateEstimatedSize("docx"),
    status: "completed",
    format: "docx",
  });

  // If template supports additional formats
  if (props.template?.supportsHTML) {
    documents.push({
      id: 3,
      name: `${baseFilename}.html`,
      displayName: `${documentName} (HTML)`,
      size: calculateEstimatedSize("html"),
      status: "completed",
      format: "html",
    });
  }

  return documents;
});

// Helper to calculate estimated file size
function calculateEstimatedSize(format) {
  // In real app, this would come from actual document generation
  const baseSizes = {
    pdf: 648, // KB
    docx: 245,
    html: 128,
  };

  const size = baseSizes[format] || 500;
  return size >= 1024 ? `${(size / 1024).toFixed(1)} MB` : `${size} KB`;
}

// Form persistence
const { saveNow, startWatching, restoreEmergencyBackup, clearEmergencyBackup } =
  useFormPersistence(
    "document-step",
    async (data) => {
      emit("update:data", data);
      await new Promise((resolve) => setTimeout(resolve, 50));
    },
    {
      debounceMs: 500,
      enableEmergencyBackup: true,
      logChanges: import.meta.env.DEV,
    }
  );

// Computed for auto-save
const documentStepData = computed(() => ({
  selectedRecipientIds: selectedRecipientIds.value,
  sendToAlternativeEmail: sendToAlternativeEmail.value,
  alternativeEmail: alternativeEmail.value,
  sendToMyEmail: sendToMyEmail.value,
}));

// Lifecycle
onMounted(async () => {
  console.log("[Document Step] Mounted");
  console.log("[Document Step] Document metadata:", props.documentMetadata);
  console.log("[Document Step] Template:", props.template);

  await contactsStore.fetchContacts();

  // Restore from stepData or emergency backup
  if (props.stepData && Object.keys(props.stepData).length > 0) {
    console.log("[Document Step] Restoring from stepData");
    restoreState(props.stepData);
  } else {
    const backup = restoreEmergencyBackup();
    if (backup) {
      console.warn("[Document Step] Restored from emergency backup");
      restoreState(backup);
      clearEmergencyBackup();
    } else {
      // Pre-select internal contacts by default
      selectedRecipientIds.value = internalContacts.value.map((c) => c.id);
    }
  }

  // Start auto-save watching
  startWatching(() => documentStepData.value);
});

onBeforeUnmount(() => {
  console.log("[Document Step] Unmounting");
  if (documentStepData.value) {
    emit("update:data", documentStepData.value);
  }
});

// Restore state helper
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
}

// Keyboard shortcuts
useKeyboardShortcuts({
  back: {
    shortcut: { key: "ArrowLeft", alt: true },
    handler: () => {
      if (!isSending.value && !isSaving.value) {
        handleBack();
      }
    },
    description: "Go back",
  },
  send: {
    shortcut: { key: "Enter", mod: true },
    handler: () => {
      if (!isSending.value && generatedDocuments.value.length > 0) {
        sendDocuments();
      }
    },
    description: "Send documents",
  },
});

// Contact management
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
  if (contactId && !selectedRecipientIds.value.includes(Number(contactId))) {
    selectedRecipientIds.value.push(Number(contactId));
    selectedContactId.value = "";
  }
}

// Email validation
function validateAlternativeEmail() {
  if (!sendToAlternativeEmail.value) {
    alternativeEmailError.value = "";
    return true;
  }

  if (!alternativeEmail.value) {
    alternativeEmailError.value = "Email is required";
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(alternativeEmail.value)) {
    alternativeEmailError.value = "Please enter a valid email address";
    return false;
  }

  alternativeEmailError.value = "";
  return true;
}

function handleAlternativeEmailToggle() {
  if (!sendToAlternativeEmail.value) {
    alternativeEmail.value = "";
    alternativeEmailError.value = "";
  }
}

// Validation
function validateForm() {
  validationErrors.value = [];

  const hasRecipients = selectedRecipientIds.value.length > 0;
  const hasAlternativeEmail =
    sendToAlternativeEmail.value && alternativeEmail.value;
  const hasSelfEmail = sendToMyEmail.value;

  if (!hasRecipients && !hasAlternativeEmail && !hasSelfEmail) {
    validationErrors.value.push("Please select at least one recipient");
  }

  if (sendToAlternativeEmail.value) {
    if (!validateAlternativeEmail()) {
      validationErrors.value.push("Please enter a valid alternative email");
    }
  }

  if (generatedDocuments.value.length === 0) {
    validationErrors.value.push(
      "No documents available. Please complete previous steps."
    );
  }

  return validationErrors.value.length === 0;
}

// Navigation handlers
async function handleBack() {
  try {
    isSaving.value = true;
    console.log("[Document Step] Back clicked, saving...");

    await saveNow(documentStepData.value);
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log("[Document Step] Data saved, going back");
    emit("back");
  } catch (error) {
    console.error("[Document Step] Failed to go back:", error);
    alert("Failed to save your progress. Please try again.");
  } finally {
    isSaving.value = false;
  }
}

async function sendDocuments() {
  if (!validateForm()) {
    const errorElement = document.querySelector(".validation-errors");
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  try {
    isSending.value = true;
    console.log("[Document Step] Sending documents...");

    const recipients = contactsStore.getContactsByIds(
      selectedRecipientIds.value
    );

    const emailData = {
      recipients: recipients.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        role: r.role,
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
      // Include document metadata for backend
      documentMetadata: {
        name: props.documentMetadata?.name,
        filename: props.documentMetadata?.filename,
        description: props.documentMetadata?.description,
        template: props.template?.name,
      },
    };

    console.log("[Document Step] Email data:", emailData);

    await saveNow(documentStepData.value);
    await nextTick();

    emit("finish", emailData);

    console.log("[Document Step] Documents sent successfully");
  } catch (error) {
    console.error("[Document Step] Failed to send documents:", error);
    validationErrors.value = ["Failed to send documents. Please try again."];
  } finally {
    isSending.value = false;
  }
}

function downloadDocument(doc) {
  console.log("Downloading document:", doc.name);
  // TODO: Implement actual download logic
  // This would typically call an API to generate and download the document
  // Example: window.location.href = `/api/documents/${doc.id}/download`;
}

// Error handling
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
  const backup = restoreEmergencyBackup();
  if (backup) {
    restoreState(backup.data || backup);
    alert("Your selections have been restored successfully.");
  }
}
</script>

<style scoped lang="scss">
// Same styles as before...
.document-step {
  &__section {
    margin-bottom: 3rem;
  }

  &__heading {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.25rem 0;
  }

  &__subheading {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0 0 2rem 0;
  }

  &__subsection {
    margin-bottom: 2rem;
  }

  &__subsection-title {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.25rem 0;
  }

  &__subsection-subtitle {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0 0 1.5rem 0;
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding-top: 2rem;
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

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
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
  margin-bottom: 1.5rem;
}

.add-contact {
  margin-bottom: 1.5rem;

  &__label {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0 0 0.5rem 0;
  }

  &__select {
    width: 100%;
  }
}

.alternative-email {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;

  &__checkbox {
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
    accent-color: #6366f1;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  &__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
    cursor: pointer;
  }

  &__input {
    position: relative;
    margin-bottom: 1.5rem;
  }

  &__icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.25rem;
    height: 1.25rem;
    color: #6b7280;
    pointer-events: none;
  }

  &__field {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    font-size: 0.875rem;
    color: #111827;
    background-color: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    outline: none;
    transition: all 0.2s;

    &:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    &::placeholder {
      color: #9ca3af;
    }

    &:disabled {
      background-color: #f3f4f6;
      cursor: not-allowed;
    }

    &--error {
      border-color: #ef4444;

      &:focus {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }
    }
  }
}

.field-error {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.375rem;
  font-weight: 500;
}

.my-email {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  &__checkbox {
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
    accent-color: #6366f1;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  &__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
    cursor: pointer;
  }

  &__address {
    font-size: 0.875rem;
    color: #6b7280;
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
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &__icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    color: #ef4444;
    margin-top: 0.125rem;
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

.keyboard-hints {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin-top: 1rem;
  padding: 0.75rem;
  font-size: 0.75rem;
  color: #6b7280;
  background-color: #f9fafb;
  border-radius: 0.375rem;

  &__separator {
    margin: 0 0.5rem;
    color: #d1d5db;
  }
}

.kbd {
  display: inline-block;
  padding: 0.125rem 0.375rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  background-color: #fff;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  min-width: 1.5rem;
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
