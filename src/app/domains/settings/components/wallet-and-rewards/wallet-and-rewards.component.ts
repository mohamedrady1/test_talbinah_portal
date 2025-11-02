import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ModalService } from '../../../../shared/services/model.service';
import { Logger } from '../../../../common/core/utilities/logging/logger';
import { WalletComponent } from '../wallet';
import { ISettingMenuItem } from '../../dtos';
import { ChargeWalletComponent } from '../charge-wallet';
import { ServicesComponent } from '../services';
import { SettingsPointsComponent } from '../settings-points';

@Component({
  selector: 'app-wallet-and-rewards',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './wallet-and-rewards.component.html',
  styleUrls: ['./wallet-and-rewards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletAndRewardsComponent {
  @Input() userInfo!: ISettingMenuItem;
  private readonly _modalService = inject(ModalService);
  ngOnInit(): void {
    console.log(this.userInfo);
  }
  protected openWalletPaymentModal(event: Event): void {
    event.stopPropagation();
    this._modalService.open(ChargeWalletComponent, {
      inputs: {
        image: 'images/logos/icon.png',
        title: 'PaymentMethods.depositAmount',
      },
      width: '40%',
      isPhoneFromDown: true
    });
  }
  protected openPointsServicesModal(event: Event): void {
    event.stopPropagation();
    this._modalService.open(ServicesComponent, {
      inputs: {
        image: 'images/settings/modal-icons/points.png',
        title: 'settings.points.title',
        subtitle: 'settings.points.subtitle'
      },
      width: "60%"
    });
  }
  protected openWalletModal(): void {
    this._modalService.open(WalletComponent, {
      inputs: {
        image: 'images/settings/modal-icons/wallet.png',
        title: 'settings.wallet.title',
        subtitle: 'settings.wallet.subtitle',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Wallet Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "60%",
      height: "80%"
    });
  }
  protected openPointsModal(): void {
    this._modalService.open(SettingsPointsComponent, {
      inputs: {
        image: 'images/settings/modal-icons/points.png',
        title: 'settings.points.title',
        subtitle: 'settings.points.subtitle',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Points Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "60%"
    });
  }
}
