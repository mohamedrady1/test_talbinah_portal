import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IToast } from './interfaces/toast.interface';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<IToast[]>([]);
  toasts$ = this.toastsSubject.asObservable();
  private toastCounter = 0;

  add(toast: { severity: 'success' | 'info' | 'error' | 'warning'; summary: string; detail: string; life?: number }) {
    const newToast: IToast = {
      id: this.toastCounter++,
      ...toast,
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, newToast]);

    setTimeout(() => this.remove(newToast.id), toast.life || 5000);
  }

  remove(id: number) {
    const updatedToasts = this.toastsSubject.value.filter((toast) => toast.id !== id);
    this.toastsSubject.next(updatedToasts);
  }
}
