import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { ErrorStateConfig } from '../error-state-card';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslationsFacade } from '../../../common/core/translations/services';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule
  ],
  templateUrl: './error-state.component.html',
  styleUrls: ['./error-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorStateComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  @Input({ required: true }) config!: ErrorStateConfig;

  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }

  get backgroundColor(): string {
    return this.config.backgroundColor || '#fff3f3';
  }

  get gap(): string {
    return this.config.gap || '1rem';
  }

  protected retry(): void {
    this.config.onRetry?.();
  }
}
