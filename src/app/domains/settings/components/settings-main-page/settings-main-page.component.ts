import { UpdatePersonalProfileInfoComponent } from '../update-personal-profile-info';
import { NationalIdVerificationComponent } from '../national-id-verification';
import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { ElementRef } from '@angular/core';
import { IUser, UserContextService } from '../../../authentication';
import { ModalService, StorageKeys } from '../../../../shared';
import { ComplaintsListComponent } from '../complaints-list';
import { ChangePasswordComponent } from '../change-password';
import { AutoExactHeightDirective, IGlobalUserContactInfoModel, Logger, StorageService } from '../../../../common';
import { SecurityModalComponent } from '../security-modal';
import { MyFavouritesComponent } from '../my-favourites';
import { SettingFaqsComponent } from '../setting-faqs';
import { ImportantNumbersComponent } from '../important-numbers';
import { WalletComponent } from '../wallet';
import { GiftToYourLovedOnesComponent } from '../gift-to-your-loved-ones';
import { InvitationCodeComponent } from '../invitation-code';
import { TalbinahCardComponent } from '../talbinah-card';
import { UserInfoCardComponent } from '../user-info-card';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { HeaderConfig } from '../../configs';
import { isPlatformBrowser } from '@angular/common';
import { MainPageRoutesEnum } from '../../../main-page';
import { TranslateModule } from '@ngx-translate/core';
import { GiftCardComponent } from '../gift-card';
import { IProfileOptions } from '../../models';
import { SettingsSections } from '../../constants/settings-sections.enum';
import { YourProfileOptionCardComponent } from '../your-profile-option-card';
import { WalletAndRewardsComponent } from '../wallet-and-rewards';
import { ReportCardComponent } from '../report-card';
import { SettingsFacade } from '../../services';
import { ISettingMenuItem } from '../../dtos';
import { SettingsPointsComponent } from '../settings-points';
import { SiteHeaderComponent } from '../../../header';
import { TechnicalSupportChatsListComponent } from '../../../technical-support';

