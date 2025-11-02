import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplaintCardComponent, IComplaint } from '../complaint-card/complaint-card.component';
import { ModalService } from '../../../../shared';
import { ImageViewerModalComponent } from '../../../talbinah-bot';
import { TranslateApiPipe } from '../../../../common/core/translations';
@Component({
    selector: 'app-complaint-details',
    standalone: true,
    imports: [CommonModule, TranslateApiPipe, ComplaintCardComponent],
    templateUrl: './complaint-details.component.html',
    styleUrls: ['./complaint-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComplaintDetailsComponent {
    @Input() item!: IComplaint;
    private readonly modalService = inject(ModalService);

    openImageViewer(imageUrl: string) {
        this.modalService.open(ImageViewerModalComponent, {
            inputs: {
                title: 'view_image',
                data: {
                    imgUrl: imageUrl
                }
            },
            outputs: {
                closed: (data: any): void => {
                    console.log('Image viewer modal closed with data:', data);
                }
            },
            width: 'fit-content',
            height: 'fit-content',
        });
    }
} 