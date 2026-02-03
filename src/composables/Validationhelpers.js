/**
 * @file validationHelpers.js
 * @location src/utils/validationHelpers.js
 *
 * Validation helper utilities for template form fields
 */

/**
 * Validates a field value against its validation rules
 * @param {Object} field - The field configuration object from template store
 * @param {string} value - The value to validate
 * @returns {string|null} - Error message if invalid, null if valid
 */
export const validateField = (field, value) => {
  if (!field) return null;

  const validation = field.validation || {};
  const trimmedValue = typeof value === "string" ? value.trim() : value;

  // Check required
  if (field.required && (!trimmedValue || trimmedValue === "")) {
    return `${field.label} is required`;
  }

  // If not required and empty, skip other validations
  if (!trimmedValue) {
    return null;
  }

  // Check minLength
  if (validation.minLength && trimmedValue.length < validation.minLength) {
    return `${field.label} must be at least ${validation.minLength} characters`;
  }

  // Check maxLength
  if (validation.maxLength && trimmedValue.length > validation.maxLength) {
    return `${field.label} must not exceed ${validation.maxLength} characters`;
  }

  // Check pattern (regex)
  if (validation.pattern && trimmedValue) {
    const regex = new RegExp(validation.pattern, "i"); // case-insensitive
    if (!regex.test(trimmedValue)) {
      return validation.customMessage || `${field.label} has an invalid format`;
    }
  }

  return null; // Valid
};

/**
 * Validates all fields in a form
 * @param {Array} fields - Array of field configurations
 * @param {Object} formData - Object containing form values
 * @returns {Object} - Object with field names as keys and error messages as values
 */
export const validateAllFields = (fields, formData) => {
  const errors = {};

  fields.forEach((field) => {
    const value = formData[field.name];
    const error = validateField(field, value);
    if (error) {
      errors[field.name] = error;
    }
  });

  return errors;
};

/**
 * Checks if there are any validation errors
 * @param {Object} errors - Errors object from validateAllFields
 * @returns {boolean} - True if there are errors, false otherwise
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * Format helpers for different field types
 */
export const formatters = {
  /**
   * Formats a duration input
   * @param {string} value - Input value
   * @returns {string} - Formatted value
   */
  duration: (value) => {
    if (!value) return value;
    return value
      .toLowerCase()
      .replace(
        /(\d+)\s*(d|day|days|w|wk|week|weeks|m|mo|month|months|y|yr|year|years)/gi,
        (match, num, unit) => {
          const unitMap = {
            d: "day",
            day: "day",
            days: "days",
            w: "week",
            wk: "week",
            week: "week",
            weeks: "weeks",
            m: "month",
            mo: "month",
            month: "month",
            months: "months",
            y: "year",
            yr: "year",
            year: "year",
            years: "years",
          };
          const normalizedUnit = unitMap[unit.toLowerCase()] || unit;
          const plural = parseInt(num) !== 1 ? "s" : "";
          return `${num} ${normalizedUnit}${plural}`;
        },
      );
  },

  /**
   * Formats a percentage input
   * @param {string} value - Input value
   * @returns {string} - Formatted value with % sign
   */
  percentage: (value) => {
    if (!value) return value;
    const cleaned = value.replace(/[^\d.]/g, "");
    const num = parseFloat(cleaned);
    if (isNaN(num)) return value;
    if (num > 100) return "100%";
    if (num < 0) return "0%";
    return `${num}%`;
  },

  /**
   * Formats a money/rate input
   * @param {string} value - Input value
   * @returns {string} - Formatted value
   */
  money: (value) => {
    if (!value) return value;
    // Remove existing $ and clean up
    let cleaned = value.replace(/^\$/, "").trim();

    // If it starts with a number, ensure $ is added
    if (/^\d/.test(cleaned)) {
      const parts = cleaned.split(/\s+/);
      const amount = parts[0];
      const rest = parts.slice(1).join(" ");
      return `$${amount}${rest ? " " + rest : ""}`;
    }

    return value;
  },

  /**
   * Formats email to lowercase
   * @param {string} value - Input value
   * @returns {string} - Formatted value
   */
  email: (value) => {
    if (!value) return value;
    return value.toLowerCase().trim();
  },
};

/**
 * Validation preview - shows what the value looks like after validation
 * @param {Object} field - Field configuration
 * @param {string} value - Input value
 * @returns {Object} - { isValid: boolean, formatted: string, error: string|null }
 */
export const getValidationPreview = (field, value) => {
  const error = validateField(field, value);
  let formatted = value;

  // Apply formatter if available
  if (value && field.type === "email") {
    formatted = formatters.email(value);
  }

  return {
    isValid: !error,
    formatted,
    error,
  };
};

/**
 * Common regex patterns (exported for reference)
 */
export const patterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  name: /^[a-zA-Z\s\.,'-]+$/,
  companyName: /^[a-zA-Z0-9\s\.,&'-]+$/,
  percentage: /^(100|[1-9]?\d)\s*%?$/,
  duration: /^\d+\s+(day|days|week|weeks|month|months|year|years)$/i,
  flexibleDuration:
    /^(\d+\s+(day|days|week|weeks|month|months|year|years)|ongoing|project-based|indefinite|until completion)$/i,
  money:
    /^\$?[0-9,]+(\.\d{2})?\s*(\/|per)?\s*(hour|month|year|week|project|day)?$/i,
  noticeperiod:
    /^\d+\s+(day|days|week|weeks|month|months)\s*(written\s+notice|notice)?$/i,
};

/**
 * Validation hints - provides helpful hints based on field type
 */
export const getValidationHint = (field) => {
  if (!field || !field.validation) return null;

  const hints = {
    duration: "Format: number + time unit (e.g., 3 months, 6 weeks)",
    percentage: "Format: 0-100 with or without % sign (e.g., 50%, 33.33)",
    money:
      "Format: dollar amount with optional frequency (e.g., $5,000/month, $150 per hour)",
    notice:
      "Format: number + time unit + 'notice' (e.g., 30 days written notice)",
  };

  // Detect field type based on validation pattern
  const pattern = field.validation.pattern;
  if (!pattern) return field.hint;

  if (pattern.includes("day|days|week|weeks")) {
    return hints.duration;
  }
  if (pattern.includes("100|[1-9]?\\d")) {
    return hints.percentage;
  }
  if (pattern.includes("\\$")) {
    return hints.money;
  }
  if (pattern.includes("notice")) {
    return hints.notice;
  }

  return field.hint;
};

/**
 * Live validation for real-time feedback
 * @param {Object} field - Field configuration
 * @param {string} value - Current input value
 * @param {boolean} touched - Whether field has been touched/focused
 * @returns {Object} - { error: string|null, showError: boolean }
 */
export const liveValidate = (field, value, touched = false) => {
  const error = validateField(field, value);

  // Only show errors after field has been touched
  const showError = touched && !!error;

  return {
    error,
    showError,
  };
};

/**
 * Sanitize input based on field type
 * @param {Object} field - Field configuration
 * @param {string} value - Input value
 * @returns {string} - Sanitized value
 */
export const sanitizeInput = (field, value) => {
  if (!value || typeof value !== "string") return value;

  // Remove dangerous characters
  let sanitized = value.replace(/[<>]/g, "");

  // Specific sanitization based on field type
  if (field.type === "email") {
    sanitized = sanitized.toLowerCase().trim();
  }

  return sanitized;
};

export default {
  validateField,
  validateAllFields,
  hasErrors,
  formatters,
  getValidationPreview,
  patterns,
  getValidationHint,
  liveValidate,
  sanitizeInput,
};
