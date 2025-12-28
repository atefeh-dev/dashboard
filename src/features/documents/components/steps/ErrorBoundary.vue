<template>
  <div class="error-boundary">
    <slot v-if="!hasError" />

    <div v-else class="error-boundary__fallback">
      <div class="error-boundary__content">
        <AlertTriangle class="error-boundary__icon" />
        <h3 class="error-boundary__title">{{ errorTitle }}</h3>
        <p class="error-boundary__message">{{ errorMessage }}</p>

        <div class="error-boundary__actions">
          <AppButton variant="primary" size="md" @click="handleRecover">
            <RefreshCw class="error-boundary__action-icon" />
            Try to Recover
          </AppButton>

          <AppButton variant="ghost" size="md" @click="handleReset">
            Start Fresh
          </AppButton>
        </div>

        <details v-if="isDevelopment" class="error-boundary__details">
          <summary>Error Details (Development Only)</summary>
          <pre class="error-boundary__stack">{{ errorDetails }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured, computed } from "vue";
import { AlertTriangle, RefreshCw } from "lucide-vue-next";
import AppButton from "@/components/ui/AppButton.vue";

const props = defineProps({
  fallbackTitle: {
    type: String,
    default: "Something went wrong",
  },
  fallbackMessage: {
    type: String,
    default:
      "An unexpected error occurred. Your data has been saved automatically.",
  },
  onError: {
    type: Function,
    default: null,
  },
  onRecover: {
    type: Function,
    default: null,
  },
  onReset: {
    type: Function,
    default: null,
  },
});

const emit = defineEmits(["error", "recover", "reset"]);

const hasError = ref(false);
const errorDetails = ref("");
const errorTitle = computed(() => props.fallbackTitle);
const errorMessage = computed(() => props.fallbackMessage);
const isDevelopment = computed(() => import.meta.env.DEV);

// Capture errors from child components
onErrorCaptured((error, instance, info) => {
  hasError.value = true;
  errorDetails.value = `${error.stack}\n\nComponent: ${
    instance?.$options.name || "Unknown"
  }\nInfo: ${info}`;

  console.error("Error boundary caught error:", {
    error,
    component: instance?.$options.name,
    info,
  });

  // Call custom error handler
  if (props.onError) {
    props.onError(error, instance, info);
  }

  emit("error", { error, instance, info });

  // Prevent error from propagating
  return false;
});

function handleRecover() {
  if (props.onRecover) {
    props.onRecover();
  }

  emit("recover");
  hasError.value = false;
  errorDetails.value = "";
}

function handleReset() {
  if (props.onReset) {
    props.onReset();
  }

  emit("reset");
  hasError.value = false;
  errorDetails.value = "";
}
</script>

<style scoped lang="scss">
.error-boundary {
  width: 100%;
  height: 100%;

  &__fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    padding: 2rem;
    background-color: #fef2f2;
    border: 2px solid #fecaca;
    border-radius: 0.75rem;
  }

  &__content {
    max-width: 500px;
    text-align: center;
  }

  &__icon {
    width: 3rem;
    height: 3rem;
    color: #dc2626;
    margin: 0 auto 1rem;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #991b1b;
    margin-bottom: 0.5rem;
  }

  &__message {
    font-size: 0.9375rem;
    color: #7f1d1d;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  &__actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    margin-bottom: 1.5rem;
  }

  &__action-icon {
    width: 1rem;
    height: 1rem;
  }

  &__details {
    margin-top: 1.5rem;
    padding: 1rem;
    background-color: #fff;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    text-align: left;

    summary {
      font-size: 0.875rem;
      font-weight: 600;
      color: #991b1b;
      cursor: pointer;
      user-select: none;

      &:hover {
        color: #7f1d1d;
      }
    }
  }

  &__stack {
    margin-top: 0.75rem;
    padding: 0.75rem;
    font-family: "Courier New", monospace;
    font-size: 0.75rem;
    color: #7f1d1d;
    background-color: #fef2f2;
    border-radius: 0.375rem;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }
}
</style>
