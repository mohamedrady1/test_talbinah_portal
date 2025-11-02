import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ErrorStateConfig } from '../error-state-card';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslateApiPipe } from '../../../common/core/translations';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    TranslateApiPipe
  ],
  templateUrl: './error-state.component.html',
  styleUrls: ['./error-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorStateComponent {
  @Input({ required: true }) config!: ErrorStateConfig;
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
