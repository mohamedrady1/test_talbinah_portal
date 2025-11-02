import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SvgIconComponent } from '../../../../shared';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-voice-recorder-button',
  standalone: true,
  imports: [SvgIconComponent, CommonModule],
  templateUrl: './voice-recorder-button.component.html',
  styleUrls: ['./voice-recorder-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoiceRecorderButtonComponent {
  @Input() isVoicePaused!: boolean;
  @Input() isPlayingBack!: boolean;
  @Input() playbackTime!: string;
  @Input() recordingTime!: string;
  @Input() recordedAudioUrl!: string;

  @Output() stopVoiceRecording = new EventEmitter<void>();
  @Output() togglePlayback = new EventEmitter<void>();
  @Output() onPlaybackEnded = new EventEmitter<void>();
  @Output() togglePauseResumeVoiceRecording = new EventEmitter<void>();

  isCancelActive = false;
}
