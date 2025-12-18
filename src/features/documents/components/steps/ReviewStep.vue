<template>
  <div class="review-step">
    <section class="section">
      <h2 class="section__heading">Review</h2>
      <p class="section__description">Overview inputs and edit</p>

      <div class="form-card">
        <p>Review content goes here...</p>

        <div class="form-actions">
          <AppButton variant="ghost" size="md" @click="$emit('back')">
            Back
          </AppButton>
          <AppButton variant="primary" size="md" @click="$emit('continue')">
            Continue
          </AppButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import AppButton from "@/components/ui/AppButton.vue";
defineEmits(["continue", "back"]);
</script>

<style scoped lang="scss">
@import "./stepStyles.scss";
</style>
