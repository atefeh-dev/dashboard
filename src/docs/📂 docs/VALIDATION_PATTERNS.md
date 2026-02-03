# Template Store Validation Patterns Documentation

This document explains all validation patterns used in the template store for data validation.

## Validation Structure

Each field now has a `validation` object with the following properties:

```javascript
{
  pattern: "regex pattern or null",
  minLength: number or null,
  maxLength: number or null,
  customMessage: "Error message to display" or null
}
```

## Field Type Validations by Template

### 1. Non Disclosure Agreement (NDA)

| Field                    | Pattern                                             | Valid Examples                                  | Invalid Examples        |
| ------------------------ | --------------------------------------------------- | ----------------------------------------------- | ----------------------- |
| **disclosingPartyName**  | `^[a-zA-Z\\s\\.,&'-]+$`                             | "John Smith", "ABC Corp.", "Smith & Associates" | "John123", "ABC@Corp"   |
| **disclosingPartyEmail** | `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$` | "john@example.com", "info@company.co.uk"        | "john@", "@company.com" |
| **receivingPartyName**   | `^[a-zA-Z\\s\\.,&'-]+$`                             | "Jane Doe", "XYZ Ltd."                          | "Jane#Doe"              |
| **receivingPartyEmail**  | `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$` | "jane@example.com"                              | "jane@"                 |
| **purpose**              | No pattern (freeform text)                          | Min 20 chars, Max 1000 chars                    | -                       |

### 2. Employment Contract

| Field             | Pattern                                                                                               | Valid Examples                                    | Invalid Examples        |
| ----------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------- |
| **employerName**  | `^[a-zA-Z0-9\\s\\.,&'-]+$`                                                                            | "Tech Corp Inc.", "ABC Company 123"               | "Tech@Corp"             |
| **employerEmail** | `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`                                                   | "hr@company.com"                                  | "hr@"                   |
| **employeeName**  | `^[a-zA-Z\\s\\.,'-]+$`                                                                                | "John O'Brien", "Mary-Jane Smith"                 | "John123"               |
| **employeeEmail** | `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`                                                   | "john@email.com"                                  | "john@"                 |
| **position**      | `^[a-zA-Z0-9\\s\\.,/-]+$`                                                                             | "Senior Software Engineer", "VP/Operations"       | "Engineer@Tech"         |
| **workLocation**  | `^[a-zA-Z0-9\\s\\.,/-]+$`                                                                             | "New York Office", "Remote", "Building 1/Floor 3" | "NY@Office"             |
| **salary**        | `^\\$?[0-9,]+(\\.\\d{2})?\\s*(per\\s+(year\|month\|hour\|week)\|annually\|monthly\|hourly\|weekly)?$` | "$75,000 per year", "$50/hour", "100000 annually" | "75k", "fifty thousand" |

### 3. Service Agreement

| Field                 | Pattern                                                                                                                  | Valid Examples                                        | Invalid Examples                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- | --------------------------------- |
| **clientName**        | `^[a-zA-Z0-9\\s\\.,&'-]+$`                                                                                               | "ABC Company", "Smith & Jones Ltd."                   | "ABC@Company"                     |
| **clientEmail**       | `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`                                                                      | "client@email.com"                                    | "client@"                         |
| **providerName**      | `^[a-zA-Z0-9\\s\\.,&'-]+$`                                                                                               | "Service Provider Inc."                               | "Provider@Inc"                    |
| **providerEmail**     | `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`                                                                      | "provider@email.com"                                  | "provider@"                       |
| **serviceTerm**       | `^(\\d+\\s+(day\|days\|week\|weeks\|month\|months\|year\|years)\|ongoing\|project-based\|indefinite\|until completion)$` | "6 months", "3 weeks", "ongoing", "project-based"     | "6 mths", "3-months"              |
| **serviceFee**        | `^\\$?[0-9,]+(\\.\\d{2})?\\s*(/\|per)?\\s*(hour\|month\|year\|week\|project\|day)?$`                                     | "$5,000/month", "$150 per hour", "10000 per project"  | "5k/month", "hundred dollars"     |
| **terminationNotice** | `^\\d+\\s+(day\|days\|week\|weeks\|month\|months)\\s*(written\\s+notice\|notice)?$`                                      | "30 days written notice", "2 weeks notice", "14 days" | "thirty days", "1 month's notice" |

### 4. Partnership Agreement

| Field               | Pattern                                                                                            | Valid Examples                                | Invalid Examples                |
| ------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------- |
| **partnerOneName**  | `^[a-zA-Z\\s\\.,'-]+$`                                                                             | "John Smith", "O'Brien"                       | "John123"                       |
| **partnerOneEmail** | `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`                                                | "partner1@email.com"                          | "partner1@"                     |
| **partnerTwoName**  | `^[a-zA-Z\\s\\.,'-]+$`                                                                             | "Jane Doe"                                    | "Jane#Doe"                      |
| **partnerTwoEmail** | `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`                                                | "partner2@email.com"                          | "partner2@"                     |
| **partnerOneShare** | `^(100\|[1-9]?\\d)\\s*%?$`                                                                         | "50%", "33.33%", "25", "100%"                 | "150%", "-10%", "fifty percent" |
| **partnerTwoShare** | `^(100\|[1-9]?\\d)\\s*%?$`                                                                         | "50%", "33.33%", "25"                         | "150%", "-10%"                  |
| **partnershipTerm** | `^(\\d+\\s+(day\|days\|week\|weeks\|month\|months\|year\|years)\|ongoing\|indefinite\|perpetual)$` | "3 years", "6 months", "ongoing", "perpetual" | "3 yrs", "forever"              |

