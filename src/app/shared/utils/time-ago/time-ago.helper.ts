export type TimeAgoResult = {
  value: number;
  unit: Intl.RelativeTimeFormatUnit;
};

export function getTimeAgoParts(from: Date, now: Date): TimeAgoResult {
  const seconds = Math.floor((now.getTime() - from.getTime()) / 1000);

  const intervals: { limit: number; value: number; unit: Intl.RelativeTimeFormatUnit }[] = [
    { limit: 60, value: 1, unit: 'second' },
    { limit: 3600, value: 60, unit: 'minute' },
    { limit: 86400, value: 3600, unit: 'hour' },
    { limit: 2592000, value: 86400, unit: 'day' },
    { limit: 31104000, value: 2592000, unit: 'month' },
    { limit: Infinity, value: 31104000, unit: 'year' },
  ];

  for (const interval of intervals) {
    if (seconds < interval.limit) {
      const value = Math.floor(seconds / interval.value);
      return { value, unit: interval.unit };
    }
  }

  return { value: 0, unit: 'second' };
}
