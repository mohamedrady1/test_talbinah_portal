import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window {
    grecaptcha?: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class RecaptchaService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly siteKey = '6Ldw8kwrAAAAAL4ey5-P48MU9P6Rgz3CCvp3qn8N';

  private scriptLoaded = signal(false);
  private scriptId = 'recaptcha-enterprise-script';

  public loadScript(): Promise<void> {
    if (!this.isBrowser || this.scriptLoaded()) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const existingScript = this.isBrowser ? document.getElementById(this.scriptId) : null;
      if (existingScript) {
        this.scriptLoaded.set(true);
        resolve();
        return;
      }

      if (!this.isBrowser) return reject();

      const script = document.createElement('script');
      script.id = this.scriptId;
      script.src = `https://www.google.com/recaptcha/enterprise.js?render=${this.siteKey}`;
      script.onload = () => {
        this.scriptLoaded.set(true);
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  public async execute(action: string): Promise<string | null> {
    if (!this.isBrowser) return null;

    if (!this.scriptLoaded()) {
      try {
        await this.loadScript();
      } catch {
        return null;
      }
    }

    return new Promise((resolve, reject) => {
      if (!window.grecaptcha?.enterprise?.ready) return resolve(null);

      window.grecaptcha.enterprise.ready(() => {
        window.grecaptcha.enterprise
          .execute(this.siteKey, { action })
          .then((token: string) => resolve(token))
          .catch(() => reject(null));
      });
    });
  }

  public removeScript(): void {
    if (!this.isBrowser) return;

    const script = document.getElementById(this.scriptId);
    if (script?.parentNode) {
      script.parentNode.removeChild(script);
    }

    this.scriptLoaded.set(false);
    delete window.grecaptcha;
  }
}
