import { Directive, ElementRef, Input, OnInit, OnDestroy, inject, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslationsFacade } from '../services';

/**
 * TranslateShimmer Directive
 * Shows shimmer animation on element while translations are loading
 * 
 * Usage:
 * <h1 appTranslateShimmer translationKey="welcome_back">{{ 'welcome_back' | translateApi }}</h1>
 * <p appTranslateShimmer="long" translationKey="description">{{ 'description' | translateApi }}</p>
 * 
 * Features:
 * - Adds shimmer CSS class while loading
 * - Removes class when loaded
 * - Supports different shimmer sizes
 */
@Directive({
    selector: '[appTranslateShimmer]',
    standalone: true
})
export class TranslateShimmerDirective implements OnInit, OnDestroy {
    @Input() translationKey!: string;
    @Input() appTranslateShimmer: 'short' | 'medium' | 'long' = 'medium';

    private readonly el = inject(ElementRef);
    private readonly renderer = inject(Renderer2);
    private readonly facade = inject(TranslationsFacade);
    private subscription?: Subscription;

    ngOnInit() {
        // Add shimmer class if loading
        this.updateShimmerState();

        // Subscribe to translations changes
        this.subscription = this.facade.translations$.subscribe(() => {
            this.updateShimmerState();
        });
    }

    private updateShimmerState(): void {
        const isLoading = this.facade.isLoading() || !this.facade.isInitialized();

        if (isLoading) {
            // Add shimmer classes
            this.renderer.addClass(this.el.nativeElement, 'shimmer-loading');
            this.renderer.addClass(this.el.nativeElement, `shimmer-${this.appTranslateShimmer}`);
            this.renderer.setAttribute(this.el.nativeElement, 'aria-busy', 'true');
        } else {
            // Remove shimmer classes
            this.renderer.removeClass(this.el.nativeElement, 'shimmer-loading');
            this.renderer.removeClass(this.el.nativeElement, `shimmer-${this.appTranslateShimmer}`);
            this.renderer.removeAttribute(this.el.nativeElement, 'aria-busy');
        }
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}

