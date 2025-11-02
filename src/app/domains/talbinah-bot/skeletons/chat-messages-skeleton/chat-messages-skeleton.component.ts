import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-messages-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-messages-skeleton.component.html',
  styleUrls: ['./chat-messages-skeleton.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessagesSkeletonComponent {
  readonly _rows = [1, 2];
}
