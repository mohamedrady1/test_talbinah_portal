import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyStateConfig } from '../empty-state-card';
import { TranslateApiPipe } from '../../../common/core/translations/pipes/translate-api.pipe';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    TranslateApiPipe
  ],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyStateComponent {
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
