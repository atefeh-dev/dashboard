<template>
  <div class="document-list__item">
    <div class="document-list__info">
      <div class="document-list__icon">
        <PdfIcon />
      </div>

      <div class="document-list__details">
        <p class="document-list__name">{{ document.name }}</p>
        <div class="document-list__meta">
          <span class="document-list__size">{{ document.size }}</span>
          <div class="document-list__status">
            <CheckCircleIcon />
            <span>{{ document.status }}</span>
          </div>
        </div>
      </div>
    </div>

    <AppButton variant="ghost" size="sm" @click="$emit('download', document)">
      <ExportIcon />
      Download
    </AppButton>
  </div>
</template>

<script setup>
import { Check, FileText, Download } from "lucide-vue-next";
import PdfIcon from "@/assets/icons/common/pdf-icon.svg";
import AppButton from "@/components/ui/AppButton.vue";
import CheckCircleIcon from "@/assets/icons/common/check-circle.svg";
import ExportIcon from "@/assets/icons/common/export-icon.svg";

defineProps({
  document: {
    type: Object,
    required: true,
  },
});

defineEmits(["download"]);
</script>
<style scoped lang="scss">
.document-list {
  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #ffffff;
    border: 1px solid #e9eaeb;
    border-radius: 0.75rem;
    transition: box-shadow 0.2s;

    &:hover {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  }

  &__info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__icon {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__size {
    font-size: 0.875rem;
    font-weight: 400;
    color: #535862;
  }
  &__icon-svg {
    width: 1.25rem;
    height: 1.25rem;
    color: #ef4444;
  }

  &__badge {
    position: absolute;
    bottom: -4px;
    right: -4px;
    padding: 0.125rem 0.25rem;
    font-size: 0.625rem;
    font-weight: 600;
    color: #ffffff;
    background-color: #ef4444;
    border-radius: 0.25rem;
  }

  &__details {
    flex: 1;
  }

  &__name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #414651;
    margin: 0 0 0.25rem 0;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: #6b7280;
  }

  &__status {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    font-weight: 400;
    color: #535862;
  }

  &__status-icon {
    width: 0.875rem;
    height: 0.875rem;
  }

  &__download-icon {
    width: 1rem;
    height: 1rem;
  }
}
</style>
