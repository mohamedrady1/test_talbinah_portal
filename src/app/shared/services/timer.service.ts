import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class TimerService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /**
   * Returns a future timestamp in milliseconds.
   * Defaults to now + duration if in browser.
   * Uses a fallback during SSR to prevent DOM mismatch.
   */
  getFutureTimestamp(msFromNow: number): number {
    const now = Date.now();
    return this.isBrowser ? now + msFromNow : now + msFromNow;
  }

  /**
   * Returns the current time.
   */
  now(): number {
    return Date.now();
  }
}
