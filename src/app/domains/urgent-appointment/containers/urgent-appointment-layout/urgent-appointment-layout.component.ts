import { Component, inject, signal, ElementRef, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ILayoutGridHeaderConfig, PageLayoutHeaderComponent } from '../../../../shared';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { BookUrgentAppointmentComponent } from '../../components';
import { UrgentAppointmentHeaderConfig } from '../../constants';
import { MainPageRoutesEnum } from '../../../main-page';
import { SiteHeaderComponent } from '../../../header';
import { CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-urgent-appointment-layout',
  standalone: true,
  imports: [
    CommonModule,
    AutoExactHeightDirective,
    SiteHeaderComponent,
    PageLayoutHeaderComponent,
    BookUrgentAppointmentComponent
  ],
  templateUrl: './urgent-appointment-layout.component.html',
  styleUrls: ['./urgent-appointment-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UrgentAppointmentLayoutComponent {
  readonly isFullscreen = signal(false); // Optional: Can be removed if header manages state independently
  readonly headerConfig: ILayoutGridHeaderConfig = UrgentAppointmentHeaderConfig;

  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('card') cardRef!: ElementRef<HTMLElement>;

  protected onCloseRequested(): void {
    this.router.navigate([`/${MainPageRoutesEnum.MAINPAGE}`]);
  }
}
