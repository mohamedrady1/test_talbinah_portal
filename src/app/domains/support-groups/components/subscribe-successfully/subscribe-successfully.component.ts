import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-subscribe-successfully',
  standalone: true,
  imports: [TranslateModule,],
  templateUrl: './subscribe-successfully.component.html',
  styleUrls: ['./subscribe-successfully.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscribeSuccessfullyComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }

  @Output() confirm = new EventEmitter<void>();
  onConfirm() {
    this.confirm.emit();
  }
}

