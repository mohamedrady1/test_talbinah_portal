import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-gift-card-shimmer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './gift-card-shimmer.component.html',
    styleUrls: ['./gift-card-shimmer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiftCardShimmerComponent {
    @Input() count: number = 3;
} 