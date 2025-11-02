import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeletePopupService {
  private isOpen = new BehaviorSubject<boolean>(false);
  private popupData = new BehaviorSubject<{
    title: string;
    message: string;
    confirmLabel: string;
    cancelLabel: string;
    onConfirm: () => void;
    onCancel: () => void;
  } | null>(null);

  isOpen$ = this.isOpen.asObservable();
  popupData$ = this.popupData.asObservable();

  openPopup(
    title: string,
    message: string,
    confirmLabel: string = 'Delete',
    cancelLabel: string = 'Cancel',
    onConfirm: () => void,
    onCancel: () => void
  ) {
    this.popupData.next({ title, message, confirmLabel, cancelLabel, onConfirm, onCancel });
    this.isOpen.next(true);
  }

  closePopup() {
    this.isOpen.next(false);
  }

  confirmDelete() {
    const data = this.popupData.getValue();
    if (data && data.onConfirm) {
      data.onConfirm();
    }
    this.closePopup();
  }

  cancelDelete() {
    const data = this.popupData.getValue();
    if (data && data.onCancel) {
      data.onCancel();
    }
    this.closePopup();
  }
}
