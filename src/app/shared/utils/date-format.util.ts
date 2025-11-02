/**
 * Converts ISO date string to formatted time like '04:55 ص' or '04:55 AM'
 */
export function formatTime(value: string, locale: string = 'ar'): string {
  const date = new Date(value);
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

/**
 * Converts ISO date string to 'dd-MM-yyyy' format like '28-05-2025'
 */
export function formatDate(value: string): string {
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function getRemainingDays(targetDateStr: string): number {
  // Parse input date
  const targetDate = new Date(targetDateStr);

  if (isNaN(targetDate.getTime())) {
    throw new Error(`Invalid date string: ${targetDateStr}`);
  }

  // Get today's date in UTC to avoid timezone issues
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate difference in milliseconds
  const diffMs = targetDate.getTime() - today.getTime();

  // Convert to days and round down
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
}
