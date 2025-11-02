import { ChangeDetectionStrategy, Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletPointsRecordsFacade } from '../../services/wallet-points-records.facade';
import { AutoExactHeightDirective } from '../../../../common';
import { EmptyStateCardComponent } from '../../../../shared/components/empty-state-card/empty-state-card.component';
import { ErrorStateCardComponent } from '../../../../shared/components/error-state-card/error-state-card.component';
import { TranslateApiPipe } from '../../../../common/core/translations';
interface FilterOption {
    label: string;
    value: string;
}

interface PointsHistoryItem {
    id: number;
    gift: any;
    service_name: string;
    name: string;
    points: number | null;
    point_before: number;
    point_original: number;
    point_after: number;
    type: string;
    original_type: string;
    expires_at: string;
    expired: boolean;
    created_at: string;
    updated_at: string;
}

@Component({
    selector: 'app-points-history',
    standalone: true,
    imports: [
        CommonModule,
        TranslateApiPipe,
        EmptyStateCardComponent,
        ErrorStateCardComponent,
        AutoExactHeightDirective
    ],
    templateUrl: './points-history.component.html',
    styleUrls: ['./points-history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PointsHistoryComponent implements OnInit {
    activeFilter = signal('all');

    filters: FilterOption[] = [
        { label: 'all', value: 'all' },
        { label: 'earned_points', value: 'earned' },
        { label: 'used_points', value: 'used' }
    ];

    private readonly walletPointsRecordsFacade = inject(WalletPointsRecordsFacade);

    // Use facade signals
    readonly movements = this.walletPointsRecordsFacade.movements;
    readonly isLoading = this.walletPointsRecordsFacade.isLoading;
    readonly errorMessage = this.walletPointsRecordsFacade.errorMessage;
    readonly status = this.walletPointsRecordsFacade.status;

    // Empty state configuration
    readonly pointsHistoryEmptyState = {
        imageUrl: 'images/emptyStates/image-6.svg',
        title: 'no_points_logs',
        imgWidth: '25%'
    };

    // Error state configuration
    readonly pointsHistoryErrorState = {
        imageUrl: 'images/emptyStates/image-6.svg',
        title: 'points_log_error',
        onRetry: () => this.loadPointsHistory(),
        imgWidth: '25%'
    };

    // Computed filtered movements
    readonly filteredMovements = computed(() => {
        let filtered = this.movements();

        // Apply type filter
        if (this.activeFilter() !== 'all') {
            const typeValue = this.activeFilter() === 'earned' ? '1' : '-1';
            filtered = filtered.filter(movement => movement.type === typeValue);
        }

        return filtered;
    });

    ngOnInit(): void {
        this.loadPointsHistory();
    }

    onFilterChange(filter: string): void {
        this.activeFilter.set(filter);
    }

    loadPointsHistory(): void {
        this.walletPointsRecordsFacade.fetchWalletPoints();
    }

    getPointsDisplay(item: PointsHistoryItem): string {
        const points = item.point_original;
        const sign = item.type === '1' ? '+' : '-';
        return `${sign}${points}`;
    }

    getPointsColor(item: PointsHistoryItem): string {
        return item.type === '1' ? 'var(--Success-primary, #00AF6C)' : 'var(--Sacondry-Color-primary, #B80924)';
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG');
    }

    formatTime(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
} 