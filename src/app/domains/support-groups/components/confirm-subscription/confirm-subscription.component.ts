import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SupportGroupSubscriptionComponent } from '../support-group-subscription';
import { ModalService } from '../../../../shared';
import { SubscribeSuccessfullyComponent } from '../subscribe-successfully';

@Component({
  selector: 'app-confirm-subscription',
  standalone: true,
  imports: [SubscribeSuccessfullyComponent],
  templateUrl: './confirm-subscription.component.html',
  styleUrls: ['./confirm-subscription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmSubscriptionComponent {
  private modalService = inject(ModalService)
  openSubscriptionModal() {
    this.modalService.open(SupportGroupSubscriptionComponent, {
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
