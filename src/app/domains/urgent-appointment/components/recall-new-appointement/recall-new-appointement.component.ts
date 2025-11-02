import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateApiPipe } from '../../../../common/core/translations';
import { Logger, useNavigation } from '../../../../common';
import { ModalService } from '../../../../shared';
import { BookUrgentAppointmentComponent } from '../book-urgent-appointment';
import { UrgentAppointmentHeaderConfig } from '../../constants';

@Component({
  selector: 'app-recall-new-appointement',
  standalone: true,
  imports: [CommonModule, TranslateApiPipe],
  templateUrl: './recall-new-appointement.component.html',
  styleUrls: ['./recall-new-appointement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecallNewAppointementComponent {
  private readonly _modalService = inject(ModalService);
  @Input() title: string = 'request_expired_urgent_appointment_canceled';

  // --- Properties for HTML bindings ---
  isSubmitting: boolean = false;

  // ID for the submit button, if dynamically set
  submitButtonId: string = 'recall-submit-button';

  @Input()
  public data: any;

  @Output() closed = new EventEmitter<any>();
  private readonly nav = useNavigation();

  // --- Output Events to communicate with parent component ---
  @Output() recallAction = new EventEmitter<void>();

  constructor() {
    // Constructor logic, if any
  }
  // --- Methods for button actions ---
  protected onCancelButtonClick(): void {
    // this.nav.navigate(NavigationIntent.INTERNAL, MainPageRoutesEnum.MAINPAGE);
    this._modalService.closeAll();
  }

  protected RecallAction(): void {
    this.closed.emit();
    // this.recallAction.emit();
    this._modalService.open(BookUrgentAppointmentComponent, {
      width: '50%',
      inputs: {
        ...UrgentAppointmentHeaderConfig
      },
      outputs: {
        closed: (): void => {
          Logger.debug('The modal is closed');
        },
      },
    });
  }
}
