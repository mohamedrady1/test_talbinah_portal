import { Injectable, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MoodModalService } from './mood-modal.service';
import { Logger } from '../../common';
import { RoleGuardService } from '../../domains/authentication/user-authentication/services/role-guard.service';

@Injectable({
    providedIn: 'root'
})
export class MoodModalIntegrationService implements OnInit {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly moodModalService = inject(MoodModalService);
    private readonly roleGuard = inject(RoleGuardService);
    protected readonly isGuestSignal = this.roleGuard.isGuest;
    ngOnInit(): void {
        // Only run on browser platform (not during SSR)
        if (isPlatformBrowser(this.platformId)) {
            // Delay the check to ensure the app is fully loaded
            setTimeout(() => {
                this.moodModalService.checkAndShowMoodModal();
                Logger.debug('MoodModalIntegrationService initialized - checking for mood modal display');
            }, 2000); // 2 second delay to ensure app is ready
        }
    }

    /**
     * Public method to manually trigger mood modal check
     * Can be called from app component or other parts of the application
     */
    checkMoodModal(): void {
        Logger.debug('MoodModalIntegrationService checkMoodModal - checking for mood modal display');
        if (this.isGuestSignal()) {
            return;
        }
        this.moodModalService.checkAndShowMoodModal();
    }

    /**
     * Force show mood modal (useful for testing or manual triggers)
     */
    forceShowMoodModal(): void {
        this.moodModalService.forceShowMoodModal();
    }

    /**
     * Reset the mood modal interval (useful for testing)
     */
    resetMoodModalInterval(): void {
        this.moodModalService.resetMoodModalInterval();
    }
}
