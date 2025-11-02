import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { IGlobalReservationModel } from '../../../appointments/models';
import { FileViewerComponent } from '../../../talbinah-bot';
import { DownloadableFile } from '../../../talbinah-bot/models';

@Component({
  selector: 'app-therapeutic-prescription',
  standalone: true,
  imports: [],
  templateUrl: './therapeutic-prescription.component.html',
  styleUrls: ['./therapeutic-prescription.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TherapeuticPrescriptionComponent {
  @Input({ required: true }) item!: IGlobalReservationModel;
}
