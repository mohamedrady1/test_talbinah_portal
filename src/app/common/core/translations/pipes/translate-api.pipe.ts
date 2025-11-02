import { Pipe, PipeTransform, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

/**
 * TranslateApi Pipe
 * Simple and easy-to-use pipe for translating text in templates
 * 
 * Usage:
 * {{ 'home.welcome.title' | translateApi }}
 * {{ 'auth.login' | translateApi:'en' }}
 * 
 * Features:
 * - Supports nested keys with dot notation
 * - Automatic language detection
 * - Manual language override
 * - Auto-updates when language changes
 * - Falls back to key if translation not found
 */
@Pipe({
    name: 'translateApi',
    standalone: true,
    pure: false, // Impure pipe to react to language changes
})
export class TranslateApiPipe implements PipeTransform, OnDestroy {
    // private readonly facade = inject(TranslationsFacade);
    private readonly cdr = inject(ChangeDetectorRef);
    private subscription?: Subscription;
    private lastKey = '';
    private lastLang = '';
    private lastValue = '';

    constructor() {
        // Subscribe to translations changes to trigger updates
        // this.subscription = this.facade.translations$.subscribe(() => {
        //     this.cdr.markForCheck();
        // });
    }

    /**
     * Transform translation key to translated text
     * 
     * @param key Translation key (supports dot notation)
     * @param lang Optional language override (ar, en)
     * @returns Translated text or key if not found
     */
    transform(key: string, lang?: string): string {
        if (!key) {
            return '';
        }

        // Return cached value if inputs haven't changed
        if (key === this.lastKey && lang === this.lastLang) {
            return this.lastValue;
        }

        this.lastKey = key;
        this.lastLang = lang || '';
        // this.lastValue = this.facade.translate(key, lang);

        return this.lastValue;
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}


