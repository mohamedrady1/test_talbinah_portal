import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Logger } from '../../../common';

export interface ISelectionOptionConfig {
  id: number | string;
  name: string;
  subtitle?: string | number | null | undefined;
  image?: string;
  selected?: boolean; // default state
}

@Component({
  selector: 'app-selection-option',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './selection-option.component.html',
  styleUrls: ['./selection-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectionOptionComponent {
  @Input({ required: true }) config!: ISelectionOptionConfig;
  @Input() iconOnly = false;
  @Input() isIconStart = false;
  @Input() shape: 'circle' | 'square' = 'circle';
  @Output() selected = new EventEmitter<ISelectionOptionConfig>();

  // ====== SSR flags ======
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly isBrowser: boolean;

  get isChecked(): boolean {
    return !!this.config?.selected;
  }

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  protected onSelect(event: Event): void {
    if (!this.isBrowser) return;
    event.stopPropagation();
    this.config.selected = !this.isChecked;
    Logger.debug('SelectionOptionComponent | onSelect: ', event);
    this.selected.emit(this.config);
  }

  protected onImageError(event: Event): void {
    if (!this.isBrowser) return;
    const target = event.target as HTMLImageElement;
    target.src = 'images/icons/logo-2.png';
  }
}
