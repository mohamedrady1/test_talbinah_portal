import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CardType } from '../../../../common';
import { ModalService } from '../../../../shared/services/model.service';
import { ProgramSubscriptionPopupComponent } from '../program-subscription-popup';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationsFacade } from '../../../../common/core/translations/services';
@Component({
  selector: 'app-program-subscription-information-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './program-subscription-information-card.component.html',
  styleUrls: ['./program-subscription-information-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgramSubscriptionInformationCardComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  private modalService = inject(ModalService);
  protected cardType = CardType;

  // @Input() item!: ITherapeuticProgram;
  @Input() item!: any;

  @Input() type: CardType = CardType.SUMMARY;
  @Output() click = new EventEmitter<void>();

  protected openProgramSubscription(): void {
    this.modalService.open(ProgramSubscriptionPopupComponent, {
      inputs: {
        image: 'images/mentalHealthScale/icons/talbinah.png',
        title: 'confirm_subscription',
      },
      outputs: {
        closed: () => {
          console.log('The model is closed');
        }
      },
    });
  }
  buttonActions() {
    this.click.emit();
  }
}
