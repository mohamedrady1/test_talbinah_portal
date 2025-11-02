import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { Logger } from '../../../../common';
@Component({
  selector: 'app-chat-message-voice',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './chat-message-voice.component.html',
  styleUrls: ['./chat-message-voice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessageVoiceComponent {
  @Input() item!: any;
  @Input() audioSrc!: string | any;
  @Input() replay: boolean = false;
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;
  @ViewChild('speedControl') speedControlRef!: ElementRef<HTMLDivElement>;
  @ViewChild('waveformContainer') waveformContainerRef!: ElementRef<HTMLDivElement>; // Reference to waveform container

  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  progressPercentage: number = 0;
  displayDuration: string = '00:00';
  playbackSpeed: number = 1;
  displaySpeed: string = 'x1';
  safeAudioUrl: SafeUrl | undefined;

  isSeeking: boolean = false; // New: To track if user is dragging the seeker

  private audio!: HTMLAudioElement;
  private animationFrameId: number = 0;

  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (this.audioSrc) {
      this.safeAudioUrl = this.sanitizer.bypassSecurityTrustUrl(this.audioSrc);
    }
  }

  ngAfterViewInit(): void {
    this.audio = this.audioPlayerRef.nativeElement;

    Logger.debug('ChatMessageVoiceComponent', 'Initializing audio player with TIME:', this.item);
    this.audio.addEventListener('loadedmetadata', () => {
      if (this.item?.recorderTimer) {
        // Parse timer string like "00:00:05" to total seconds
        this.duration = parseRecorderTimer(this.item.recorderTimer);
      } else if (isFinite(this.audio.duration)) {
        // Fallback: use audio duration if backend didn’t provide
        this.duration = this.audio.duration;
      }

      this.displayDuration = this.formatTime(this.duration);
      this.cdr.detectChanges();
    });


    this.audio.addEventListener('timeupdate', () => {
      // Only update progress if not currently seeking to prevent jumps
      if (!this.isSeeking) {
        this.currentTime = this.audio.currentTime;
        this.progressPercentage = (this.currentTime / this.duration) * 100;
        this.displayDuration = this.formatTime(this.currentTime) + '/' + this.formatTime(this.duration);
        this.cdr.detectChanges();
      }
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.currentTime = 0;
      this.progressPercentage = 0; // Reset progress
      this.displayDuration = this.formatTime(this.duration);
      this.cdr.detectChanges();
    });
  }

  togglePlayPause(): void {
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play().catch(e => console.error('Error playing audio:', e));
    }
    this.isPlaying = !this.isPlaying;
    this.cdr.detectChanges();
  }

  // --- Playback Speed Control ---
  private playbackSpeeds = [1, 1.5, 2];
  private currentSpeedIndex = 0;

  togglePlaybackSpeed(): void {
    this.currentSpeedIndex = (this.currentSpeedIndex + 1) % this.playbackSpeeds.length;
    this.playbackSpeed = this.playbackSpeeds[this.currentSpeedIndex];
    this.audio.playbackRate = this.playbackSpeed;
    this.displaySpeed = `x${this.playbackSpeed}`;
    this.cdr.detectChanges();
  }

  // --- Seeker / Scrubbing functionality ---

  // Event handler for clicking anywhere on the waveform to seek
  seek(event: MouseEvent): void {
    const waveformRect = this.waveformContainerRef.nativeElement.getBoundingClientRect();
    const clickX = event.clientX - waveformRect.left; // X position relative to waveform container
    const percentage = (clickX / waveformRect.width);
    const newTime = this.duration * percentage;

    this.audio.currentTime = newTime;
    this.currentTime = newTime; // Update current time immediately
    this.progressPercentage = percentage * 100;
    this.cdr.detectChanges();

    if (!this.isPlaying) { // If not playing, start playing after seeking
      this.audio.play().catch(e => console.error('Error playing audio after seeking:', e));
      this.isPlaying = true;
    }
  }

  // Event handler for starting to drag the seeker
  startSeeking(event: MouseEvent): void {
    // Check if the event target is the seeker itself or the waveform container
    if ((event.target as HTMLElement).classList.contains('voice-message__seeker') ||
      (event.target as HTMLElement).classList.contains('voice-message__waveform')) {
      this.isSeeking = true;
      // If we clicked directly on the waveform, also seek to that point
      if ((event.target as HTMLElement).classList.contains('voice-message__waveform')) {
        this.seek(event);
      }
      this.audio.pause(); // Pause audio when seeking starts
      this.cdr.detectChanges();
    }
  }

  // Listen for mousemove and mouseup globally when seeking is active
  @HostListener('document:mousemove', ['$event'])
  onSeeking(event: MouseEvent): void {
    if (!this.isSeeking) return;

    const waveformRect = this.waveformContainerRef.nativeElement.getBoundingClientRect();
    let clientX = event.clientX;

    // Clamp clientX within the waveform container bounds
    if (clientX < waveformRect.left) {
      clientX = waveformRect.left;
    } else if (clientX > waveformRect.right) {
      clientX = waveformRect.right;
    }

    const newX = clientX - waveformRect.left;
    const percentage = (newX / waveformRect.width);
    const newTime = this.duration * percentage;

    this.currentTime = newTime;
    this.progressPercentage = percentage * 100;
    this.displayDuration = this.formatTime(this.currentTime) + '/' + this.formatTime(this.duration);
    this.cdr.detectChanges();
  }

  @HostListener('document:mouseup')
  stopSeeking(): void {
    if (this.isSeeking) {
      this.isSeeking = false;
      this.audio.currentTime = this.currentTime; // Set audio current time to the dragged position
      if (this.isPlaying) { // Resume playing if it was playing before seeking
        this.audio.play().catch(e => console.error('Error resuming audio:', e));
      } else {
        // If it wasn't playing, update the displayed duration to total duration after seeking
        this.displayDuration = this.formatTime(this.duration);
      }
      this.cdr.detectChanges();
    }
  }

  // --- Helper Functions ---
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  getWaveformBars(): number[] {
    const numberOfBars = 40; // Adjust as needed
    const bars = [];
    for (let i = 0; i < numberOfBars; i++) {
      bars.push(i);
    }
    return bars;
  }

  isBarActive(index: number): boolean {
    const activeBarsCount = Math.floor((this.progressPercentage / 100) * this.getWaveformBars().length);
    return index < activeBarsCount;
  }

  ngOnDestroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio.load();
    }
    cancelAnimationFrame(this.animationFrameId);
    // Remove global event listeners to prevent memory leaks, especially when using @HostListener
    // Although @HostListener on document generally cleans up, explicit removal can be safer in complex scenarios.
    // For simple cases like this, Angular typically handles it.
  }
}

export function parseRecorderTimer(timer: string): number {
  const parts = timer.split(':').map(Number);
  if (parts.length === 3) {
    const [hh, mm, ss] = parts;
    return (hh * 3600) + (mm * 60) + ss;
  } else if (parts.length === 2) {
    const [mm, ss] = parts;
    return (mm * 60) + ss;
  }
  return 0;
}
