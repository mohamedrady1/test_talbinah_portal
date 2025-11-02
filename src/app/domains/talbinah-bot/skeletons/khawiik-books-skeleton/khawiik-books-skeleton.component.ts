import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-khawiik-books-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './khawiik-books-skeleton.component.html',
  styleUrl: './khawiik-books-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KhawiikBooksSkeletonComponent {
  readonly _activityRows = [1, 2];
}
