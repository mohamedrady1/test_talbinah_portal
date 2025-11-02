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

  ngOnInit(): void {
    // Setup SEO metadata
    if (this.isBrowser) {
      this.setupSEO();
    }
  }

  ngAfterViewInit(): void {
    this.cardSignal.set(this.cardRef); // ✅ update when ViewChild is ready

    // Show mood modal on book appointment page (if conditions are met)
    // this.moodModalIntegrationService.checkMoodModal();
  }

  private setupSEO(): void {
    if (!this.isBrowser) return;

    const lang = this.localization.getCurrentLanguage();
    const routeData = BookAppointmentRouteData.BookAppointmentMainPage;

    const title = lang === 'ar' ? routeData.title.ar : routeData.title.en;
    const description = lang === 'ar' ? routeData.meta.description.ar : routeData.meta.description.en;

    this.seo.setMetaTags({
      title,
      description,
      locale: lang === 'ar' ? 'ar_SA' : 'en_US'
    });
  }

  protected onCloseRequested(): void {
    this.router.navigate([`/${MainPageRoutesEnum.MAINPAGE}`]);
  }
}
