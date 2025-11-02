import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class PlatformService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isServer = signal(true);
  readonly platform = signal<'Browser' | 'Server' | 'Unknown'>('Unknown');

  detect(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.platform.set('Browser');
    } else if (isPlatformServer(this.platformId)) {
      this.platform.set('Server');
    } else {
      this.platform.set('Unknown');
    }
  }

  setIsServer(value: boolean): void {
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.isServer.set(value);
      }
    }, 0);
  }
}
