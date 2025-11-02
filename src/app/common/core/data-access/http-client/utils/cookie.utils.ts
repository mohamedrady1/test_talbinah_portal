/**
 * Cookie utilities for managing cookies in SSR-safe manner
 */

/**
 * Set cookie with flexible expiry
 * @param name cookie name
 * @param value cookie value
 * @param time number of days/hours/minutes/seconds
 * @param unit 'days' | 'hours' | 'minutes' | 'seconds'
 */
export function setCookie(
    name: string,
    value: string,
    time: number,
    unit: 'days' | 'hours' | 'minutes' | 'seconds' = 'days'
): void {
    if (typeof document === 'undefined') return;

    const expires = new Date();
    switch (unit) {
        case 'days':
            expires.setTime(expires.getTime() + time * 24 * 60 * 60 * 1000);
            break;
        case 'hours':
            expires.setTime(expires.getTime() + time * 60 * 60 * 1000);
            break;
        case 'minutes':
            expires.setTime(expires.getTime() + time * 60 * 1000);
            break;
        case 'seconds':
            expires.setTime(expires.getTime() + time * 1000);
            break;
    }

    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Get cookie value by name
 * @param name cookie name
 * @returns cookie value or null if not found
 */
export function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const cookieString = document.cookie || '';
    const match = cookieString.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Exported function to get b2b value from cookie or URL
 * Can be used without dependency injection
 * SSR-safe implementation
 */
export function getB2BValue(): string | null {
    // Check URL parameter first
    if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        const urlParam = url.searchParams.get('b2b');
        if (urlParam) {
            // Set cookie - expires in 1 day
            setCookie('b2b', urlParam, 1, 'days');

            // Remove ?b2b=value from URL without reloading page
            url.searchParams.delete('b2b');
            window.history.replaceState({}, '', url.toString());

            return urlParam;
        }
    }

    // Check cookie
    return getCookie('b2b');
}

