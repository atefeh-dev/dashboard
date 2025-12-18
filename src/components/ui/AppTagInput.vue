<template>
  <div class="tag-input" :class="{ 'tag-input--focused': isFocused }">
    <!-- Display selected tags -->
    <div v-if="tags.length > 0" class="tag-input__tags">
      <span v-for="(tag, index) in tags" :key="index" class="tag-input__tag">
        {{ tag }}
        <X
          class="tag-input__remove"
          @click="removeTag(tag)"
          @keydown.enter="removeTag(tag)"
          tabindex="0"
          role="button"
          :aria-label="`Remove ${tag} tag`"
        />
      </span>
    </div>

    <!-- Input field -->
    <input
      ref="inputRef"
      v-model="inputValue"
      type="text"
      class="tag-input__field"
      :placeholder="tags.length === 0 ? placeholder : ''"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @keydown.enter.prevent="handleEnter"
      @keydown="handleKeydown"
      @keydown.backspace="handleBackspace"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { X } from "lucide-vue-next";

const props = defineProps({
  tags: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "Type and press Enter...",
  },
});

const emit = defineEmits(["add-tag", "remove-tag"]);

const inputRef = ref(null);
const inputValue = ref("");
const isFocused = ref(false);

function handleEnter() {
  addCurrentTag();
}

function handleKeydown(event) {
  if (event.key === ",") {
    event.preventDefault();
    addCurrentTag();
  }
}

function handleBackspace() {
  if (inputValue.value === "" && props.tags.length > 0) {
    const lastTag = props.tags[props.tags.length - 1];
    emit("remove-tag", lastTag);
  }
}

function addCurrentTag() {
  const tag = inputValue.value.replace(/,$/, "").trim();
  if (tag) {
    emit("add-tag", tag);
    inputValue.value = "";
  }
}

function removeTag(tag) {
  emit("remove-tag", tag);
}

defineExpose({
  focus() {
    inputRef.value?.focus();
  },
});
</script>

<style scoped lang="scss">
.tag-input {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d5d7da;
  border-radius: 0.5rem;
  background-color: #ffffff;
  min-height: 2.75rem;
  transition: all 0.2s;
  cursor: text;

  &:hover {
    border-color: #9ca3af;
  }

  &--focused {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.5rem;
    background-color: #eff6ff;
    color: #3b82f6;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;

    &:hover {
      background-color: #dbeafe;
    }
  }

  &__remove {
    width: 0.875rem;
    height: 0.875rem;
    color: #3b82f6;
    cursor: pointer;

    &:hover {
      color: #2563eb;
    }

    &:focus {
      outline: 2px solid #6366f1;
      outline-offset: 2px;
      border-radius: 2px;
    }
  }

  &__field {
    flex: 1;
    min-width: 120px;
    padding: 0.25rem;
    border: none;
    font-size: 0.875rem;
    color: #111827;
    background: transparent;
    outline: none;

    &::placeholder {
      color: #9ca3af;
    }
  }
}
</style>
