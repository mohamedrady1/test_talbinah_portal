import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Logger, StorageService } from '../../../../common';
import { KhawiikBotRoutesEnum } from '../../../talbinah-bot/constants';
import { ModalService, StorageKeys } from '../../../../shared';
import { RoleGuardService, UserContextService } from '../../../authentication';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-rate-your-compatibility',
  standalone: true,
  imports: [TranslateModule, ],
  templateUrl: './rate-your-compatibility.component.html',
  styleUrls: ['./rate-your-compatibility.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RateYourCompatibilityComponent implements OnInit, OnDestroy {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  
  @Input({ required: true }) doctorId!: number | string;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly _router = inject(Router);
  private readonly _modalService = inject(ModalService);
  private readonly _StorageService = inject(StorageService);
  private readonly _RoleGuardService = inject(RoleGuardService);
  private readonly _UserContextService = inject(UserContextService);

  // Auth state
  private readonly token = signal<string | null>(
    this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null
  );
  protected readonly isLoggedIn = computed(() => !!this.token());

  // Subscription for re-attempting action after login
  private recallUserDataSubscription?: Subscription;
  private pendingNavigation = false;

  protected refreshLoginStatus(): void {
    this.token.set(this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null);
  }

  ngOnInit(): void {
    // Subscribe to login state changes to retry navigation after user logs in
    this.recallUserDataSubscription = this._UserContextService.recallUserDataViewed.subscribe((emitted: boolean) => {
      this.refreshLoginStatus();

      if (emitted && this.isLoggedIn() && this.pendingNavigation) {
        Logger.debug('RateYourCompatibilityComponent: User logged in, retrying navigation with doctor_id:', this.doctorId);
        this.pendingNavigation = false;
        this.navigateToKhawiikChat();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.recallUserDataSubscription) {
      this.recallUserDataSubscription.unsubscribe();
    }
  }

  protected onRateCompatibilityClick(): void {
    if (!this.isBrowser) {
      Logger.debug('RateYourCompatibilityComponent: SSR - Navigation skipped');
      return;
    }

    this.refreshLoginStatus();

    if (!this.isLoggedIn()) {
      Logger.debug('RateYourCompatibilityComponent: User not logged in, opening login modal');
      this.pendingNavigation = true;
      this._RoleGuardService.openLoginModal();
      return;
    }

    this.navigateToKhawiikChat();
  }

  private navigateToKhawiikChat(): void {
    Logger.debug('RateYourCompatibilityComponent: Navigating to Khawiik text chat with doctor_id:', this.doctorId);

    this._modalService.closeAll();
    this._router.navigate(
      [`/${KhawiikBotRoutesEnum.KHAWIIK_MAIN_PAGE}`, KhawiikBotRoutesEnum.TEXT_CHAT],
      {
        state: {
          fromDoctorCompatibility: true,
          doctorId: this.doctorId
        }
      }
    );
  }
}

