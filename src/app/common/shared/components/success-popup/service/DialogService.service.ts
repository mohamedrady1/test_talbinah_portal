import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private isOpen = new BehaviorSubject<boolean>(false);
  private message = new BehaviorSubject<string>('');
  private isSuccess = new BehaviorSubject<boolean>(true);

  isOpen$ = this.isOpen.asObservable();
  message$ = this.message.asObservable();
  isSuccess$ = this.isSuccess.asObservable();

  openDialog(message: string, success: boolean = true) {
    this.message.next(message);
    this.isSuccess.next(success);
    this.isOpen.next(true);
  }

  closeDialog() {
    this.isOpen.next(false);
  }
}
