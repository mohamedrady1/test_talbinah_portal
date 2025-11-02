import { ChangeDetectionStrategy, Component, effect, EventEmitter, inject, Input, Output } from '@angular/core';
import { BlockUserFacade, CalcReservationCancelPriceFacade } from '../../services';
import { IBlockUserActionData, ICalcReservationCancelPriceData } from '../../dtos';
import { IGlobalReservationModel } from '../../models';
import { TranslateModule } from '@ngx-translate/core';
import { IGlobalDoctorContactInfoModel, Logger } from '../../../../common';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-block-doctor-modal',
  standalone: true,
  imports: [
    TranslateModule,
    TranslateApiPipe
  ],
  templateUrl: './block-doctor-modal.component.html',
  styleUrls: ['./block-doctor-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockDoctorModalComponent {
  // --- Inputs/Outputs ---
  @Input({ required: false }) protected type!: string;
  @Input() protected session: IGlobalReservationModel | null = null;
  @Input() protected doctor: IGlobalDoctorContactInfoModel | null = null;

  @Output() protected closed = new EventEmitter<IBlockUserActionData | null>();

  public readonly _BlockUserFacade = inject(BlockUserFacade);
  constructor() {
    effect(() => {
      if (this._BlockUserFacade.isSuccess() && !this._BlockUserFacade.isLoading()) {
        this.closed.emit(this._BlockUserFacade.result());
        Logger.debug('BlockDoctorModalComponent => Blocking successful, emitting closed event with form data.');
      }
      else if (this._BlockUserFacade.error() && !this._BlockUserFacade.isLoading()) {
        Logger.error('BlockDoctorModalComponent => Blocking failed, closing modal.');
      }
    });
  }

  ngOnInit(): void {
    Logger.debug('BlockDoctorModalComponent initialized with data:', {
      doctor: this.doctor
    });
    this._BlockUserFacade.reset();
  }

  protected onConfirm(): void {
    if (!this._BlockUserFacade.isLoading()) {
      // this.closed.emit();
      if (this.doctor?.id) {
        this._BlockUserFacade.blockDoctorById(this.doctor?.id);
      }
    }
  }

  protected onCancel(): void {
    this.closed.emit(null);
  }
}
