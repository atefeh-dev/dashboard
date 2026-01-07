/**
 * @file pdfContentCleaner.js
 * @location src/composables/pdfContentCleaner.js
 *
 * Clean document content for PDF export
 * Removes lock icons and locked field styling
 */

/**
 * Clean content before PDF export
 * @param {string} htmlContent - HTML content from the editor
 * @returns {string} - Cleaned HTML without locked field styling
 */
export function cleanContentForPDF(htmlContent) {
  if (!htmlContent) {
    console.warn("[PDF Cleaner] No content provided");
    return "";
  }

  console.log(
    "[PDF Cleaner] Starting cleanup, input length:",
    htmlContent.length
  );

  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;

  // Find all locked field nodes
  const lockedFields = tempDiv.querySelectorAll(
    ".locked-field-node, span[data-field-name]"
  );

  console.log(
    "[PDF Cleaner] Found",
    lockedFields.length,
    "locked fields to clean"
  );

  lockedFields.forEach((field, index) => {
    // Get the text content and remove the lock emoji
    let textContent = field.textContent || "";

    // Remove lock emoji (🔒) and any extra spaces
    textContent = textContent.replace(/🔒/g, "").trim();

    // Get the field value from data attribute (more reliable)
    const fieldValue = field.getAttribute("data-field-value");
    if (fieldValue) {
      textContent = fieldValue;
    }

    console.log(`[PDF Cleaner] Cleaning field ${index + 1}:`, {
      original: field.textContent?.substring(0, 50),
      cleaned: textContent?.substring(0, 50),
    });

    // Create a clean span without any special styling
    const cleanSpan = document.createElement("span");
    cleanSpan.textContent = textContent;

    // Preserve only text color if it exists (for colored text)
    // But don't preserve the default locked field color
    const color = field.style.color;
    if (color && color !== "#92400e" && color !== "rgb(146, 64, 14)") {
      cleanSpan.style.color = color;
    }

    // Replace the locked field with clean span
    field.replaceWith(cleanSpan);
  });

  // Remove any remaining lock emojis that might be loose in the text
  let cleanedHTML = tempDiv.innerHTML;
  cleanedHTML = cleanedHTML.replace(/🔒/g, "");

  // Remove locked field classes from any remaining elements
  const allElements = tempDiv.querySelectorAll("*");
  allElements.forEach((el) => {
    el.classList.remove("locked-field-node");

    // Remove locked field specific attributes
    el.removeAttribute("data-field-name");
    el.removeAttribute("data-field-value");
    el.removeAttribute("contenteditable");

    // Remove locked field inline styles (background, border, etc.)
    const styles = el.style;

    // Remove yellow background
    if (
      styles.background &&
      (styles.background.includes("fef3c7") ||
        styles.background.includes("fde68a"))
    ) {
      el.style.background = "";
    }
    if (
      styles.backgroundColor &&
      (styles.backgroundColor.includes("fef3c7") ||
        styles.backgroundColor.includes("fde68a"))
    ) {
      el.style.backgroundColor = "";
    }

    // Remove yellow borders
    if (styles.border && styles.border.includes("fbbf24")) {
      el.style.border = "";
    }
    if (styles.borderColor && styles.borderColor.includes("fbbf24")) {
      el.style.borderColor = "";
    }

    // Remove locked field specific border-radius and padding combinations
    if (styles.borderRadius === "4px" && styles.padding === "2px 8px") {
      el.style.borderRadius = "";
      el.style.padding = "";
    }

    // Remove cursor: not-allowed
    if (styles.cursor === "not-allowed") {
      el.style.cursor = "";
    }

    // Remove user-select: none
    if (styles.userSelect === "none") {
      el.style.userSelect = "";
    }
  });

  const finalHTML = tempDiv.innerHTML;

  console.log("[PDF Cleaner] Cleanup complete:", {
    originalLength: htmlContent.length,
    cleanedLength: finalHTML.length,
    hasLockEmoji: finalHTML.includes("🔒"),
    hasLockedFieldClass: finalHTML.includes("locked-field-node"),
    hasYellowStyling:
      finalHTML.includes("fef3c7") || finalHTML.includes("fbbf24"),
  });

  return finalHTML;
}

/**
 * Extract plain text from content (fallback for very basic exports)
 * @param {string} htmlContent - HTML content
 * @returns {string} - Plain text without HTML
 */
export function extractPlainText(htmlContent) {
  if (!htmlContent) return "";

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;

  // Get text content and clean up
  let text = tempDiv.textContent || "";
  text = text.replace(/🔒/g, "").trim();

  return text;
}

/**
 * Validate that content has been properly cleaned
 * @param {string} htmlContent - Cleaned HTML content
 * @returns {boolean} - True if content is properly cleaned
 */
export function validateCleanedContent(htmlContent) {
  const issues = [];

  // Check for lock emojis
  if (htmlContent.includes("🔒")) {
    issues.push("Lock emoji still present");
  }

  // Check for locked field classes
  if (htmlContent.includes("locked-field-node")) {
    issues.push("Locked field classes still present");
  }

  // Check for locked field styling
  if (htmlContent.includes("fef3c7") || htmlContent.includes("fbbf24")) {
    issues.push("Locked field styling still present");
  }

  // Check for locked field attributes
  if (
    htmlContent.includes("data-field-name") ||
    htmlContent.includes("data-field-value")
  ) {
    issues.push("Locked field attributes still present");
  }

  if (issues.length > 0) {
    console.warn("[PDF Cleaner] Validation failed:", issues);
    return false;
  }

  console.log("[PDF Cleaner] Validation passed - content is clean");
  return true;
}
