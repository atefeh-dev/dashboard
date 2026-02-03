<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
        <div class="modal-container" role="dialog" aria-modal="true">
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-header__content">
              <div class="modal-header__title-section">
                <FileTypeIcon class="modal-header__icon" />
                <div>
                  <h2 class="modal-header__title">{{ template?.name }}</h2>
                  <div class="modal-header__meta">
                    <span class="modal-header__author"
                      >By {{ template?.author }}</span
                    >
                    <span class="modal-header__separator">•</span>
                    <span class="modal-header__verified">
                      <VerifiedTickIcon />
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                class="modal-header__close"
                @click="handleClose"
                aria-label="Close preview"
              >
                <X />
              </button>
            </div>

            <!-- Template Info Bar -->
            <div class="template-info">
              <div class="template-info__item">
                <Calendar class="template-info__icon" />
                <span class="template-info__label">Last updated</span>
                <span class="template-info__value">{{
                  template?.lastUpdate
                }}</span>
              </div>

              <div class="template-info__item">
                <FileText class="template-info__icon" />
                <span class="template-info__label">Type</span>
                <span class="template-info__value template-info__value--badge">
                  {{ template?.type }}
                </span>
              </div>

              <div class="template-info__item">
                <Tag class="template-info__icon" />
                <span class="template-info__label">Tags</span>
                <div class="template-info__tags">
                  <span
                    v-for="(tag, idx) in template?.tags.slice(0, 3)"
                    :key="idx"
                    class="template-info__tag"
                  >
                    {{ tag }}
                  </span>
                  <span
                    v-if="template?.tags.length > 3"
                    class="template-info__tag-more"
                  >
                    +{{ template?.tags.length - 3 }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="modal-body">
            <div class="preview-container">
              <!-- Sample Data Notice -->
              <div class="sample-notice">
                <AlertCircle class="sample-notice__icon" />
                <div class="sample-notice__content">
                  <p class="sample-notice__title">Preview with Sample Data</p>
                  <p class="sample-notice__text">
                    This preview shows the template structure with placeholder
                    content. Your actual document will use your provided data.
                  </p>
                </div>
              </div>

              <!-- Template Preview -->
              <div class="template-preview">
                <div
                  class="template-preview__content"
                  v-html="previewContent"
                ></div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <div class="modal-footer__actions">
              <AppButton variant="ghost" size="md" @click="handleClose">
                Close Preview
              </AppButton>
              <AppButton variant="primary" size="md" @click="handleUseTemplate">
                Use This Template
                <ChevronRight class="button-icon" />
              </AppButton>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, onMounted, onBeforeUnmount, ref } from "vue";
import {
  X,
  FileText,
  Calendar,
  Tag,
  AlertCircle,
  ChevronRight,
} from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";
import FileTypeIcon from "@/assets/icons/common/file-type-icon.svg";
import VerifiedTickIcon from "@/assets/icons/common/verified-tick.svg";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  template: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "use-template"]);

