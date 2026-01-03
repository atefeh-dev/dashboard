<template>
  <div class="alternative-email">
    <!-- Checkbox -->
    <div class="alternative-email__checkbox-wrapper">
      <input
        type="checkbox"
        :id="checkboxId"
        v-model="isEnabled"
        class="alternative-email__checkbox"
        :disabled="disabled"
        @change="handleToggle"
      />
      <label :for="checkboxId" class="alternative-email__label">
        Send to an alternative email
      </label>
    </div>

    <!-- Email Input (appears when checked) -->
    <transition
      name="slide-fade"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div v-if="isEnabled" class="alternative-email__input-wrapper">
        <Mail class="alternative-email__icon" />
        <input
          ref="emailInputRef"
          type="email"
          v-model="emailValue"
          placeholder="email@example.com"
          class="alternative-email__input"
          :class="{
            'alternative-email__input--error':
              isEnabled && !isHiding && hasError && touched,
          }"
          :disabled="disabled"
          @blur="handleBlur"
          @input="handleInput"
          @focus="handleFocus"
        />

        <!-- Error Message - Only show when enabled AND has error -->
        <div
          v-show="isEnabled && !isHiding && hasError && touched"
          class="alternative-email__error"
        >
          {{ errorMessage }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { Mail } from "lucide-vue-next";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  enabled: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  checkboxId: {
    type: String,
    default: "alt-email",
  },
});

const emit = defineEmits(["update:modelValue", "update:enabled", "error"]);

// Local state
const isEnabled = ref(props.enabled);
const emailValue = ref(props.modelValue);
const touched = ref(false);
const emailInputRef = ref(null);
const isHiding = ref(false);

// Validation
const errorMessage = ref("");
const hasError = computed(() => errorMessage.value !== "");

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail() {
  // If checkbox is not enabled, no validation needed
  if (!isEnabled.value) {
    errorMessage.value = "";
    return true;
  }

  // If enabled but empty
  if (!emailValue.value || emailValue.value.trim() === "") {
    errorMessage.value = "Email is required";
    return false;
  }

  // If enabled but invalid format
  if (!emailRegex.test(emailValue.value.trim())) {
    errorMessage.value = "Please enter a valid email address";
    return false;
  }

  // Valid
  errorMessage.value = "";
  return true;
}

// Handlers
function handleToggle() {
  if (!isEnabled.value) {
    // Checkbox was unchecked - INSTANT CLEAR with specific order

    // 1. Set hiding flag FIRST (prevents CSS from showing error styles)
    isHiding.value = true;

    // 2. Clear error state IMMEDIATELY (removes red border/background)
    errorMessage.value = "";
    touched.value = false;

    // 3. Clear email value
    emailValue.value = "";

    // 4. THEN emit to parent (after internal state is clean)
    emit("update:enabled", false);
    emit("error", null);
    emit("update:modelValue", "");

    // 5. Reset hiding flag after Vue updates
    nextTick(() => {
      isHiding.value = false;
    });
  } else {
    isHiding.value = false;
    emit("update:enabled", true);

    // Let user manually click the input when ready
  }
}

function handleInput() {
  // Clear error while typing
  if (hasError.value) {
    errorMessage.value = "";
    emit("error", null);
  }
  emit("update:modelValue", emailValue.value);
}

function handleBlur() {
  // Only validate on blur if checkbox is still enabled
  if (!isEnabled.value) return;

  touched.value = true;
  validateEmail();
  emit("error", hasError.value ? errorMessage.value : null);
}

function handleFocus() {
  // Clear error on focus for better UX
  if (hasError.value && touched.value) {
    errorMessage.value = "";
    emit("error", null);
  }
}

// Smooth transition handlers
function onBeforeEnter(el) {
  el.style.height = "0";
  el.style.opacity = "0";
}

function onEnter(el) {
  el.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
  el.offsetHeight; // Force reflow
  el.style.height = el.scrollHeight + "px";
  el.style.opacity = "1";

  setTimeout(() => {
    el.style.height = "auto";
  }, 300);
}

function onLeave(el) {
  el.style.height = el.scrollHeight + "px";
  el.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
  el.offsetHeight; // Force reflow
  el.style.height = "0";
  el.style.opacity = "0";
}

// Watch for external changes
watch(
  () => props.enabled,
  (newValue) => {
    if (isEnabled.value !== newValue) {
      if (!newValue) {
        // External disable - clear instantly
        isHiding.value = true;
        errorMessage.value = "";
        touched.value = false;
        emailValue.value = "";
        emit("error", null);

        nextTick(() => {
          isHiding.value = false;
        });
      }
      isEnabled.value = newValue;
    }
  },
  { immediate: true }
);

watch(
  () => props.modelValue,
  (newValue) => {
    if (emailValue.value !== newValue) {
      emailValue.value = newValue;
    }
  }
);

// Expose validation method for parent
defineExpose({
  validate: () => {
    if (!isEnabled.value) return true;
    touched.value = true;
    return validateEmail();
  },
  hasError: () => hasError.value,
  getError: () => errorMessage.value,
});
</script>

<style scoped lang="scss">
.alternative-email {
  &__checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__checkbox {
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
    accent-color: #4539cc;
    flex-shrink: 0;
    transition: all 0.2s ease;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    &:hover:not(:disabled) {
      transform: scale(1.05);
    }
  }

  &__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #414651;
    cursor: pointer;
    user-select: none;
    transition: color 0.2s ease;

    &:hover {
      color: #4539cc;
    }
  }

  &__input-wrapper {
    position: relative;
    overflow: hidden;
  }

  &__icon {
    position: absolute;
    left: 1rem;
    top: 0.875rem;
    width: 1.25rem;
    height: 1.25rem;
    color: #6b7280;
    pointer-events: none;
    z-index: 1;
    transition: color 0.2s ease;
  }

  &__input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    font-size: 0.875rem;
    color: #111827;
    background-color: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    outline: none;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      border-color: #9ca3af;
    }

    &:focus {
      border-color: #4539cc;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);

      ~ .alternative-email__icon {
        color: #4539cc;
      }
    }

    &::placeholder {
      color: #9ca3af;
    }

    &:disabled {
      background-color: #f3f4f6;
      cursor: not-allowed;
      opacity: 0.6;
    }

    &--error {
      border-color: #d92d20;
      background-color: #fef2f2;

      &:focus {
        border-color: #d92d20;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }

      ~ .alternative-email__icon {
        color: #d92d20;
      }
    }
  }

  &__error {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    color: #d92d20;
    font-weight: 500;
    margin-top: 0.5rem;
    padding: 0.5rem 0.75rem;
    background-color: #fef2f2;
    border-left: 3px solid #ef4444;
    border-radius: 0.375rem;

    &::before {
      content: "⚠";
      font-size: 1rem;
      flex-shrink: 0;
    }
  }
}

// Error slide transition
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
