import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, ComponentRef, WritableSignal, signal, PLATFORM_ID, inject, ElementRef, EnvironmentInjector, ChangeDetectionStrategy } from '@angular/core';
import { ModalService, ModalConfig } from '../../services/model.service';
import { isPlatformBrowser } from '@angular/common';
import { ModalHostComponent } from '../modal-host/modal-host.component';
import { Logger } from '../../../common';

interface ActiveModal {
  hostRef: ComponentRef<ModalHostComponent>;
  config?: ModalConfig;
  componentRef: ComponentRef<any> | null;
}

@Component({
  selector: 'app-modal-outlet',
  standalone: true,
  imports: [],
  templateUrl: './modal-outlet.component.html',
  styleUrls: ['./modal-outlet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalOutletComponent implements OnInit, OnDestroy {
  @ViewChild('vc', { read: ViewContainerRef, static: false }) vc!: ViewContainerRef;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private modalService = inject(ModalService);

  readonly activeModals: WritableSignal<ActiveModal[]> = signal([]);
  private subscriptions: any[] = [];

  ngOnInit() {
    this.subscriptions.push(
      this.modalService.openModal$.subscribe(({ component, config }) => {
        this.open(component, config);
      })
    );
    this.subscriptions.push(
      this.modalService.closeAllModals$.subscribe(() => {
        this.closeAllModals();
      })
    );
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];

    // Clean up modals
    this.closeAllModals();
  }

  open(component: any, config?: ModalConfig): void {
    const zIndex = 1000 + (this.activeModals().length * 10);
    const isMobile = isPlatformBrowser(this.platformId) && window.innerWidth < 768;

    // Only use bottom sheet if explicitly enabled AND on mobile
    const shouldUseBottomSheet = config?.isPhoneFromDown === true && isMobile;

    const hostComponentRef = this.vc.createComponent(ModalHostComponent, {
      environmentInjector: this.environmentInjector
    });

    hostComponentRef.instance.component = component;
    hostComponentRef.instance.config = config;
    hostComponentRef.instance.headerConfig = {
      ...config?.inputs,
      onCloseClick: config?.onCloseClick
    };

    // Handle bottom sheet or regular modal
    if (shouldUseBottomSheet) {
      // Bottom sheet mode (when explicitly enabled)
      hostComponentRef.instance.isPhoneFromDown = true;
      hostComponentRef.instance.modalWidth = '100%';
      hostComponentRef.instance.modalHeight = config?.height || '50%';
      hostComponentRef.instance.minWidth = '100%';
      hostComponentRef.instance.maxWidth = '100%';
      hostComponentRef.instance.minHeight = config?.minHeight || '40%';
      hostComponentRef.instance.maxHeight = config?.maxHeight || '80%';
      hostComponentRef.instance.showHeader = false;
      hostComponentRef.instance.overflow = config?.overflow || false;
      hostComponentRef.instance.backgroundColor = config?.backgroundColor || 'auto';
    } else if (isMobile) {
      // Mobile fullscreen mode (default for mobile)
      hostComponentRef.instance.modalWidth = '100%';
      hostComponentRef.instance.modalHeight = '100%';
      hostComponentRef.instance.minWidth = '100%';
      hostComponentRef.instance.maxWidth = '100%';
      hostComponentRef.instance.minHeight = '100%';
      hostComponentRef.instance.maxHeight = '100%';
      hostComponentRef.instance.isFullscreen = true;
      hostComponentRef.instance.showHeader = false;
      hostComponentRef.instance.isPhoneFromDown = false;
      hostComponentRef.instance.showMobileHeader = config?.showMobileHeader !== false;
      hostComponentRef.instance.overflow = config?.overflow || false;
      hostComponentRef.instance.backgroundColor = config?.backgroundColor || 'auto';
    } else {
      // Desktop mode
      hostComponentRef.instance.modalWidth = config?.width || 'auto';
      hostComponentRef.instance.modalHeight = config?.height || 'auto';
      hostComponentRef.instance.minWidth = config?.minWidth || 'auto';
      hostComponentRef.instance.maxWidth = config?.maxWidth || 'auto';
      hostComponentRef.instance.minHeight = config?.minHeight || 'auto';
      hostComponentRef.instance.maxHeight = config?.maxHeight || 'auto';
      hostComponentRef.instance.showHeader = config?.showHeader !== false;
      hostComponentRef.instance.isPhone = false;
      hostComponentRef.instance.isPhoneFromDown = false;
      hostComponentRef.instance.overflow = config?.overflow || false;
      hostComponentRef.instance.backgroundColor = config?.backgroundColor || 'auto';
    }

    hostComponentRef.instance.zIndex = zIndex;

    // Override with fullscreen if explicitly requested
    if (config?.isFullscreen) {
      hostComponentRef.instance.isFullscreen = true;
      hostComponentRef.instance.modalWidth = '100%';
      hostComponentRef.instance.modalHeight = '100%';
      hostComponentRef.instance.minWidth = '100%';
      hostComponentRef.instance.maxWidth = '100%';
      hostComponentRef.instance.minHeight = '100%';
      hostComponentRef.instance.maxHeight = '100%';
      hostComponentRef.instance.isPhoneFromDown = false;
      hostComponentRef.instance.backgroundColor = config?.backgroundColor || 'auto';
    }

    this.subscriptions.push(
      hostComponentRef.instance.closeRequested.subscribe((data: any) => {
        this.onCloseRequested(hostComponentRef, data);
      })
    );

    this.subscriptions.push(
      hostComponentRef.instance.fullscreenToggled.subscribe((isFullscreen: boolean) => {
        this.handleFullscreenToggle(hostComponentRef, isFullscreen);
      })
    );

    this.subscriptions.push(
      hostComponentRef.instance.openFullScreen.subscribe(() => {
        this.handleFullscreenToggle(hostComponentRef, true);
      })
    );

    const modalIndex = this.activeModals().length;
    this.activeModals.update(modals => [...modals, { hostRef: hostComponentRef, config: config, componentRef: null }]);

    // Store component reference after creation
    setTimeout(() => {
      const componentRef = hostComponentRef.instance.getHostedComponentRef();
      if (componentRef) {
        this.activeModals.update(modals => {
          const updatedModals = [...modals];
          if (updatedModals[modalIndex]) {
            updatedModals[modalIndex].componentRef = componentRef;
          }
          return updatedModals;
        });
      }
    }, 0);
  }

  protected onCloseRequested(hostRefToClose: ComponentRef<ModalHostComponent>, data: any = null): void {
    const modals = this.activeModals();
    const indexToClose = modals.findIndex(modal => modal.hostRef === hostRefToClose);

    if (indexToClose > -1) {
      const modalToClose = modals[indexToClose];

      if (modalToClose.config?.outputs?.['onClose']) {
        const result = modalToClose.hostRef.instance.hostedComponentData ?? data ?? null;
        modalToClose.config.outputs['onClose'](result);
      }

      // Clean up component reference first
      if (modalToClose.componentRef) {
        modalToClose.componentRef.destroy();
        modalToClose.componentRef = null;
      }

      // Clean up host component
      modalToClose.hostRef.destroy();

      this.activeModals.update(currentModals => currentModals.filter((_, index) => index !== indexToClose));

      if (isPlatformBrowser(this.platformId) && document.fullscreenElement) {
        if (document.fullscreenElement === modalToClose.hostRef.instance.modalContent.nativeElement) {
          document.exitFullscreen().catch(() => { });
        }
      }
    }
  }

  private handleFullscreenToggle(modalHostRef: ComponentRef<ModalHostComponent>, isFullscreen: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      const contentEl = modalHostRef.instance.modalContent.nativeElement;
      if (isFullscreen) {
        contentEl.requestFullscreen().then(() => {
          modalHostRef.instance.isFullscreen = true;
        }).catch((err: any) => {
          console.error('Failed to enter fullscreen:', err);
          modalHostRef.instance.isFullscreen = false;
        });
      } else {
        document.exitFullscreen().then(() => {
          modalHostRef.instance.isFullscreen = false;
        });
      }
    }
  }

  closeTopModal(): void {
    const modals = this.activeModals();
    if (modals.length > 0) {
      const topModal = modals[modals.length - 1];
      this.onCloseRequested(topModal.hostRef);
    }
  }

  closeAllModals(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => { });
      }
    }

    this.activeModals().forEach(modal => {
      if (modal.config?.outputs?.['onClose']) {
        modal.config.outputs['onClose'](null);
      }
      // Clean up component reference first
      if (modal.componentRef) {
        modal.componentRef.destroy();
        modal.componentRef = null;
      }
      // Clean up host component
      modal.hostRef.destroy();
    });

    this.activeModals.set([]);
    this.vc.clear();
    Logger.debug('All modals have been closed.');
  }
}
