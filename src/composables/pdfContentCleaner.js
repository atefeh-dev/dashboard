/**
 * Clean document content for PDF export
 * Removes lock icons and locked field styling
 */
export function cleanContentForPDF(htmlContent) {
  if (!htmlContent) return "";

  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;

  // Find all locked field nodes
  const lockedFields = tempDiv.querySelectorAll(
    ".locked-field-node, span[data-field-name]"
  );

  lockedFields.forEach((field) => {
    // Get the text content and remove the lock emoji
    let textContent = field.textContent || "";

    // Remove lock emoji (🔒) and any extra spaces
    textContent = textContent.replace(/🔒/g, "").trim();

    // Get the field value from data attribute (more reliable)
    const fieldValue = field.getAttribute("data-field-value");
    if (fieldValue) {
      textContent = fieldValue;
    }

    // Create a clean span without any special styling
    const cleanSpan = document.createElement("span");
    cleanSpan.textContent = textContent;

    // Preserve only text color if it exists (for colored text)
    const color = field.style.color;
    if (color && color !== "#92400e") {
      // Don't preserve the default locked field color
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

    // Remove locked field inline styles (background, border, etc.)
    const styles = el.style;
    if (styles.background && styles.background.includes("fef3c7")) {
      el.style.background = "";
    }
    if (styles.backgroundColor && styles.backgroundColor.includes("fef3c7")) {
      el.style.backgroundColor = "";
    }
    if (styles.border && styles.border.includes("fbbf24")) {
      el.style.border = "";
    }
    if (styles.borderColor && styles.borderColor.includes("fbbf24")) {
      el.style.borderColor = "";
    }
    if (styles.borderRadius === "4px" && styles.padding === "2px 8px") {
      el.style.borderRadius = "";
      el.style.padding = "";
    }
  });

  return tempDiv.innerHTML;
}

/**
 * Extract plain text from locked fields for fallback
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
 */
export function validateCleanedContent(htmlContent) {
  // Check for lock emojis
  if (htmlContent.includes("🔒")) {
    console.warn("[PDF Cleaner] Lock emoji still present in content");
    return false;
  }

  // Check for locked field classes
  if (htmlContent.includes("locked-field-node")) {
    console.warn("[PDF Cleaner] Locked field classes still present");
    return false;
  }

  // Check for locked field styling
  if (htmlContent.includes("fef3c7") || htmlContent.includes("fbbf24")) {
    console.warn("[PDF Cleaner] Locked field styling still present");
    return false;
  }

  return true;
}
