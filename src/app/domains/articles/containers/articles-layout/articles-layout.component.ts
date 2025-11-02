import { ChangeDetectionStrategy, Component, ElementRef, inject, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ILayoutGridHeaderConfig, LocalizationService, MoodModalIntegrationService, PageLayoutHeaderComponent } from '../../../../shared';
import { ArticlesHeaderConfig, ArticlesRouteData } from '../../constants';
import { AutoExactHeightDirective, MetadataService } from '../../../../common';
import { MainPageRoutesEnum } from '../../../main-page';
import { Router, RouterModule } from '@angular/router';
import { SiteHeaderComponent } from '../../../header';

@Component({
  selector: 'app-articles-layout',
  standalone: true,
  imports: [
    SiteHeaderComponent,
    RouterModule,
    AutoExactHeightDirective,
    PageLayoutHeaderComponent
  ],
  templateUrl: './articles-layout.component.html',
  styleUrls: ['./articles-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ArticlesLayoutComponent {
  readonly isFullscreen = signal(false); // Optional: Can be removed if header manages state independently
  readonly headerConfig: ILayoutGridHeaderConfig = ArticlesHeaderConfig;

  private readonly router = inject(Router);
  private readonly moodModalIntegrationService = inject(MoodModalIntegrationService);
  private readonly seo = inject(MetadataService);
  private readonly localization = inject(LocalizationService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  @ViewChild('card') cardRef!: ElementRef<HTMLElement>;

  ngOnInit(): void {
    // Setup SEO metadata
    if (this.isBrowser) {
      this.setupSEO();
    }
  }

  ngAfterViewInit(): void {
    // this.moodModalIntegrationService.checkMoodModal();
  }

  private setupSEO(): void {
    if (!this.isBrowser) return;

    const lang = this.localization.getCurrentLanguage();
    const routeData = ArticlesRouteData.ArticlesMainPage;

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
