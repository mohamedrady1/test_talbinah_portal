import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplaintCardComponent, IComplaint } from '../complaint-card/complaint-card.component';
import { ModalService } from '../../../../shared';
import { ImageViewerModalComponent } from '../../../talbinah-bot';
import { TranslationsFacade } from '../../../../common/core/translations/services';
@Component({
    selector: 'app-complaint-details',
    standalone: true,
    imports: [CommonModule, ComplaintCardComponent],
    templateUrl: './complaint-details.component.html',
    styleUrls: ['./complaint-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComplaintDetailsComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  
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

