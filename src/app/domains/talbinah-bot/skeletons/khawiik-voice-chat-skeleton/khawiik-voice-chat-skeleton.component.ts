import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-khawiik-voice-chat-skeleton',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './khawiik-voice-chat-skeleton.component.html',
    styleUrls: ['./khawiik-voice-chat-skeleton.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KhawiikVoiceChatSkeletonComponent {
}
