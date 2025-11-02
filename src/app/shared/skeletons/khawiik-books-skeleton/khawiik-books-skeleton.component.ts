import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-khawiik-books-skeleton',
  standalone: true,
  imports: [],
  templateUrl: './khawiik-books-skeleton.component.html',
  styleUrl: './khawiik-books-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KhawiikBooksSkeletonComponent {
  // Generate skeleton items to match the expected number of cards
  skeletonItems = Array.from({ length: 2 }, (_, i) => i);
}






