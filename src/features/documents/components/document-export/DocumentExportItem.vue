<template>
  <div class="document-list__item">
    <div class="document-list__info">
      <div class="document-list__icon">
        <FileText class="document-list__icon-svg" />
        <span class="document-list__badge">PDF</span>
      </div>

      <div class="document-list__details">
        <p class="document-list__name">{{ document.name }}</p>
        <div class="document-list__meta">
          <span class="document-list__size">{{ document.size }}</span>
          <div class="document-list__status">
            <Check class="document-list__status-icon" />
            <span>{{ document.status }}</span>
          </div>
        </div>
      </div>
    </div>

    <AppButton variant="ghost" size="sm" @click="$emit('download', document)">
      <Download class="document-list__download-icon" />
      Download
    </AppButton>
  </div>
</template>

<script setup>
import { Check, FileText, Download } from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";

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
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
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
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fef2f2;
    border-radius: 0.375rem;
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
    color: #111827;
    margin: 0 0 0.25rem 0;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.75rem;
    color: #6b7280;
  }

  &__status {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #10b981;
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
