import { ChangeDetectionStrategy, Component, inject, Input, PLATFORM_ID } from '@angular/core';
import { GovernmentAgenciesComponent } from '../government-agencies';
import { SettingMenuItemsPages } from '../../configs';
import { ModalService } from '../../../../shared';
import { ISettingMenuItem } from '../../dtos';
import { Logger } from '../../../../common';
import { VisitReportsComponent } from '../visit-reports';
import { InvitationCodeComponent } from '../invitation-code';
import { SettingFaqsComponent } from '../setting-faqs';
import { ImportantNumbersComponent } from '../important-numbers';
import { WalletComponent } from '../wallet';
import { GiftToYourLovedOnesComponent } from '../gift-to-your-loved-ones';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { SecurityModalComponent } from '../security-modal';
import { MyFavouritesComponent } from '../my-favourites';
import { ComplaintsListComponent } from '../complaints-list';
import { PrescriptionsComponent } from '../prescriptions';
import { SettingsPointsComponent } from '../settings-points';
import { TechnicalSupportChatsListComponent } from '../../../technical-support';
import { TranslationsFacade } from '../../../../common/core/translations/services';
import { LocalizationService } from '../../../../shared/localization';

@Component({
  selector: 'app-your-profile-option-card',
  standalone: true,
  imports: [
    
    NgClass
  ],
  templateUrl: './your-profile-option-card.component.html',
  styleUrls: ['./your-profile-option-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YourProfileOptionCardComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  
  @Input() config!: ISettingMenuItem;
  private readonly _modalService = inject(ModalService);
  private readonly _platformId = inject(PLATFORM_ID);
  protected readonly _localizationService = inject(LocalizationService);

  get isArabic(): boolean {
    return this._localizationService.getCurrentLanguage() === 'ar';
  }


  ngOnInit(): void {
    // this.openGovernmentAgenciesModal();
    // this.openMyFavouritesModal();
    // this.openTechnicalSupportModal();
  }
  protected openModalAction(config: ISettingMenuItem): void {
    Logger.debug('YourProfileOptionCardComponent => openModalAction => item: ', config);
    if (config?.page === SettingMenuItemsPages.GovernmentAgencies) {
      Logger.debug('YourProfileOptionCardComponent => openModalAction => item: ', config?.page);
      this.openGovernmentAgenciesModal();
    }
    if (config?.page === SettingMenuItemsPages.WalletGift) {
      Logger.debug('YourProfileOptionCardComponent => openModalAction => item: ', config?.page);
      this.openGiftToYourLovedOnesModal();
    }
    if (config?.page === SettingMenuItemsPages.VisitsReport) {
      Logger.debug('YourProfileOptionCardComponent => openModalAction => item: ', config?.page);
      this.openVisitReportsModal();
    }
    if (config?.page === SettingMenuItemsPages.ReferralCode) {
      Logger.debug('YourProfileOptionCardComponent => openModalAction => item: ', config?.page);
      this.openInvitationCodeModal();
    }
    if (config?.page === SettingMenuItemsPages.FAQs) {
      this.openSettingFAQsModal();
    }
    if (config?.page === SettingMenuItemsPages.ImportantNumbers) {
      Logger.debug('YourProfileOptionCardComponent => openModalAction => item: ', config?.page);
      this.openImportantNumbersModal();
    }
    if (config?.page === SettingMenuItemsPages.Wallet) {
      Logger.debug('YourProfileOptionCardComponent => openModalAction => item: ', config?.page);
      this.openImportantNumbersModal();
    }
    if (config?.page === SettingMenuItemsPages.WelcomePoints) {
      Logger.debug('YourProfileOptionCardComponent => openModalAction => item: ', config?.page);
      this.openPointsModal();
    }
    if (config?.page === SettingMenuItemsPages.ContactUs) {
      Logger.debug('YourProfileOptionCardComponent => openModalAction => item: ', config?.page);
      this.openWhatsAppModal();
    }
    if (config?.page === SettingMenuItemsPages.Security) {
      Logger.debug('YourProfileOptionCardComponent => openModalAction => item: ', config?.page);
      this.openSecurityModal();
    }
    if (config?.page === SettingMenuItemsPages.Favorites) {
      Logger.debug('YourProfileOptionCardComponent => openModalAction => item: ', config?.page);
      this.openMyFavouritesModal();
    }
    if (config?.page === SettingMenuItemsPages.Problems) {
      Logger.debug('YourProfileOptionCardComponent => openModalAction => item: ', config?.page);
      this.openComplaintsListModal();
    }
    if (config?.page === SettingMenuItemsPages.PrescriptionList) {
      Logger.debug('YourProfileOptionCardComponent => openModalAction => item: ', config?.page);
      this.openPrescriptionModal();
    }
    if (config?.page === SettingMenuItemsPages.TechnicalSupport) {
      Logger.debug('YourProfileOptionCardComponent => openModalAction => item: ', config?.page);
      this.openTechnicalSupportModal();
    }
  }

  openWhatsAppModal(): void {
    const isBrowser = isPlatformBrowser(this._platformId);

    if (!isBrowser) return;

    const phoneNumber = '966552272756';
    const url = `https://wa.me/${phoneNumber}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  }

  protected openPrescriptionModal(): void {
    this._modalService.open(PrescriptionsComponent, {
      inputs: {
        image: 'images/settings/modal-icons/security.png',
        title: 'prescriptions',
        subtitle: 'manage_medical_prescriptions',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Prescription Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "60%",
    });
  }

  protected openMyFavouritesModal(): void {
    this._modalService.open(MyFavouritesComponent, {
      inputs: {
        image: 'images/settings/modal-icons/my-favourites.png',
        title: 'Favorite',
        subtitle: 'favorites_overview',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('My Favourites Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "60%",
      minHeight: "40%",
      maxHeight: "80%"
    });
  }

  protected openSecurityModal(): void {
    this._modalService.open(SecurityModalComponent, {
      inputs: {
        image: 'images/settings/modal-icons/security.png',
        title: 'security',
        subtitle: 'manage_security_and_devices_preferences',
        data: {}
      },
      outputs: {
      },
      width: "40%"
    });
  }
  protected openGovernmentAgenciesModal(): void {
    this._modalService.open(GovernmentAgenciesComponent, {
      inputs: {
        image: 'images/settings/modal-icons/government-agencies.png',
        title: 'government_entities',
        subtitle: 'link_government_account',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Government Agencies Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "70%",
      maxHeight: "80%"
    });
  }

  protected openComplaintsListModal(): void {
    this._modalService.open(ComplaintsListComponent, {
      inputs: {
        image: 'images/settings/modal-icons/complaints.png',
        title: 'complaints',
        subtitle: 'your_voice_matters_description',
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
  protected openVisitReportsModal(): void {
    this._modalService.open(VisitReportsComponent, {
      inputs: {
        image: 'images/settings/modal-icons/visit-reports.png',
        title: 'visit_reports',
        subtitle: 'visit_reports_intro',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Visit Reports Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "60%"
    });
  }

  protected openInvitationCodeModal(): void {
    this._modalService.open(InvitationCodeComponent, {
      inputs: {
        image: 'images/settings/modal-icons/invitation-code.png',
        title: 'invitation_code',
        subtitle: 'referral_intro',
        invitationCode: 'TALBINAH-12523'
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Invitation Code Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "40%",
      isPhoneFromDown: true
    });
  }

  protected openSettingFAQsModal(): void {
    this._modalService.open(SettingFaqsComponent, {
      inputs: {
        image: 'images/settings/modal-icons/faqs.png',
        title: 'faqs',
        subtitle: 'faq_intro',
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
        title: 'important_numbers',
        subtitle: 'important_numbers_intro',
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
        title: 'your_wallet',
        subtitle: 'wallet_description',
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
        title: 'gift_someone_you_love',
        subtitle: 'quick_gift_intro',
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
        title: 'my_points',
        subtitle: 'redeem_points_for_services',
        data: {}
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Points Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "40%"
    });
  }
  protected openTechnicalSupportModal(): void {
    this._modalService.open(TechnicalSupportChatsListComponent, {

      inputs: {
        image: 'images/settings/modal-icons/support-icon.jpg',
        title: 'support',
        subtitle: 'faq_intro',
        data: {}
      },
      width: "60%"
    });
  }
}

