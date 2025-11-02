import { Component, ElementRef, ViewChild, Input, Output, EventEmitter, OnInit, OnDestroy, signal, inject, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FirestoreService } from '../../../common/core/services/firestore.service';

@Component({
  selector: 'app-camera-capture',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './camera-capture.component.html',
  styleUrls: ['./camera-capture.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CameraCaptureComponent implements OnInit, OnDestroy {
  @ViewChild('videoStream') videoElement!: ElementRef<HTMLVideoElement>;
  @Input() title: string = 'camera';
  @Output() onImageCaptured = new EventEmitter<string>();
  @Output() onVideoCaptured = new EventEmitter<Blob>();
  @Output() protected closed = new EventEmitter<{ status?: boolean, item: FileList | null }>(); // تم تعديل نوع الـ item

  private platformId = inject(PLATFORM_ID);
  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private isBrowser = isPlatformBrowser(this.platformId);
  private _FirestoreService = inject(FirestoreService);

  isStreamActive = signal(false);
  capturedImage = signal<string | null>(null);
  isRecording = signal(false);
  recordingTime = signal(0);
  isVideoMode = signal(false);
  private recordingInterval: any;

  ngOnInit() {
    if (this.isBrowser) {
      setTimeout(() => this.startCamera(), 100);
    }
  }

  ngOnDestroy() {
    this.stopCamera();
    this.stopRecording();
  }

  async startCamera() {
    if (!this.isBrowser) return;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        },
        audio: this.isVideoMode()
      });

      if (this.videoElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
        this.isStreamActive.set(true);
      }
    } catch (error) {
      console.error('حدث خطأ أثناء الوصول إلى الكاميرا:', error);
      this.closed.emit({ status: false, item: null });
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
      this.isStreamActive.set(false);
    }
  }

  toggleMode() {
    this.isVideoMode.set(!this.isVideoMode());
    this.capturedImage.set(null);
    this.stopRecording();
    this.stopCamera();
    setTimeout(() => this.startCamera(), 100);
  }

  captureImage() {
    if (!this.videoElement || !this.isStreamActive() || this.isVideoMode()) return;

    const canvas = document.createElement('canvas');
    const video = this.videoElement.nativeElement;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const filename = `captured_image_${Date.now()}.jpeg`;
          const file = new File([blob], filename, { type: 'image/jpeg' });
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          const fileList: FileList = dataTransfer.files;
          this.closed.emit({ status: true, item: fileList });
        } else {
          console.error('فشل تحويل الصورة إلى Blob.');
          this.closed.emit({ status: false, item: null });
        }
      }, 'image/jpeg', 0.8);
    }
  }

  startRecording() {
    if (!this.stream || !this.isVideoMode()) return;

    this.recordedChunks = [];
    const options = { mimeType: 'video/webm; codecs=vp8,opus' };
    try {
      this.mediaRecorder = new MediaRecorder(this.stream, options);
    } catch (e) {
      console.error('MediaRecorder غير مدعوم أو تنسيق خاطئ:', e);
      this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: 'video/webm' });
    }

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
      const filename = `captured_video_${Date.now()}.webm`;
      const file = new File([blob], filename, { type: blob.type });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const fileList: FileList = dataTransfer.files;

      this.closed.emit({ status: true, item: fileList });
      this.stopRecording();
    };

    this.mediaRecorder.start();
    this.isRecording.set(true);
    this.startRecordingTimer();
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording()) {
      this.mediaRecorder.stop();
      this.recordingTime.set(0);
      if (this.recordingInterval) {
        clearInterval(this.recordingInterval);
        this.recordingInterval = null;
      }
    }
  }

  startRecordingTimer() {
    this.recordingTime.set(0);
    this.recordingInterval = setInterval(() => {
      this.recordingTime.set(this.recordingTime() + 1);
    }, 1000);
  }

  retakePhoto() {
    this.capturedImage.set(null);
    this.startCamera();
  }

  usePhoto() {
    const imageData = this.capturedImage();
    if (imageData) {
      this.onImageCaptured.emit(imageData);
      this.closed.emit({ status: true, item: null });
    }
  }

  closeCamera() {
    this.stopCamera();
    this.stopRecording();
    this.capturedImage.set(null);
    this.closed.emit({ status: false, item: null });
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
