import { Component } from '@angular/core';
import { NotificationShemmerComponent } from '../notification-shemmer';
import { TabsShemmerComponent } from '../tabs-shemmer';
import { CommentBoxSkeletonComponent } from '../comment-box-skeleton';
import { PsychologicalSocietyCardShemmerComponent } from '../psychological-society-card-shemmer';
import { MoodShemmerComponent } from '../mood-shemmer';


@Component({
  selector: 'app-main-page-shemmer',
  standalone: true,
  imports: [NotificationShemmerComponent, TabsShemmerComponent, CommentBoxSkeletonComponent, PsychologicalSocietyCardShemmerComponent, MoodShemmerComponent],
  templateUrl: './main-page-shemmer.component.html',
  styleUrls: ['./main-page-shemmer.component.scss']
})
export class MainPageShemmerComponent {

}
