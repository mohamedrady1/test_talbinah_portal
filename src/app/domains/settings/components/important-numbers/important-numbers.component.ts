import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  ErrorStateCardComponent,
  EmptyStateCardComponent,
  ImportantNumberCardComponent,
  ImportantNumbersLoadingComponent,
  LocalSearchComponent
} from '../../../../shared';
import { ImportantNumbersFacade } from '../../services';
import { ImportantNumberItem } from '../../dtos/responses/important-numbers-response.dto';
import { AutoExactHeightDirective, Logger } from '../../../../common';
import { getImportantNumbersErrorConfig, ImportantNumbersEmptyConfig } from '../../configs';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-important-numbers',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ImportantNumberCardComponent,
    ImportantNumbersLoadingComponent,
    ErrorStateCardComponent,
    EmptyStateCardComponent,
    LocalSearchComponent,
    AutoExactHeightDirective,
    TranslateApiPipe
  ],
  templateUrl: './important-numbers.component.html',
  styleUrls: ['./important-numbers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportantNumbersComponent implements OnInit {
  private readonly importantNumbersFacade = inject(ImportantNumbersFacade);

  // Signals for reactive state
  readonly isLoading = computed(() => this.importantNumbersFacade.isLoading());
  readonly errorMessage = computed(() => this.importantNumbersFacade.errorMessage());
  readonly importantNumbers = computed(() => this.importantNumbersFacade.importantNumbers());
  readonly importantNumbersResponse = computed(() => this.importantNumbersFacade.importantNumbersResponse());

  // Local search functionality
  private readonly _localSearchTerm = signal<string>('');
  readonly localSearchTerm = computed(() => this._localSearchTerm());
  readonly filteredImportantNumbers = computed(() => {
    const numbers = this.importantNumbers();
    const search = this.localSearchTerm().toLowerCase();
    if (!search) return numbers;
    return numbers.filter((number: ImportantNumberItem) =>
      number.title.toLowerCase().includes(search) ||
      number.number.toLowerCase().includes(search)
    );
  });

  // Configs
  readonly errorStateConfig = getImportantNumbersErrorConfig(() => this.loadImportantNumbers());
  readonly emptyStateConfig = ImportantNumbersEmptyConfig;

  ngOnInit(): void {
    Logger.debug('ImportantNumbersComponent: Initializing component');
    this.loadImportantNumbers();
  }

  loadImportantNumbers(): void {
    Logger.debug('ImportantNumbersComponent: Loading important numbers');
    this.importantNumbersFacade.fetchImportantNumbers();
    setTimeout(() => {
      // No need to set filteredNumbers here as filteredImportantNumbers is computed
    }, 0);
  }

  onLocalSearchChange(searchTerm: string): void {
    Logger.debug('ImportantNumbersComponent: Local search term changed', { searchTerm });
    this._localSearchTerm.set(searchTerm);
  }
}
