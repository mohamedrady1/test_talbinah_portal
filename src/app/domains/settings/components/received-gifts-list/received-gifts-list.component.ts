import { Component, inject, OnInit, computed, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { GiftCardComponent } from '../gift-to-your-loved-ones/gift-card/gift-card.component';
import { GiftCardShimmerComponent } from '../gift-card-shimmer/gift-card-shimmer.component';
import { PaginationListingComponent } from '../../../../shared/components/pagination-listing/components/pagination-listing/pagination-listing.component';
import { EmptyStateCardComponent, ErrorStateCardComponent } from '../../../../shared';
import { GiftsFacade } from '../../services/gifts.facade';
import { ComplaintCardSkeletonComponent } from '../complaint-card-skeleton/complaint-card-skeleton.component';
import { receivedGiftsEmptyConfig } from '../../configs';
import { receivedGiftsErrorConfig } from '../../configs/settings-error-state.config';
import { PaginationConfig } from '../../../../shared/components/pagination-listing/model/pagination.model';

@Component({
    selector: 'app-received-gifts-list',
    standalone: true,
    imports: [CommonModule, TranslateModule, GiftCardComponent, GiftCardShimmerComponent, PaginationListingComponent, ErrorStateCardComponent, EmptyStateCardComponent, ComplaintCardSkeletonComponent],
    templateUrl: './received-gifts-list.component.html',
    styleUrls: ['./received-gifts-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReceivedGiftsListComponent implements OnInit {
    private giftsFacade = inject(GiftsFacade);

    readonly isLoading = this.giftsFacade.isLoadingReceived;
    readonly errorMessage = this.giftsFacade.errorMessageReceived;
    readonly receivedGifts = this.giftsFacade.receivedGifts;
    readonly status = this.giftsFacade.statusReceived;

    currentPage = 1;
    itemsPerPage = 3;

    get pagedItems() {
        const safePage = Math.min(Math.max(this.currentPage, 1), this.totalPages);
        const start = (safePage - 1) * this.itemsPerPage;
        return this.receivedGifts().slice(start, start + this.itemsPerPage);
    }
    get isEmpty() {
        return !this.receivedGifts().length;
    }

    get totalPages(): number {
        const total = Math.ceil(this.receivedGifts().length / this.itemsPerPage);
        return Number.isFinite(total) && total > 0 ? total : 1;
    }

    get paginationConfig(): PaginationConfig {
        return {
            currentPage: this.currentPage,
            totalPages: this.totalPages,
            onPageChange: this.onPageChange
        };
    }

    private onPageChange = (page: number): void => {
        this.currentPage = page;
    };

    emptyConfig = receivedGiftsEmptyConfig;
    errorConfig = receivedGiftsErrorConfig(() => this.giftsFacade.fetchReceivedGifts());

    constructor() {
        // Clamp currentPage when list length changes (after accept refresh, etc.)
        effect(() => {
            const total = this.totalPages;
            if (this.currentPage > total) this.currentPage = total;
            if (this.currentPage < 1) this.currentPage = 1;
        });
    }

    ngOnInit(): void {
        this.giftsFacade.fetchReceivedGifts();
    }
} 