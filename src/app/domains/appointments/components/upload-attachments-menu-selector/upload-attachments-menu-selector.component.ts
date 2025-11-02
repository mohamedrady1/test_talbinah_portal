import {
  ChangeDetectionStrategy,
  EventEmitter,
  PLATFORM_ID,
  ElementRef,
  ViewChild,
  Component,
  Output,
  Input,
  inject,
  OnInit,
  OnDestroy,
  Renderer2
} from '@angular/core';
import { IGlobalPodcastItemModel, Logger } from '../../../../common';
import { CameraCaptureComponent, ModalService, SvgIconComponent, ToastService } from '../../../../shared';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SendPodcastComponent } from '../send-podcast';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-upload-attachments-menu-selector',
  standalone: true,
  imports: [
    SvgIconComponent,
    CommonModule,
    TranslateApiPipe
  ],
  templateUrl: './upload-attachments-menu-selector.component.html',
  styleUrls: ['./upload-attachments-menu-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadAttachmentsMenuSelectorComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _ModalService = inject(ModalService);
  private readonly modalService = inject(ModalService);
  private readonly renderer = inject(Renderer2);
  private readonly toast = inject(ToastService);

  @Input() showMenu: boolean = false;
  @Input() onlyImage: boolean = false;
  @Output() filesSelected = new EventEmitter<{ files: FileList | null, fileType: string }>();
  @Output() menuClosed = new EventEmitter<void>();
  @Output() selectedPodcast = new EventEmitter<IGlobalPodcastItemModel | null>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('imageFileInput') imageFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('videoFileInput') videoFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('documentFileInput') documentFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('attachmentMenuContainer') attachmentMenuContainer!: ElementRef<HTMLElement>;
  @ViewChild('videoStream') videoStream!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasCapture') canvasCapture!: ElementRef<HTMLCanvasElement>;

  public capturedImageUrl: string | null = null;
  private cameraStream: MediaStream | null = null;
  private fileType: string = '';
  private clickListenerCleanup?: () => void;

  ngOnInit(): void {
    this.addClickListener();
  }

  ngOnDestroy(): void {
    this.cleanupClickListener();
  }

  private addClickListener(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.clickListenerCleanup = this.renderer.listen('document', 'click', (event: Event) => {
      if (this.showMenu && this.attachmentMenuContainer?.nativeElement) {
        const target = event.target as HTMLElement;
        if (!this.attachmentMenuContainer.nativeElement.contains(target)) {
          this.closeMenu();
        }
      }
    });
  }

  private cleanupClickListener(): void {
    if (this.clickListenerCleanup) {
      this.clickListenerCleanup();
      this.clickListenerCleanup = undefined;
    }
  }

  protected closeMenu(): void {
    this.menuClosed.emit();
  }

  protected onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (this.fileType === 'image' && files && files.length > 0) {
      const validImages = Array.from(files).filter(file => file.type.startsWith('image/'));
      if (validImages.length === 0) {
        this.toast.add({
          severity: 'error',
          summary: 'error',
          detail: 'error_to_delete_post',
          life: 3000
        }); this.clearFileInputs();
        return;
      }
    }

    this.filesSelected.emit({ files: input.files, fileType: this.fileType });
    this.menuClosed.emit();
    this.clearFileInputs();
  }

  protected triggerFileInput(type: 'podcast' | 'image' | 'camera' | 'video' | 'document'): void {
    if (!isPlatformBrowser(this.platformId)) {
      Logger.warn('Camera functionality is only available in browser environment.');
      return;
    }
    this.fileType = type;
    switch (type) {
      case 'image':
        this.imageFileInput.nativeElement.click();
        break;
      case 'video':
        this.videoFileInput.nativeElement.click();
        break;
      case 'podcast':
        this.openAllPodcastsPopup();
        break;
      case 'document':
        this.documentFileInput.nativeElement.click();
        break;
      case 'camera':
        this.openDeviceCamera();
        break;
      default:
        this.fileInput.nativeElement.click();
        break;
    }
  }

  protected async openDeviceCamera(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    this.modalService.open(CameraCaptureComponent, {
      inputs: { title: 'camera' },
      outputs: {
        closed: (res: { status?: boolean, item: FileList | null } | null) => {
          if (res?.status) {
            this.filesSelected.emit({ files: res.item, fileType: 'image' });
            this.menuClosed.emit();
          }
          this.menuClosed.emit();
        }
      },
      width: '70%',
      height: '90%'
    });
  }

  public captureImageFromStream(): void {
    const video = this.videoStream.nativeElement;
    const canvas = this.canvasCapture.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.capturedImageUrl = canvas.toDataURL('image/png');
    }
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }
    video.srcObject = null;
  }

  protected openAllPodcastsPopup(): void {
    this._ModalService.open(SendPodcastComponent, {
      inputs: {
        image: 'images/podcast/icons/mic.png',
        title: 'send_podcast',
        subtitle: 'share_podcast_with_doctor2'
      },
      width: '50%',
      outputs: {
        closed: (res: { status?: boolean, item: IGlobalPodcastItemModel | null } | null) => {
          if (res?.item) {
            this.selectedPodcast.emit(res.item);
          }
          this.menuClosed.emit();
        }
      }
    })
  }

  public clearFileInputs(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.fileInput) this.fileInput.nativeElement.value = '';
    if (this.imageFileInput) this.imageFileInput.nativeElement.value = '';
    if (this.videoFileInput) this.videoFileInput.nativeElement.value = '';
    if (this.documentFileInput) this.documentFileInput.nativeElement.value = '';
  }
}
