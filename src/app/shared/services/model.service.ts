/* ---------- Angular Core ---------- */
import { Injectable, OnDestroy, Type } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ModalConfig {
  inputs?: {
    [key: string]: any;
    image?: string;
    title?: string;
    subtitle?: string;
    data?: any;
  };
  outputs?: {
    [key: string]: (data: any) => void;
  };
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  isFullscreen?: boolean;
  isPhone?: boolean;
  isPhoneFromDown?: boolean;
  showHeader?: boolean;
  showMobileHeader?: boolean;
  overflow?: boolean;
  onCloseClick?: () => void;
  backgroundColor?: string;
  closeOnBackdropClick?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ModalService implements OnDestroy {
  private openModalSubject = new Subject<{ component: Type<any>; config?: ModalConfig }>();
  private closeAllModalsSubject = new Subject<void>();

  closeAllModals$: Observable<void> = this.closeAllModalsSubject.asObservable();
  openModal$ = this.openModalSubject.asObservable();

  /**
   * Open a modal with the specified component and configuration
   * @param component - The component class (Type) to render in the modal
   * @param config - Modal configuration options
   */
  open(component: Type<any>, config?: ModalConfig): void {
    if (!component) {
      console.error('ModalService: Component is undefined or null');
      return;
    }

    this.openModalSubject.next({ component, config });
  }

  /**
   * Open a fullscreen modal
   * @param component - The component class to render
   * @param config - Additional modal configuration
   */
  openFullscreen(component: Type<any>, config?: ModalConfig): void {
    const fullscreenConfig: ModalConfig = {
      ...config,
      isFullscreen: true
    };
    this.open(component, fullscreenConfig);
  }

  /**
   * Open a phone-optimized modal
   * @param component - The component class to render
   * @param config - Additional modal configuration
   */
  openPhone(component: Type<any>, config?: ModalConfig): void {
    const phoneConfig: ModalConfig = {
      ...config,
      isPhone: true
    };
    this.open(component, phoneConfig);
  }

  /**
   * Close all currently open modals
   */
  closeAll(): void {
    this.closeAllModalsSubject.next();
  }

  ngOnDestroy(): void {
    this.openModalSubject.complete();
    this.closeAllModalsSubject.complete();
  }
}
