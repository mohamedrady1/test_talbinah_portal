import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-khawiik-activities-skeleton',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './khawiik-activities-skeleton.component.html',
    styleUrls: ['./khawiik-activities-skeleton.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KhawiikActivitiesSkeletonComponent {
    readonly _activityRows = [1, 2, 3, 4];
}
