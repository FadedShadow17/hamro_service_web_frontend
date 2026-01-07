/**
 * Utility functions for Nepal phone number formatting
 * Ensures +977- prefix is always present
 */

const PHONE_PREFIX = '+977-';

/**
 * Formats phone number input to always include +977- prefix
 * Only allows digits after the prefix
 */
export function formatPhoneInput(value: string): string {
  // Remove all non-digit characters except the prefix
  const digitsOnly = value.replace(/[^\d]/g, '');
  
  // If value starts with +977, extract the digits after it
  if (value.startsWith(PHONE_PREFIX)) {
    const afterPrefix = value.slice(PHONE_PREFIX.length);
    const digits = afterPrefix.replace(/[^\d]/g, '');
    return PHONE_PREFIX + digits;
  }
  
  // If value starts with 977, remove it and add prefix
  if (value.startsWith('977')) {
    const afterCountry = value.slice(3);
    const digits = afterCountry.replace(/[^\d]/g, '');
    return PHONE_PREFIX + digits;
  }
  
  // Otherwise, just add prefix and digits
  return PHONE_PREFIX + digitsOnly;
}

/**
 * Handles phone number input change event
 * Ensures prefix is always present and user can only type digits
 */
export function handlePhoneChange(
  currentValue: string,
  newValue: string,
  setValue: (value: string) => void
): void {
  // If user tries to delete the prefix, prevent it
  if (newValue.length < PHONE_PREFIX.length) {
    setValue(PHONE_PREFIX);
    return;
  }
  
  // If prefix is missing, add it
  if (!newValue.startsWith(PHONE_PREFIX)) {
    const formatted = formatPhoneInput(newValue);
    setValue(formatted);
    return;
  }
  
  // Extract digits after prefix
  const afterPrefix = newValue.slice(PHONE_PREFIX.length);
  const digitsOnly = afterPrefix.replace(/[^\d]/g, '');
  
  // Limit to 10 digits (Nepal phone numbers are 9-10 digits)
  if (digitsOnly.length <= 10) {
    setValue(PHONE_PREFIX + digitsOnly);
  } else {
    // Keep current value if exceeding limit
    setValue(currentValue);
  }
}

/**
 * Gets the cursor position after formatting
 */
export function getPhoneCursorPosition(
  oldValue: string,
  newValue: string,
  oldCursorPos: number
): number {
  const prefixLength = PHONE_PREFIX.length;
  
  // If cursor was in the prefix area, move it to after prefix
  if (oldCursorPos <= prefixLength) {
    return prefixLength;
  }
  
  // Calculate how many digits were added/removed
  const oldDigits = oldValue.slice(prefixLength).replace(/[^\d]/g, '').length;
  const newDigits = newValue.slice(prefixLength).replace(/[^\d]/g, '').length;
  const diff = newDigits - oldDigits;
  
  // Adjust cursor position
  return Math.min(oldCursorPos + diff, newValue.length);
}