### 5. Consulting Agreement

| Field                 | Pattern                                                                               | Valid Examples                                 | Invalid Examples                  |
| --------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------- | --------------------------------- |
| **consultantName**    | `^[a-zA-Z0-9\\s\\.,&'-]+$`                                                            | "John Smith Consulting", "ABC & Associates"    | "John@Consulting"                 |
| **consultantEmail**   | `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`                                   | "consultant@email.com"                         | "consultant@"                     |
| **clientName**        | `^[a-zA-Z0-9\\s\\.,&'-]+$`                                                            | "Client Company Inc."                          | "Client@Company"                  |
| **clientEmail**       | `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`                                   | "client@company.com"                           | "client@"                         |
| **hourlyRate**        | `^\\$?[0-9,]+(\\.\\d{2})?\\s*(/\|per)?\\s*(hour\|project\|day\|week\|month\|fixed)?$` | "$200/hour", "$50,000 fixed", "$1,500 per day" | "200 dollars/hr", "5k"            |
| **projectDuration**   | `^\\d+\\s+(day\|days\|week\|weeks\|month\|months\|year\|years)$`                      | "3 months", "6 weeks", "1 year"                | "3 mths", "6-weeks", "ongoing"    |
| **terminationNotice** | `^\\d+\\s+(day\|days\|week\|weeks\|month\|months)\\s*(written\\s+notice\|notice)?$`   | "30 days written notice", "2 weeks notice"     | "thirty days", "1 month's notice" |

## Common Pattern Explanations

### Name Patterns

- **Person Names**: `^[a-zA-Z\\s\\.,'-]+$`
  - Allows: Letters, spaces, periods, commas, apostrophes, hyphens
  - Use for: Individual names
- **Company Names**: `^[a-zA-Z0-9\\s\\.,&'-]+$`
  - Allows: Letters, numbers, spaces, periods, commas, ampersands, apostrophes, hyphens
  - Use for: Business entities

### Email Pattern

- `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`
  - Validates standard email format
  - Requires @ symbol and domain with extension

### Duration Patterns

- **Flexible Duration**: `^(\\d+\\s+(day|days|week|weeks|month|months|year|years)|ongoing|project-based|indefinite|until completion)$`
  - Accepts: Numeric durations OR keywords
  - Examples: "6 months", "ongoing", "project-based"

- **Strict Duration**: `^\\d+\\s+(day|days|week|weeks|month|months|year|years)$`
  - Only accepts: Numeric durations
  - Examples: "3 months", "6 weeks"

### Money/Rate Patterns

- `^\\$?[0-9,]+(\\.\\d{2})?\\s*(per\\s+(year|month|hour|week)|annually|monthly|hourly|weekly)?$`
  - Optional $ sign
  - Numbers with optional commas
  - Optional decimal (2 places)
  - Optional frequency indicator
  - Examples: "$75,000 per year", "50000 annually", "$50/hour"

### Percentage Pattern

- `^(100|[1-9]?\\d)\\s*%?$`
  - Accepts: 0-100
  - Optional % sign
  - Allows decimals
  - Examples: "50%", "33.33%", "25", "100"

### Notice Period Pattern

- `^\\d+\\s+(day|days|week|weeks|month|months)\\s*(written\\s+notice|notice)?$`
  - Requires: Number + time unit
  - Optional: "written notice" or "notice"
  - Examples: "30 days written notice", "2 weeks notice"

## Implementation in Vue Components

```javascript
// Example validation in a Vue component
const validateField = (field, value) => {
  const validation = field.validation;

  // Check required
  if (field.required && !value) {
    return "This field is required";
  }

  // Check minLength
  if (validation.minLength && value.length < validation.minLength) {
    return `Minimum ${validation.minLength} characters required`;
  }

  // Check maxLength
  if (validation.maxLength && value.length > validation.maxLength) {
    return `Maximum ${validation.maxLength} characters allowed`;
  }

  // Check pattern
  if (validation.pattern && value) {
    const regex = new RegExp(validation.pattern, "i"); // case-insensitive
    if (!regex.test(value)) {
      return validation.customMessage || "Invalid format";
    }
  }

  return null; // Valid
};
```

## Case Insensitivity

All patterns should be tested with case-insensitive flag (`i`) to allow:

- "3 Months" or "3 months"
- "Ongoing" or "ongoing"
- "Per Year" or "per year"

## Tips for Users

1. **Durations**: Always use full words (days, weeks, months, years)
2. **Percentages**: Include the % sign or just the number
3. **Money**: Use $ and include frequency (per hour, per month, etc.)
4. **Notice Periods**: Use format like "30 days written notice" or "2 weeks notice"
5. **Names**: Avoid special characters except: . , & ' -
6. **Emails**: Standard email format required

## Testing Your Validation

Use these test cases to ensure validation works:

```javascript
// Valid inputs
"30 days written notice" ✓
"3 months" ✓
"$5,000/month" ✓
"50%" ✓
"john@email.com" ✓

// Invalid inputs
"thirty days" ✗
"3 mths" ✗
"5k/month" ✗
"150%" ✗
"john@" ✗
```
