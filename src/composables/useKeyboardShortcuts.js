// composables/useKeyboardShortcuts.js
import { onMounted, onBeforeUnmount } from "vue";

/**
 * Detect user's operating system
 */
function getOS() {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
  const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];

  if (macosPlatforms.indexOf(platform) !== -1) {
    return "Mac";
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    return "Windows";
  } else {
    return "Other";
  }
}

/**
 * Get keyboard shortcut labels for display
 * Mac: Cmd (⌘), Option (⌥), Control (⌃)
 * Windows/Linux: Ctrl, Alt
 */
export function getShortcutLabels() {
  const os = getOS();
  const isMac = os === "Mac";

  return {
    isMac,
    os,
    // Modifier keys
    mod: isMac ? "⌘" : "Ctrl", // Primary modifier (Cmd/Ctrl)
    alt: isMac ? "⌥" : "Alt", // Alt/Option
    shift: "⇧", // Shift (same on all)
    // Arrow keys
    left: "←",
    right: "→",
    up: "↑",
    down: "↓",
    // Special keys
    escape: "Esc",
    enter: "Enter",
    delete: isMac ? "⌫" : "Del",
    // Common shortcuts
    save: isMac ? "⌘S" : "Ctrl+S",
    undo: isMac ? "⌘Z" : "Ctrl+Z",
    redo: isMac ? "⌘⇧Z" : "Ctrl+Y",
    copy: isMac ? "⌘C" : "Ctrl+C",
    paste: isMac ? "⌘V" : "Ctrl+V",
  };
}

/**
 * Check if a keyboard event matches a shortcut
 * Works cross-platform (Mac uses Cmd, Windows uses Ctrl)
 *
 * @param {KeyboardEvent} event - The keyboard event
 * @param {Object} shortcut - Shortcut configuration
 * @param {string} shortcut.key - Key name (e.g., 'ArrowLeft', 's')
 * @param {boolean} [shortcut.mod=false] - Cmd (Mac) or Ctrl (Windows)
 * @param {boolean} [shortcut.alt=false] - Option (Mac) or Alt (Windows)
 * @param {boolean} [shortcut.shift=false] - Shift key
 * @param {boolean} [shortcut.ctrl=false] - Ctrl key (use sparingly on Mac)
 */
export function matchesShortcut(event, shortcut) {
  const isMac = getOS() === "Mac";

  // Check key
  if (event.key !== shortcut.key) {
    return false;
  }

  // Check modifiers
  const modPressed = isMac ? event.metaKey : event.ctrlKey;
  const altPressed = event.altKey;
  const shiftPressed = event.shiftKey;
  const ctrlPressed = event.ctrlKey;

  // Match mod key (Cmd on Mac, Ctrl on Windows)
  if (shortcut.mod && !modPressed) return false;
  if (!shortcut.mod && modPressed) return false;

  // Match alt/option key
  if (shortcut.alt && !altPressed) return false;
  if (!shortcut.alt && altPressed) return false;

  // Match shift key
  if (shortcut.shift && !shiftPressed) return false;
  if (!shortcut.shift && shiftPressed) return false;

  // Match ctrl key (only when explicitly required)
  if (shortcut.ctrl && !ctrlPressed) return false;

  return true;
}

/**
 * Register keyboard shortcuts with cross-platform support
 * Automatically handles Mac (Cmd) vs Windows (Ctrl)
 *
 * @param {Object} shortcuts - Map of shortcut configs to handlers
 *
 * @example
 * useKeyboardShortcuts({
 *   // Cmd+S on Mac, Ctrl+S on Windows
 *   save: {
 *     shortcut: { key: 's', mod: true },
 *     handler: () => save(),
 *     description: 'Save'
 *   },
 *   // Option+Left on Mac, Alt+Left on Windows
 *   back: {
 *     shortcut: { key: 'ArrowLeft', alt: true },
 *     handler: () => goBack(),
 *     description: 'Go back'
 *   }
 * });
 */
export function useKeyboardShortcuts(shortcuts) {
  let keyboardHandler = null;

  function handleKeyDown(event) {
    // Check each registered shortcut
    for (const [name, config] of Object.entries(shortcuts)) {
      if (matchesShortcut(event, config.shortcut)) {
        event.preventDefault();
        console.log(`[Shortcuts] Triggered: ${name}`);
        config.handler(event);
        return;
      }
    }
  }

  onMounted(() => {
    keyboardHandler = handleKeyDown;
    window.addEventListener("keydown", keyboardHandler);
    console.log("[Shortcuts] Registered", Object.keys(shortcuts));
  });

  onBeforeUnmount(() => {
    if (keyboardHandler) {
      window.removeEventListener("keydown", keyboardHandler);
      keyboardHandler = null;
      console.log("[Shortcuts] Unregistered");
    }
  });

  return {
    getLabels: getShortcutLabels,
    matches: matchesShortcut,
  };
}

/**
 * Format shortcut for display
 * @example
 * formatShortcut({ key: 's', mod: true })
 * // Returns: "⌘S" on Mac, "Ctrl+S" on Windows
 */
export function formatShortcut(shortcut) {
  const labels = getShortcutLabels();
  const parts = [];

  if (shortcut.mod) parts.push(labels.mod);
  if (shortcut.alt) parts.push(labels.alt);
  if (shortcut.shift) parts.push(labels.shift);
  if (shortcut.ctrl) parts.push("⌃");

  // Format key name
  let keyLabel = shortcut.key;
  if (keyLabel.startsWith("Arrow")) {
    keyLabel = labels[keyLabel.replace("Arrow", "").toLowerCase()];
  } else if (keyLabel === "Escape") {
    keyLabel = labels.escape;
  } else if (keyLabel === "Enter") {
    keyLabel = labels.enter;
  } else {
    keyLabel = keyLabel.toUpperCase();
  }

  parts.push(keyLabel);

  return parts.join(labels.isMac ? "" : "+");
}
