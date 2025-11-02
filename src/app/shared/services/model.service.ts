// modal.service.ts
import { Injectable, OnDestroy } from '@angular/core';
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
  private openModalSubject = new Subject<{ component: any; config?: ModalConfig }>();
  private closeAllModalsSubject = new Subject<void>();
  closeAllModals$: Observable<void> = this.closeAllModalsSubject.asObservable();
  openModal$ = this.openModalSubject.asObservable();

  // You can add a Subject for closing if you want to close the modal from the service
  // private closeModalSubject = new Subject<void>();
  // closeModal$ = this.closeModalSubject.asObservable();

  open(component: any, config?: ModalConfig) {
    this.openModalSubject.next({ component, config });
  }


  openFullscreen(component: any, config?: ModalConfig) {
    const fullscreenConfig: ModalConfig = {
      ...config,
      isFullscreen: true
    };
    this.openModalSubject.next({ component, config: fullscreenConfig });
  }

  openPhone(component: any, config?: ModalConfig) {
    const phoneConfig: ModalConfig = {
      ...config,
      isPhone: true
    };
    this.openModalSubject.next({ component, config: phoneConfig });
  }

  // You can call this function from anywhere to close the top-most modal
  // close() {
  //   // ModalOutletComponent will need to subscribe to this and determine which modal to close
  //   this.closeModalSubject.next();
  // }
  closeAll(): void {
    this.closeAllModalsSubject.next();
  }

  ngOnDestroy(): void {
    this.openModalSubject.complete();
    this.closeAllModalsSubject.complete();
  }
}
