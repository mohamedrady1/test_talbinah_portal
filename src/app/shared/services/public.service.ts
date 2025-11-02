import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { StorageService } from '../../common';
import { StorageKeys } from '../config';
import { DEFAULT_LANGUAGE_CODE } from '../../domains/header';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  private translate = inject(TranslateService);
  private platformId = inject(PLATFORM_ID);
  readonly storage = inject(StorageService);

  show_loader = new Subject<boolean>();
  resetTable = new BehaviorSubject<boolean>(false);
  changePageSub = new BehaviorSubject<{}>({});

  constructor() {
    this.initLanguage();
  }

  private initLanguage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = this.storage.getItem(StorageKeys.LANGUAGE) || this.translate.getDefaultLang();
      this.translate.use(savedLang as string);
    }
  }

  translateTextFromJson(text: string): string {
    return this.translate.instant(text);
  }

  getCurrentLanguage(): string {
    if (isPlatformBrowser(this.platformId)) {
      return this.storage.getItem(StorageKeys.LANGUAGE) || this.translate.currentLang || this.translate.getDefaultLang();
    }
    return DEFAULT_LANGUAGE_CODE;
  }

  validateAllFormFields(form: any): void {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  clearValidationErrors(control: AbstractControl): void {
    control.markAsUntouched();
    control.markAsPending();
  }
}
