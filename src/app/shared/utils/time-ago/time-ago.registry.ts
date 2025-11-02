import { signal, Signal } from '@angular/core';
import { getTimeAgoParts, TimeAgoResult } from './time-ago.helper';

type TimeAgoEntry = {
  date: Date;
  parts: Signal<TimeAgoResult>;
};

const registry = new Map<string, TimeAgoEntry>();
let initialized = false;

function getIntervalPrecision(secondsAgo: number): number {
  if (secondsAgo < 60) return 1000;
  if (secondsAgo < 3600) return 60000;
  if (secondsAgo < 86400) return 3600000;
  return 0; // No longer auto-updates
}

function updateAll() {
  const now = new Date();
  for (const entry of registry.values()) {
    const newParts = getTimeAgoParts(entry.date, now);
    (entry.parts as any).set(newParts);
  }
}

export function startTimeAgoUpdater(): void {
  if (initialized) return;
  initialized = true;

  let currentInterval = 1000;

  const loop = () => {
    updateAll();
    const nextPrecision = Array.from(registry.values()).reduce(
      (min, entry) => {
        const age = Math.floor((Date.now() - entry.date.getTime()) / 1000);
        return Math.min(min, getIntervalPrecision(age));
      },
      Infinity,
    );

    currentInterval = nextPrecision || 3600000;
    setTimeout(loop, currentInterval);
  };

  setTimeout(loop, currentInterval);
}

export function registerTimeAgo(id: string, date: Date): Signal<TimeAgoResult> {
  if (registry.has(id)) return registry.get(id)!.parts;

  const now = new Date();
  const parts = signal(getTimeAgoParts(date, now));
  registry.set(id, { date, parts });

  startTimeAgoUpdater();

  return parts;
}

export function unregisterTimeAgo(id: string): void {
  registry.delete(id);
}