@Component({
  selector: 'app-settings-main-page',
  standalone: true,
  imports: [
    SiteHeaderComponent,
    TalbinahCardComponent,
    UserInfoCardComponent,
    HeaderComponent,
    TranslateModule,
    YourProfileOptionCardComponent,
    GiftCardComponent,
    WalletAndRewardsComponent,
    ReportCardComponent,
    AutoExactHeightDirective
  ],
  templateUrl: './settings-main-page.component.html',
  styleUrls: ['./settings-main-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsMainPageComponent {
  protected readonly _SettingsFacade = inject(SettingsFacade);
  // --- Dependencies ---
  private readonly _modalService = inject(ModalService);
  private readonly userContext = inject(UserContextService);
  protected readonly headerConfig = HeaderConfig;
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  @ViewChild('card') cardRef!: ElementRef;
  isFullscreen: boolean = false;
  private _StorageService = inject(StorageService);
  protected userInfo!: IGlobalUserContactInfoModel | null;
  protected cards: ISettingMenuItem[] = [];
  profileOptions: IProfileOptions[] = [
    {
      title: SettingsSections.Profile,
      icon: 'images/settings/main-page/profile-options/Profile.png',
      action: () => this.openUpdatePersonalProfileInfoModal()
    },
    {
      title: SettingsSections.GovernmentAuthorities,
      icon: 'images/settings/main-page/profile-options/GovernmentAuthorities.png',
      action: () => 'this.openGovernmentAgenciesModal()'
    },
    {
      title: SettingsSections.VisitReports,
      icon: 'images/settings/main-page/profile-options/VisitReports.png',
      action: () => 'this.openVisitReportsModal()'
    },
    {
      title: SettingsSections.Favorites,
      icon: 'images/settings/main-page/profile-options/Favorites.png',
      action: () => this.openMyFavouritesModal()
    },
    {
      title: SettingsSections.Prescriptions,
      icon: 'images/settings/main-page/profile-options/Prescriptions.png',
      action: () => this.openPointsModal()
    },
    {
      title: SettingsSections.InvitationCode,
      icon: 'images/settings/main-page/profile-options/InvitationCode.png',
      action: () => ''
    },
    {
      title: SettingsSections.Security,
      icon: 'images/settings/main-page/profile-options/Security.png',
      action: () => this.openSecurityModal()
    }
  ];
  helpOptions: IProfileOptions[] = [
    {
      title: SettingsSections.Faq,
      icon: 'images/settings/main-page/profile-options/Faq.png',
      action: () => this.openFaqModal()
    },
    {
      title: SettingsSections.ImportantNumbers,
      icon: 'images/settings/main-page/profile-options/ImportantNumbers.png',
      action: () => this.openImportantNumbersModal()
    },
    {
      title: SettingsSections.ContactUs,
      icon: 'images/settings/main-page/profile-options/ContactUs.png',
      action: () => this.openContactUsModal()
    }
  ];

  openFaqModal() { }
  openContactUsModal() {
    if (isPlatformBrowser(this.platformId)) {
      window.open('https://wa.me/+966552272756');
    }
  }
  ngOnInit(): void {
    this._SettingsFacade.fetchSettings();
    this.cards = this._SettingsFacade.headerItems();
    const storedUserInfo: any = this._StorageService.getItem(StorageKeys.CURRENT_USER_INFO) as { user?: IUser } | null;
    if (storedUserInfo && storedUserInfo.user) {
      this.userInfo = storedUserInfo.user;
      Logger.debug('SettingsMainPageComponent initialized with data:', {
        UserInfo: this.userInfo
      });

    } else {
      // Logger.warn('No user info found in storage.');
    }
    // this.openInvitationCodeModal();
    // this.openPointsModal(); //done
    // this.openGiftToYourLovedOnesModal();
    // this.openWalletModal() //done
    // this.openVisitReportsModal(); //done
    // this.openImportantNumbersModal(); //done
    // this.openSettingFAQsModal(); //done
    // this.openMyFavouritesModal();
    // this.openComplaintsListModal(); //done
    // this.openUpdatePersonalProfileInfoModal();
    // this.openGovernmentAgenciesModal(); //done
    // this.openNationalIdVerificationModal(); //done
    // this.openChangePasswordModal(); //done
    // this.openSecurityModal(); //done
    // this.openTechnicalSupportModal();
  }

  protected openNationalIdVerificationModal(): void {
    this._modalService.open(NationalIdVerificationComponent, {
      inputs: {
        image: 'images/settings/modal-icons/security.png',
        title: 'settings.nationalIdVerification.title',
        subtitle: 'settings.nationalIdVerification.subtitle',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('National ID Verification modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "40%"
    });
  }

  protected openSecurityModal(): void {
    this._modalService.open(SecurityModalComponent, {
      inputs: {
        image: 'images/settings/modal-icons/security.png',
        title: 'settings.security.title',
        subtitle: 'settings.security.subtitle',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Security Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "40%"
    });
  }

  protected openChangePasswordModal(): void {
    this._modalService.open(ChangePasswordComponent, {
      inputs: {
        image: 'images/settings/modal-icons/security.png',
        title: 'settings.changePassword.title',
        subtitle: 'settings.changePassword.subtitle',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Change Password Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "40%"
    });
  }

  protected openUpdatePersonalProfileInfoModal(): void {
    this._modalService.open(UpdatePersonalProfileInfoComponent, {
      inputs: {
        image: 'images/settings/modal-icons/personal-info.png',
        title: 'settings.updatePersonalInfo.title',
        subtitle: 'settings.updatePersonalInfo.subtitle',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Update Personal Profile Info Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "40%"
    });
  }

  protected openComplaintsListModal(): void {
    this._modalService.open(ComplaintsListComponent, {
      inputs: {
        image: 'images/settings/modal-icons/complaints.png',
        title: 'settings.complaintsList.title',
        subtitle: 'settings.complaintsList.subtitle',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Complaints List Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "60%"
    });
  }

  protected openMyFavouritesModal(): void {
    this._modalService.open(MyFavouritesComponent, {
      inputs: {
        image: 'images/settings/modal-icons/my-favourites.png',
        title: 'settings.myFavourites.title',
        subtitle: 'settings.myFavourites.subtitle',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('My Favourites Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "40%"
    });
  }

  protected openSettingFAQsModal(): void {
    this._modalService.open(SettingFaqsComponent, {
      inputs: {
        image: 'images/settings/modal-icons/faqs.png',
        title: 'settings.settingFaqs.title',
        subtitle: 'settings.settingFaqs.subtitle',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Settings FAQs Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "60%"
    });
  }

  protected openImportantNumbersModal(): void {
    this._modalService.open(ImportantNumbersComponent, {
      inputs: {
        image: 'images/settings/modal-icons/important-numbers.png',
        title: 'settings.importantNumbers.title',
        subtitle: 'settings.importantNumbers.subtitle',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Important Numbers Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "60%"
    });
  }


  protected openWalletModal(): void {
    this._modalService.open(WalletComponent, {
      inputs: {
        image: 'images/settings/modal-icons/wallet.png',
        title: 'settings.wallet.title',
        subtitle: 'settings.wallet.subtitle',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Wallet Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "60%",
      height: "80%"
    });
  }

  protected openGiftToYourLovedOnesModal(): void {
    this._modalService.open(GiftToYourLovedOnesComponent, {
      inputs: {
        image: 'images/settings/modal-icons/gift-loved-ones.png',
        title: 'settings.giftLovedOnes.title',
        subtitle: 'settings.giftLovedOnes.subtitle',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Gift to Your Loved Ones Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "60%",
      minHeight: "60%"
    });
  }

  protected openPointsModal(): void {
    this._modalService.open(SettingsPointsComponent, {
      inputs: {
        image: 'images/settings/modal-icons/points.png',
        title: 'settings.points.title',
        subtitle: 'settings.points.subtitle',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Points Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "60%"
    });
  }

  protected goHome(): void {
    this.router.navigate([MainPageRoutesEnum.MAINPAGE]);
  }

  protected toggleFullscreen(): void {
    if (isPlatformBrowser(this.platformId)) {
      const cardEl = this.cardRef.nativeElement;
      if (!document.fullscreenElement) {
        cardEl.requestFullscreen().then(() => {
          this.isFullscreen = true;
        }).catch((err: any) => {
          console.error('فشل في التكبير:', err);
          this.isFullscreen = false;
        });
      } else {
        document.exitFullscreen().then(() => {
          this.isFullscreen = false;
        });
      }
    }
  }

  protected openTechnicalSupportModal(): void {
    this._modalService.open(TechnicalSupportChatsListComponent, {

      inputs: {
        image: 'images/settings/modal-icons/support-icon.jpg',
        title: 'Technical_Support.title',
        subtitle: 'Technical_Support.subtitle',
        data: {}
      },
      outputs: {
        closed: () => {
          console.log('The model is closed');
        }
      },
      width: "60%"
    });
  }
}
