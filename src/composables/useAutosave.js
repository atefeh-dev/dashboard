// composables/useAutosave.js
import { ref, computed, onMounted, onUnmounted } from "vue";

/**
 * Autosave composable with NATURAL time display
 * Shows: "a moment ago" (not "1 second ago", "2 seconds ago" - that's weird!)
 */
export function useAutosave(saveCallback, options = {}) {
  const {
    debounceMs = 500, // Fast response
    updateIntervalMs = 5000, // Update every 5 seconds (no need for 1s!)
  } = options;

  const lastSavedAt = ref(null);
  const isSaving = ref(false);
  const currentTime = ref(Date.now());

  let autosaveTimer = null;
  let timeUpdateInterval = null;

  // NATURAL time display - FIGMA UX STYLE
  const timeSinceLastSave = computed(() => {
    if (!lastSavedAt.value) return null;

    const now = currentTime.value;
    const saved = new Date(lastSavedAt.value).getTime();
    const diffMs = now - saved;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    // NATURAL UX: No second-by-second counting!
    if (diffSeconds < 10) {
      return "a moment ago"; // 0-10 seconds
    } else if (diffSeconds < 60) {
      return "less than a minute ago"; // 10-60 seconds
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
      return new Date(saved).toLocaleDateString();
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
    if (isSaving.value) {
      console.log("[Autosave] Already saving, skipping...");
      return;
    }

    try {
      isSaving.value = true;
      console.log("[Autosave] Saving...");

      await saveCallback();

      lastSavedAt.value = new Date().toISOString();
      console.log("[Autosave] Saved successfully");
    } catch (error) {
      console.error("[Autosave] Failed:", error);
      throw error;
    } finally {
      isSaving.value = false;
    }
  }

  // Force save immediately
  async function forceSave() {
    if (autosaveTimer) {
      clearTimeout(autosaveTimer);
      autosaveTimer = null;
    }

    console.log("[Autosave] Force save requested");
    await save();
    console.log("[Autosave] Force save completed");
  }

  // Initialize
  onMounted(() => {
    console.log("[Autosave] Mounted, starting time update interval");

    // Update every 5 seconds (no need for every second!)
    // Changes: "a moment ago" → "less than a minute ago" → "1 minute ago"
    timeUpdateInterval = setInterval(() => {
      currentTime.value = Date.now();
    }, updateIntervalMs);
  });

  // Cleanup
  onUnmounted(() => {
    console.log("[Autosave] Unmounting, cleaning up timers");

    if (autosaveTimer) {
      clearTimeout(autosaveTimer);
      autosaveTimer = null;
    }

    if (timeUpdateInterval) {
      clearInterval(timeUpdateInterval);
      timeUpdateInterval = null;
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
