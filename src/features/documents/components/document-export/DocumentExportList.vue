<template>
  <div class="document-list">
    <DocumentExportItem
      v-for="doc in documents"
      :key="doc.id"
      :document="doc"
      @download="$emit('download', $event)"
    />
  </div>
</template>

<script setup>
import DocumentExportItem from "./DocumentExportItem.vue";

defineProps({
  documents: {
    type: Array,
    required: true,
  },
});

defineEmits(["download"]);
</script>
<style scoped lang="scss">
.document-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
