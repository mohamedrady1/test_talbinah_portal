import { TranslateApiPipe } from './../../../../common/core/translations/pipes/translate-api.pipe';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IMentalHealthScaleListItemDto } from '../../../../domains';
import { CardType, Logger } from '../../../../common';

@Component({
  selector: 'app-mental-health-scale-start-test',
  standalone: true,
  imports: [TranslateApiPipe],
  templateUrl: './mental-health-scale-start-test.component.html',
  styleUrls: ['./mental-health-scale-start-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MentalHealthScaleStartTestComponent {
  @Input() item!: IMentalHealthScaleListItemDto;
  @Output() startQuiz = new EventEmitter<boolean | null>();
  @Input() messageRef!: any;
  cardType = CardType;
  ngOnInit(): void {
    Logger.debug('MentalHealthScaleStartTestComponent => ngOnInit => Message Ref: ', this.messageRef);
  }
  startQuizAction() {
    this.startQuiz.emit(this.messageRef?.mentalHealthResult?.isNotEmpty);
  }

}
