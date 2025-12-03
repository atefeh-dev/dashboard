<template>
  <div class="relative w-full">
    <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      <slot name="icon">
        <svg v-if="false" />
      </slot>
    </div>
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-400"
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
