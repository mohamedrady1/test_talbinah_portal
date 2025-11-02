import { Component, inject, signal, ElementRef, ChangeDetectionStrategy, ViewChild, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ILayoutGridHeaderConfig, LocalizationService, ModalService, MoodModalIntegrationService } from '../../../../shared';
import { AppointmentsHeaderConfig, AppointmentsRouteData } from '../../constants';
import { MainPageRoutesEnum } from '../../../main-page';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SiteHeaderComponent } from '../../../header';
import { MetadataService } from '../../../../common';

@Component({
  selector: 'app-appointments-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SiteHeaderComponent,
  ],
  templateUrl: './appointments-layout.component.html',
  styleUrls: ['./appointments-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsLayoutComponent {
  readonly isFullscreen = signal(false);
  readonly headerConfig: ILayoutGridHeaderConfig = AppointmentsHeaderConfig;
  private readonly modalService = inject(ModalService)
  private readonly router = inject(Router);
  private readonly moodModalIntegrationService = inject(MoodModalIntegrationService);
  private readonly seo = inject(MetadataService);
  private readonly localization = inject(LocalizationService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  @ViewChild('card') cardRef!: ElementRef<HTMLElement>;
  readonly cardSignal = signal<ElementRef<HTMLElement> | null>(null); // 🔁 create signal
  
  constructor() {
    this.setupSEO();
  }

  ngOnInit() {
    // this.modalService.open(CommingSoonComponent, {
    //   width: '50%',
    //   outputs: {
    //     closed: () => {
    //       console.log('The model is closed');
    //     }
    //   }
    // })
  }

  ngAfterViewInit(): void {
    // this.moodModalIntegrationService.checkMoodModal();

    this.cardSignal.set(this.cardRef); // ✅ update when ViewChild is ready
  }

  private setupSEO(): void {
    const { title, meta } = AppointmentsRouteData.AppointmentsMainPage;
    const lang = this.localization.getCurrentLanguage() as keyof typeof title;
    
    this.seo.setMetaTags({
      title: title[lang],
      description: meta.description[lang],
      keywords: 'appointments, sessions, therapy, talbinah, مواعيد, جلسات, علاج نفسي, تلبينة',
      image: 'https://talbinah.net/dashboard_assets/Talbinah.png',
      url: 'https://talbinah.com/appointments',
      robots: 'index, follow',
      locale: lang === 'ar' ? 'ar_SA' : 'en_US',
      canonical: 'https://talbinah.com/appointments',
    });
  }

  protected onCloseRequested(): void {
    if (!this.isBrowser) return;
    this.router.navigate([`/${MainPageRoutesEnum.MAINPAGE}`]);
  }
}
