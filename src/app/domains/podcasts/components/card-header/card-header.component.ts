import { Component, EventEmitter, Input, Output, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ICardHeaderConfig } from '../../configs';
import { CommonModule } from '@angular/common';
import { Logger } from '../../../../common';
import { ITabItem } from '../../models';
import { TranslateApiPipe } from '../../../../common/core/translations/pipes';

@Component({
  selector: 'app-card-header',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TranslateApiPipe
  ],
  templateUrl: './card-header.component.html',
  styleUrls: ['./card-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardHeaderComponent implements OnInit {

  @Input() config!: ICardHeaderConfig;
  @Input() isPrevDisabled = false;
  @Input() isNextDisabled = false;

  @Output() tabSelected = new EventEmitter<ITabItem>();
  @Output() prevClicked = new EventEmitter<void>();
  @Output() nextClicked = new EventEmitter<void>();
  @Output() allClicked = new EventEmitter<void>();

  selectedTab = signal<ITabItem | null>(null);

  ngOnInit() {
    Logger.debug('Tabs in CardHeaderComponent :', this.config.tabs);
    if ((this.config.tabs ?? []).length > 0) {
      const initialSelectedTabName = this.config.selectedTab;
      const foundTab = this.config.tabs!.find(tab => tab.name === initialSelectedTabName);

      if (foundTab) {
        this.selectedTab.set(foundTab);
      } else if (this.config.tabs && this.config.tabs.length > 0) {
        this.selectedTab.set(this.config.tabs[0]);
        this.tabSelected.emit(this.config.tabs[0]);
      }
    }
  }

  protected selectTab(tab: ITabItem) {
    this.selectedTab.set(tab);
    this.tabSelected.emit(tab);
  }
}
