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

  constructor() {
    this.setupSEO();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // this.moodModalIntegrationService.checkMoodModal();
  }

  private setupSEO(): void {
    const { title, meta } = ArticlesRouteData.ArticlesMainPage;
    const lang = this.localization.getCurrentLanguage() as keyof typeof title;
    
    this.seo.setMetaTags({
      title: title[lang],
      description: meta.description[lang],
      keywords: 'articles, mental health, wellness, talbinah, مقالات, صحة نفسية, تلبينة',
      image: 'https://talbinah.net/dashboard_assets/Talbinah.png',
      url: 'https://talbinah.com/articles',
      robots: 'index, follow',
      locale: lang === 'ar' ? 'ar_SA' : 'en_US',
      canonical: 'https://talbinah.com/articles',
    });
  }

  protected onCloseRequested(): void {
    if (!this.isBrowser) return;
    this.router.navigate([`/${MainPageRoutesEnum.MAINPAGE}`]);
  }
}
