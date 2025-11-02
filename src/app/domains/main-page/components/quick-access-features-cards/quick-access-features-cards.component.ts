import { TranslateModule } from '@ngx-translate/core';
import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import { QuickAccessCardComponent } from '../quick-access-card/quick-access-card.component';
import { CommingSoonComponent, ModalService, StorageKeys, UploadAppsPopupComponent } from '../../../../shared';
import { CardLayoutType, IQuickAccessCardConfig } from '../../models';
import { HOME_PAGE_CARD_CONFIGS } from '../../constants';
import { Logger, StorageService } from '../../../../common';
import { DraggableCardListComponent } from '../draggable-card-list';
import { BookUrgentAppointmentComponent, SelectAppointmentTypeConfig, UploadAppsHeaderConfig, UrgentAppointmentHeaderConfig } from '../../../urgent-appointment';
import { SelectAppointmentTypeComponent } from '../../../book-appointment';
import { RoleGuardService } from '../../../authentication';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-quick-access-features-cards',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    
    QuickAccessCardComponent
  ],
  templateUrl: './quick-access-features-cards.component.html',
  styleUrls: ['./quick-access-features-cards.component.scss']
})
export class QuickAccessFeaturesCardsComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  
  private readonly router: Router = inject(Router);
  private readonly modalService: ModalService = inject(ModalService);
  private readonly storage = inject(StorageService);

  // SSR-safe browser check
  protected isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // ----- Injected services -----
  private readonly _StorageService = inject(StorageService);
  private readonly _RoleGuardService = inject(RoleGuardService);

  public pinnedCards: IQuickAccessCardConfig[] = [];

  // Strongly type the cards data
  public cardsData: IQuickAccessCardConfig[] = [];
  public readonly CardLayoutType = CardLayoutType; // Expose enum to template

  private token = signal<string | null>(
    this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null
  );
  protected refreshLoginStatus(): void {
    this.token.set(this._StorageService.getItem<string>(StorageKeys.TOKEN) ?? null);
  }

  protected navigateToPage(card: IQuickAccessCardConfig): void {
    Logger.debug('QuickAccessFeaturesCardsComponent| Home Card: ', card);
    this.refreshLoginStatus();
    // ✅ Only restrict some moduleNames
    const restrictedModules = ['Appointments', 'khawiik'];
    if (restrictedModules.includes(card?.moduleName || '')) {
      if (!this.token()) {
        this._RoleGuardService.openLoginModal();
        return;
      }
    }

    // 🟢 From here, normal logic for all cards
    if (card?.uploadApps) {
      this.openUploadAppsPopup();
      return;
    }

    if (card.isCommingSoon) {
      this.modalService.open(CommingSoonComponent, {
        inputs: {
          image: 'assets/images/coming-soon.png',
          title: 'general.comingSoon.title',
          subtitle: 'general.comingSoon.subtitle',
        },
        outputs: {
          closed: () => {
            Logger.debug('QuickAccessFeaturesCardsComponent | Coming Soon modal closed');
          },
        },
        width: '50%',
        minHeight: '30vh',
        maxHeight: '78vh',
        onCloseClick: () => {
          Logger.debug('QuickAccessFeaturesCardsComponent | onCloseClick | Modal closed');
        },
      });
      return;
    }

    if (card?.isModal) {
      if (card?.moduleName === 'UrgentAppointment') {
        this.openQucikAppointment();
      }
      if (card?.moduleName === 'BookAppointment') {
        this.openBookAppointment('BookAppointment');
      }
      if (card?.moduleName === 'Appointments') {
        this.openBookAppointment('Appointments');
      }
      return;
    }

    if (card.link) {
      this.router.navigate([card.link]);
    }
  }

  private openUploadAppsPopup(): void {
    this.modalService.open(UploadAppsPopupComponent, {
      width: '40%',
      inputs: {
        ...UploadAppsHeaderConfig
      },
      outputs: {
        closed: (): void => {
          Logger.debug('QuickAccessFeaturesCardsComponent | The modal is closed');
        },
      },
    });
  }
  private openQucikAppointment(): void {
    this.modalService.open(BookUrgentAppointmentComponent, {
      width: '50%',
      inputs: {
        ...UrgentAppointmentHeaderConfig
      },
      outputs: {
        closed: (): void => {
          Logger.debug('QuickAccessFeaturesCardsComponent | The modal is closed');
        },
      },
    });
  }
  private openBookAppointment(type: string): void {
    this.modalService.open(SelectAppointmentTypeComponent, {
      width: '35%',
      minHeight: '20rem',
      maxHeight: '70rem',
      inputs: {
        ...SelectAppointmentTypeConfig,
        type: type
      },
      outputs: {
        closed: (): void => {
          Logger.debug('QuickAccessFeaturesCardsComponent | The modal is closed');
        },
      },
      isPhoneFromDown: true,
    });
  }


  ngOnInit(): void {
    this.loadCardsFromStorage();
    // this.openQucikAppointment();
  }

  private loadCardsFromStorage(): void {
    try {
      const storedConfig: IQuickAccessCardConfig[] | string | any = this.storage.getItem(StorageKeys.QUCIK_ACCESS_CARDS);
      if (storedConfig) {
        const parsedConfig: IQuickAccessCardConfig[] = JSON.parse(storedConfig || '{}');
        // Logger.info('Cards loaded from storage:', parsedConfig);
        this.cardsData = parsedConfig;
      } else {
        Logger.info('No saved card configuration found in storage.');
        this.cardsData = HOME_PAGE_CARD_CONFIGS;
      }
    } catch (error) {
      Logger.error('Failed to load cards from storage:', error);
      this.cardsData = HOME_PAGE_CARD_CONFIGS;
    }

    this.cardsData?.forEach((card: IQuickAccessCardConfig) => {
      if (card.isPinned) {
        this.pinnedCards.push({ ...card, isPinned: true });
      }
    });

    this.pinnedCards.sort((a, b) => a.id - b.id);
  }

  protected editMenuItemsCards(): void {
    this.modalService.open(DraggableCardListComponent, {
      inputs: {
        title: 'home_customize_cards_title',
        // subtitle: 'articles_page_subtitle',
        image: 'images/mentalHealthScale/icons/talbinah.png',
        data: {}
      },
      outputs: {
        closed: (data: { isSaved: boolean } | void): void => {
          Logger.debug('QuickAccessFeaturesCardsComponent | editMenuItemsCards => Modal closed with data:', data);
          if (data?.isSaved) {
            this.pinnedCards = [];
            this.loadCardsFromStorage();
          }
        }
      },
      width: '70%',
    });
  }
}

