import { ref, computed, onMounted, onUnmounted } from "vue";

/**
 * Composable for managing autosave functionality and time display
 * Can be used as an alternative to the store-based approach
 */
export function useAutosave(saveCallback, options = {}) {
  const { debounceMs = 2000, updateIntervalMs = 10000 } = options;

  const lastSavedAt = ref(null);
  const isSaving = ref(false);

  let autosaveTimer = null;
  let timeUpdateInterval = null;

  // Computed time since last save
  const timeSinceLastSave = computed(() => {
    if (!lastSavedAt.value) return null;

    const now = new Date();
    const saved = new Date(lastSavedAt.value);
    const diffMs = now - saved;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 10) {
      return "just now";
    } else if (diffSeconds < 60) {
      return `${diffSeconds} seconds ago`;
    } else if (diffMinutes === 1) {
      return "1 minute ago";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffHours === 1) {
      return "1 hour ago";
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return "yesterday";
    } else {
      return saved.toLocaleDateString();
    }
  });

  // Schedule autosave with debounce
  function scheduleAutosave() {
    if (autosaveTimer) {
      clearTimeout(autosaveTimer);
    }

    autosaveTimer = setTimeout(async () => {
      await save();
    }, debounceMs);
  }

  // Perform save
  async function save() {
    if (isSaving.value) return;

    try {
      isSaving.value = true;
      await saveCallback();
      lastSavedAt.value = new Date().toISOString();
    } catch (error) {
      console.error("Autosave failed:", error);
    } finally {
      isSaving.value = false;
    }
  }

  // Force save immediately
  async function forceSave() {
    if (autosaveTimer) {
      clearTimeout(autosaveTimer);
    }
    await save();
  }

  // Initialize
  onMounted(() => {
    // Update time display periodically
    timeUpdateInterval = setInterval(() => {
      // Trigger reactivity by accessing the ref
      if (lastSavedAt.value) {
        lastSavedAt.value = lastSavedAt.value;
      }
    }, updateIntervalMs);
  });

  // Cleanup
  onUnmounted(() => {
    if (autosaveTimer) {
      clearTimeout(autosaveTimer);
    }
    if (timeUpdateInterval) {
      clearInterval(timeUpdateInterval);
    }
  });

  return {
    lastSavedAt,
    timeSinceLastSave,
    isSaving,
    scheduleAutosave,
    forceSave,
  };
}
