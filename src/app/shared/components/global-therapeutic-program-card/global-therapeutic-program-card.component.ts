import { TranslateApiPipe } from './../../../common/core/translations/pipes/translate-api.pipe';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ModalService } from '../../services';
import { DetailsHeaderConfig, ProgramSubscriptionPopupComponent } from '../../../domains';
import { CardType, IGlobalDoctorProgrammeModel, Logger } from '../../../common';
import { SvgIconComponent } from '../svg-icon';

export interface IProgramSubscriptionPopupInputs {
  data: {
    item: IGlobalDoctorProgrammeModel;
  };
}

@Component({
  selector: 'app-global-therapeutic-program-card',
  standalone: true,
  imports: [CommonModule, TranslateApiPipe, SvgIconComponent],
  templateUrl: './global-therapeutic-program-card.component.html',
  styleUrls: ['./global-therapeutic-program-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalTherapeuticProgramCardComponent implements OnInit {
  private readonly modalService = inject(ModalService);
  protected readonly cardType = CardType;

  @Input({ required: true }) item!: IGlobalDoctorProgrammeModel;
  @Input() type: CardType = CardType.SUMMARY;

  ngOnInit(): void {
    // Reserved for potential initialization logic.
  }

  protected openProgramSubscription(): void {
    this.modalService.open(ProgramSubscriptionPopupComponent, {
      inputs: {
        ...DetailsHeaderConfig,
        data: { item: this.item }
      },
      outputs: {
        closed: (response: unknown) => {
          Logger.debug('GlobalTherapeuticProgramCardComponent | Program subscription modal closed =>', response);
        }
      },
      width: '70%',
      height: 'fit-content'
    });
  }
}
