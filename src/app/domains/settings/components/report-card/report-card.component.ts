import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ComplaintsListComponent } from '../complaints-list';
import { ModalService } from '../../../../shared';
import { Logger } from '../../../../common';
import { TranslateApiPipe } from '../../../../common/core/translations';
@Component({
  selector: 'app-report-card',
  standalone: true,
  imports: [TranslateApiPipe],
  templateUrl: './report-card.component.html',
  styleUrls: ['./report-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportCardComponent {
  private readonly _modalService = inject(ModalService);
  protected openComplaintsListModal(): void {
    this._modalService.open(ComplaintsListComponent, {
      inputs: {
        image: 'images/settings/modal-icons/complaints.png',
        title: 'complaints',
        subtitle: 'your_voice_matters_description',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Complaints List Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "60%"
    });
  }
}
