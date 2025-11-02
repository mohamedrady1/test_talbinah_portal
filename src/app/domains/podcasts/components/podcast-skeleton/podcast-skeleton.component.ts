import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-podcast-skeleton',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './podcast-skeleton.component.html',
  styleUrls: ['./podcast-skeleton.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PodcastSkeletonComponent {
  @Input() count = 1;
}
