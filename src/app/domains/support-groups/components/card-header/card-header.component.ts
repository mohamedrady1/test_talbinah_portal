import { TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICardHeaderConfig } from '../../../../shared';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-card-header',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './card-header.component.html',
  styleUrls: ['./card-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardHeaderComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }

  @Input() config!: ICardHeaderConfig;
  @Input() isPrevDisabled = false;
  @Input() isNextDisabled = false;
  @Input() total: number = 0;
  @Input() count: number = 0;

  @Output() tabSelected = new EventEmitter<string>();
  @Output() prevClicked = new EventEmitter<void>();
  @Output() nextClicked = new EventEmitter<void>();
  @Output() allClicked = new EventEmitter<void>();

  selectedTab = signal<string | null>(null);

  ngOnInit() {
    if ((this.config.tabs ?? []).length > 0) {
      const tabs = this.config.tabs ?? [];
      this.selectedTab.set(tabs[0] ?? null);
      if (tabs[0]) {
        this.tabSelected.emit(tabs[0]);
      }
    }
  }

  protected selectTab(tab: string) {
    this.selectedTab.set(tab);
    this.tabSelected.emit(tab);
  }
  protected get shouldShowAllButton(): boolean {
    return (this.config.isAllButtonVisible ?? false) || (this.total > this.count);
  }
}

