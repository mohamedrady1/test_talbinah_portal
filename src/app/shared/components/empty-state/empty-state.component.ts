import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyStateConfig } from '../empty-state-card';
import { TranslationsFacade } from '../../../common/core/translations/services';
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
  ],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyStateComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  @Input({ required: true }) config!: EmptyStateConfig;
  @Output() action = new EventEmitter<void>();

  // Computed getters for safe SSR access and template simplification
  readonly backgroundColor = computed(() => this.config.backgroundColor || '#f9f9f9');
  readonly gap = computed(() => this.config.gap || '1rem');
  readonly hasImage = computed(() => !!this.config.imageUrl);
  readonly hasTitle = computed(() => !!this.config.title);
  readonly hasMessage = computed(() => !!this.config.message);
  readonly hasButton = computed(() => !!this.config.hasButton);

  protected onClick() {
    this.action.emit();
  }
}
