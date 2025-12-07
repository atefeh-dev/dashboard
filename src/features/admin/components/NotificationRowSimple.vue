<template>
  <div class="flex items-center justify-between py-4">
    <span class="text-sm text-gray-900">{{ label }}</span>

    <div
      class="inline-flex bg-white border border-gray-200 rounded-lg p-0.5 gap-0.5"
    >
      <button
        v-for="(option, index) in options"
        :key="option"
        @click="$emit('update', option)"
        :class="[
          'relative px-6 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap',
          selected === option
            ? 'bg-gray-50 text-gray-900'
            : 'text-gray-600 hover:text-gray-900',
          index !== options.length - 1
            ? 'after:absolute after:right-0 after:top-0 after:bottom-0 after:w-px after:bg-gray-200'
            : '',
        ]"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  selected: {
    type: String,
    default: "None",
  },
});

defineEmits(["update"]);

const options = ["None", "In-app", "Email"];
</script>
