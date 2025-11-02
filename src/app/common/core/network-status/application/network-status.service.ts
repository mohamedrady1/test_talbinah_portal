import { Injectable, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { fromEvent, merge, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class NetworkStatusService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly online$ = this.createOnlineObservable();
  readonly online = toSignal(this.online$, { initialValue: true });

  /**
   * Returns the current online status as a signal.
   * Can be used in components directly.
   */
  isOnline(): boolean {
    return this.online();
  }

  /**
   * Returns the current online status as an observable.
   * Can be used in services/interceptors.
   */
  isOnline$() {
    return this.online$;
  }

  private createOnlineObservable() {
    if (!this.isBrowser) {
      return of(true); // SSR-safe fallback
    }

    return merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    );
  }
}


// @Component({
//   selector: 'app-status-indicator',
//   template: `
//     <p class="status" [class.online]="networkStatus.isOnline()">
//       Status: {{ networkStatus.isOnline() ? 'Online' : 'Offline' }}
//     </p>
//   `,
//   standalone: true,
//   changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class StatusIndicatorComponent {
//   constructor(public readonly networkStatus: NetworkStatusService) {}
// }
