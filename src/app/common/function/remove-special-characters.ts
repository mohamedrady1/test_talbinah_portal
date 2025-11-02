/**
  * Removes special characters from a phone number and returns the digits as a number.
  * @param phoneNumber The phone number string (e.g., '+966123456789', '+966-123-456-789')
  * @returns A number containing only digits (e.g., 966123456789)
  * @throws Error if the input is invalid or exceeds safe integer limit
  */

export function removeSpecialCharacters(phoneNumber: string): number {
  if (!phoneNumber) {
    return 0; // Handle empty or falsy input
  }

  const cleaned = phoneNumber.replace(/[^0-9]/g, '');
  if (!cleaned) {
    return 0; // Handle non-numeric input
  }

  const numberValue = parseInt(cleaned, 10);
  if (isNaN(numberValue)) {
    return 0; // Handle invalid number
  }

  // Check for safe integer limit
  if (numberValue > Number.MAX_SAFE_INTEGER) {
    throw new Error('Phone number exceeds safe integer limit');
  }

  return numberValue;
}
