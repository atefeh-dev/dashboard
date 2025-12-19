<template>
  <div class="document-step">
    <section class="section">
      <h2 class="section__heading">Document</h2>
      <p class="section__description">Save or send for action</p>

      <div class="form-card">
        <p>Final document content goes here...</p>

        <div class="form-actions">
          <AppButton variant="ghost" size="md" @click="$emit('back')">
            Back
          </AppButton>
          <AppButton variant="primary" size="md" @click="$emit('finish')">
            Finish
          </AppButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import AppButton from "@/components/ui/AppButton.vue";
defineEmits(["finish", "back"]);
</script>

<style scoped lang="scss">
@use "./stepStyles.scss";
</style>
