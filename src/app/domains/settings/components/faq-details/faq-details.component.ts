import { Component, Input, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorStateCardComponent, EmptyStateCardComponent, FaqDetailsLoadingComponent } from '../../../../shared';
import { FaqsFacade } from '../../services';
import { FaqItem } from '../../dtos/responses/faqs-response.dto';
import { AutoExactHeightDirective, Logger } from '../../../../common';
import {
  getFaqsErrorConfig,
  FaqsEmptyConfig,
  FaqsSearchConfig
} from '../../configs';
import { IFaqsCategoryDto } from '../../dtos';

@Component({
  selector: 'app-faq-details',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FaqDetailsLoadingComponent,
    ErrorStateCardComponent,
    EmptyStateCardComponent,
    AutoExactHeightDirective
  ],
  templateUrl: './faq-details.component.html',
  styleUrls: ['./faq-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqDetailsComponent implements OnInit {
  @Input() item!: IFaqsCategoryDto;
  @Input() categoryId!: number;

  private readonly faqsFacade = inject(FaqsFacade);

  // Signals for reactive state
  readonly isLoading = computed(() => this.faqsFacade.isLoading());
  readonly errorMessage = computed(() => this.faqsFacade.errorMessage());
  readonly faqs = computed(() => this.faqsFacade.faqs());
  readonly faqsResponse = computed(() => this.faqsFacade.faqsResponse());

  // Search functionality
  private readonly _searchTerm = signal<string>('');
  readonly searchTerm = computed(() => this._searchTerm());



  // Selected FAQ
  private readonly _selectedFaqId = signal<number | null>(null);
  readonly selectedFaqId = computed(() => this._selectedFaqId());
  readonly selectedFaq = computed(() => {
    const faqs = this.faqs();
    const selectedId = this.selectedFaqId();
    return faqs.find((faq: FaqItem) => faq.id === selectedId) || null;
  });

  // Configs
  readonly errorStateConfig = getFaqsErrorConfig(() => this.loadFaqs());
  readonly emptyStateConfig = FaqsEmptyConfig;
  readonly searchConfig = FaqsSearchConfig;

  ngOnInit(): void {
    Logger.debug('FaqDetailsComponent: Initializing component', { categoryId: this.categoryId });
    this.categoryId = this.item?.id;
    this.loadFaqs();
  }

  protected loadFaqs(): void {
    Logger.debug('FaqDetailsComponent: Loading FAQs', { categoryId: this.categoryId });
    this.faqsFacade.fetchFaqs$(this.categoryId).subscribe({
      next: () => {
        const faqs = this.faqs();
        if (faqs.length > 0) {
          this._selectedFaqId.set(faqs[0].id);
        }
      }
    });
  }

  protected onSearchChange(searchTerm: string): void {
    Logger.debug('FaqDetailsComponent: Search term changed', { searchTerm });
    this._searchTerm.set(searchTerm);
  }

  protected onFaqClick(faq: FaqItem): void {
    Logger.debug('FaqDetailsComponent: FAQ clicked', { faqId: faq.id, question: faq.question });
    this._selectedFaqId.set(faq.id);
  }

  protected isFaqActive(faqId: number): boolean {
    return this.selectedFaqId() === faqId;
  }
}
