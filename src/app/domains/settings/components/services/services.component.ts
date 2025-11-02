import { EmptyStateCardComponent } from '../../../../shared/components/empty-state-card/empty-state-card.component';
import { ErrorStateCardComponent } from '../../../../shared/components/error-state-card/error-state-card.component';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicePointsGiftsFacade } from '../../services/service-points-gifts.facade';
import { Logger } from '../../../../common';
import { AutoExactHeightDirective } from '../../../../common';
import { ServiceModalComponent } from '../service-modal';
import { ModalService } from '../../../../shared/services/model.service';
import { SvgIconComponent } from "../../../../shared";
import { TranslationsFacade } from '../../../../common/core/translations/services';
@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, AutoExactHeightDirective, EmptyStateCardComponent, ErrorStateCardComponent, SvgIconComponent, ],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesComponent implements OnInit {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  
  private readonly _modalService = inject(ModalService);
  private readonly _servicePointsGiftsFacade = inject(ServicePointsGiftsFacade);

  readonly items = this._servicePointsGiftsFacade.items;
  readonly isLoading = this._servicePointsGiftsFacade.isLoading;
  readonly errorMessage = this._servicePointsGiftsFacade.errorMessage;

  // State configurations
  readonly emptyStateConfig = {
    imageUrl: '/images/emptyStates/services.svg',
    title: 'no_services_available',
    message: 'no_services_found_yet'
  };

  readonly errorStateConfig = {
    imageUrl: '/images/errorStates/services.svg',
    title: 'services_loading_error',
    message: 'services_loading_error_retry',
    retryLabel: 'common.retry',
    onRetry: () => this.loadServices()
  };

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this._servicePointsGiftsFacade.fetchServicePointsGifts();
  }

  onRetry(): void {
    this.loadServices();
  }

  openServiceModal(service: any): void {
    this._modalService.open(ServiceModalComponent, {
      inputs: {
        image: 'images/logos/icon.png',
        title: 'points_redemption',
        service: service
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Service Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "40%"
    });
  }

  // State methods
  readonly hasError = () => this.errorMessage() !== null;
  readonly isEmpty = () => this.items().length === 0;
} 

