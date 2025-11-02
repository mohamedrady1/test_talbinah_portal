import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { IPodcast } from '../../models';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-podcast-bot',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './podcast-bot.component.html',
  styleUrls: ['./podcast-bot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PodcastBotComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  
  @Input() podcastDetails!: IPodcast | any;
  @Input() allowShortTexts!: boolean | null;
  @Input() hideButtonAction!: boolean | null;
  @Output() openPopupAction = new EventEmitter<void>();

  protected openPopup(): void {
    this.openPopupAction.emit();
  }
}

