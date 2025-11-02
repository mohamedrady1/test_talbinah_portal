import { Component, Input, Signal, signal, computed, effect } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; // Don't forget CommonModule for ngFor, ngClass etc.
import { TranslateModule } from '@ngx-translate/core'; // If you're using translate pipe in template
import { ITab } from '../../models'; // Ensure this path is correct

@Component({
  selector: 'app-tab-switcher',
  standalone: true,
  imports: [CommonModule, TranslateModule], // Add CommonModule and TranslateModule
  templateUrl: './tab-switcher.component.html',
  styleUrls: ['./tab-switcher.component.scss']
})
export class TabSwitcherComponent {
  private _tabs = signal<ITab[]>([]);

  // ✅ Input signal for pre-selected tab ID
  @Input() selectedTabId = signal<number | null>(null);

  // Internal signal to hold the currently selected ITab object
  readonly selectedTab = signal<ITab | null>(null);

  @Output() tabSelected = new EventEmitter<ITab>();

  // ✅ Input Signal for loading state
  @Input({ required: false }) isLoadingItems: Signal<boolean> = signal(false);

  // Setter for the 'tabs' input. Primarily updates the internal _tabs signal.
  // The logic for setting `selectedTab` based on `selectedTabId` will now be in the effect.
  @Input() set tabs(value: ITab[]) {
    this._tabs.set(value);
    // Removed logic here that sets `selectedTab` directly, as the effect will handle it
    // based on `selectedTabId` and the updated `_tabs`.
  }

  get tabs(): ITab[] {
    return this._tabs();
  }

  constructor() {
    // Effect to handle initial selection based on selectedTabId input
    // and to react if tabs or selectedTabId change.
    effect(() => {
      const currentSelectedId = this.selectedTabId(); // Read the input signal
      const availableTabs = this._tabs();           // Read the internal tabs signal

      // Logger.debug('TabSwitcher Effect running:', { currentSelectedId, availableTabs });

      if (currentSelectedId !== null && availableTabs.length > 0) {
        const foundTab = availableTabs.find(tab => tab.id === currentSelectedId);
        if (foundTab && this.selectedTab()?.id !== foundTab.id) { // Only update if different
          this.selectedTab.set(foundTab);
          // Optionally emit if the initial selection should trigger an output
          // this.tabSelected.emit(foundTab);
          // Logger.debug('TabSwitcher: Selected tab updated by effect:', foundTab);
        }
      } else if (availableTabs.length > 0 && this.selectedTab() === null) {
        // If no selectedId is provided but tabs are available, default to the first tab
        this.selectedTab.set(availableTabs[0]);
        // Logger.debug('TabSwitcher: Defaulted to first tab:', availableTabs[0]);
      } else if (currentSelectedId === null && this.selectedTab() !== null && !availableTabs.some(tab => tab.id === this.selectedTab()?.id)) {
        // If selectedId is null, and the current selected tab is no longer in the list, reset it
        this.selectedTab.set(null);
        // Logger.debug('TabSwitcher: Resetting selected tab as it is no longer in available tabs.');
      }
    }); // Allow writing to `selectedTab` signal within the effect
  }


  selectTab(tab: ITab): void {
    // Prevent selecting a tab if items are currently loading
    if (this.isLoadingItems()) {
      return;
    }
    // Only update if the new tab is different from the currently selected one
    if (this.selectedTab()?.id !== tab.id) {
      this.selectedTab.set(tab);
      this.tabSelected.emit(tab);
    }
  }
}
