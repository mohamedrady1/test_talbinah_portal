import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ModalService } from './model.service';
import { Logger } from '../../common';
import { YourCurrentMoodTodayComponent } from '../components';

@Injectable({
    providedIn: 'root'
})
export class MoodModalService {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly modalService = inject(ModalService);

    private readonly MOOD_MODAL_KEY = 'mood_modal_last_shown_date';
    private readonly MOOD_MODAL_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    constructor() {
        // Check if modal should be shown when service is instantiated
        if (isPlatformBrowser(this.platformId)) {
            this.checkAndShowMoodModal();
        }
    }

    /**
     * Checks if 24 hours have passed since the last mood modal display
     * and shows the modal if conditions are met
     */
    checkAndShowMoodModal(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const lastShownDate = this.getLastShownDate();
        const today = new Date();
        const todayString = this.getDateString(today);

        // If never shown before or if it's a new day
        if (!lastShownDate || lastShownDate !== todayString) {
            Logger.debug('Showing mood modal - new day started (midnight)');
            this.showMoodModal();
            // Don't save the date here - only save after successful submission
        } else {
            Logger.debug('Mood modal not shown - already submitted today');
        }
    }

    /**
     * Manually shows the mood selector modal
     */
    showMoodModal(): void {
        Logger.debug('Manually showing mood modal');
        this.modalService.open(YourCurrentMoodTodayComponent,
            {
                inputs: {
                    image: 'images/icons/logo-2.png',
                    title: 'your_mood',
                    showCloseButton: false,
                    data: {}
                },
                outputs: {
                    closed: (data: { status: boolean, data: any }) => {
                        Logger.debug('Mood modal closed by user');
                    }
                },
                closeOnBackdropClick: false,
                maxWidth: '40vw',
                minWidth: '40vw',
                onCloseClick: () => {
                    Logger.debug('Mood modal closed by user');
                }
            });
    }

    /**
     * Forces the mood modal to show regardless of the daily interval
     * Useful for testing or manual triggers
     */
    forceShowMoodModal(): void {
        Logger.debug('Force showing mood modal');
        this.showMoodModal();
    }

    /**
     * Marks the mood as submitted for today
     * This should be called after successful mood submission
     */
    markMoodSubmittedForToday(): void {
        if (isPlatformBrowser(this.platformId)) {
            const today = new Date();
            const todayString = this.getDateString(today);
            this.setLastShownDate(todayString);
            Logger.debug('✅ Mood submitted for today - modal will not show again until tomorrow');
            Logger.debug('📅 Date saved to localStorage:', todayString);
        } else {
            Logger.warn('❌ Cannot save to localStorage - not in browser environment');
        }
    }

    /**
     * Simulates a new day for testing purposes
     * This will allow the modal to show immediately
     */
    simulateNewDay(): void {
        if (isPlatformBrowser(this.platformId)) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = this.getDateString(yesterday);
            this.setLastShownDate(yesterdayString);
            Logger.debug('Simulated new day - modal can now show');
        }
    }

    /**
     * Resets the last shown timestamp, allowing the modal to show immediately
     * Useful for testing or when you want to reset the interval
     */
    resetMoodModalInterval(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.MOOD_MODAL_KEY);
            Logger.debug('Mood modal interval reset');
        }
    }

    /**
     * Gets the remaining time until the next mood modal can be shown (until midnight)
     * @returns Remaining time in milliseconds, or 0 if ready to show
     */
    getRemainingTimeUntilNextModal(): number {
        if (!isPlatformBrowser(this.platformId)) {
            return 0;
        }

        const lastShownDate = this.getLastShownDate();
        const today = new Date();
        const todayString = this.getDateString(today);

        // If never shown before or if it's a new day, can show immediately
        if (!lastShownDate || lastShownDate !== todayString) {
            return 0;
        }

        // Calculate time until next midnight
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        return tomorrow.getTime() - today.getTime();
    }

    /**
     * Gets the last shown date from localStorage
     */
    private getLastShownDate(): string | null {
        if (!isPlatformBrowser(this.platformId)) {
            return null;
        }

        try {
            return localStorage.getItem(this.MOOD_MODAL_KEY);
        } catch (error) {
            Logger.error('Error reading mood modal date from localStorage:', error);
            return null;
        }
    }

    /**
     * Sets the last shown date in localStorage
     */
    private setLastShownDate(dateString: string): void {
        if (!isPlatformBrowser(this.platformId)) {
            Logger.warn('❌ Cannot save to localStorage - not in browser environment');
            return;
        }

        try {
            localStorage.setItem(this.MOOD_MODAL_KEY, dateString);
            Logger.debug('💾 Mood modal date saved to localStorage:', dateString);
            Logger.debug('🔑 localStorage key:', this.MOOD_MODAL_KEY);

            // Verify the save was successful
            const savedValue = localStorage.getItem(this.MOOD_MODAL_KEY);
            Logger.debug('✅ Verification - saved value:', savedValue);
        } catch (error) {
            Logger.error('❌ Error saving mood modal date to localStorage:', error);
        }
    }

    /**
     * Converts a date to a string format (YYYY-MM-DD)
     */
    private getDateString(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