// Generate sample data based on template fields
const sampleData = computed(() => {
  if (!props.template?.fields) return {};

  const data = {};
  props.template.fields.forEach((field) => {
    // Generate appropriate sample data based on field type
    switch (field.name) {
      // Common fields
      case "effectiveDate":
        data[field.name] = "January 15, 2026";
        break;

      // NDA specific
      case "disclosingPartyName":
        data[field.name] = "Acme Corporation Inc.";
        break;
      case "disclosingPartyAddress":
        data[field.name] =
          "123 Business Street, Suite 500\nSan Francisco, CA 94103";
        break;
      case "disclosingPartyEmail":
        data[field.name] = "legal@acmecorp.com";
        break;
      case "receivingPartyName":
        data[field.name] = "Tech Innovations LLC";
        break;
      case "receivingPartyAddress":
        data[field.name] = "456 Innovation Drive\nAustin, TX 78701";
        break;
      case "receivingPartyEmail":
        data[field.name] = "contact@techinnovations.com";
        break;
      case "purpose":
        data[field.name] =
          "To facilitate discussions and potential business collaboration regarding the development of innovative software solutions and technology partnerships.";
        break;

      // Employment Contract
      case "employerName":
        data[field.name] = "Global Tech Solutions Inc.";
        break;
      case "employerEmail":
        data[field.name] = "hr@globaltech.com";
        break;
      case "employeeName":
        data[field.name] = "Sarah Johnson";
        break;
      case "employeeEmail":
        data[field.name] = "sarah.johnson@email.com";
        break;
      case "position":
        data[field.name] = "Senior Software Engineer";
        break;
      case "workLocation":
        data[field.name] = "New York Office (Hybrid)";
        break;
      case "salary":
        data[field.name] = "$120,000 per year";
        break;

      // Service Agreement
      case "clientName":
        data[field.name] = "StartUp Ventures Ltd.";
        break;
      case "clientEmail":
        data[field.name] = "contact@startupventures.com";
        break;
      case "providerName":
        data[field.name] = "Professional Services Group";
        break;
      case "providerEmail":
        data[field.name] = "services@proservices.com";
        break;
      case "servicesDescription":
        data[field.name] =
          "Comprehensive business consulting services including strategic planning, market analysis, financial modeling, and operational optimization. Services will be delivered through regular consultation sessions, detailed reports, and ongoing advisory support.";
        break;
      case "serviceTerm":
        data[field.name] = "6 months";
        break;
      case "serviceFee":
        data[field.name] = "$5,000 per month";
        break;
      case "paymentTerms":
        data[field.name] =
          "Payment due within 15 days of invoice date. Invoices will be issued monthly on the first business day. Late payments subject to 1.5% monthly interest. Accepted payment methods: bank transfer, check, or credit card.";
        break;
      case "terminationNotice":
        data[field.name] = "30 days written notice";
        break;

      // Partnership Agreement
      case "partnerOneName":
        data[field.name] = "Michael Chen";
        break;
      case "partnerOneEmail":
        data[field.name] = "michael.chen@email.com";
        break;
      case "partnerTwoName":
        data[field.name] = "Jennifer Martinez";
        break;
      case "partnerTwoEmail":
        data[field.name] = "jennifer.martinez@email.com";
        break;
      case "partnershipPurpose":
        data[field.name] =
          "To establish a strategic partnership for the development and commercialization of innovative software products, combining technical expertise with business acumen to create market-leading solutions.";
        break;
      case "partnerOneContribution":
        data[field.name] = "$100,000 cash investment and technical expertise";
        break;
      case "partnerTwoContribution":
        data[field.name] = "$100,000 cash investment and business development";
        break;
      case "partnerOneShare":
        data[field.name] = "50%";
        break;
      case "partnerTwoShare":
        data[field.name] = "50%";
        break;
      case "partnershipTerm":
        data[field.name] = "5 years";
        break;

      // Consulting Agreement
      case "consultantName":
        data[field.name] = "Expert Consulting Group LLC";
        break;
      case "consultantEmail":
        data[field.name] = "info@expertconsulting.com";
        break;
      case "consultingServices":
        data[field.name] =
          "Strategic business consulting services including market research, competitive analysis, business model development, go-to-market strategy, and executive coaching. Deliverables include comprehensive reports, presentations, and actionable recommendations.";
        break;
      case "hourlyRate":
        data[field.name] = "$250 per hour";
        break;
      case "projectDuration":
        data[field.name] = "3 months";
        break;

      default:
        // Generic fallback
        if (field.type === "email") {
          data[field.name] = "sample@example.com";
        } else if (field.type === "date") {
          data[field.name] = "January 1, 2026";
        } else if (field.type === "textarea") {
          data[field.name] =
            "This is sample content that demonstrates how your text will appear in the final document. Replace this with your actual content.";
        } else {
          data[field.name] = `Sample ${field.label}`;
        }
    }
  });

  return data;
});

// Generate preview content
const previewContent = computed(() => {
  if (!props.template?.content) return "";

  let content = props.template.content;

  // Replace all placeholders with sample data
  content = content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return sampleData.value[key] || match;
  });

  return content;
});

// Handle close
function handleClose() {
  emit("close");
}

