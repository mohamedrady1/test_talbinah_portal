import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ModalService } from '../../services/model.service';
import { ProgramSubscriptionPopupComponent } from '../../../domains/therapeutic-programs';
import { TranslateModule } from '@ngx-translate/core';
// import { ProgramSubscriptionPopupComponent } from '../../../domains/therapeutic-programs';

@Component({
  selector: 'app-confirm-subscription',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './confirm-subscription.component.html',
  styleUrls: ['./confirm-subscription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmSubscriptionComponent {
  private modalService = inject(ModalService)

  openSubscriptionModal() {
    // this.modalService.open(ProgramSubscriptionPopupComponent, {
    //   inputs: {
    //     image: 'images/mentalHealthScale/icons/talbinah.png',
    //     title: 'supportGroups.confirmSubscription',
    //     // status: 'success',
    //   },
    //   outputs: {
    //     closed: () => {
    //       console.log('The model is closed');
    //     }
    //   }
    // });
  }
}
