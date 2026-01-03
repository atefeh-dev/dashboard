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
        <p class="document-step__subheading">They need you action</p>
      </div>

      <!-- Horizontal Divider -->
      <div class="document-step__divider"></div>

      <!-- ROW 1: Export Documents Section -->
      <div class="document-step__section-row">
        <div class="document-step__section-header">
          <h3 class="document-step__subsection-title">Export documents</h3>
          <p class="document-step__subsection-subtitle">
            You can download it here
          </p>
        </div>

        <div class="document-step__section-content">
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
            You can send them to contacts
          </p>
        </div>

        <div class="document-step__section-content">
          <!-- Selected Recipients (Internal Contacts) -->
          <div v-if="internalContacts.length > 0" class="email-recipients">
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

          <!-- Add External Contact Dropdown -->
          <div class="add-contact">
            <p class="add-contact__label">
              You can add from your contacts here
            </p>
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

          <!-- Alternative Email Component -->
          <AppAlternativeEmailInput
            v-model="alternativeEmail"
            v-model:enabled="sendToAlternativeEmail"
            :disabled="isSending"
            @error="handleAlternativeEmailError"
          />

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
/**
 * DOCUMENT STEP - EMAIL & EXPORT
 *
 * Final step of document workflow with instant error clearing
 */

import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import { storeToRefs } from "pinia";
import {
  FileText,
  ChevronLeft,
  Loader,
  Send,
  AlertCircle,
} from "lucide-vue-next";
import DocumentExportList from "../document-export/DocumentExportList.vue";
import AppAlternativeEmailInput from "@/components/ui/AppAlternativeEmailInput.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppSelect from "@/components/ui/AppSelect.vue";
import ErrorBoundary from "./ErrorBoundary.vue";
import ContactSelectItem from "../contact/ContactSelectItem.vue";
import CheckIcon from "@/assets/icons/common/check.svg"; // Update path to your icon
import { useContactsStore } from "@/stores/useContactsStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useFormPersistence } from "@/composables/useFormPersistence";
import {
  useKeyboardShortcuts,
  getShortcutLabels,
} from "@/composables/useKeyboardShortcuts";

// ============================================
// PROPS & EMITS
// ============================================
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

// ============================================
// STORES & COMPOSABLES
// ============================================
const contactsStore = useContactsStore();
const authStore = useAuthStore();
const { internalContacts, externalContacts } = storeToRefs(contactsStore);
const shortcutLabels = getShortcutLabels();

// ============================================
// STATE - ALL REFS DECLARED FIRST
// ============================================
const selectedRecipientIds = ref([]);
const selectedContactId = ref("");
const sendToAlternativeEmail = ref(false);
const alternativeEmail = ref("");
const sendToMyEmail = ref(false);
const isSending = ref(false);
const isSaving = ref(false);
const alternativeEmailError = ref("");
const validationErrors = ref([]);

// ============================================
// COMPUTED PROPERTIES
// ============================================
const userEmail = computed(() => authStore.user?.email || "user@doclast.com");

