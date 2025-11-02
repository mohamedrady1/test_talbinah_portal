import { Component, Input, signal, computed, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CardType } from '../../../../common'; // Assuming CardType is used for doctor cards
import { DoctorCardForBookingComponent } from '../../../book-appointment';
import { IDoctorItem } from '../../../../shared';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { PaginationListingComponent, PaginationConfig } from '../../../../shared';

@Component({
  selector: 'app-all-doctors',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    DoctorCardForBookingComponent,
    AutoExactHeightDirective,
    PaginationListingComponent
  ],
  templateUrl: './all-doctors.component.html',
  styleUrls: ['./all-doctors.component.scss']
})
export class AllDoctorsComponent implements OnChanges {
  @Input() doctors!: IDoctorItem[];
  protected cardTypes = CardType;

  // Local pagination state
  private readonly _currentPage = signal<number>(1);
  private readonly _itemsPerPage = signal<number>(6); // 6 doctors per page

  // Local pagination configuration that works with stored data
  readonly paginationConfig = computed<PaginationConfig>(() => {
    const allData = this.doctors || [];
    const totalItems = allData.length;
    const totalPages = Math.ceil(totalItems / this._itemsPerPage());

    return {
      currentPage: this._currentPage(),
      totalPages: totalPages,
      onPageChange: (page: number) => this.handleLocalPageChange(page)
    };
  });

  // Get paginated data for current page
  readonly paginatedDoctors = computed(() => {
    const allData = this.doctors || [];
    const currentPage = this._currentPage();
    const itemsPerPage = this._itemsPerPage();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return allData.slice(startIndex, endIndex);
  });

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    // Reset to first page when doctors input changes
    if (changes['doctors'] && !changes['doctors'].firstChange) {
      this._currentPage.set(1);
    }
  }

  /**
   * Handles local page changes without API calls.
   * @param page The new page number.
   */
  protected handleLocalPageChange(page: number): void {
    console.log('AllDoctorsComponent: Local page change to', page);
    this._currentPage.set(page);

    // Scroll to top when page changes
    this.scrollToTop();
  }

  private scrollToTop(): void {
    // Scroll to the top of the container
    const containerElement = document.querySelector('.all-doctors');
    if (containerElement) {
      containerElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}