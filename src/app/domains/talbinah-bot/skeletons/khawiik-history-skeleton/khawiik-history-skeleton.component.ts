import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-khawiik-history-skeleton',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './khawiik-history-skeleton.component.html',
    styleUrls: ['./khawiik-history-skeleton.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KhawiikHistorySkeletonComponent {
    readonly _chatRows = [1, 2, 3, 4, 5];
}
