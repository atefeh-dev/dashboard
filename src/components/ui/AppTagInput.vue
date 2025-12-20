<template>
  <div class="tag-input" :class="{ 'tag-input--focused': isFocused }">
    <!-- SENIOR UX: Show first N tags + "+N more" badge -->
    <div v-if="tags.length > 0" class="tag-input__tags">
      <!-- First N visible tags -->
      <span
        v-for="(tag, index) in visibleTags"
        :key="index"
        class="tag-input__tag"
      >
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

      <!-- "+N more" badge (shows when >maxVisible tags) -->
      <button
        v-if="hiddenTags.length > 0"
        class="tag-input__more"
        @click="togglePopover"
        type="button"
      >
        +{{ hiddenTags.length }} more
      </button>
    </div>

    <!-- Input field -->
    <input
      ref="inputRef"
      v-model="inputValue"
      type="text"
      class="tag-input__field"
      :placeholder="tags.length === 0 ? placeholder : ''"
      @focus="isFocused = true"
      @blur="handleBlur"
      @keydown.enter.prevent="handleEnter"
      @keydown="handleKeydown"
      @keydown.backspace="handleBackspace"
    />

    <!-- Popover: All tags (appears when clicking "+N more") -->
    <div v-if="showPopover" class="tag-input__popover" @click.stop>
      <div class="tag-input__popover-header">
        <span class="tag-input__popover-title"
          >All tags ({{ tags.length }})</span
        >
        <button
          class="tag-input__popover-close"
          @click="showPopover = false"
          type="button"
        >
          <X class="tag-input__popover-close-icon" />
        </button>
      </div>

      <div class="tag-input__popover-content">
        <span
          v-for="(tag, index) in tags"
          :key="index"
          class="tag-input__tag tag-input__tag--popover"
        >
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
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
  maxVisible: {
    type: Number,
    default: 2, // Show only 2 tags by default (GitHub style)
  },
});

const emit = defineEmits(["add-tag", "remove-tag"]);

const inputRef = ref(null);
const inputValue = ref("");
const isFocused = ref(false);
const showPopover = ref(false);

// SENIOR UX: Show only first N tags, rest in popover
const visibleTags = computed(() => {
  return props.tags.slice(0, props.maxVisible);
});

const hiddenTags = computed(() => {
  return props.tags.slice(props.maxVisible);
});

function togglePopover() {
  showPopover.value = !showPopover.value;
}

function handleBlur() {
  // Delay to allow click on popover
  setTimeout(() => {
    isFocused.value = false;
    if (!showPopover.value) {
      // Close popover if focus lost
    }
  }, 200);
}

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
  // Close popover if no tags left
  if (props.tags.length <= 1) {
    showPopover.value = false;
  }
}

defineExpose({
  focus() {
    inputRef.value?.focus();
  },
});
</script>

<style scoped lang="scss">
.tag-input {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d5d7da;
  border-radius: 0.5rem;
  background-color: #ffffff;

  // CRITICAL: Fixed height
  min-height: 2.75rem;
  max-height: 2.75rem;

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
    align-items: center;
    gap: 0.375rem;
    flex-shrink: 0; // Don't shrink tags
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.125rem 0.5rem;
    background-color: #eff6ff;
    color: #3b82f6;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.5;
    white-space: nowrap;
    flex-shrink: 0;

    &:hover {
      background-color: #dbeafe;
    }

    &--popover {
      margin-bottom: 0.5rem;
    }
  }

  &__remove {
    width: 0.875rem;
    height: 0.875rem;
    color: #3b82f6;
    cursor: pointer;
    flex-shrink: 0;

    &:hover {
      color: #2563eb;
    }

    &:focus {
      outline: 2px solid #6366f1;
      outline-offset: 2px;
      border-radius: 2px;
    }
  }

  // SENIOR UX: "+N more" badge (like GitHub/Linear)
  &__more {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.5rem;
    background-color: #f3f4f6;
    color: #6b7280;
    border: 1px solid #e5e7eb;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
    flex-shrink: 0;

    &:hover {
      background-color: #e5e7eb;
      color: #374151;
    }

    &:active {
      transform: scale(0.95);
    }
  }

  &__field {
    flex: 1;
    min-width: 80px;
    padding: 0.125rem;
    border: none;
    font-size: 0.8125rem;
    color: #111827;
    background: transparent;
    outline: none;

    &::placeholder {
      color: #9ca3af;
    }
  }

  // SENIOR UX: Popover for all tags
  &__popover {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    right: 0;
    z-index: 50;
    max-height: 300px;
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }

  &__popover-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e5e7eb;
    background-color: #f9fafb;
  }

  &__popover-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
  }

  &__popover-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.15s;

    &:hover {
      background-color: #e5e7eb;
    }
  }

  &__popover-close-icon {
    width: 1rem;
    height: 1rem;
    color: #6b7280;
  }

  &__popover-content {
    padding: 1rem;
    max-height: 250px;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f3f4f6;
    }

    &::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 3px;

      &:hover {
        background: #9ca3af;
      }
    }
  }
}

// Responsive
@media (max-width: 640px) {
  .tag-input {
    padding: 0.375rem 0.5rem;

    &__tag {
      font-size: 0.6875rem;
      padding: 0.0625rem 0.375rem;
    }

    &__more {
      font-size: 0.6875rem;
    }

    &__field {
      font-size: 0.75rem;
      min-width: 60px;
    }
  }
}
</style>
