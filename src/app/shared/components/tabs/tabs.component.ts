import { Component, Input, Output, EventEmitter, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { TabItem } from '../../models';
import { TranslateModule } from '@ngx-translate/core';
import { ITab } from '../../../domains/talbinah-community/models';
import { TranslationsFacade } from '../../../common/core/translations/services';
@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  @Input() tabs: ITab[] = [];
  @Input() multiSelect = false;
  @Output() tabSelected = new EventEmitter<ITab | ITab[]>();

  selectedTabs = signal<ITab[]>([]);

  ngOnInit() {
    if (!this.multiSelect && this.tabs.length > 0) {
      this.selectedTabs.set([this.tabs[0]]);
      this.tabSelected.emit(this.tabs[0]);
    }
  }
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }

  selectTab(tab: ITab) {
    if (this.multiSelect) {
      const current = this.selectedTabs();
      const exists = current.find(t => t.id === tab.id);
      const updated = exists
        ? current.filter(t => t.id !== tab.id)
        : [...current, tab];
      this.selectedTabs.set(updated);
      this.tabSelected.emit(updated);
    } else {
      this.selectedTabs.set([tab]);
      this.tabSelected.emit(tab);
    }
  }

  isSelected(tab: ITab): boolean {
    return this.selectedTabs().some(t => t.id === tab.id);
  }
}
