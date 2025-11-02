import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-khawiik-voice-types-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './khawiik-voice-types-skeleton.component.html',
  styleUrls: ['./khawiik-voice-types-skeleton.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KhawiikVoiceTypesSkeletonComponent {
  readonly skeletonItems = Array(3).fill(0); // Create 6 skeleton items
}


