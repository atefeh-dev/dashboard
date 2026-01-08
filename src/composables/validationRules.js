import * as yup from "yup";

/**
 * Custom validation messages
 */
export const validationMessages = {
  required: (field) => `${field} is required`,
  email: "Please enter a valid email address",
  minLength: (field, min) => `${field} must be at least ${min} characters`,
  maxLength: (field, max) => `${field} cannot exceed ${max} characters`,
  pattern: (field, pattern) => `${field} format is invalid`,
  date: {
    invalid: "Please enter a valid date",
    future: "Date must be in the future",
    past: "Date must be in the past",
    range: "Date must be within the allowed range",
  },
  text: {
    noSpecialChars: "Special characters are not allowed",
    alphanumeric: "Only letters and numbers are allowed",
    lettersOnly: "Only letters are allowed",
  },
  number: {
    positive: "Must be a positive number",
    min: (min) => `Must be at least ${min}`,
    max: (max) => `Cannot exceed ${max}`,
  },
};

/**
 * Common regex patterns
 */
export const patterns = {
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[\d\s\-\+\(\)]+$/,
  alphanumeric: /^[a-zA-Z0-9\s]+$/,
  lettersOnly: /^[a-zA-Z\s]+$/,
  noSpecialChars: /^[a-zA-Z0-9\s\-_.,]+$/,
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  postalCode: /^[A-Z0-9\s-]{3,10}$/i,
  currency: /^\$?\d{1,3}(,?\d{3})*(\.\d{2})?$/,
};

/**
 * Date validation helpers
 */
export const dateValidators = {
  isValidDate: (value) => {
    if (!value) return false;
    const date = new Date(value);
    return date instanceof Date && !isNaN(date);
  },

  isFutureDate: (value) => {
    if (!dateValidators.isValidDate(value)) return false;
    return new Date(value) > new Date();
  },

  isPastDate: (value) => {
    if (!dateValidators.isValidDate(value)) return false;
    return new Date(value) < new Date();
  },

  isWithinRange: (value, minDate, maxDate) => {
    if (!dateValidators.isValidDate(value)) return false;
    const date = new Date(value);
    const min = minDate ? new Date(minDate) : null;
    const max = maxDate ? new Date(maxDate) : null;

    if (min && date < min) return false;
    if (max && date > max) return false;
    return true;
  },

  minAge: (birthDate, minAge) => {
    if (!dateValidators.isValidDate(birthDate)) return false;
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      return age - 1 >= minAge;
    }
    return age >= minAge;
  },
};

/**
 * Text validation helpers
 */
export const textValidators = {
  hasNoSpecialChars: (value) => {
    if (!value) return true;
    return patterns.noSpecialChars.test(value);
  },

  isAlphanumeric: (value) => {
    if (!value) return true;
    return patterns.alphanumeric.test(value);
  },

  isLettersOnly: (value) => {
    if (!value) return true;
    return patterns.lettersOnly.test(value);
  },

  hasMinWords: (value, minWords) => {
    if (!value) return false;
    const words = value.trim().split(/\s+/);
    return words.length >= minWords;
  },

  hasMaxWords: (value, maxWords) => {
    if (!value) return true;
    const words = value.trim().split(/\s+/);
    return words.length <= maxWords;
  },
};

/**
 * Create validation schema based on field configuration
 */
