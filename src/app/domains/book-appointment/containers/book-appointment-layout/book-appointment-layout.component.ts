import { Component, inject, signal, ElementRef, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ILayoutGridHeaderConfig, MoodModalIntegrationService, PageLayoutHeaderComponent } from '../../../../shared';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { DoctorsListingForBookingComponent } from '../../components';
import { BookAppointmentHeaderConfig } from '../../constants';
import { MainPageRoutesEnum } from '../../../main-page';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SiteHeaderComponent } from '../../../header';

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

  @ViewChild('card') cardRef!: ElementRef<HTMLElement>;
  readonly cardSignal = signal<ElementRef<HTMLElement> | null>(null); // 🔁 create signal

  ngAfterViewInit(): void {
    this.cardSignal.set(this.cardRef); // ✅ update when ViewChild is ready

    // Show mood modal on book appointment page (if conditions are met)
    // this.moodModalIntegrationService.checkMoodModal();
  }

  protected onCloseRequested(): void {
    this.router.navigate([`/${MainPageRoutesEnum.MAINPAGE}`]);
  }
}
