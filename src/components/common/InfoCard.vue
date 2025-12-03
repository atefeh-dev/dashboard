<template>
  <div class="app-card mb-5">
    <div class="flex flex-col md:flex-row gap-4 md:gap-6">
      <slot name="image">
        <img
          src="data:image/svg+xml,%3Csvg width='200' height='150' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='150' fill='%23e5e7eb'/%3E%3C/svg%3E"
          alt="illustration"
          class="w-full md:w-48 h-36 object-cover rounded-lg"
        />
      </slot>

      <div class="flex-1">
        <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-2">
          <slot name="title"
            >We don't store any document's files on our server</slot
          >
        </h3>

        <p class="text-sm text-gray-600 mb-4">
          <slot name="body">
            DocLast does not store documents on its servers to ensure your
            security. Connect your workspace to Google Drive to store files.
          </slot>
        </p>

        <slot name="actions">
          <app-button variant="secondary">
            <span class="text-blue-600">G</span>
            Connect to google drive
          </app-button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppButton from "@/components/ui/AppButton.vue";
</script>

<style scoped lang="scss"></style>