export function createFieldValidation(field) {
  let validation;

  // Base validation by type
  switch (field.type) {
    case "email":
      validation = yup
        .string()
        .email(validationMessages.email)
        .test("valid-email-format", validationMessages.email, (value) => {
          if (!value) return true;
          return patterns.email.test(value);
        });
      break;

    case "date":
      validation = yup
        .string()
        .test("valid-date", validationMessages.date.invalid, (value) => {
          if (!value) return true;
          return dateValidators.isValidDate(value);
        });

      // Future date validation
      if (field.validation?.futureOnly) {
        validation = validation.test(
          "future-date",
          validationMessages.date.future,
          (value) => {
            if (!value) return true;
            return dateValidators.isFutureDate(value);
          }
        );
      }

      // Past date validation
      if (field.validation?.pastOnly) {
        validation = validation.test(
          "past-date",
          validationMessages.date.past,
          (value) => {
            if (!value) return true;
            return dateValidators.isPastDate(value);
          }
        );
      }

      // Date range validation
      if (field.validation?.minDate || field.validation?.maxDate) {
        validation = validation.test(
          "date-range",
          validationMessages.date.range,
          (value) => {
            if (!value) return true;
            return dateValidators.isWithinRange(
              value,
              field.validation?.minDate,
              field.validation?.maxDate
            );
          }
        );
      }

      // Minimum age validation
      if (field.validation?.minAge) {
        validation = validation.test(
          "min-age",
          `Must be at least ${field.validation.minAge} years old`,
          (value) => {
            if (!value) return true;
            return dateValidators.minAge(value, field.validation.minAge);
          }
        );
      }
      break;

    case "phone":
      validation = yup
        .string()
        .test("valid-phone", "Please enter a valid phone number", (value) => {
          if (!value) return true;
          return patterns.phone.test(value);
        });
      break;

    case "url":
      validation = yup
        .string()
        .test("valid-url", "Please enter a valid URL", (value) => {
          if (!value) return true;
          return patterns.url.test(value);
        });
      break;

    case "number":
      validation = yup.number().typeError("Must be a valid number");

      if (field.validation?.positive) {
        validation = validation.positive(validationMessages.number.positive);
      }

      if (field.validation?.min !== undefined) {
        validation = validation.min(
          field.validation.min,
          validationMessages.number.min(field.validation.min)
        );
      }

      if (field.validation?.max !== undefined) {
        validation = validation.max(
          field.validation.max,
          validationMessages.number.max(field.validation.max)
        );
      }
      break;

    case "textarea":
      validation = yup.string();

      // Word count validation for textareas
      if (field.validation?.minWords) {
        validation = validation.test(
          "min-words",
          `Must contain at least ${field.validation.minWords} words`,
          (value) => {
            if (!value) return true;
            return textValidators.hasMinWords(value, field.validation.minWords);
          }
        );
      }

      if (field.validation?.maxWords) {
        validation = validation.test(
          "max-words",
          `Cannot exceed ${field.validation.maxWords} words`,
          (value) => {
            if (!value) return true;
            return textValidators.hasMaxWords(value, field.validation.maxWords);
          }
        );
      }
      break;

    case "text":
    default:
      validation = yup.string();

      // Text format validation
      if (field.validation?.alphanumeric) {
        validation = validation.test(
          "alphanumeric",
          validationMessages.text.alphanumeric,
          (value) => {
            if (!value) return true;
            return textValidators.isAlphanumeric(value);
          }
        );
      }

      if (field.validation?.lettersOnly) {
        validation = validation.test(
          "letters-only",
          validationMessages.text.lettersOnly,
          (value) => {
            if (!value) return true;
            return textValidators.isLettersOnly(value);
          }
        );
      }

      if (field.validation?.noSpecialChars) {
        validation = validation.test(
          "no-special-chars",
          validationMessages.text.noSpecialChars,
          (value) => {
            if (!value) return true;
            return textValidators.hasNoSpecialChars(value);
          }
        );
      }

      // Custom pattern validation
      if (field.validation?.pattern) {
        validation = validation.test(
          "custom-pattern",
          field.validation?.patternMessage ||
            validationMessages.pattern(field.label),
          (value) => {
            if (!value) return true;
            const regex = new RegExp(field.validation.pattern);
            return regex.test(value);
          }
        );
      }
  }

  // Required validation
  if (field.required) {
    validation = validation.required(validationMessages.required(field.label));
  } else {
    validation = validation.notRequired();
  }

  // Min length validation
  if (field.validation?.minLength || field.minLength) {
    const minLen = field.validation?.minLength || field.minLength;
    validation = validation.min(
      minLen,
      validationMessages.minLength(field.label, minLen)
    );
  }

  // Max length validation
  if (field.validation?.maxLength || field.maxLength) {
    const maxLen = field.validation?.maxLength || field.maxLength;
    validation = validation.max(
      maxLen,
      validationMessages.maxLength(field.label, maxLen)
    );
  }

  // Trim string values
  if (validation instanceof yup.StringSchema) {
    validation = validation.transform((value) => {
      if (typeof value === "string") {
        return value.trim();
      }
      return value;
    });
  }

  // Custom validator function
  if (field.validation?.custom) {
    validation = validation.test(
      "custom-validation",
      field.validation.customMessage || "Invalid value",
      field.validation.custom
    );
  }

  return validation;
}

/**
 * Create complete validation schema from template fields
 */
export function createValidationSchema(fields) {
  const schema = {};

  fields.forEach((field) => {
    schema[field.name] = createFieldValidation(field);
  });

  return yup.object(schema);
}

/**
 * Validate single field
 */
export async function validateField(field, value) {
  try {
    const validation = createFieldValidation(field);
    await validation.validate(value);
    return { valid: true, error: null };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

/**
 * Validate all fields
 */
export async function validateAllFields(fields, values) {
  const errors = {};

  for (const field of fields) {
    const result = await validateField(field, values[field.name]);
    if (!result.valid) {
      errors[field.name] = result.error;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Get field validation status (for real-time feedback)
 */
export function getFieldValidationStatus(field, value, touched = false) {
  if (!touched && !value) {
    return { status: "idle", message: null };
  }

  try {
    const validation = createFieldValidation(field);
    validation.validateSync(value);
    return { status: "valid", message: null };
  } catch (error) {
    return { status: "invalid", message: error.message };
  }
}

/**
 * Format validation error for display
 */
export function formatValidationError(error, fieldLabel) {
  if (typeof error === "string") {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  return `Invalid ${fieldLabel}`;
}
