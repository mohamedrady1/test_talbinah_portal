import { Component, inject, signal, ElementRef, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ILayoutGridHeaderConfig, ModalService, MoodModalIntegrationService } from '../../../../shared';
import { AppointmentsHeaderConfig } from '../../constants';
import { MainPageRoutesEnum } from '../../../main-page';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SiteHeaderComponent } from '../../../header';

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
  @ViewChild('card') cardRef!: ElementRef<HTMLElement>;
  readonly cardSignal = signal<ElementRef<HTMLElement> | null>(null); // 🔁 create signal
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

  protected onCloseRequested(): void {
    this.router.navigate([`/${MainPageRoutesEnum.MAINPAGE}`]);
  }
}
