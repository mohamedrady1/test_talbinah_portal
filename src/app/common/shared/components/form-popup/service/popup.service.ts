import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  isOpen$ = this.isOpenSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();

  private formConfigSubject = new BehaviorSubject<any>({
    popupTitle: '',
    popupBtnTitle: '',
    fields: []
  });
  formConfig$ = this.formConfigSubject.asObservable();

  openPopup(config: { popupTitle: string; popupBtnTitle: string; fields: any[] }) {
    this.formConfigSubject.next(config);
    this.isOpenSubject.next(true);
  }

  closePopup() {
    this.isOpenSubject.next(false);
  }
  setLoading(state: boolean) {
    this.isLoadingSubject.next(state);
  }
}

