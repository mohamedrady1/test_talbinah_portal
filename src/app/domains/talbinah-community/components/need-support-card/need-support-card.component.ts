import { SelectAppointmentTypeComponent } from '../../../book-appointment';
import { SelectAppointmentTypeConfig } from '../../../urgent-appointment';
import { ModalService, SvgIconComponent } from '../../../../shared';
import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { KhawiikBotRoutesEnum } from '../../../talbinah-bot';
import { TranslateModule } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { Logger } from '../../../../common';
import { Router } from '@angular/router';
import { TranslateApiPipe } from '../../../../common/core/translations';
@Component({
  selector: 'app-need-support-card',
  standalone: true,
  imports: [TranslateModule, SvgIconComponent, TranslateApiPipe],
  templateUrl: './need-support-card.component.html',
  styleUrls: ['./need-support-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NeedSupportCardComponent {
  private router = inject(Router);
  private modalService = inject(ModalService);
  private platformId = inject(PLATFORM_ID);

  protected goToTalbinahBot(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.router.navigateByUrl(KhawiikBotRoutesEnum.KHAWIIK_MAIN_PAGE);
    }
  }

  protected goToBookAppointment(type: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.modalService.open(SelectAppointmentTypeComponent, {
        width: '35%',
        minHeight: '20rem',
        maxHeight: '70rems',
        inputs: {
          ...SelectAppointmentTypeConfig,
          type: type
        },
        outputs: {
          closed: (): void => {
            Logger.debug('The modal is closed');
          }
        },
        isPhoneFromDown: true
      });
    }
  }
}
