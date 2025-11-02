import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from '../../services/notification.service';
import { PublicService } from '../../../shared/services/public.service';
import { INotification } from '../../interfaces/notification.interface';
import { NotificationTypeEnum } from '../../enums/notification-type.enum';
import { Logger } from '../../../common/core/utilities';
import {
    AppointmentsRoutesEnum,
    PodcastRoutesEnum,
    TalbinahCommunityRoutesEnum,
    TherapeuticProgramsRoutesEnum,
    NotificationsFacade
} from '../../../domains';

@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent {
    private readonly notificationService = inject(NotificationService);
    private readonly publicService = inject(PublicService);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly router = inject(Router);
    private readonly notificationsFacade = inject(NotificationsFacade);
    protected readonly isBrowser = isPlatformBrowser(this.platformId);

    readonly notifications$ = this.notificationService.notifications$;
    currentLanguage!: string;

    constructor() {
        if (this.isBrowser) {
            this.currentLanguage = this.publicService.getCurrentLanguage();
        }
    }

    protected removeNotification(id: number) {
        this.notificationService.remove(id);
    }

    protected onNotificationClick(notification: INotification): void {
        if (!this.isBrowser) {
            Logger.debug('NotificationComponent | SSR: Navigation skipped');
            return;
        }

        Logger.debug('NotificationComponent | Notification clicked:', notification);

        // Mark notification as read if notification_id exists in data
        if (notification.data?.notification_id) {
            Logger.debug('NotificationComponent | Marking notification as read:', notification.data.notification_id);
            this.notificationsFacade.markAsRead(notification.data.notification_id);
        }

        // Navigate based on notification type using route enums and Router.navigate
        switch (notification.type) {
            case NotificationTypeEnum.SESSION_REMINDER:
                this.router.navigate([AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE]);
                break;

            case NotificationTypeEnum.NEW_MESSAGE:
                this.router.navigate(['messages']);
                break;

            case NotificationTypeEnum.APPOINTMENT:
                this.router.navigate([AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE]);
                break;

            case NotificationTypeEnum.RESERVATION:
                // Navigate to appointments (reservations)
                if (notification.data?.reservationId) {
                    this.router.navigate([
                        AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE,
                        notification.data.reservationId
                    ]);
                } else {
                    this.router.navigate([AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE]);
                }
                break;

            case NotificationTypeEnum.PODCAST:
                // Navigate to podcasts
                if (notification.data?.podcastId) {
                    this.router.navigate([PodcastRoutesEnum.PODCASTSMAINPAGE], {
                        queryParams: { id: notification.data.podcastId }
                    });
                } else {
                    this.router.navigate([PodcastRoutesEnum.PODCASTSMAINPAGE]);
                }
                break;

            case NotificationTypeEnum.COMMUNITY:
                // Navigate to community
                if (notification.data?.postId) {
                    this.router.navigate([TalbinahCommunityRoutesEnum.TALBINAH_COMMUNITY_MAIN_PAGE], {
                        queryParams: { postId: notification.data.postId }
                    });
                } else if (notification.data?.userId) {
                    this.router.navigate([
                        TalbinahCommunityRoutesEnum.TALBINAH_COMMUNITY_MAIN_PAGE,
                        TalbinahCommunityRoutesEnum.USER_COMMUNITY_PROFILE,
                        notification.data.userId
                    ]);
                } else {
                    this.router.navigate([TalbinahCommunityRoutesEnum.TALBINAH_COMMUNITY_MAIN_PAGE]);
                }
                break;

            case NotificationTypeEnum.TASK:
                // Navigate to session tasks
                if (notification.data?.sessionId) {
                    this.router.navigate([
                        AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE,
                        AppointmentsRoutesEnum.APPOINTMENTS_SESSION,
                        notification.data.sessionId
                    ]);
                } else {
                    this.router.navigate([AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE]);
                }
                break;

            case NotificationTypeEnum.OFFER:
                // Navigate to therapeutic programs or specific offer
                if (notification.data?.offerId) {
                    this.router.navigate([TherapeuticProgramsRoutesEnum.THERAPEUTIC_PROGRAMS_MAIN_PAGE], {
                        queryParams: { offerId: notification.data.offerId }
                    });
                } else if (notification.data?.url) {
                    this.router.navigate([notification.data.url]);
                } else {
                    this.router.navigate([TherapeuticProgramsRoutesEnum.THERAPEUTIC_PROGRAMS_MAIN_PAGE]);
                }
                break;

            case NotificationTypeEnum.GENERAL:
                // Check if there's specific data for navigation
                if (notification.data?.url) {
                    this.router.navigate([notification.data.url]);
                }
                break;

            default:
                // For other types, check if there's a URL in data
                if (notification.data?.url) {
                    this.router.navigate([notification.data.url]);
                }
                break;
        }

        // Remove notification after click
        this.removeNotification(notification.id);
    }

    protected getTimeAgo(timestamp: Date): string {
        const now = new Date();
        const diff = Math.floor((now.getTime() - new Date(timestamp).getTime()) / 1000); // difference in seconds

        if (diff < 60) {
            return this.currentLanguage === 'ar' ? 'الآن' : 'Now';
        } else if (diff < 3600) {
            const minutes = Math.floor(diff / 60);
            return this.currentLanguage === 'ar'
                ? `منذ ${minutes} دقيقة`
                : `${minutes}m ago`;
        } else if (diff < 86400) {
            const hours = Math.floor(diff / 3600);
            return this.currentLanguage === 'ar'
                ? `منذ ${hours} ساعة`
                : `${hours}h ago`;
        } else {
            const days = Math.floor(diff / 86400);
            return this.currentLanguage === 'ar'
                ? `منذ ${days} يوم`
                : `${days}d ago`;
        }
    }

}

