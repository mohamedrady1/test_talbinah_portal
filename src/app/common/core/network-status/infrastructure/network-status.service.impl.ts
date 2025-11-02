import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class NetworkStatusServiceImpl {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  isOnline(): boolean {
    if (!this.isBrowser) return true; // Assume online in SSR
    return navigator.onLine;
  }

  showOfflineRequestError(): void {
    if (!this.isBrowser) return; // Do not alert on server
    alert('You are offline. Please check your internet connection.'); // Replace with toast/snackbar in production
  }
}