const generatedDocuments = computed(() => {
  const baseFilename = props.documentMetadata?.filename || "untitled-document";
  const documentName = props.documentMetadata?.name || "Untitled Document";

  const documents = [
    {
      id: 1,
      name: `${baseFilename}.pdf`,
      displayName: `${documentName} (PDF)`,
      size: calculateEstimatedSize("pdf"),
      status: "completed",
      format: "pdf",
    },
    // {
    //   id: 2,
    //   name: `${baseFilename}.docx`,
    //   displayName: `${documentName} (Word)`,
    //   size: calculateEstimatedSize("docx"),
    //   status: "completed",
    //   format: "docx",
    // },
  ];

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

// ============================================
// WATCHERS - IMMEDIATE CLEARING
// ============================================
watch(
  sendToAlternativeEmail,
  (newValue, oldValue) => {
    // Only clear when transitioning from true to false
    if (oldValue === true && newValue === false) {
      console.log("[Document Step] Alternative email disabled - INSTANT CLEAR");

      // Clear SYNCHRONOUSLY (no await, no nextTick)
      alternativeEmailError.value = "";
      alternativeEmail.value = "";

      // Clear validation errors SYNCHRONOUSLY
      const filtered = validationErrors.value.filter((e) => {
        const lowerError = e.toLowerCase();
        return (
          !lowerError.includes("alternative") &&
          !lowerError.includes("enter an alternative") &&
          !lowerError.includes("email is required")
        );
      });

      validationErrors.value = filtered;
    }
  },
  { flush: "sync" } // CRITICAL: Use sync flush for immediate execution
);

// ============================================
// FORM PERSISTENCE
// ============================================
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

// ============================================
// HELPER FUNCTIONS
// ============================================
function calculateEstimatedSize(format) {
  const baseSizes = { pdf: 648, docx: 245, html: 128 };
  const size = baseSizes[format] || 500;
  return size >= 1024 ? `${(size / 1024).toFixed(1)} MB` : `${size} KB`;
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

  // Clean up if disabled
  if (!sendToAlternativeEmail.value) {
    alternativeEmail.value = "";
    alternativeEmailError.value = "";
  }
}

// ============================================
// CONTACT MANAGEMENT
// ============================================
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

// ============================================
// ALTERNATIVE EMAIL HANDLING
// ============================================
function handleAlternativeEmailError(error) {
  // If checkbox is disabled, ignore all errors
  if (!sendToAlternativeEmail.value) {
    alternativeEmailError.value = "";

    // Remove any alternative email errors
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

  // Checkbox is enabled - handle normally
  alternativeEmailError.value = error || "";

  // Clear from validation if error resolved
  if (!error) {
    validationErrors.value = validationErrors.value.filter(
      (e) => !e.toLowerCase().includes("alternative")
    );
  }
}

// ============================================
// VALIDATION
// ============================================
function validateForm() {
  // Clear all errors first
  validationErrors.value = [];

  const hasRecipients = selectedRecipientIds.value.length > 0;
  const hasValidAlternativeEmail =
    sendToAlternativeEmail.value &&
    alternativeEmail.value &&
    !alternativeEmailError.value;
  const hasSelfEmail = sendToMyEmail.value;

  // At least one recipient required
  if (!hasRecipients && !hasValidAlternativeEmail && !hasSelfEmail) {
    validationErrors.value.push("Please select at least one recipient");
  }

  // Only validate alternative email if checkbox is enabled
  if (sendToAlternativeEmail.value === true) {
    if (!alternativeEmail.value?.trim()) {
      validationErrors.value.push(
        "Please enter an alternative email address or uncheck the option"
      );
    } else if (alternativeEmailError.value) {
      validationErrors.value.push(alternativeEmailError.value);
    }
  }

  // Check documents available
  if (generatedDocuments.value.length === 0) {
    validationErrors.value.push(
      "No documents available. Please complete previous steps."
    );
  }

  return validationErrors.value.length === 0;
}

// ============================================
// NAVIGATION HANDLERS
// ============================================
async function handleBack() {
  if (isSending.value || isSaving.value) return;

  try {
    isSaving.value = true;
    await saveNow(documentStepData.value);
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
  if (isSending.value || generatedDocuments.value.length === 0) return;

  if (!validateForm()) {
    const errorElement = document.querySelector(".validation-errors");
    errorElement?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  try {
    isSending.value = true;
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
      allStepData: props.allStepData,
    };

    await saveNow(documentStepData.value);
    await nextTick();
    emit("finish", emailData);
  } catch (error) {
    console.error("[Document Step] Failed to send:", error);
    validationErrors.value = ["Failed to send documents. Please try again."];
  } finally {
    isSending.value = false;
  }
}

function downloadDocument(doc) {
  alert(
    `Download functionality coming soon!\n\nFilename: ${
      doc.name
    }\nFormat: ${doc.format.toUpperCase()}`
  );
}

// ============================================
// ERROR HANDLING
// ============================================
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

// ============================================
// LIFECYCLE HOOKS
// ============================================
onMounted(async () => {
  await contactsStore.fetchContacts();

  if (props.stepData && Object.keys(props.stepData).length > 0) {
    restoreState(props.stepData);
  } else {
    const backup = restoreEmergencyBackup();
    if (backup) {
      restoreState(backup);
      clearEmergencyBackup();
    } else {
      selectedRecipientIds.value = internalContacts.value.map((c) => c.id);
    }
  }

  startWatching(() => documentStepData.value);
});

onBeforeUnmount(() => {
  if (documentStepData.value) {
    emit("update:data", documentStepData.value);
  }
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
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
</script>

<style scoped lang="scss">
@use "./stepStyles.scss";

.document-step {
  // Header section
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

  // Horizontal divider line
  &__divider {
    height: 1px;
    background-color: #e5e7eb;
    margin: 1.5rem 0;
  }

  // Each section row (Export or Email)
  &__section-row {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2rem;
    align-items: start;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__section-header {
    min-width: 200px;
    padding-top: 0.25rem;
    flex-shrink: 0;

    @media (max-width: 1024px) {
      min-width: auto;
    }
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
    padding-top: 2rem;
    margin-top: 2rem;
    border-top: 1px solid #e5e7eb;

    @media (max-width: 640px) {
      flex-direction: column-reverse;

      button {
        width: 100%;
      }
    }
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
  margin-bottom: 1.5rem;
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

  // Hide native checkbox
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

  // Custom checkbox
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

    // When checked
    .my-email__checkbox:checked + .my-email__label & {
      background-color: #4539cc;
      border-color: #4539cc;
    }

    // Hover effect
    .my-email__label:hover & {
      border-color: #9ca3af;
    }

    .my-email__checkbox:checked + .my-email__label:hover & {
      background-color: #5145d4;
      border-color: #5145d4;
    }

    // Disabled state
    .my-email__checkbox:disabled + .my-email__label & {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  // Check icon
  &__check-icon {
    width: 12px;
    height: 12px;
    color: #ffffff;
    animation: checkAppear 0.2s ease;
  }

  @keyframes checkAppear {
    from {
      opacity: 0;
      transform: scale(0.5);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  &__text {
    font-size: 0.875rem;
    font-weight: 500;
    color: #414651;
    user-select: none;
    transition: color 0.2s ease;

    .my-email__label:hover & {
      color: #4539cc;
    }

    .my-email__checkbox:disabled + .my-email__label & {
      opacity: 0.5;
      cursor: not-allowed;
    }
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
  animation: slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

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
</style>
