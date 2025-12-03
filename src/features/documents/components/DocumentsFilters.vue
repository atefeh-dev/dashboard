<template>
  <div
    class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4"
  >
    <div>
      <h2 class="text-base sm:text-lg font-semibold text-gray-900">
        Your documents are important, we're keep an eye on them here
      </h2>
      <p class="text-sm text-gray-600">
        Keep track of every document you're working on
      </p>
    </div>

    <div class="flex flex-col sm:flex-row gap-3">
      <AppButton variant="secondary" @click="$emit('import')">
        <UploadIcon class="w-4 h-4" />
        <span>Import / Export</span>
      </AppButton>

      <AppButton variant="primary" @click="$emit('create')">
        <PlusIcon class="w-4 h-4" />
        <span>New document</span>
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import AppButton from "@/components/ui/AppButton.vue";
import { Upload as UploadIcon, Plus as PlusIcon } from "lucide-vue-next";
</script>

<style scoped lang="scss"></style>
