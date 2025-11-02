import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-mood-graph',
  standalone: true,
  imports: [],
  templateUrl: './mood-graph.component.html',
  styleUrls: ['./mood-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoodGraphComponent {

}
