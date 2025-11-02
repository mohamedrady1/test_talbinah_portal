import { UpdatePersonalProfileInfoComponent } from '../update-personal-profile-info';
import { ChangeDetectionStrategy, Component, inject, Input, PLATFORM_ID, signal } from '@angular/core';
import { ModalService } from '../../../../shared/services/model.service';
import { LocalizationService, StorageKeys } from '../../../../shared';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { IGlobalUserContactInfoModel, Logger } from '../../../../common';
import { UserContextService } from '../../../authentication';

@Component({
  selector: 'app-user-info-card',
  standalone: true,
  imports: [
    TranslateModule,
    DatePipe
  ],
  templateUrl: './user-info-card.component.html',
  styleUrls: ['./user-info-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfoCardComponent {
  private readonly modalService = inject(ModalService);
  private readonly localizationService = inject(LocalizationService);
  protected readonly currentLang !: string;

  private readonly _UserContextService = inject(UserContextService);
  private readonly _platformId = inject(PLATFORM_ID);

  @Input() userInfo: IGlobalUserContactInfoModel | null = null;
  protected internalUserInfo = signal<IGlobalUserContactInfoModel | null>(null);

  constructor() {
    this.currentLang = this.localizationService.getCurrentLanguage();
    setTimeout(() => {
      console.log('userInfo', this.userInfo);
    }, 1000);
  }

  ngOnInit(): void {
    this._UserContextService.recallUserDataViewed.subscribe((emittedVal: boolean) => {
      if (emittedVal) {
        Logger.debug('UserInfoCardComponent | recallUserDataViewed: ', emittedVal);
        let storedUserData: { token: string, user: IGlobalUserContactInfoModel } = JSON.parse(this.getStoredUser() || '{}');
        Logger.debug('UserInfoCardComponent | recallUserDataViewed | Stored User: ', storedUserData?.user?.full_name);
        if (storedUserData?.user) {
          this.internalUserInfo.set(storedUserData.user);
        } else {
          this.internalUserInfo.set(this.userInfo);
        }
      } else {
        this.internalUserInfo.set(this.userInfo);
      }
    });
  }

  protected openEditProfileModal(): void {
    Logger.debug('UserInfoCardComponent | openEditProfileModal');
    this.modalService.open(UpdatePersonalProfileInfoComponent, {
      inputs: {
        image: 'images/articles/calender-2.png',
        title: 'settings.updatePersonalInfo.title',
        subtitle: 'settings.updatePersonalInfo.subtitle',
        data: {
          config: this.userInfo
        }
      },
      outputs: {
        closed: (data: any): void => {
          console.log('close', data);
        }
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
}
