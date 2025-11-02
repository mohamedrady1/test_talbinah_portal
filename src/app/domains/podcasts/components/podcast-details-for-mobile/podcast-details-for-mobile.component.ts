import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { DetailsForMobileComponent, ModalService } from '../../../../shared';
import { PodcastDetailsBoxCardComponent } from '../podcast-details-box-card';
import { IGlobalPodcastItemModel } from '../../../../common';
import { PodcastCardComponent } from '../podcast-card';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
    selector: 'app-podcast-details-for-mobile',
    standalone: true,
    imports: [
        TranslateModule,
        CommonModule,

        PodcastDetailsBoxCardComponent,
        DetailsForMobileComponent,
        PodcastCardComponent,
        
    ],
    templateUrl: './podcast-details-for-mobile.component.html',
    styleUrls: ['./podcast-details-for-mobile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PodcastDetailsForMobileComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  
    @Input() podcast!: IGlobalPodcastItemModel;
    @Input() showCloseButton: boolean = true;

    @Output() close = new EventEmitter<void>();
    @Output() playPodcast = new EventEmitter<void>();

    private readonly modalService = inject(ModalService);

    protected onClose(): void {
        this.close.emit();
        this.modalService.closeAll();
    }

    protected openPodcastMediaPlayer(): void {
        this.playPodcast.emit();
    }

}        

