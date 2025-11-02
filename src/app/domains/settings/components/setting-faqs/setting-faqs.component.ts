import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
import { LocalSearchComponent, LoadingShimmerComponent, ErrorStateCardComponent, EmptyStateCardComponent, ModalService } from '../../../../shared';
import { FaqCardComponent } from '../faq-card';
import { FaqsCategoriesFacade } from '../../services';
import { AutoExactHeightDirective, Logger } from '../../../../common';
import {
  getFaqsCategoriesErrorConfig,
  FaqsCategoriesEmptyConfig,
} from '../../configs';
import { FaqDetailsComponent } from '../faq-details';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { IFaqsCategoryDto } from '../../dtos';
import { TranslateApiPipe } from '../../../../common/core/translations';
@Component({
  selector: 'app-setting-faqs',
  standalone: true,
  imports: [
    LocalSearchComponent,
    FaqCardComponent,
    LoadingShimmerComponent,
    ErrorStateCardComponent,
    EmptyStateCardComponent,
    CommonModule,
    AutoExactHeightDirective,
    TranslateApiPipe
  ],
  templateUrl: './setting-faqs.component.html',
  styleUrls: ['./setting-faqs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingFaqsComponent implements OnInit {
  private readonly faqsCategoriesFacade = inject(FaqsCategoriesFacade);
  protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private _ModalService = inject(ModalService);

  // Signals for reactive state
  readonly isLoading = computed(() => this.faqsCategoriesFacade.isLoading());
  readonly errorMessage = computed(() => this.faqsCategoriesFacade.errorMessage());
  readonly categories = computed(() => this.faqsCategoriesFacade.categories());
  readonly categoriesResponse = computed(() => this.faqsCategoriesFacade.categoriesResponse());

  // Local search functionality
  private readonly _localSearchTerm = signal<string>('');
  readonly localSearchTerm = computed(() => this._localSearchTerm());
  readonly filteredCategories = computed(() => {
    const search = this.localSearchTerm().toLowerCase();
    return this.categories().filter(category => {
      const name = category.name ?? '';
      const description = category.description ?? '';
      return name.toLowerCase().includes(search) || description.toLowerCase().includes(search);
    });
  });

  // Selected category
  private readonly _selectedCategoryId = signal<number | null>(null);
  readonly selectedCategoryId = computed(() => this._selectedCategoryId());

  // Configs from separate files
  readonly errorStateConfig = getFaqsCategoriesErrorConfig(() => this.loadFaqsCategories());
  readonly emptyStateConfig = FaqsCategoriesEmptyConfig;

  ngOnInit(): void {
    if (!this.isBrowser) return;
    Logger.debug('SettingFaqsComponent: Initializing component');
    this.loadFaqsCategories();
  }

  protected loadFaqsCategories(): void {
    Logger.debug('SettingFaqsComponent: Loading FAQs categories');
    this.faqsCategoriesFacade.fetchFaqsCategories();
  }

  protected onLocalSearchChange(searchTerm: string): void {
    Logger.debug('SettingFaqsComponent: Local search term changed', { searchTerm });
    this._localSearchTerm.set(searchTerm);
  }

  protected onCategoryClick(category: IFaqsCategoryDto): void {
    if (!this.isBrowser) return;
    this._ModalService.open(FaqDetailsComponent, {
      inputs: {
        image: 'images/settings/modal-icons/faqs.png',
        title: 'faqs',
        subtitle: 'faq_intro',
        item: category,
      },
      outputs: {
        closed: () => {
          console.log('The model is closed');
        }
      },
      width: '50%',
    });
  }

}
