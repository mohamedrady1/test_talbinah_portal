import { Injectable, inject, PLATFORM_ID, signal, WritableSignal, } from '@angular/core';
import { DOCUMENT, isPlatformBrowser, isPlatformServer, } from '@angular/common';
import { Meta, Title, MetaDefinition, } from '@angular/platform-browser';
import { MetaTags } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class MetadataService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  readonly metaTagsSignal: WritableSignal<MetaTags> = signal<MetaTags>({
    title: '',
    description: '',
    keywords: '',
    image: '',
    url: '',
    robots: 'index, follow',
    locale: 'en_US',
    canonical: '',
  });

  /**
   * Public method to set/update meta tags (smart merge with defaults).
   */
  setMetaTags(customTags: Partial<MetaTags>): void {
    const current = this.metaTagsSignal();
    const merged: MetaTags = {
      ...current,
      ...customTags,
    };

    this.metaTagsSignal.set(merged);
    this.applyMetaTags(merged);
  }

  /**
   * Applies the meta tags to the document only if missing or different.
   */
  private applyMetaTags(meta: MetaTags): void {
    this.updateTitle(meta.title || '');
    this.updateMeta([
      { name: 'description', content: meta.description || '' },
      { name: 'keywords', content: meta.keywords || '' },
      { name: 'robots', content: meta.robots || 'index, follow' },
      { property: 'og:title', content: meta.title || '' },
      { property: 'og:description', content: meta.description || '' },
      { property: 'og:image', content: meta.image || '' },
      { property: 'og:url', content: meta.url || '' },
      { property: 'og:locale', content: meta.locale || 'en_US' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: meta.title || '' },
      { name: 'twitter:description', content: meta.description || '' },
      { name: 'twitter:image', content: meta.image || '' },
    ]);

    if (meta.canonical) this.updateCanonical(meta.canonical);
  }

  /**
   * Set or update meta tags only if necessary.
   */
  private updateMeta(defs: MetaDefinition[]): void {
    defs.forEach(def => {
      const existing = def.name
        ? this.metaService.getTag(`name='${def.name}'`)
        : def.property
          ? this.metaService.getTag(`property='${def.property}'`)
          : null;

      if (!existing || existing.content !== def.content) {
        this.metaService.updateTag(def);
      }
    });
  }

  private updateTitle(title: string): void {
    if (title && this.titleService.getTitle() !== title) {
      this.titleService.setTitle(title);
    }
  }

  private updateCanonical(canonical: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);
  }

  injectJSONLdSchema(schema: Record<string, any>): void {
    if (!isPlatformServer(this.platformId)) return;
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }

  injectGoogleTagManager(gtmId: string): void {
    if (!isPlatformServer(this.platformId)) return;

    const script = this.document.createElement('script');
    script.text = `
      (function(w,d,s,l,i){w[l]=w[l]||[];
        w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;
        j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
        f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `;
    this.document.head.appendChild(script);

    const noscript = this.document.createElement('noscript');
    noscript.innerHTML = `
      <iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    this.document.body.appendChild(noscript);
  }
}
