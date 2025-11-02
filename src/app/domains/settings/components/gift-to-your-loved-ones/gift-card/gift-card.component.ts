import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ModalService } from '../../../../../shared';
import { GiftAcceptModalComponent } from '../../gift-accept-modal';
import { GiftCancelModalComponent } from '../../gift-cancel-modal';
import { IGiftSenderDto } from '../../../dtos';
import { TranslateApiPipe } from '../../../../../common/core/translations';

@Component({
    selector: 'app-gift-card',
    standalone: true,
    imports: [CommonModule, TranslateModule, TranslateApiPipe],
    templateUrl: './gift-card.component.html',
    styleUrls: ['./gift-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiftCardComponent {
    @Input() item!: IGiftSenderDto;
    @Input() type: 'receiver' | 'sender' = 'receiver';
    private modalService = inject(ModalService);

    openModal() {
        if (this.type === 'receiver') {
            this.modalService.open(GiftAcceptModalComponent, {
                inputs: {
                    image: 'images/logos/icon.png',
                    title: 'accept_gift',
                    item: this.item
                },
                outputs: {
                    closed: (accepted: boolean) => {
                    }
                },
                width: '30%',
                isPhoneFromDown: true
            });
        } else {
            this.modalService.open(GiftCancelModalComponent, {
                inputs: { image: 'images/logos/icon.png', title: 'cancel_sent_gift_confirmation', item: this.item },
                outputs: {
                    closed: (cancelled: boolean) => {
                    }
                },
                width: '30%',
                isPhoneFromDown: true
            });
        }
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('ar-EG', { month: 'long' });
        const weekday = date.toLocaleDateString('ar-EG', { weekday: 'long' });

        return `${day} ${month} - ${weekday}`;
    }
    formatTime(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

} 