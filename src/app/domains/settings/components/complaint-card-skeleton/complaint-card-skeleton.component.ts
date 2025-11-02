import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-complaint-card-skeleton',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './complaint-card-skeleton.component.html',
    styleUrls: ['./complaint-card-skeleton.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComplaintCardSkeletonComponent {
    @Input() count: number = 3;
} 