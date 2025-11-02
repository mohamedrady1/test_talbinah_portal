import { Component, ElementRef, inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { MainPageRoutesEnum } from '../../../main-page';
import { HeaderConfig } from '../../data/header.config';
import { Router, RouterModule } from '@angular/router';
import { SiteHeaderComponent } from '../../../header';
import { isPlatformBrowser } from '@angular/common';
import { IHeaderConfig } from '../../models';
import { HeaderComponent } from '../../../../shared';

@Component({
  selector: 'app-therapeutic-programs-layout',
  standalone: true,
  imports: [
    SiteHeaderComponent,
    HeaderComponent,
    RouterModule,
    AutoExactHeightDirective
  ],
  templateUrl: './therapeutic-programs-layout.component.html',
  styleUrls: ['./therapeutic-programs-layout.component.scss']
})
export class TherapeuticProgramsLayoutComponent {
  headerConfig: IHeaderConfig = HeaderConfig;
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  @ViewChild('card') cardRef!: ElementRef;
  isFullscreen: boolean = false;

  protected goHome(): void {
    if (!this.isBrowser) return;
    this.router.navigate([MainPageRoutesEnum.MAINPAGE]);
  }

  protected toggleFullscreen(): void {
    if (isPlatformBrowser(this.platformId)) {
      const cardEl = this.cardRef.nativeElement;
      if (!document.fullscreenElement) {
        cardEl.requestFullscreen().then(() => {
          this.isFullscreen = true;
        }).catch((err: any) => {
          console.error('فشل في التكبير:', err);
          this.isFullscreen = false;
        });
      } else {
        document.exitFullscreen().then(() => {
          this.isFullscreen = false;
        });
      }
    }
  }
}
