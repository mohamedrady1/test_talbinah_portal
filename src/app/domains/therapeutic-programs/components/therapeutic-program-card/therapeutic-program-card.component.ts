import { ProgramSubscriptionPopupComponent } from '../program-subscription-popup';
import { ModalService } from '../../../../shared/services/model.service';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { ITherapeuticProgram } from '../../models';
import { CommonModule } from '@angular/common';
import { CardType, IGlobalDoctorProgrammeModel, Logger } from '../../../../common';
import { DetailsHeaderConfig } from '../../configs';
import { TranslationsFacade } from '../../../../common/core/translations/services';
@Component({
  selector: 'app-therapeutic-program-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './therapeutic-program-card.component.html',
  styleUrls: ['./therapeutic-program-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class TherapeuticProgramCardComponent {
  private modalService = inject(ModalService);
  protected cardType = CardType;
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  @Input() item!: ITherapeuticProgram | IGlobalDoctorProgrammeModel;
  @Input() type: CardType = CardType.SUMMARY;


  ngOnInit(): void {
    // this.openProgramSubscription();
  }

  protected openProgramSubscription(): void {
    this.modalService.open(ProgramSubscriptionPopupComponent, {
      inputs: {
        ...DetailsHeaderConfig,
        data: {
          item: this.item,
        }
      },
      outputs: {
        closed: (response: any) => {
          Logger.debug('The update model is closed => response: ', response);
        }
      },
      width: '70%',
      height: "fit-content"

    });
  }
}
