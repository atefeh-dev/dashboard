<template>
  <div class="alternative-email">
    <!-- Reusable Checkbox -->
    <AppCheckbox
      :id="checkboxId"
      v-model="isEnabled"
      :disabled="disabled"
      @update:modelValue="handleToggle"
    >
      Send to an alternative email
    </AppCheckbox>

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
import AppCheckbox from "@/components/ui/AppCheckbox.vue";

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

const isEnabled = ref(props.enabled);
const emailValue = ref(props.modelValue);
const touched = ref(false);
const emailInputRef = ref(null);
const isHiding = ref(false);

const errorMessage = ref("");
const hasError = computed(() => errorMessage.value !== "");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail() {
  if (!isEnabled.value) {
    errorMessage.value = "";
    return true;
  }

  if (!emailValue.value?.trim()) {
    errorMessage.value = "Email is required";
    return false;
  }

  if (!emailRegex.test(emailValue.value.trim())) {
    errorMessage.value = "Please enter a valid email address";
    return false;
  }

  errorMessage.value = "";
  return true;
}

function handleToggle(enabled) {
  if (!enabled) {
    isHiding.value = true;
    errorMessage.value = "";
    touched.value = false;
    emailValue.value = "";

    emit("update:enabled", false);
    emit("update:modelValue", "");
    emit("error", null);

    nextTick(() => {
      isHiding.value = false;
    });
  } else {
    emit("update:enabled", true);
  }
}

function handleInput() {
  if (hasError.value) {
    errorMessage.value = "";
    emit("error", null);
  }
  emit("update:modelValue", emailValue.value);
}

function handleBlur() {
  if (!isEnabled.value) return;

  touched.value = true;
  validateEmail();
  emit("error", hasError.value ? errorMessage.value : null);
}

function handleFocus() {
  if (hasError.value && touched.value) {
    errorMessage.value = "";
    emit("error", null);
  }
}

// Transition helpers
function onBeforeEnter(el) {
  el.style.height = "0";
  el.style.opacity = "0";
}

function onEnter(el) {
  el.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
  el.offsetHeight;
  el.style.height = el.scrollHeight + "px";
  el.style.opacity = "1";

  setTimeout(() => {
    el.style.height = "auto";
  }, 300);
}

function onLeave(el) {
  el.style.height = el.scrollHeight + "px";
  el.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
  el.offsetHeight;
  el.style.height = "0";
  el.style.opacity = "0";
}

// Sync external props
watch(
  () => props.enabled,
  (val) => {
    if (isEnabled.value !== val) {
      if (!val) {
        isHiding.value = true;
        errorMessage.value = "";
        touched.value = false;
        emailValue.value = "";
        emit("error", null);

        nextTick(() => {
          isHiding.value = false;
        });
      }
      isEnabled.value = val;
    }
  },
  { immediate: true }
);

watch(
  () => props.modelValue,
  (val) => {
    if (emailValue.value !== val) {
      emailValue.value = val;
    }
  }
);

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
  &__input-wrapper {
    position: relative;
    overflow: hidden;
    margin-top: 1rem;
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
  }

  &__input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    font-size: 0.875rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;

    &:focus {
      border-color: #4539cc;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    &--error {
      border-color: #d92d20;
      background-color: #fef2f2;
    }
  }

  &__error {
    font-size: 0.75rem;
    color: #d92d20;
    margin-top: 0.5rem;
  }
}
</style>
