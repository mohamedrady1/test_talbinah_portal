import { Component, Input, Output, EventEmitter, inject, effect, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationsFacade } from '../../../../common/core/translations/services';
import { GiftsFacade } from '../../services/gifts.facade';
import { ModalService } from '../../../../shared';
import { StatusInfoComponent } from '../../../payments/components';

@Component({
    selector: 'app-gift-accept-modal',
    standalone: true,
    imports: [CommonModule, ],
    templateUrl: './gift-accept-modal.component.html',
    styleUrls: ['./gift-accept-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiftAcceptModalComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  
    @Input() item: any;
    @Output() closed = new EventEmitter<boolean>();
    private giftsFacade = inject(GiftsFacade);
    private modalService = inject(ModalService);

    readonly isLoading = this.giftsFacade.isLoadingAccept;
    readonly errorMessage = this.giftsFacade.errorMessageAccept;
    readonly status = this.giftsFacade.statusAccept;
    readonly message = this.giftsFacade.messageAccept;

    // Guard to avoid multiple openings/loops per modal lifecycle
    private handledOnce = signal(false);

    constructor() {
        // Reset accept state on init to avoid stale success state preventing reopen behavior
        this.giftsFacade.resetAcceptState();
        // Watch for response and open status popup similar to send-gift-form
        effect(() => {
            if (this.handledOnce()) return;

            const isLoading = this.giftsFacade.isLoadingAccept();
            const status = this.giftsFacade.statusAccept();
            const errorMessage = this.giftsFacade.errorMessageAccept();

            if (!isLoading && status !== null) {
                this.handledOnce.set(true);
                if (status) {
                    this.openSuccessModal(this.giftsFacade.messageAccept());
                    this.giftsFacade.fetchReceivedGifts();
                } else {
                    this.openErrorModal(errorMessage);
                }
            }
        });
    }

    onAccept() {
        if (!this.item?.id) return;
        this.giftsFacade.acceptGift(this.item.id);
    }

    private openSuccessModal(message: string | null): void {
        this.modalService.open(StatusInfoComponent, {
            inputs: {
                image: 'images/mentalHealthScale/icons/talbinah.png',
                title: 'gift_accepted_successfully',
                statusTitleKey: message || 'gift_accepted_successfully',
                statusSubtitleKey: 'gift_balance_added',
                data: {
                    item: {
                        storeSuccess: true,
                        pageType: 'accept-gift'
                    },
                    statusLabels: {
                        successSubTitle: message
                    }
                }
            },
            outputs: {
                closed: () => {
                    this.finishAndClose(true);
                }
            },
            onCloseClick: () => {
                this.finishAndClose(true);
            },
            width: '40%',
            isPhoneFromDown: true,
            minHeight: '10rem',
            maxHeight: '60rem',
        });
    }

    private openErrorModal(errorMessage: string | null): void {
        this.modalService.open(StatusInfoComponent, {
            inputs: {
                image: 'images/mentalHealthScale/icons/talbinah.png',
                title: 'gift_accept_failed',
                statusTitleKey: errorMessage,
                statusSubtitleKey: 'gift_accept_error',
                data: {
                    item: {
                        storeSuccess: false,
                        errorMessage: errorMessage,
                        pageType: 'accept-gift'
                    },
                    statusLabels: {
                        errorSubTitle: errorMessage
                    }
                }
            },
            outputs: {
                closed: () => {
                    this.finishAndClose(false);
                }
            },
            width: '40%',
            isPhoneFromDown: true,
            minHeight: '10rem',
            maxHeight: '60rem',
        });
    }

    private finishAndClose(success: boolean): void {
        this.giftsFacade.resetAcceptState();
        this.closed.emit(success);
    }
} 

