// composables/useFormPersistence.js
import { ref, watch, onBeforeUnmount } from "vue";

/**
 * Composable for handling form data persistence
 * Provides auto-save, emergency backup, and data restoration
 *
 * @param {string} formKey - Unique key for this form (e.g., 'input-step', 'details-step')
 * @param {Function} onSave - Callback function to save data to store
 * @param {Object} options - Configuration options
 */
export function useFormPersistence(formKey, onSave, options = {}) {
  const {
    debounceMs = 500,
    enableEmergencyBackup = true,
    logChanges = false,
  } = options;

  const isSaving = ref(false);
  const lastSaveTime = ref(null);
  const saveError = ref(null);
  let saveTimeout = null;
  let unwatchValues = null;

  /**
   * Schedule a save operation with debouncing
   */
  function scheduleSave(data) {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    saveTimeout = setTimeout(() => {
      saveNow(data);
    }, debounceMs);
  }

  /**
   * Save immediately without debouncing
   */
  async function saveNow(data) {
    if (isSaving.value) {
      if (logChanges)
        console.log(`[${formKey}] Save already in progress, skipping`);
      return;
    }

    try {
      isSaving.value = true;
      saveError.value = null;

      if (logChanges) console.log(`[${formKey}] Saving data:`, data);

      await onSave(data);
      lastSaveTime.value = Date.now();

      if (logChanges) console.log(`[${formKey}] Save successful`);
    } catch (error) {
      console.error(`[${formKey}] Save failed:`, error);
      saveError.value = error;

      // Save to emergency backup
      if (enableEmergencyBackup) {
        saveEmergencyBackup(data);
      }
    } finally {
      isSaving.value = false;
    }
  }

  /**
   * Save to localStorage as emergency backup
   */
  function saveEmergencyBackup(data) {
    try {
      const backup = {
        data,
        timestamp: Date.now(),
        formKey,
      };
      localStorage.setItem(
        `emergency-backup-${formKey}`,
        JSON.stringify(backup)
      );
      console.warn(`[${formKey}] Emergency backup saved to localStorage`);
    } catch (error) {
      console.error(`[${formKey}] Emergency backup failed:`, error);
    }
  }

  /**
   * Restore from emergency backup if available
   */
  function restoreEmergencyBackup() {
    try {
      const backupStr = localStorage.getItem(`emergency-backup-${formKey}`);
      if (!backupStr) return null;

      const backup = JSON.parse(backupStr);
      const age = Date.now() - backup.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      if (age > maxAge) {
        clearEmergencyBackup();
        return null;
      }

      console.log(
        `[${formKey}] Emergency backup found (${Math.round(age / 1000)}s old)`
      );
      return backup.data;
    } catch (error) {
      console.error(`[${formKey}] Failed to restore emergency backup:`, error);
      return null;
    }
  }

  /**
   * Clear emergency backup
   */
  function clearEmergencyBackup() {
    localStorage.removeItem(`emergency-backup-${formKey}`);
  }

  /**
   * Start watching form values for changes
   */
  function startWatching(valueGetter) {
    unwatchValues = watch(
      valueGetter,
      (newValues) => {
        if (newValues && Object.keys(newValues).length > 0) {
          scheduleSave(newValues);
        }
      },
      { deep: true }
    );
  }

  /**
   * Stop watching and cleanup
   */
  function stopWatching() {
    if (unwatchValues) {
      unwatchValues();
      unwatchValues = null;
    }
    if (saveTimeout) {
      clearTimeout(saveTimeout);
      saveTimeout = null;
    }
  }

  /**
   * Cleanup on unmount
   */
  onBeforeUnmount(() => {
    stopWatching();
  });

  return {
    isSaving,
    lastSaveTime,
    saveError,
    scheduleSave,
    saveNow,
    startWatching,
    stopWatching,
    saveEmergencyBackup,
    restoreEmergencyBackup,
    clearEmergencyBackup,
  };
}