// Handle use template
function handleUseTemplate() {
  emit("use-template", props.template);
}

// Keyboard shortcuts
function handleKeydown(event) {
  if (event.key === "Escape" && props.isOpen) {
    handleClose();
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});

// Prevent body scroll when modal is open
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  },
);
</script>

<style scoped lang="scss">
// Modal Overlay
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1rem;
    align-items: flex-start;
  }
}

// Modal Container
.modal-container {
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  margin: auto;

  @media (max-width: 768px) {
    max-height: 95vh;
    border-radius: 0.75rem;
  }
}

// Header
.modal-header {
  padding: 2rem 2.5rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(to bottom, #fafbfc, #ffffff);

  @media (max-width: 768px) {
    padding: 1.5rem 1.5rem 1rem;
  }

  &__content {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  &__title-section {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }

  &__icon {
    flex-shrink: 0;
    margin-top: 0.25rem;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 0.5rem 0;
    line-height: 1.3;

    @media (max-width: 768px) {
      font-size: 1.25rem;
    }
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  &__author {
    color: #374151;
    font-weight: 500;
  }

  &__separator {
    color: #d1d5db;
  }

  &__verified {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #059669;
    font-weight: 500;

    svg {
      width: 1rem;
      height: 1rem;
    }
  }

  &__close {
    flex-shrink: 0;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: #f3f4f6;
    color: #6b7280;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #e5e7eb;
      color: #374151;
    }

    svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  }
}

// Template Info Bar
.template-info {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 1rem;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
  }

  &__icon {
    width: 1rem;
    height: 1rem;
    color: #9ca3af;
    flex-shrink: 0;
  }

  &__label {
    color: #6b7280;
    font-weight: 500;
  }

  &__value {
    color: #111827;
    font-weight: 600;

    &--badge {
      background: #eff6ff;
      color: #1e40af;
      padding: 0.125rem 0.5rem;
      border-radius: 0.375rem;
      text-transform: capitalize;
    }
  }

  &__tags {
    display: flex;
    gap: 0.375rem;
    flex-wrap: wrap;
  }

  &__tag {
    background: #f3f4f6;
    color: #374151;
    padding: 0.125rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
  }

  &__tag-more {
    background: #e5e7eb;
    color: #6b7280;
    padding: 0.125rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
  }
}

// Body
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem 2.5rem;
  background: #f9fafb;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

// Preview Container
.preview-container {
  max-width: 900px;
  margin: 0 auto;
}

// Sample Notice
.sample-notice {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 0.75rem;
  margin-bottom: 2rem;

  &__icon {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
    color: #d97706;
    margin-top: 0.125rem;
  }

  &__content {
    flex: 1;
  }

  &__title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #92400e;
    margin: 0 0 0.25rem 0;
  }

  &__text {
    font-size: 0.8125rem;
    color: #78350f;
    margin: 0;
    line-height: 1.5;
  }
}

// Template Preview
.template-preview {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow: hidden;

  &__content {
    padding: 3rem;
    min-height: 600px;

    @media (max-width: 768px) {
      padding: 2rem 1.5rem;
    }

    // Ensure template content is readable
    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4) {
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }

    :deep(p) {
      margin-bottom: 1rem;
    }

    :deep(ul),
    :deep(ol) {
      margin-bottom: 1rem;
      padding-left: 1.5rem;
    }

    :deep(strong) {
      font-weight: 600;
    }
  }
}

// Footer
.modal-footer {
  padding: 1.5rem 2.5rem;
  border-top: 1px solid #e5e7eb;
  background: #ffffff;

  @media (max-width: 768px) {
    padding: 1.25rem 1.5rem;
  }

  &__actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;

    @media (max-width: 640px) {
      flex-direction: column-reverse;

      button {
        width: 100%;
      }
    }
  }
}

// Button Icon
.button-icon {
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
}

// Transitions
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-container {
  transform: scale(0.95) translateY(-1rem);
  opacity: 0;
}

.modal-fade-leave-to .modal-container {
  transform: scale(0.95) translateY(1rem);
  opacity: 0;
}
</style>
