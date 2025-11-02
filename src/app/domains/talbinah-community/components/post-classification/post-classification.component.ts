import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { ITab } from '../../models';
import { TranslateModule } from '@ngx-translate/core';
import { TabSwitcherComponent } from "../tab-switcher/tab-switcher.component";
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-post-classification',
  standalone: true,
  imports: [TranslateModule, TabSwitcherComponent, TranslateApiPipe],
  templateUrl: './post-classification.component.html',
  styleUrls: ['./post-classification.component.scss']
})
export class PostClassificationComponent {
  @Input() tabs: ITab[] = [];
  @Output() tabSelected = new EventEmitter<ITab>();

  // ✅ Input signal for pre-selected tab ID
  @Input() selectedTabId = signal<number | null>(null);

  selectedTab: ITab | null = null;

  selectTab(tab: ITab): void {
    this.selectedTab = tab;
    this.tabSelected.emit(tab);
  }
}
