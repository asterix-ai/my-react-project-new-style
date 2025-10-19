/**
 * Validates an email address using a regular expression.
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
export const isValidEmail = (email) => {
  // A simple regex for email validation. More complex regex exists but this covers most cases.
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2}$/;
  return emailRegex.test(email);
};

/**
 * Formats a given date object into a readable string.
 * @param {Date} date - The date object to format.
 * @returns {string} The formatted date string.
 */
export const formatDate = (date) => {
  if (!(date instanceof Date)) {
    return 'تاريخ غير صالح';
  }
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Capitalizes the first letter of a string.
 * @param {string} string - The string to capitalize.
 * @returns {string} The capitalized string.
 */
export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};
