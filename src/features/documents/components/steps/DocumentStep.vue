<template>
  <div class="document-step">
    <!-- Documents Export Section -->
    <div class="document-step__section">
      <h2 class="document-step__heading">Here are your documents</h2>
      <p class="document-step__subheading">They need your action</p>

      <div class="document-step__subsection">
        <h3 class="document-step__subsection-title">Export documents</h3>
        <p class="document-step__subsection-subtitle">
          You can download it here
        </p>

        <div class="document-list">
          <DocumentExportList
            :documents="documents"
            @download="downloadDocument"
          />
        </div>
      </div>
    </div>

    <!-- Email Section -->
    <div class="document-step__section">
      <h3 class="document-step__subsection-title">
        Email this (these) documents
      </h3>
      <p class="document-step__subsection-subtitle">
        You can send them to contacts
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

      <!-- Selected External Contacts Preview Cards -->
      <div v-if="selectedExternalContacts.length > 0" class="selected-contacts">
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
      </div>

      <!-- Add External Contact Dropdown -->
      <div class="add-contact">
        <p class="add-contact__label">You can add from your contacts here</p>
        <AppSelect
          v-model="selectedContactId"
          class="add-contact__select"
          @update:model-value="handleContactSelect"
        >
          <option value="" disabled selected>Select from People</option>
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
        />
        <label for="alt-email" class="alternative-email__label">
          Send to an alternative email
        </label>
      </div>

      <div v-if="sendToAlternativeEmail" class="alternative-email__input">
        <Mail class="alternative-email__icon" />
        <input
          type="email"
          v-model="alternativeEmail"
          placeholder="email@example.com"
          class="alternative-email__field"
        />
      </div>

      <!-- Send to My Email -->
      <div class="my-email">
        <input
          type="checkbox"
          id="my-email"
          v-model="sendToMyEmail"
          class="my-email__checkbox"
        />
        <label for="my-email" class="my-email__label">
          Send to my email
          <span class="my-email__address">{{ userEmail }}</span>
        </label>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="document-step__actions">
      <AppButton variant="ghost" @click="goBack">
        <ChevronLeft class="document-step__back-icon" />
        Back
      </AppButton>
      <AppButton variant="primary" size="lg" @click="sendDocuments">
        Send
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import {
  Check,
  FileText,
  Download,
  Mail,
  ChevronLeft,
  X,
} from "lucide-vue-next";
import DocumentExportList from "../document-export/DocumentExportList.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppSelect from "@/components/ui/AppSelect.vue";
import { useContactsStore } from "@/stores/useContactsStore";
import { useAuthStore } from "@/stores/useAuthStore";
import ContactSelectItem from "../contact/ContactSelectItem.vue";

// Emits
const emit = defineEmits(["finish", "back"]);

// Stores
const contactsStore = useContactsStore();
const authStore = useAuthStore();

const { internalContacts, externalContacts } = storeToRefs(contactsStore);

// Documents
const documents = ref([
  {
    id: 1,
    name: "doclast-accelerator-contract-2025.pdf",
    size: "648 KB",
    status: "completed",
  },
  {
    id: 2,
    name: "doclast-accelerator-contract-2025.pdf",
    size: "648 KB",
    status: "completed",
  },
  {
    id: 3,
    name: "doclast-accelerator-contract-2025.pdf",
    size: "648 KB",
    status: "completed",
  },
]);

// Recipients Management
const selectedRecipientIds = ref([]);
const selectedContactId = ref("");

// Initialize with internal contacts
onMounted(async () => {
  await contactsStore.fetchContacts();

  // Pre-select internal contacts
  selectedRecipientIds.value = internalContacts.value.map((c) => c.id);
});

// Selected external contacts (shown as preview cards)
const selectedExternalContacts = computed(() => {
  return externalContacts.value.filter((contact) =>
    selectedRecipientIds.value.includes(contact.id)
  );
});

// Available external contacts (not yet selected)
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
    selectedContactId.value = ""; // Reset select
  }
}

function removeExternalContact(id) {
  const index = selectedRecipientIds.value.indexOf(id);
  if (index > -1) {
    selectedRecipientIds.value.splice(index, 1);
  }
}

// Email Options
const sendToAlternativeEmail = ref(false);
const alternativeEmail = ref("");
const sendToMyEmail = ref(false);
const userEmail = computed(() => authStore.user?.email || "ali@doclast.com");

// Methods
function downloadDocument(doc) {
  console.log("Downloading document:", doc.name);
  // TODO: Implement actual download logic
}

function goBack() {
  emit("back");
}

function sendDocuments() {
  // Get all selected contacts
  const recipients = contactsStore.getContactsByIds(selectedRecipientIds.value);

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
    documents: documents.value.map((d) => d.id),
  };

  // Validate
  if (
    recipients.length === 0 &&
    !sendToAlternativeEmail.value &&
    !sendToMyEmail.value
  ) {
    alert("Please select at least one recipient");
    return;
  }

  if (sendToAlternativeEmail.value && !alternativeEmail.value) {
    alert("Please enter an alternative email");
    return;
  }

  emit("finish", emailData);
}
</script>

<style scoped lang="scss">
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

  &__back-icon {
    width: 1rem;
    height: 1rem;
  }
}

// Email Recipients

// Selected Contacts Preview Cards (NEW)
.selected-contacts {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  &__card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #f5f6ff;
    border: 2px solid #6366f1;
    border-radius: 0.5rem;
    transition: all 0.2s ease;

    &:hover {
      background-color: #eef0ff;
    }
  }

  &__info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
  }

  &__check-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: #6366f1;
    flex-shrink: 0;
  }

  &__details {
    flex: 1;
  }

  &__name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
    margin: 0 0 0.125rem 0;
  }

  &__added-label {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 400;
  }

  &__remove-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background-color: transparent;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.15s;

    &:hover {
      background-color: rgba(99, 102, 241, 0.1);
    }

    &:active {
      background-color: rgba(99, 102, 241, 0.2);
    }
  }

  &__remove-icon {
    width: 1.125rem;
    height: 1.125rem;
    color: #6366f1;
  }
}

// Add Contact
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

// Alternative Email
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
    transition: border-color 0.2s;

    &:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    &::placeholder {
      color: #9ca3af;
    }
  }
}

// My Email
.my-email {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &__checkbox {
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
    accent-color: #6366f1;
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
</style>
