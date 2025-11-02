import { ChangeDetectionStrategy, Component, inject, OnInit, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyStateCardComponent, EmptyStateConfig, ErrorStateCardComponent, ErrorStateConfig, PaginationListingComponent } from '../../../../shared';
import { GiftCardShimmerComponent } from '../gift-card-shimmer';
import { GiftCardComponent } from '../gift-to-your-loved-ones/gift-card/gift-card.component';
import { GiftsFacade } from '../../services/gifts.facade';
import { IGiftSenderDto } from '../../dtos';
import { ComplaintCardSkeletonComponent } from '../complaint-card-skeleton/complaint-card-skeleton.component';
import { sentGiftsEmptyConfig, sentGiftsErrorConfig } from '../../configs';
import { PaginationConfig } from '../../../../shared/components/pagination-listing/model/pagination.model';

@Component({
    selector: 'app-sent-gifts-list',
    standalone: true,
    imports: [CommonModule, TranslateModule, GiftCardComponent, GiftCardShimmerComponent, PaginationListingComponent, ErrorStateCardComponent, EmptyStateCardComponent, ComplaintCardSkeletonComponent],
    templateUrl: './sent-gifts-list.component.html',
    styleUrls: ['./sent-gifts-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SentGiftsListComponent implements OnInit {
    private giftsFacade = inject(GiftsFacade);

    readonly isLoading = this.giftsFacade.isLoadingSent;
    readonly errorMessage = this.giftsFacade.errorMessageSent;
    readonly sentGifts = this.giftsFacade.sentGifts;
    readonly status = this.giftsFacade.statusSent;

    errorConfig = sentGiftsErrorConfig(() => this.giftsFacade.fetchSentGifts());
    emptyConfig = sentGiftsEmptyConfig;

    currentPage = 1;
    itemsPerPage = 3;
    get pagedItems(): IGiftSenderDto[] {
        const safePage = Math.min(Math.max(this.currentPage, 1), this.totalPages);
        const start = (safePage - 1) * this.itemsPerPage;
        return this.sentGifts().slice(start, start + this.itemsPerPage);
    }
    get isEmpty() {
        return !this.sentGifts().length;
    }

    get totalPages(): number {
        const total = Math.ceil(this.sentGifts().length / this.itemsPerPage);
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

    constructor() {
        // Clamp currentPage when list length changes (after cancel refresh, etc.)
        effect(() => {
            const total = this.totalPages;
            if (this.currentPage > total) this.currentPage = total;
            if (this.currentPage < 1) this.currentPage = 1;
        });
    }

    ngOnInit(): void {
        this.giftsFacade.fetchSentGifts();
    }
} 