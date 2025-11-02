import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  Input,
  Output,
  EventEmitter,
  PLATFORM_ID,
  inject,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  EnvironmentInjector,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from '../header';
import { TranslateModule } from '@ngx-translate/core';
import { SiteHeaderComponent } from '../../../domains';

@Component({
  selector: 'app-modal-host',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TranslateModule, SiteHeaderComponent],
  templateUrl: './modal-host.component.html',
  styleUrls: ['./modal-host.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalHostComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('hostVc', { read: ViewContainerRef, static: false }) hostVc!: ViewContainerRef;
  @ViewChild('modalContent', { static: true }) modalContent!: ElementRef<HTMLElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private subscriptions: any[] = [];

  @Input() component: any;
  @Input() config: any;
  @Input() headerConfig: any;
  @Input() modalWidth: string = 'auto';
  @Input() modalHeight: string = 'auto';
  @Input() minWidth: string = 'auto';
  @Input() maxWidth: string = 'auto';
  @Input() minHeight: string = 'auto';
  @Input() backgroundColor: string = 'auto';
  @Input() maxHeight: string = 'auto';

  @Input() isFullscreen: boolean = false;
  @Input() isPhone: boolean = false;
  @Input() isPhoneFromDown: boolean = false;
  @Input() overflow: boolean = false;
  @Input() zIndex: number = 1000;
  @Input() showHeader: boolean = true;
  @Input() showMobileHeader: boolean = false;

  @Output() closeRequested = new EventEmitter<any>();
  @Output() fullscreenToggled = new EventEmitter<boolean>();
  @Output() openFullScreen = new EventEmitter<void>();

  private componentRef: ComponentRef<any> | null = null;
  private isDragging = false;
  private startY = 0;
  private currentY = 0;
  readonly showCloseButton = computed(() => this.headerConfig?.showCloseButton ?? true);
  ngOnInit() { }

  ngAfterViewInit() {
    if (this.hostVc) {
      this.renderComponent();
    } else {
      console.error('hostVc is still undefined in ngAfterViewInit. Please check template or query.');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['component'] && !changes['component'].firstChange) {
      this.renderComponent();
    }
  }

  get hostedComponentData(): any {
    return this.componentRef?.instance?.data ?? null;
  }

  getHostedComponentRef(): ComponentRef<any> | null {
    return this.componentRef;
  }

  onDragStart(event: TouchEvent | MouseEvent): void {
    if (!this.isPhoneFromDown) return;

    this.isDragging = true;
    this.startY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    this.currentY = this.startY;

    document.addEventListener('mousemove', this.onDragMove.bind(this));
    document.addEventListener('mouseup', this.onDragEnd.bind(this));
    document.addEventListener('touchmove', this.onDragMove.bind(this));
    document.addEventListener('touchend', this.onDragEnd.bind(this));
  }

  onDragMove(event: TouchEvent | MouseEvent): void {
    if (!this.isDragging || !this.isPhoneFromDown) return;

    event.preventDefault();
    this.currentY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    const deltaY = this.currentY - this.startY;

    if (deltaY > 0) {
      const modalElement = this.modalContent.nativeElement;
      modalElement.style.transform = `translateY(${deltaY}px)`;
    }
  }

  onDragEnd(event: TouchEvent | MouseEvent): void {
    if (!this.isDragging || !this.isPhoneFromDown) return;

    this.isDragging = false;
    const deltaY = this.currentY - this.startY;

    document.removeEventListener('mousemove', this.onDragMove.bind(this));
    document.removeEventListener('mouseup', this.onDragEnd.bind(this));
    document.removeEventListener('touchmove', this.onDragMove.bind(this));
    document.removeEventListener('touchend', this.onDragEnd.bind(this));

    const modalElement = this.modalContent.nativeElement;

    if (deltaY > 100) {
      modalElement.style.animation = 'slideDown 0.3s ease-out forwards';
      setTimeout(() => {
        this.closeRequested.emit();
      }, 300);
    } else {
      modalElement.style.transform = 'translateY(0)';
    }
  }

  private renderComponent(): void {
    if (!this.hostVc) {
      console.error('hostVc is undefined in renderComponent. This should not happen after ngAfterViewInit.');
      return;
    }

    // Clean up previous subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];

    // Clean up previous component
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }

    this.hostVc.clear();

    // Create component with proper environment injector for Angular 19
    this.componentRef = this.hostVc.createComponent(this.component, {
      environmentInjector: this.environmentInjector
    });

    if (this.config?.inputs) {
      Object.entries(this.config.inputs).forEach(([key, value]) => {
        if (this.componentRef && this.componentRef.instance) {
          this.componentRef.instance[key] = value;
        }
      });
    }

    if (this.config?.outputs) {
      Object.entries(this.config.outputs).forEach(([key, handler]) => {
        const output = this.componentRef?.instance[key];
        if (output && typeof output.subscribe === 'function') {
          this.subscriptions.push(
            output.subscribe((data: any) => {
              if (typeof handler === 'function') {
                (handler as (data: any) => void)(data);
              }

              const closeOutputNames = ['onClose', 'close', 'closed'];
              if (closeOutputNames.includes(key)) {
                this.closeRequested.emit(data);
              }
            })
          );
        }
      });
    }

    if (this.componentRef?.instance?.openFullScreen && typeof this.componentRef.instance.openFullScreen.subscribe === 'function') {
      this.subscriptions.push(
        this.componentRef.instance.openFullScreen.subscribe(() => {
          this.openFullScreen.emit();
        })
      );
    }
  }

  getModalContentStyles() {
    return {
      'width': this.modalWidth,
      'height': this.modalHeight,
      'min-width': this.minWidth,
      'max-width': this.maxWidth,
      'min-height': this.minHeight,
      'max-height': this.maxHeight,
      'background': this.backgroundColor,
    };
  }

  onBackdropClick(): void {
    // Close on backdrop click for bottom sheet or if explicitly enabled
    if (this.isPhoneFromDown || this.config?.closeOnBackdropClick === true) {
      this.closeRequested.emit();
    }
  }

  onHeaderCloseRequested(): void {
    // If onCloseClick function is provided in config, call it first
    if (this.config?.onCloseClick && typeof this.config.onCloseClick === 'function') {
      this.config.onCloseClick();
    }
    // Then emit closeRequested event
    this.closeRequested.emit();
  }

  toggleFullscreen(): void {
    this.fullscreenToggled.emit(!this.isFullscreen);
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];

    // Clean up component reference
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
    if (isPlatformBrowser(this.platformId) && document.fullscreenElement === this.modalContent.nativeElement) {
      document.exitFullscreen().catch(() => { });
    }
  }
}