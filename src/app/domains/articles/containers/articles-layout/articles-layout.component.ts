import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ILayoutGridHeaderConfig, MoodModalIntegrationService, PageLayoutHeaderComponent } from '../../../../shared';
import { ArticlesHeaderConfig } from '../../constants/articles-header.config';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
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
  @ViewChild('card') cardRef!: ElementRef<HTMLElement>;

  protected onCloseRequested(): void {
    this.router.navigate([`/${MainPageRoutesEnum.MAINPAGE}`]);
  }

  ngAfterViewInit(): void {
    // this.moodModalIntegrationService.checkMoodModal();
  }
}
