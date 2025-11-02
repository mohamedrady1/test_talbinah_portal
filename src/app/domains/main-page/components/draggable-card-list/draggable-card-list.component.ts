import { Component, OnInit, inject, PLATFORM_ID, signal, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { EmptyStateComponent, EmptyStateConfig, StorageKeys } from '../../../../shared';
import { DraggableCardComponent } from '../draggable-card/draggable-card.component';
import { AutoExactHeightDirective } from '../../../../common/core/directives';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Logger, StorageService } from '../../../../common';
import { HOME_PAGE_CARD_CONFIGS } from '../../constants';
import { IQuickAccessCardConfig } from '../../models';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { TranslateApiPipe } from '../../../../common/core/translations/pipes/translate-api.pipe';

export const PinedEmptyState: EmptyStateConfig = {
  imageUrl: 'images/not-found/home/pined.svg',
  title: 'home_customize_cards_all_pinned',
  gap: '.5rem'
};

@Component({
  selector: 'app-draggable-card-list',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    TranslateApiPipe,
    AutoExactHeightDirective,

    DraggableCardComponent,
    EmptyStateComponent
  ],
  templateUrl: './draggable-card-list.component.html',
  styleUrls: ['./draggable-card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraggableCardListComponent implements OnInit {
  public pinnedCards: IQuickAccessCardConfig[] = [];
  public availableCards: IQuickAccessCardConfig[] = [];

  private readonly platformId: Object = inject(PLATFORM_ID);
  public readonly isBrowser: boolean = isPlatformBrowser(this.platformId);
  private readonly _router = inject(Router);
  private minCards: number = 6;

  public allowUnPinning = signal<boolean>(true);

  private readonly storage = inject(StorageService);
  emptyState = PinedEmptyState;

  @Output() closed = new EventEmitter<{ isSaved: boolean } | void>();
  @Input() data!: { items: IQuickAccessCardConfig[] };

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadCardsFromStorage();
      if (this.pinnedCards.length === 0 && this.availableCards.length === 0) {
        this.initializeCardsFromConstants();
      }
      this.updatePinningStates();
    }
  }

  private initializeCardsFromConstants(): void {
    this.pinnedCards = [];
    this.availableCards = [];

    HOME_PAGE_CARD_CONFIGS.forEach(card => {
      if (card.isPinned) {
        this.pinnedCards.push({ ...card, isPinned: true });
      } else {
        this.availableCards.push({ ...card, isPinned: false });
      }
    });

    this.pinnedCards.sort((a, b) => a.id - b.id);
    this.availableCards.sort((a, b) => a.id - b.id);

    Logger.debug('Initialized Pinned Cards from Constants:', this.pinnedCards);
    Logger.debug('Initialized Available Cards from Constants:', this.availableCards);
  }

  private loadCardsFromStorage(): void {
    try {
      const storedConfig: IQuickAccessCardConfig[] | string | any = this.storage.getItem(StorageKeys.QUCIK_ACCESS_CARDS);
      if (storedConfig) {
        const parsedConfig: IQuickAccessCardConfig[] = JSON.parse(storedConfig || '{}');
        this.pinnedCards = parsedConfig.filter(card => card.isPinned).sort((a, b) => a.id - b.id);
        this.availableCards = parsedConfig.filter(card => !card.isPinned).sort((a, b) => a.id - b.id);
      } else {
        Logger.info('No saved card configuration found in storage.');
      }
    } catch (error) {
      Logger.error('Failed to load cards from storage:', error);
      this.initializeCardsFromConstants();
    }
  }

  private saveCardsToStorage(): void {
    if (!this.isBrowser) return;
    const allCards = [...this.pinnedCards, ...this.availableCards];
    allCards.sort((a, b) => a.id - b.id);

    try {
      this.storage.setItem(StorageKeys.QUCIK_ACCESS_CARDS, JSON.stringify(allCards), true);
      Logger.info('Card configuration saved:', allCards.map(c => ({ id: c.id, title: c.title, isPinned: c.isPinned })));
    } catch (error) {
      Logger.error('Failed to save cards:', error);
    }
  }

  public onPinCard(card: IQuickAccessCardConfig): void {
    const index = this.availableCards.findIndex(c => c.id === card.id);
    if (index > -1) {
      const [cardToPin] = this.availableCards.splice(index, 1);
      cardToPin.isPinned = true;
      this.pinnedCards.push(cardToPin);
      this.pinnedCards.sort((a, b) => a.id - b.id);
      this.updatePinningStates();
    }
  }

  public onUnpinCard(card: IQuickAccessCardConfig): void {
    if (!this.allowUnPinning()) return;

    const index = this.pinnedCards.findIndex(c => c.id === card.id);
    if (index > -1) {
      const [cardToUnpin] = this.pinnedCards.splice(index, 1);
      cardToUnpin.isPinned = false;
      this.availableCards.push(cardToUnpin);
      this.availableCards.sort((a, b) => a.id - b.id);
      this.updatePinningStates();
    }
  }

  public trackByCardId(index: number, item: IQuickAccessCardConfig): number {
    return item.id;
  }

  public onSubmit(): void {
    this.saveCardsToStorage();
    this.closed.emit({ isSaved: true });
  }

  protected onCancel(): void {
    this.closed.emit();
  }

  private updatePinningStates(): void {
    const newAllowUnPinningState = this.pinnedCards.length > this.minCards;
    this.allowUnPinning.set(newAllowUnPinningState);
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      const currentUrl = this._router.url;
      if (currentUrl === '/' || currentUrl === '/home') {
        document.body.style.overflow = '';
      }
    }
  }
}
