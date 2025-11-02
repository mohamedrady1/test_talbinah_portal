import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Utility function to check if the code is running in the browser
 * @returns boolean indicating if the platform is browser
 */
export function isBrowser(): boolean {
    const platformId = inject(PLATFORM_ID);
    return isPlatformBrowser(platformId);
}

/**
 * Utility function to safely execute code only in browser environment
 * @param callback Function to execute only in browser
 * @param fallback Optional fallback function to execute in non-browser environments
 */
export function runInBrowser<T>(callback: () => T, fallback?: () => T): T | undefined {
    if (isBrowser()) {
        return callback();
    }
    return fallback?.();
}

