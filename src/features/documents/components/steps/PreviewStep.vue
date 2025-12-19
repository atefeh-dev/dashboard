<template>
  <div class="preview-step">
    <section class="section">
      <h2 class="section__heading">Preview</h2>
      <p class="section__description">See data in action</p>

      <div class="form-card">
        <p>Preview content goes here...</p>

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
@use "./stepStyles.scss";
</style>
