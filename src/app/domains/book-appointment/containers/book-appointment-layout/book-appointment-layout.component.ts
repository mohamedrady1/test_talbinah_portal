import { Component, inject, signal, ElementRef, ChangeDetectionStrategy, ViewChild, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ILayoutGridHeaderConfig, LocalizationService, MoodModalIntegrationService, PageLayoutHeaderComponent } from '../../../../shared';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { DoctorsListingForBookingComponent } from '../../components';
import { BookAppointmentHeaderConfig, BookAppointmentRouteData } from '../../constants';
import { MainPageRoutesEnum } from '../../../main-page';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SiteHeaderComponent } from '../../../header';
import { MetadataService } from '../../../../common';

@Component({
  selector: 'app-book-appointment-layout',
  standalone: true,
  imports: [
    CommonModule,
    AutoExactHeightDirective,
    SiteHeaderComponent,
    PageLayoutHeaderComponent,
    DoctorsListingForBookingComponent
  ],
  templateUrl: './book-appointment-layout.component.html',
  styleUrls: ['./book-appointment-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookAppointmentLayoutComponent {
  readonly isFullscreen = signal(false);
  readonly headerConfig: ILayoutGridHeaderConfig = BookAppointmentHeaderConfig;
  private readonly moodModalIntegrationService = inject(MoodModalIntegrationService);
  private readonly router = inject(Router);
  private readonly seo = inject(MetadataService);
  private readonly localization = inject(LocalizationService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  @ViewChild('card') cardRef!: ElementRef<HTMLElement>;
  readonly cardSignal = signal<ElementRef<HTMLElement> | null>(null); // 🔁 create signal

  constructor() {
    this.setupSEO();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.cardSignal.set(this.cardRef); // ✅ update when ViewChild is ready

    // Show mood modal on book appointment page (if conditions are met)
    // this.moodModalIntegrationService.checkMoodModal();
  }

  private setupSEO(): void {
    const { title, meta } = BookAppointmentRouteData.BookAppointmentMainPage;
    const lang = this.localization.getCurrentLanguage() as keyof typeof title;
    
    this.seo.setMetaTags({
      title: title[lang],
      description: meta.description[lang],
      keywords: 'book appointment, doctors, therapy sessions, talbinah, حجز موعد, أطباء, جلسات علاج, تلبينة',
      image: 'https://talbinah.net/dashboard_assets/Talbinah.png',
      url: 'https://talbinah.com/book-appointment',
      robots: 'index, follow',
      locale: lang === 'ar' ? 'ar_SA' : 'en_US',
      canonical: 'https://talbinah.com/book-appointment',
    });
  }

  protected onCloseRequested(): void {
    if (!this.isBrowser) return;
    this.router.navigate([`/${MainPageRoutesEnum.MAINPAGE}`]);
  }
}
