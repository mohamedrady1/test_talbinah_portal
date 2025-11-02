import {
    Component,
    Input,
    OnInit,
    OnDestroy,
    signal,
    inject,
    PLATFORM_ID,
    ChangeDetectionStrategy,
    computed
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { IBannerItem } from '../../dtos';
import { BannerPageType, BannerActionType } from '../../enums';
import { Logger } from '../../../../common';
import { MainPageApiClientProvider } from '../../clients';

// Import route enums
import { BookAppointmentRoutesEnum } from '../../../book-appointment';
import { PodcastRoutesEnum } from '../../../podcasts';
import { ArticlesRoutesEnum } from '../../../articles';
import { TalbinahCommunityRoutesEnum } from '../../../talbinah-community';
import { MentalHealthScalesRoutesEnum } from '../../../mental-health-scales';
import { TherapeuticProgramsRoutesEnum } from '../../../therapeutic-programs';
import { KhawiikBotRoutesEnum } from '../../../talbinah-bot';
import { SupportGroupsRoutesEnum } from '../../../support-groups';
import { AppointmentsRoutesEnum } from '../../../appointments';
import { UrgentAppointmentRoutesEnum } from '../../../urgent-appointment';
import { UrgentAppointmentOpenService } from '../../../urgent-appointment/services/urgent-appointment-open.service';
import { SettingsRoutesEnum } from '../../../settings';
import { WalletComponent } from '../../../settings/components/wallet/wallet.component';
import { GovernmentAgenciesComponent } from '../../../settings/components/government-agencies/government-agencies.component';
import { SettingsPointsComponent } from '../../../settings/components/settings-points/settings-points.component';
import { MyFavouritesComponent } from '../../../settings/components/my-favourites/my-favourites.component';
import { SettingFaqsComponent } from '../../../settings/components/setting-faqs/setting-faqs.component';
import { ImportantNumbersComponent } from '../../../settings/components/important-numbers/important-numbers.component';
import { ComplaintsListComponent } from '../../../settings/components/complaints-list/complaints-list.component';
import { NotificationsListComponent } from '../../../notifications/components/notifications-list/notifications-list.component';
import { ModalService } from '../../../../shared';

@Component({
    selector: 'app-banner-carousel',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './banner-carousel.component.html',
    styleUrls: ['./banner-carousel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannerCarouselComponent implements OnInit, OnDestroy {
    @Input({ required: true }) banners!: IBannerItem[];

    protected currentSlide = signal<number>(0);
    private autoPlayInterval: any;
    private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    private readonly router = inject(Router);
    private readonly apiClient = inject(MainPageApiClientProvider).getClient();
    private readonly document = inject(DOCUMENT);
    private readonly urgentAppointmentService = inject(UrgentAppointmentOpenService);
    private readonly modalService = inject(ModalService);

    // Touch/Swipe properties
    private touchStartX = 0;
    private touchEndX = 0;
    private touchStartY = 0;
    private touchEndY = 0;
    private isDragging = false;
    protected isGrabbing = signal<boolean>(false); // For visual feedback
    private readonly SWIPE_THRESHOLD = 50; // Minimum distance for swipe
    private readonly CLICK_THRESHOLD = 10; // Maximum distance for click

    // Computed property to check if RTL
    protected isRTL = computed(() => {
        if (!this.isBrowser) return false;
        return this.document.documentElement.dir === 'rtl' ||
            this.document.body.dir === 'rtl' ||
            getComputedStyle(this.document.documentElement).direction === 'rtl';
    });

    // Computed property for transform value
    protected getTransform = computed(() => {
        const offset = this.currentSlide() * 100;
        return this.isRTL()
            ? `translateX(${offset}%)`
            : `translateX(-${offset}%)`;
    });

    ngOnInit(): void {
        if (this.isBrowser && this.banners.length > 1) {
            this.startAutoPlay();
        }
    }

    ngOnDestroy(): void {
        this.stopAutoPlay();
    }

    private startAutoPlay(): void {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }

    private stopAutoPlay(): void {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }

    protected nextSlide(): void {
        const nextIndex = (this.currentSlide() + 1) % this.banners.length;
        this.currentSlide.set(nextIndex);
    }

    protected prevSlide(): void {
        const prevIndex = this.currentSlide() === 0
            ? this.banners.length - 1
            : this.currentSlide() - 1;
        this.currentSlide.set(prevIndex);
    }

    protected goToSlide(index: number): void {
        this.currentSlide.set(index);
        this.stopAutoPlay();
        this.startAutoPlay(); // Restart auto-play after manual navigation
    }

    protected onBannerClick(banner: IBannerItem, event?: Event): void {
        // If it was a swipe, don't trigger click
        if (this.isDragging) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            return;
        }

        Logger.debug('Banner clicked:', banner);

        // Send click event to API
        this.apiClient.sendBannerClick({ banner_id: banner.id }).subscribe({
            next: (response) => {
                Logger.debug('Banner click tracked:', response);
            },
            error: (error) => {
                Logger.error('Failed to track banner click:', error);
            }
        });

        // Navigate based on action type using enum
        if (banner.action === BannerActionType.PAGE && banner.page) {
            this.navigateToPage(banner.page, banner.pageID);
        } else if (banner.action === BannerActionType.LINK && banner.link) {
            this.navigateToLink(banner.link);
        }
    }

    // Touch/Swipe handlers
    protected onTouchStart(event: TouchEvent): void {
        if (!this.isBrowser) return;

        this.touchStartX = event.touches[0].clientX;
        this.touchStartY = event.touches[0].clientY;
        this.isDragging = false;
        this.isGrabbing.set(true);
        this.stopAutoPlay();
    }

    protected onTouchMove(event: TouchEvent): void {
        if (!this.isBrowser) return;

        this.touchEndX = event.touches[0].clientX;
        this.touchEndY = event.touches[0].clientY;

        // Calculate distances
        const deltaX = Math.abs(this.touchEndX - this.touchStartX);
        const deltaY = Math.abs(this.touchEndY - this.touchStartY);

        // If horizontal movement is greater than vertical, it's a swipe
        if (deltaX > deltaY && deltaX > this.CLICK_THRESHOLD) {
            this.isDragging = true;
            // Prevent scrolling while swiping horizontally
            event.preventDefault();
        }
    }

    protected onTouchEnd(event: TouchEvent): void {
        if (!this.isBrowser) return;

        const deltaX = this.touchStartX - this.touchEndX;
        const deltaY = Math.abs(this.touchStartY - this.touchEndY);

        // Only process horizontal swipes (not vertical scrolls)
        if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > this.SWIPE_THRESHOLD) {
            if (this.isRTL()) {
                // In RTL: swipe right (negative delta) = next, swipe left (positive delta) = prev
                if (deltaX < 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            } else {
                // In LTR: swipe left (positive delta) = next, swipe right (negative delta) = prev
                if (deltaX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        }

        this.isGrabbing.set(false);

        // Reset after a short delay to allow click event to check isDragging
        setTimeout(() => {
            this.isDragging = false;
        }, 100);

        this.startAutoPlay();
    }

    // Mouse drag handlers (for desktop)
    protected onMouseDown(event: MouseEvent): void {
        if (!this.isBrowser) return;

        this.touchStartX = event.clientX;
        this.touchStartY = event.clientY;
        this.isDragging = false;
        this.isGrabbing.set(true);
        this.stopAutoPlay();
    }

    protected onMouseMove(event: MouseEvent): void {
        if (!this.isBrowser || event.buttons !== 1) return;

        this.touchEndX = event.clientX;
        this.touchEndY = event.clientY;

        const deltaX = Math.abs(this.touchEndX - this.touchStartX);
        const deltaY = Math.abs(this.touchEndY - this.touchStartY);

        if (deltaX > deltaY && deltaX > this.CLICK_THRESHOLD) {
            this.isDragging = true;
        }
    }

    protected onMouseUp(event: MouseEvent): void {
        if (!this.isBrowser) return;

        this.touchEndX = event.clientX;
        const deltaX = this.touchStartX - this.touchEndX;
        const deltaY = Math.abs(this.touchStartY - this.touchEndY);

        if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > this.SWIPE_THRESHOLD) {
            if (this.isRTL()) {
                if (deltaX < 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            } else {
                if (deltaX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        }

        this.isGrabbing.set(false);

        setTimeout(() => {
            this.isDragging = false;
        }, 100);

        this.startAutoPlay();
    }

    private navigateToPage(page: string, pageID: number | null): void {
        // Check for special modal pages
        if (page === BannerPageType.QUICK_RESERVATION) {
            this.openQuickReservationPopup();
            return;
        }

        if (page === BannerPageType.WALLET_GIFT) {
            this.openWalletModal();
            return;
        }

        if (page === BannerPageType.GOVERNMENT_AGENCIES) {
            this.openGovernmentAgenciesModal();
            return;
        }

        if (page === BannerPageType.NOTIFICATIONS) {
            this.openNotificationsModal();
            return;
        }

        if (page === BannerPageType.POINTS || page === BannerPageType.POINTS_REWARDS) {
            this.openPointsModal();
            return;
        }

        if (page === BannerPageType.FAVORITES) {
            this.openFavoritesModal();
            return;
        }

        if (page === BannerPageType.FAQS) {
            this.openFaqsModal();
            return;
        }

        if (page === BannerPageType.IMPORTANT_NUMBERS) {
            this.openImportantNumbersModal();
            return;
        }

        if (page === BannerPageType.PROBLEMS) {
            this.openProblemsModal();
            return;
        }

        if (page === BannerPageType.CONTACT_US) {
            this.openContactUsWhatsApp();
            return;
        }

        // Handle regular page navigation
        const route = this.getRouteForPage(page);

        if (route) {
            if (pageID) {
                this.router.navigate([route, pageID]);
            } else {
                this.router.navigate([route]);
            }
        } else {
            Logger.warn(`No route mapping found for page: ${page}`);
        }
    }

    private openQuickReservationPopup(): void {
        if (this.isBrowser) {
            Logger.debug('Opening Quick Reservation popup from banner');
            this.urgentAppointmentService.requestOpen();
        }
    }

    private openWalletModal(): void {
        if (this.isBrowser) {
            Logger.debug('Opening Wallet modal from banner');
            this.modalService.open(WalletComponent, {
                inputs: {
                    image: 'images/settings/modal-icons/wallet.png',
                    title: 'settings.wallet.title',
                    subtitle: 'settings.wallet.subtitle',
                    data: {},
                },
                outputs: {
                    closed: (data: { status: boolean; data: any }) => {
                        Logger.debug('Wallet Modal closed from banner. Status:', data.status, 'Data:', data.data);
                    },
                },
                width: '60%',
                height: '80%',
            });
        }
    }

    private openGovernmentAgenciesModal(): void {
        if (this.isBrowser) {
            Logger.debug('Opening Government Agencies modal from banner');
            this.modalService.open(GovernmentAgenciesComponent, {
                inputs: {
                    image: 'images/settings/modal-icons/government-agencies.png',
                    title: 'settings.governmentAgencies.title',
                    subtitle: 'settings.governmentAgencies.subtitle',
                    data: {}
                },
                outputs: {
                    closed: (data: { status: boolean; data: any }) => {
                        Logger.debug('Government Agencies Modal closed from banner. Status:', data.status, 'Data:', data.data);
                    }
                },
                width: '70%',
                maxHeight: '80%'
            });
        }
    }

    private openNotificationsModal(): void {
        if (this.isBrowser) {
            Logger.debug('Opening Notifications modal from banner');
            this.modalService.open(NotificationsListComponent, {
                inputs: {
                    image: 'images/notifications/notifications.png',
                    title: 'notifications',
                    subtitle: 'notifications_subtitle',
                    data: {}
                },
                outputs: {
                    closed: (data: { isSaved: boolean } | void): void => {
                        Logger.debug('Notifications Modal closed from banner with data:', data);
                    }
                },
                width: '70%',
                minHeight: '50%',
                maxHeight: '70%'
            });
        }
    }

    private openPointsModal(): void {
        if (this.isBrowser) {
            Logger.debug('Opening Points modal from banner');
            this.modalService.open(SettingsPointsComponent, {
                inputs: {
                    image: 'images/settings/modal-icons/points.png',
                    title: 'settings.points.title',
                    subtitle: 'settings.points.subtitle',
                    data: {}
                },
                outputs: {
                    closed: (data: { status: boolean; data: any }) => {
                        Logger.debug('Points Modal closed from banner. Status:', data.status, 'Data:', data.data);
                    }
                },
                width: '60%'
            });
        }
    }

    private openFavoritesModal(): void {
        if (this.isBrowser) {
            Logger.debug('Opening Favorites modal from banner');
            this.modalService.open(MyFavouritesComponent, {
                inputs: {
                    image: 'images/settings/modal-icons/my-favourites.png',
                    title: 'settings.myFavourites.title',
                    subtitle: 'settings.myFavourites.subtitle',
                    data: {}
                },
                outputs: {
                    closed: (data: { status: boolean; data: any }) => {
                        Logger.debug('Favorites Modal closed from banner. Status:', data.status, 'Data:', data.data);
                    }
                },
                width: '60%',
                minHeight: '40%',
                maxHeight: '80%'
            });
        }
    }

    private openFaqsModal(): void {
        if (this.isBrowser) {
            Logger.debug('Opening FAQs modal from banner');
            this.modalService.open(SettingFaqsComponent, {
                inputs: {
                    image: 'images/settings/modal-icons/faqs.png',
                    title: 'settings.settingFaqs.title',
                    subtitle: 'settings.settingFaqs.subtitle',
                    data: {}
                },
                outputs: {
                    closed: (data: { status: boolean; data: any }) => {
                        Logger.debug('FAQs Modal closed from banner. Status:', data.status, 'Data:', data.data);
                    }
                },
                width: '60%'
            });
        }
    }

    private openImportantNumbersModal(): void {
        if (this.isBrowser) {
            Logger.debug('Opening Important Numbers modal from banner');
            this.modalService.open(ImportantNumbersComponent, {
                inputs: {
                    image: 'images/settings/modal-icons/important-numbers.png',
                    title: 'settings.importantNumbers.title',
                    subtitle: 'settings.importantNumbers.subtitle',
                    data: {}
                },
                outputs: {
                    closed: (data: { status: boolean; data: any }) => {
                        Logger.debug('Important Numbers Modal closed from banner. Status:', data.status, 'Data:', data.data);
                    }
                },
                width: '60%'
            });
        }
    }

    private openProblemsModal(): void {
        if (this.isBrowser) {
            Logger.debug('Opening Problems (Complaints) modal from banner');
            this.modalService.open(ComplaintsListComponent, {
                inputs: {
                    image: 'images/settings/modal-icons/complaints.png',
                    title: 'settings.complaintsList.title',
                    subtitle: 'settings.complaintsList.subtitle',
                    data: {}
                },
                outputs: {
                    closed: (data: { status: boolean; data: any }) => {
                        Logger.debug('Problems Modal closed from banner. Status:', data.status, 'Data:', data.data);
                    }
                },
                width: '60%'
            });
        }
    }

    private openContactUsWhatsApp(): void {
        if (this.isBrowser) {
            Logger.debug('Opening Contact Us (WhatsApp) from banner');
            const phoneNumber = '966552272756';
            const url = `https://wa.me/${phoneNumber}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }

    private navigateToLink(link: string): void {
        if (this.isBrowser) {
            window.open(link, '_blank');
        }
    }

    private getRouteForPage(page: string): string | null {
        const pageRouteMap: Record<string, string> = {
            [BannerPageType.SUPPORT_SESSIONS]: SupportGroupsRoutesEnum.SUPPORT_GROUPS_ROUTES,
            [BannerPageType.BOOK_APPOINTMENT]: BookAppointmentRoutesEnum.BOOK_APPOINTMENT_MAIN_PAGE,
            [BannerPageType.PODCAST]: PodcastRoutesEnum.PODCASTSMAINPAGE,
            [BannerPageType.ARTICLES]: ArticlesRoutesEnum.ARTICLES_MAIN_PAGE,
            [BannerPageType.TALBINAH_COMMUNITY]: TalbinahCommunityRoutesEnum.TALBINAH_COMMUNITY_MAIN_PAGE,
            [BannerPageType.MENTAL_HEALTH_SCALES]: MentalHealthScalesRoutesEnum.MENTALHEALTSCALESMAINPAGE,
            [BannerPageType.THERAPEUTIC_PROGRAMS]: TherapeuticProgramsRoutesEnum.THERAPEUTIC_PROGRAMS_MAIN_PAGE,
            [BannerPageType.KHAWIIK]: KhawiikBotRoutesEnum.KHAWIIK_MAIN_PAGE,
            [BannerPageType.SUPPORT_GROUPS]: SupportGroupsRoutesEnum.SUPPORT_GROUPS_ROUTES,
            [BannerPageType.APPOINTMENTS]: AppointmentsRoutesEnum.APPOINTMENTS_MAIN_PAGE,
            [BannerPageType.URGENT_APPOINTMENT]: UrgentAppointmentRoutesEnum.URGENT_APPOINTMENT_MAIN_PAGE,
            [BannerPageType.SETTINGS]: SettingsRoutesEnum.SETTINGS_MAIN_PAGE,
            [BannerPageType.PROFILE]: TalbinahCommunityRoutesEnum.USER_COMMUNITY_PROFILE
        };

        return pageRouteMap[page] || null;
    }

    protected onImageError(event: Event): void {
        const img = event.target as HTMLImageElement;
        img.src = 'images/home/home.png'; // Fallback image
    }
}

