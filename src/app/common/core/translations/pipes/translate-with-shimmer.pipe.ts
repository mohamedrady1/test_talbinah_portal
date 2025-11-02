import { Pipe, PipeTransform, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslationsFacade } from '../services';

/**
 * TranslateWithShimmer Pipe
 * Enhanced translation pipe that shows shimmer/skeleton while loading
 * 
 * Usage:
 * {{ 'home.welcome.title' | translateWithShimmer }}
 * {{ 'auth.login' | translateWithShimmer:'short' }}
 * {{ 'description' | translateWithShimmer:'long' }}
 * 
 * Features:
 * - Shows shimmer placeholder while loading
 * - Different shimmer lengths (short, medium, long)
 * - Auto-updates when translations load
 * - Falls back to key if translation not found
 */
@Pipe({
    name: 'translateWithShimmer',
    standalone: true,
    pure: false,
})
export class TranslateWithShimmerPipe implements PipeTransform, OnDestroy {
    private readonly facade = inject(TranslationsFacade);
    private readonly cdr = inject(ChangeDetectorRef);
    private subscription?: Subscription;
    private lastKey = '';
    private lastLength = '';
    private lastValue = '';

    constructor() {
        this.subscription = this.facade.translations$.subscribe(() => {
            this.cdr.markForCheck();
        });
    }

    /**
     * Transform translation key to translated text or shimmer
     * 
     * @param key Translation key
     * @param shimmerLength Shimmer length: 'short' | 'medium' | 'long' (default: 'medium')
     * @returns Translated text or shimmer placeholder
     */
    transform(key: string, shimmerLength: 'short' | 'medium' | 'long' = 'medium'): string {
        if (!key) {
            return '';
        }

        // Return cached value if inputs haven't changed
        if (key === this.lastKey && shimmerLength === this.lastLength) {
            return this.lastValue;
        }

        this.lastKey = key;
        this.lastLength = shimmerLength;

        // Check if loading
        if (this.facade.isLoading()) {
            this.lastValue = this.getShimmerText(shimmerLength);
            return this.lastValue;
        }

        // Check if translations loaded
        if (!this.facade.isInitialized()) {
            this.lastValue = this.getShimmerText(shimmerLength);
            return this.lastValue;
        }

        // Get translation
        this.lastValue = this.facade.translate(key);
        return this.lastValue;
    }

    /**
     * Get shimmer placeholder text based on length
     * 
     * @param length Shimmer length
     * @returns Shimmer placeholder
     */
    private getShimmerText(length: 'short' | 'medium' | 'long'): string {
        switch (length) {
            case 'short':
                return '████████';  // ~8 chars
            case 'medium':
                return '████████████████';  // ~16 chars
            case 'long':
                return '████████████████████████████████';  // ~32 chars
            default:
                return '████████████████';
        }
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}

