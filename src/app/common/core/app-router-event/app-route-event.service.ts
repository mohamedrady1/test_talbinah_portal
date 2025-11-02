import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter, map } from 'rxjs';
import { Logger } from '../utilities';

@Injectable({ providedIn: 'root' })
export class RouteService {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);

  readonly shouldRenderSignal = signal<boolean>(true);

  listen(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child?.firstChild) child = child.firstChild;
          return child?.snapshot?.data || null;
        })
      )
      .subscribe();
  }

  updateShouldRender(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.shouldRenderSignal.set(true); // On server, always render
      return;
    }

    const hiddenRoutes = ['/Errors', '/Auth', '/Admin', '/Main'];
    const url = this.router.url;
    const isVisible = !hiddenRoutes.some(route => url.includes(route));
    // Logger.debug('shouldRender: ', this.shouldRender());
    this.shouldRenderSignal.set(isVisible);
  }

  // Expose as a computed value, not signal directly
  shouldRender(): boolean {
    return this.shouldRenderSignal();
  }
}
