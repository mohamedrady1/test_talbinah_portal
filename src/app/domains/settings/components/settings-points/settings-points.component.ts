import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
// import { Logger } from '../../../../common';
import { WalletPointsRecordsFacade } from '../../services/wallet-points-records.facade';
import { PointsFacade } from '../../services/wallet-points-welcome-page.facade';
import { ServicePointsGiftsFacade } from '../../services/service-points-gifts.facade';
import { PointsHistoryComponent } from '../points-history/points-history.component';
import { POINTS_EMPTY_STATE_CONFIG, POINTS_ERROR_STATE_CONFIG } from '../../configs/points.config';
import { ServiceModalComponent } from '../service-modal/service-modal.component';
import { ServicesComponent } from '../services/services.component';
import { LoadingShimmerComponent } from '../../../../shared/components/loading-shimmer/loading-shimmer.component';
import { ModalService } from '../../../../shared/services/model.service';
import { ErrorStateCardComponent } from '../../../../shared/components/error-state-card/error-state-card.component';
import { EmptyStateCardComponent } from '../../../../shared/components/empty-state-card/empty-state-card.component';
import { AutoExactHeightDirective } from '../../../../common';
import { SvgIconComponent } from "../../../../shared";
import { SettingsRewardsComponent } from '../settings-rewards';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-settings-points',
  standalone: true,
  imports: [
    TranslateModule,
    EmptyStateCardComponent,
    ErrorStateCardComponent,
    LoadingShimmerComponent,
    AutoExactHeightDirective,
    SvgIconComponent
  ],
  templateUrl: './settings-points.component.html',
  styleUrls: ['./settings-points.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPointsComponent {
  private readonly servicePointsGiftsFacade = inject(ServicePointsGiftsFacade);
  private readonly pointsRecords = inject(WalletPointsRecordsFacade);
  private readonly pointsFacade = inject(PointsFacade);
  private readonly _modalService = inject(ModalService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly _router = inject(Router);
  readonly services = this.pointsFacade.services;
  readonly isLoadingServices = this.pointsFacade.isLoading;
  readonly errorMessageServices = this.pointsFacade.errorMessage;
  readonly statusServices = this.pointsFacade.status;
  readonly bannerTitle = this.pointsFacade.title;
  readonly bannerDescription = this.pointsFacade.description;

  readonly items = this.servicePointsGiftsFacade.items;
  readonly isLoading = this.servicePointsGiftsFacade.isLoading;
  readonly errorMessage = this.servicePointsGiftsFacade.errorMessage;
  readonly pointsRecordsBalance = this.pointsRecords.balance;

  // State configurations
  readonly emptyStateConfig = POINTS_EMPTY_STATE_CONFIG;
  readonly errorStateConfig = POINTS_ERROR_STATE_CONFIG;

  // State methods
  readonly hasError = () => this.errorMessage() !== null;
  readonly isEmpty = () => this.items().length === 0;

  ngOnInit(): void {
    this.pointsFacade.fetchPoints();
    this.servicePointsGiftsFacade.fetchServicePointsGifts();
    this.pointsRecords.fetchWalletPoints();
  }
  openPointsHistory() {
    this._modalService.open(PointsHistoryComponent, {
      inputs: {
        image: 'images/settings/modal-icons/points.png',
        title: 'settings.points.title',
        subtitle: 'settings.points.subtitle',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          // Logger.debug('Points Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "60%"
    });
  }
  openServices(): void {
    this._modalService.open(ServicesComponent, {
      inputs: {
        image: 'images/settings/modal-icons/points.png',
        title: 'settings.points.title',
        subtitle: 'settings.points.subtitle'
      },
      width: "60%"
    });
  }
  onRetry(): void {
    this.servicePointsGiftsFacade.fetchServicePointsGifts();
  }

  openServiceModal(service: any): void {
    this._modalService.open(ServiceModalComponent, {
      inputs: {
        image: 'images/logos/icon.png',
        title: 'userInfo.changePoints',
        service: service
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          // Logger.debug('Service Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "40%"
    });
  }

  protected openRewards(): void {
    this._modalService.open(SettingsRewardsComponent, {
      inputs: {
        image: 'images/settings/gift/settings-reward.png',
        title: 'settings.rewards.title',
        subtitle: 'settings.rewards.subtitle',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          // Logger.debug('Points Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "60%"
    });
  }
  ngOnDestroy(): void {
    if (this.isBrowser) {
      const currentUrl = this._router.url;
      if (currentUrl === '/' || currentUrl === '/home') {
        document.body.style.overflow = '';
      }
    }
  }
}
