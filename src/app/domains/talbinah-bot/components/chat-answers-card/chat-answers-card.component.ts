import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { IAnswer } from '../../models';

@Component({
  selector: 'app-chat-answers-card',
  standalone: true,
  imports: [],
  templateUrl: './chat-answers-card.component.html',
  styleUrls: ['./chat-answers-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatAnswersCardComponent {
  @Input() answer!: IAnswer;
  @Input() selectedId!: number | null;

  @Output() selectAnswer = new EventEmitter<IAnswer>();

  handleClick() {
    this.selectAnswer.emit(this.answer);
  }
}
