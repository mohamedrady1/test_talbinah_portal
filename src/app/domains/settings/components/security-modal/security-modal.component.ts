import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ModalService } from '../../../../shared';
import { VatNationalIdVerificationComponent } from '../vat-national-id-verification';
import { Logger } from '../../../../common';
import { ChangePasswordComponent } from '../change-password';

@Component({
  selector: 'app-security-modal',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './security-modal.component.html',
  styleUrls: ['./security-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecurityModalComponent {
  private readonly _modalService = inject(ModalService);
  @Output() public closed = new EventEmitter<void>();

  openNationalIdVerificationModal(): void {
    this._modalService.closeAll();
    this._modalService.open(VatNationalIdVerificationComponent, {
      inputs: {
        image: 'images/settings/modal-icons/security.png',
        title: 'settings.security.title',
        subtitle: 'settings.security.subtitle',
        data: {}
      },
      width: "40%",
      isPhoneFromDown: true
    });

  }
  openChangePasswordModal(): void {
    this._modalService.closeAll();

    this._modalService.open(ChangePasswordComponent, {
      inputs: {
        image: 'images/settings/modal-icons/security.png',
        title: 'settings.changePassword.title',
        subtitle: 'settings.changePassword.subtitle',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Change Password Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "40%",
      isPhoneFromDown: true
    });
    this.closed.emit();
  }

}
