import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, PLATFORM_ID, signal } from '@angular/core';
import { SvgIconComponent } from './../../../../shared/components/svg-icon/svg-icon.component';
import { isBrowser, ModalService, PublicService, StorageKeys } from '../../../../shared';

import { getTextByLang, IGlobalUserContactInfoModel, Logger } from '../../../../common';
import { AuthenticationRoutesEnum, LogOutComponent, NewLoginComponent, UserContextService } from '../../../../domains';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { userConfig } from '../../configs';
import { TranslateApiPipe } from '../../../../common/core/translations/pipes/translate-api.pipe';
@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SvgIconComponent,
    TranslateApiPipe
  ],
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfoComponent {
  private readonly _ModalService = inject(ModalService);
  private readonly _Router = inject(Router);
  protected readonly _PublicService = inject(PublicService);
  private readonly _UserContextService = inject(UserContextService);

  @Input() userInfoConfig!: IGlobalUserContactInfoModel;
  @Input() isLoggedIn!: boolean;
  protected internalUserInfo = signal<IGlobalUserContactInfoModel | null>(null);

  @Output() action: EventEmitter<void> = new EventEmitter();
  @Output() openLogOutPopUp: EventEmitter<void> = new EventEmitter();

  private readonly _platformId = inject(PLATFORM_ID);

  protected openUserInfo: boolean = false;
  protected getTextByLang = getTextByLang;
  protected userConfig = userConfig;

  protected triggerAction(action: string): void {
    switch (action) {
      case 'openSettings':
        break;
      case 'logOut':
        this.logOut();
        break;
      default:
        console.warn("No action defined for:", action);
    }
  }

  protected logOut(): void {
    this._ModalService.open(LogOutComponent, {
      outputs: {
        closed: () => {
          console.log('The model is closed');
        }
      },
      isPhoneFromDown: true,
      minHeight: '10rem',
      maxHeight: '40rem',
      closeOnBackdropClick: false,
    });

  }

  protected goToLoginPage(): void {
    this._Router.navigate([AuthenticationRoutesEnum.LOGIN]);

  }

  ngOnInit(): void {
    this._UserContextService.recallUserDataViewed.subscribe((emittedVal: boolean) => {
      const raw = this.getStoredUser();
      if (!raw) {
        // Logged out: clear user info so header hides avatar
        this.internalUserInfo.set(null);
        return;
      }

      if (emittedVal) {
        Logger.debug('UserInfoComponent | recallUserDataViewed: ', emittedVal);
        let storedUserData: { token: string, user: IGlobalUserContactInfoModel } = JSON.parse(raw || '{}');
        Logger.debug('UserInfoComponent | recallUserDataViewed | Stored User: ', storedUserData?.user?.full_name);
        if (storedUserData?.user) {
          this.internalUserInfo.set(storedUserData.user);
        } else {
          this.internalUserInfo.set(this.userInfoConfig);
        }
      } else {
        this.internalUserInfo.set(this.userInfoConfig);
      }
    });
  }

  private getStoredUser(): string | null {
    if (!isPlatformBrowser(this._platformId)) return null;
    try {
      return localStorage.getItem(StorageKeys.CURRENT_USER_INFO);
    } catch {
      return null;
    }
  }

  protected openLoginModal(): void {
    const modalData = {
      image: 'images/icons/logo-2.png',
      title: 'login',
      description: 'welcome_safe_space',
    };

    this._ModalService.open(NewLoginComponent, {
      inputs: modalData,
      minWidth: '70vh',
      maxWidth: '70vh',
      minHeight: '50vh',
      closeOnBackdropClick: false,
      outputs: {
        closed: (data: any): void => {
          Logger.debug('Login Modal closed with data:', data);
        }
      },
    });
  }
  protected truncateName(name: string, limit: number): string {
    return name.length > limit ? name.slice(0, limit) + '..' : name;
  }
}
