import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Reaction, ReelReactionType } from '../../../domains/talbinah-community/models';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-reaction-picker',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './reaction-picker.component.html',
  styleUrls: ['./reaction-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactionPickerComponent {
  @Input() reactions: Reaction[] = [];
  @Output() reactionSelected = new EventEmitter<ReelReactionType>();

  selectReaction(type: ReelReactionType): void {
    this.reactionSelected.emit(type);
  }
}
