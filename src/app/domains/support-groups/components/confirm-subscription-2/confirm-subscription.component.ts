import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ModalService } from '../../../../shared';
import { ProgramSubscriptionPopupComponent } from '../../../therapeutic-programs';

@Component({
  selector: 'app-confirm-subscription-2',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './confirm-subscription.component.html',
  styleUrls: ['./confirm-subscription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmSubscription2Component {
  private modalService = inject(ModalService);

  openSubscriptionModal() {
    this.modalService.open(ProgramSubscriptionPopupComponent, {
      inputs: {
        image: 'images/mentalHealthScale/icons/talbinah.png',
        title: 'confirm_subscription',
        status: 'success',
      },
      outputs: {
        closed: () => {
          console.log('The model is closed');
        }
      }
    });
  }
}
