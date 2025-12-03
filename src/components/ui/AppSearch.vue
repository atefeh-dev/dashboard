<template>
  <div class="search-box">
    <div class="icon">
      <slot name="icon">
        <svg v-if="false" />
      </slot>
    </div>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      class="input"
      type="text"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "Search..." },
});
</script>

<style scoped lang="scss"></style>
