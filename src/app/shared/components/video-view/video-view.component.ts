import { Component, Input, ViewChild, ElementRef, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for @if
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface Ivideo {
  title: string;
  video: string;
}

@Component({
  selector: 'app-video-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-view.component.html',
  styleUrls: ['./video-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoViewComponent implements OnInit {
  @Input() config!: Ivideo;
  private sanitizer = inject(DomSanitizer)
  @ViewChild('videoElement') videoElementRef!: ElementRef<HTMLVideoElement>;

  // Signal to track play/pause state
  isPlaying = signal<boolean>(false);

  // New signal to store the sanitized video URL
  sanitizedVideoUrl = signal<SafeUrl | null>(null);

  constructor() { } // Inject DomSanitizer

  ngOnInit(): void {
    // Sanitize the video URL here to prevent potential XSS attacks
    if (this.config && this.config.video) {
      this.sanitizedVideoUrl.set(this.sanitizer.bypassSecurityTrustUrl(this.config.video));
      console.log('VideoViewComponent initialized with sanitized video URL:', this.sanitizedVideoUrl());
    } else {
      console.warn('VideoViewComponent received no video URL in config.');
    }
  }

  ngAfterViewInit(): void {
    const video = this.videoElementRef.nativeElement;

    video.onplay = () => this.isPlaying.set(true);
    video.onpause = () => this.isPlaying.set(false);
    video.onended = () => this.isPlaying.set(false);
  }

  /**
   * Toggles the play/pause state of the video.
   * Called when the overlay is clicked.
   */
  togglePlayPause(): void {
    const video = this.videoElementRef.nativeElement;

    if (video.paused || video.ended) {
      video.play().catch(error => console.error('Error playing video:', error));
    } else {
      video.pause();
    }
  }
}
