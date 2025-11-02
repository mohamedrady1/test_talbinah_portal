import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { IPodcast } from '../../models';
import { TranslateApiPipe } from '../../../../common/core/translations/pipes';

@Component({
  selector: 'app-podcast-bot',
  standalone: true,
  imports: [TranslateModule, CommonModule, TranslateApiPipe],
  templateUrl: './podcast-bot.component.html',
  styleUrls: ['./podcast-bot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PodcastBotComponent {
  @Input() podcastDetails!: IPodcast | any;
  @Input() allowShortTexts!: boolean | null;
  @Input() hideButtonAction!: boolean | null;
  @Output() openPopupAction = new EventEmitter<void>();

  protected openPopup(): void {
    this.openPopupAction.emit();
  }
}

