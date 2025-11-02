import { registerTimeAgo, unregisterTimeAgo } from './time-ago.registry';

/**
 * Use this to get a real-time signal of time ago parts (value and unit).
 */
export function useTimeAgoRealtime(id: string | number, dateInput: Date | string) {
  const date = new Date(dateInput);
  return registerTimeAgo(String(id), date); // Signal<TimeAgoResult>
}

/**
 * Use this to manually destroy the time ago tracking for a given ID.
 */
export function destroyTimeAgo(id: string | number) {
  unregisterTimeAgo(String(id));
}
