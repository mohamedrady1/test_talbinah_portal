import { TranslationsFacade } from '../../../../common/core/translations/services';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IMentalHealthScaleListItemDto } from '../../../../domains';
import { CardType, Logger } from '../../../../common';

@Component({
  selector: 'app-mental-health-scale-start-test',
  standalone: true,
  imports: [],
  templateUrl: './mental-health-scale-start-test.component.html',
  styleUrls: ['./mental-health-scale-start-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MentalHealthScaleStartTestComponent {
  @Input() item!: IMentalHealthScaleListItemDto;
  @Output() startQuiz = new EventEmitter<boolean | null>();
  @Input() messageRef!: any;
  cardType = CardType;
  
  private readonly translationsFacade = inject(TranslationsFacade);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  
  ngOnInit(): void {
    Logger.debug('MentalHealthScaleStartTestComponent => ngOnInit => Message Ref: ', this.messageRef);
  }
  startQuizAction() {
    this.startQuiz.emit(this.messageRef?.mentalHealthResult?.isNotEmpty);
  }

}
