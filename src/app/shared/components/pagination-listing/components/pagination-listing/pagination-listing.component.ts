import { Component, Input, signal, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { getPaginationRange } from '../../utils';
import { PaginationConfig } from '../../model';
import { CommonModule } from '@angular/common';
import { TranslationsFacade } from '../../../../../common/core/translations/services';

@Component({
  selector: 'app-pagination-listing',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './pagination-listing.component.html',
  styleUrls: ['./pagination-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationListingComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  private config = signal<PaginationConfig>({
    totalPages: 1,
    currentPage: 1,
    onPageChange: () => { }
  });

  @Input() set paginationConfig(value: PaginationConfig) {
    this.config.set({ ...this.config(), ...value });
    this.current.set(value.currentPage);
  }

  current = signal(1);
  total = computed(() => this.config().totalPages);
  visiblePages = computed(() =>
    getPaginationRange(this.current(), this.total(), this.config().maxVisible ?? 5)
  );

  changePage = (page: number | string) => {
    if (typeof page === 'number' && page !== this.current()) {
      this.current.set(page);
      this.config().onPageChange(page);
    }
  };

  goPrev = () => this.changePage(this.current() - 1);
  goNext = () => this.changePage(this.current() + 1);

  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
}
