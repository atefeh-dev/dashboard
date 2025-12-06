<template>
  <div
    class="relative flex items-center justify-center min-h-[720px] md:min-h-[calc(100vh-200px)] px-4"
  >
    <!-- Background SVG -->
    <img
      :src="emptyState"
      alt=""
      class="absolute inset-0 m-auto w-[480px] max-w-full pointer-events-none select-none"
      style="z-index: 0"
    />

    <!-- Foreground Content -->
    <div class="relative z-10 flex flex-col items-center text-center">
      <!-- Icon -->
      <div
        class="w-14 h-14 mb-6 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200"
      >
        <FileText class="w-7 h-7 text-gray-400" />
      </div>

      <!-- Title -->
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        No document created yet
      </h3>

      <!-- Description -->
      <p class="text-sm text-gray-500 mb-6 max-w-lg leading-relaxed">
        Here you can manage every document you create and of course we'll take
        care of them.
      </p>

      <!-- CTA Button -->
      <AppButton variant="primary" size="md" @click="$emit('create')">
        <Plus class="w-4 h-4 mr-2" />
        Create your first document
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import AppButton from "@/components/ui/AppButton.vue";
import { Plus, FileText } from "lucide-vue-next";
import emptyState from "@/assets/images/empty_state.svg";

defineEmits(["create"]);
</script>
