import { Component, Input, Output, EventEmitter, inject, effect, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationsFacade } from '../../../../common/core/translations/services';
import { GiftsFacade } from '../../services/gifts.facade';
import { ModalService } from '../../../../shared';
import { StatusInfoComponent } from '../../../payments/components';

@Component({
    selector: 'app-gift-cancel-modal',
    standalone: true,
    imports: [CommonModule, ],
    templateUrl: './gift-cancel-modal.component.html',
    styleUrls: ['./gift-cancel-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiftCancelModalComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  
    @Input() item: any;
    @Output() closed = new EventEmitter<boolean>();
    private giftsFacade = inject(GiftsFacade);
    private modalService = inject(ModalService);

    readonly isLoading = this.giftsFacade.isLoadingCancel;
    readonly errorMessage = this.giftsFacade.errorMessageCancel;
    readonly status = this.giftsFacade.statusCancel;
    readonly message = this.giftsFacade.messageCancel;

    private handledOnce = signal(false);

    constructor() {
        // Reset cancel state on init
        this.giftsFacade.resetCancelState();

        effect(() => {
            if (this.handledOnce()) return;

            const isLoading = this.giftsFacade.isLoadingCancel();
            const status = this.giftsFacade.statusCancel();
            const errorMessage = this.giftsFacade.errorMessageCancel();

            if (!isLoading && status !== null) {
                this.handledOnce.set(true);
                if (status) {
                    this.openSuccessModal(this.giftsFacade.messageCancel());
                    this.giftsFacade.fetchSentGifts();
                } else {
                    this.openErrorModal(errorMessage);
                }
            }
        });
    }

    onCancelGift() {
        if (!this.item?.id) return;
        this.giftsFacade.cancelGift(this.item.id);
    }

    private openSuccessModal(message: string | null): void {
        this.modalService.open(StatusInfoComponent, {
            inputs: {
                image: 'images/mentalHealthScale/icons/talbinah.png',
                title: 'gift_canceled_successfully',
                statusTitleKey: message || 'gift_canceled_successfully',
                statusSubtitleKey: 'gift_balance_added',
                data: {
                    item: {
                        storeSuccess: true,
                        pageType: 'cancel-gift'
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
                title: 'gift_cancel_failed',
                statusTitleKey: errorMessage,
                statusSubtitleKey: 'gift_cancel_error',
                data: {
                    item: {
                        storeSuccess: false,
                        errorMessage: errorMessage,
                        pageType: 'cancel-gift'
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
        this.giftsFacade.resetCancelState();
        this.closed.emit(success);
    }
} 

