import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { ITab } from '../../models';
import { TranslateModule } from '@ngx-translate/core';
import { TabSwitcherComponent } from "../tab-switcher/tab-switcher.component";
import { TranslationsFacade } from '../../../../common/core/translations/services';
@Component({
  selector: 'app-post-classification',
  standalone: true,
  imports: [TranslateModule, TabSwitcherComponent],
  templateUrl: './post-classification.component.html',
  styleUrls: ['./post-classification.component.scss']
})
export class PostClassificationComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
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
