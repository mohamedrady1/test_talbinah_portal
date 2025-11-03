import { PublicService } from '../../../shared/services/public.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { ToastService } from './toast-service.service';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationsFacade } from '../../core/translations/services';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  private toastService = inject(ToastService)
  toasts$ = this.toastService.toasts$;
  currentLanguage!: string;
  private translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  private publicService = inject(PublicService);
  private platformId = inject(PLATFORM_ID);
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = this.publicService.getCurrentLanguage();
    }
  }
  removeToast(id: number) {
    this.toastService.remove(id);
  }
}
