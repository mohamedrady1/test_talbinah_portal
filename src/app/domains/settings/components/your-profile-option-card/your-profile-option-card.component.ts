import { ChangeDetectionStrategy, Component, inject, Input, PLATFORM_ID } from '@angular/core';
import { GovernmentAgenciesComponent } from '../government-agencies';
import { SettingMenuItemsPages } from '../../configs';
import { TranslateModule } from '@ngx-translate/core';
import { ModalService } from '../../../../shared';
import { ISettingMenuItem } from '../../dtos';
import { Logger } from '../../../../common';
import { VisitReportsComponent } from '../visit-reports';
import { InvitationCodeComponent } from '../invitation-code';
import { SettingFaqsComponent } from '../setting-faqs';
import { ImportantNumbersComponent } from '../important-numbers';
import { WalletComponent } from '../wallet';
import { GiftToYourLovedOnesComponent } from '../gift-to-your-loved-ones';
import { isPlatformBrowser } from '@angular/common';
import { SecurityModalComponent } from '../security-modal';
import { MyFavouritesComponent } from '../my-favourites';
import { ComplaintsListComponent } from '../complaints-list';
import { PrescriptionsComponent } from '../prescriptions';
import { SettingsPointsComponent } from '../settings-points';
import { TechnicalSupportChatsListComponent } from '../../../technical-support';

@Component({
  selector: 'app-your-profile-option-card',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './your-profile-option-card.component.html',
  styleUrls: ['./your-profile-option-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YourProfileOptionCardComponent {
  @Input() config!: ISettingMenuItem;
  private readonly _modalService = inject(ModalService);
  private readonly _platformId = inject(PLATFORM_ID);


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
        title: 'settings.prescription.title',
        subtitle: 'settings.prescription.subtitle',
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
        title: 'settings.myFavourites.title',
        subtitle: 'settings.myFavourites.subtitle',
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
        title: 'settings.security.title',
        subtitle: 'settings.security.subtitle',
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
        title: 'settings.governmentAgencies.title',
        subtitle: 'settings.governmentAgencies.subtitle',
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
  protected openVisitReportsModal(): void {
    this._modalService.open(VisitReportsComponent, {
      inputs: {
        image: 'images/settings/modal-icons/visit-reports.png',
        title: 'settings.visitReports.title',
        subtitle: 'settings.visitReports.subtitle',
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
        title: 'settings.invitationCode.title',
        subtitle: 'settings.invitationCode.subtitle',
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
      width: "40%"
    });
  }
  protected openTechnicalSupportModal(): void {
    this._modalService.open(TechnicalSupportChatsListComponent, {

      inputs: {
        image: 'images/settings/modal-icons/support-icon.jpg',
        title: 'Technical_Support.title',
        subtitle: 'Technical_Support.subtitle',
        data: {}
      },
      width: "60%"
    });
  }
}
