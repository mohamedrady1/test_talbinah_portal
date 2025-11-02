import { Component, Input, Output, EventEmitter, signal, ChangeDetectionStrategy } from '@angular/core';
import { TabItem } from '../../models';
import { TranslateModule } from '@ngx-translate/core';
import { ITab } from '../../../domains/talbinah-community/models';
import { TranslateApiPipe } from '../../../common/core/translations';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [TranslateModule, TranslateApiPipe],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent {
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
