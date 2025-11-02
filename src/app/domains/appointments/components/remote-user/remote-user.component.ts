import { Component, Input, AfterViewInit, ViewChild, ElementRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Logger } from '../../../../common';

@Component({
  selector: 'app-remote-user',
  standalone: true,
  imports: [],
  templateUrl: './remote-user.component.html',
  styleUrls: ['./remote-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoteUserComponent implements AfterViewInit, OnDestroy {
  @Input() user: any;
  @ViewChild('video') videoRef!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.setupUserTracks();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private setupUserTracks(): void {
    if (!this.user) return;

    // Setup video track
    if (this.user.videoTrack && this.videoRef?.nativeElement) {
      try {
        this.user.videoTrack.play(this.videoRef.nativeElement);
        Logger.debug(`[RemoteUser] Video track playing for user ${this.user.uid}`);
      } catch (error) {
        Logger.error(`[RemoteUser] Error playing video for user ${this.user.uid}:`, error);
      }
    }

    // Setup audio track
    if (this.user.audioTrack) {
      try {
        this.user.audioTrack.play();
        Logger.debug(`[RemoteUser] Audio track playing for user ${this.user.uid}`);
      } catch (error) {
        Logger.error(`[RemoteUser] Error playing audio for user ${this.user.uid}:`, error);
      }
    }
  }

  private cleanup(): void {
    if (this.user?.videoTrack) {
      try {
        this.user.videoTrack.stop();
        if (this.videoRef?.nativeElement) {
          this.videoRef.nativeElement.innerHTML = '';
        }
      } catch (error) {
        Logger.error(`[RemoteUser] Error cleaning up video for user ${this.user.uid}:`, error);
      }
    }
  }
}
