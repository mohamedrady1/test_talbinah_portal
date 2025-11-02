import { Component } from '@angular/core';
import { CommentBoxSkeletonComponent } from "../comment-box-skeleton/comment-box-skeleton.component";
import { TabsShemmerComponent } from "../tabs-shemmer/tabs-shemmer.component";

@Component({
  selector: 'app-psychological-society-card-shemmer',
  standalone: true,
  imports: [CommentBoxSkeletonComponent, TabsShemmerComponent],
  templateUrl: './psychological-society-card-shemmer.component.html',
  styleUrls: ['./psychological-society-card-shemmer.component.scss']
})
export class PsychologicalSocietyCardShemmerComponent {

}
