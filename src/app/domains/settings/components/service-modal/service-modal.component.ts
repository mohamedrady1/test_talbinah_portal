import { Component, Input, Output, EventEmitter, inject, effect, EffectRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { StatusInfoComponent } from '../../../payments/components/status-info/status-info.component';
import { WalletPointsToCouponFacade } from '../../services/wallet-points-to-coupon.facade';
import { ModalService } from '../../../../shared/services/model.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Logger } from '../../../../common';

@Component({
  selector: 'app-service-modal',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './service-modal.component.html',
  styleUrls: ['./service-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceModalComponent implements OnDestroy {
  @Input() service: any;
  @Output() closed = new EventEmitter<{ status: boolean, data: any }>();

  private readonly _walletFacade = inject(WalletPointsToCouponFacade);
  private readonly _modalService = inject(ModalService);

  readonly isLoading = this._walletFacade.isLoading;
  readonly success = this._walletFacade.success;
  readonly errorMessage = this._walletFacade.errorMessage;
  readonly response = this._walletFacade.response;

  private hasHandledResult = false;
  private effectCleanup: EffectRef | null = null;

  constructor() {
    this.effectCleanup = effect(() => {
      if (this.isLoading()) return;

      if (this.hasHandledResult) return;

      if (this.success()) {
        this.hasHandledResult = true;
        this.openSuccessModal();
      } else if (this.errorMessage()) {
        this.hasHandledResult = true;
        this.openErrorModal();
      }
    });
  }

  onConfirm(): void {
    if (this.service?.points) {
      this.hasHandledResult = false;
      this._walletFacade.convertPointsToCoupon(this.service.points);
    }
  }

  onCancel(): void {
    this._walletFacade.resetState();
    this.hasHandledResult = false;
    this.closed.emit({ status: false, data: null });
  }

  onClose(): void {
    this._walletFacade.resetState();
    this.hasHandledResult = false;
    this.closed.emit({ status: false, data: null });
  }

  onSuccessClose(): void {
    this._walletFacade.resetState();
    this.hasHandledResult = false;
    this.closed.emit({ status: true, data: this.response() });
  }

  private openSuccessModal(): void {
    this._modalService.open(StatusInfoComponent, {
      inputs: {
        image: 'images/mentalHealthScale/icons/talbinah.png',
        title: 'general.pointsConvertedSuccessfully',
        statusTitleKey: 'general.pointsConvertedSuccessfully',
        data: {
          statusLabels: {
            successTitle: 'general.pointsConvertedSuccessfully',
          },
          item: {
            storeSuccess: true,
            response: this.response()
          }
        }
      },
      outputs: {
        closed: () => {
          this._walletFacade.resetState();
          Logger.debug('Success modal closed');
          this.onSuccessClose();
        }
      },
      width: '40%',
      isPhoneFromDown: true,
      minHeight: '10rem',
      maxHeight: '60rem',
    });
  }

  private openErrorModal(): void {
    this._modalService.open(StatusInfoComponent, {
      inputs: {
        image: 'images/mentalHealthScale/icons/talbinah.png',
        title: 'general.pointsConversionFailed',
        statusTitleKey: 'general.pointsConversionFailed',
        data: {
          statusLabels: {
            successTitle: 'general.pointsConversionFailed',
          },
          item: {
            storeSuccess: false,
            errorMessage: this.errorMessage()
          }
        }
      },
      outputs: {
        closed: () => {
          this._walletFacade.resetState();
          Logger.debug('Error modal closed');
          this.onClose();
        }
      },
      width: '40%',
      isPhoneFromDown: true,
      minHeight: '10rem',
      maxHeight: '60rem',
    });
  }

  ngOnDestroy(): void {
    if (this.effectCleanup) {
      this.effectCleanup.destroy();
      this.effectCleanup = null;
    }
    this.closed.complete();
    this.closed.unsubscribe();
  }
}
