import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Service to play notification sounds
 * 
 * This service handles playing audio notifications when new notifications are received.
 * It supports different sound types and volume control.
 * 
 * @example
 * ```typescript
 * constructor(private notificationSoundService: NotificationSoundService) {}
 * 
 * // Play default notification sound
 * this.notificationSoundService.playNotificationSound();
 * 
 * // Play with custom volume
 * this.notificationSoundService.playNotificationSound(0.5);
 * 
 * // Play specific sound type
 * this.notificationSoundService.playNotificationSound(1.0, 'message');
 * ```
 */
@Injectable({
    providedIn: 'root'
})
export class NotificationSoundService {
    private readonly platformId = inject(PLATFORM_ID);
    private audio: HTMLAudioElement | null = null;

    /**
     * Available notification sound types
     */
    private readonly soundPaths: Record<string, string> = {
        default: '/sounds/notification-sound.mp3',
        message: '/sounds/notification-sound.mp3',
        // Add more sound types here if needed
        // alert: '/sounds/alert-notification-sound.mp3',
    };

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            this.initializeAudio();
        }
    }

    /**
     * Initialize audio element
     * @private
     */
    private initializeAudio(): void {
        try {
            this.audio = new Audio();
            this.audio.volume = 1.0; // Default volume
        } catch (error) {
            console.error('Failed to initialize audio:', error);
        }
    }

    /**
     * Play notification sound
     * 
     * @param volume - Volume level (0.0 to 1.0), default is 1.0
     * @param soundType - Type of sound to play ('default', 'message', etc.), default is 'default'
     * @returns Promise<void>
     * 
     * @example
     * ```typescript
     * // Play with default volume and sound
     * await this.notificationSoundService.playNotificationSound();
     * 
     * // Play with 50% volume
     * await this.notificationSoundService.playNotificationSound(0.5);
     * 
     * // Play specific sound type
     * await this.notificationSoundService.playNotificationSound(1.0, 'message');
     * ```
     */
    async playNotificationSound(volume: number = 1.0, soundType: string = 'default'): Promise<void> {
        if (!isPlatformBrowser(this.platformId) || !this.audio) {
            return;
        }

        try {
            // Get sound path based on type
            const soundPath = this.soundPaths[soundType] || this.soundPaths['default'];

            // Set audio source and volume
            this.audio.src = soundPath;
            this.audio.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1

            // Play the sound
            await this.audio.play();
        } catch (error) {
            console.error('Failed to play notification sound:', error);
            // Don't throw error to prevent breaking the notification flow
        }
    }

    /**
     * Set the default volume for notifications
     * 
     * @param volume - Volume level (0.0 to 1.0)
     * 
     * @example
     * ```typescript
     * this.notificationSoundService.setVolume(0.7);
     * ```
     */
    setVolume(volume: number): void {
        if (this.audio) {
            this.audio.volume = Math.max(0, Math.min(1, volume));
        }
    }

    /**
     * Mute notification sounds
     * 
     * @example
     * ```typescript
     * this.notificationSoundService.mute();
     * ```
     */
    mute(): void {
        if (this.audio) {
            this.audio.volume = 0;
        }
    }

    /**
     * Unmute notification sounds
     * 
     * @example
     * ```typescript
     * this.notificationSoundService.unmute();
     * ```
     */
    unmute(): void {
        if (this.audio) {
            this.audio.volume = 1.0;
        }
    }

    /**
     * Check if browser supports audio playback
     * 
     * @returns boolean
     */
    isSupported(): boolean {
        return isPlatformBrowser(this.platformId) && !!this.audio;
    }
}

