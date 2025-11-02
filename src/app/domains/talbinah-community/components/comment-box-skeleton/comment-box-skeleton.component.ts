import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-comment-box-skeleton',
  standalone: true,
  imports: [],
  templateUrl: './comment-box-skeleton.component.html',
  styleUrls: ['./comment-box-skeleton.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentBoxSkeletonComponent {

}
