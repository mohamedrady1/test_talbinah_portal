import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  inject,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { PodcastDetailsBoxCardComponent } from '../podcast-details-box-card';
import { PodcastMediaPlayerComponent } from "../podcast-media-player";
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { IGlobalPodcastItemModel } from '../../../../common';
import { PodcastsListFacade } from '../../services';
import { IPodcast } from '../../models';
import { PodcastDetailsForMobileComponent } from '../podcast-details-for-mobile';
import { ModalService } from '../../../../shared';

@Component({
  selector: 'app-podcast-details',
  standalone: true,
  imports: [
    PodcastDetailsBoxCardComponent,
    PodcastMediaPlayerComponent,
    CommonModule,
    PodcastDetailsForMobileComponent
  ],
  templateUrl: './podcast-details.component.html',
  styleUrls: ['./podcast-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PodcastDetailsComponent {
  @Input({ required: true }) item!: IGlobalPodcastItemModel;

  @Input() podcastDetails!: IPodcast;
  @Input() currentTime!: number;
  @Input() isFullScreenFromAudio: boolean = false;
  @Input() isloadingFavourite: boolean = false;

  @Output() closed = new EventEmitter<IGlobalPodcastItemModel | void>();
  @Output() onMinimize = new EventEmitter<number>();
  @Output() openFullScreen = new EventEmitter<void>();
  @Output() favouriteToggled = new EventEmitter<IGlobalPodcastItemModel>();

  @ViewChild('card', { static: true }) private readonly cardRef!: ElementRef<HTMLElement>;

  readonly fullScreen = signal(false);

  protected externalFavouriteToggled = signal<IGlobalPodcastItemModel | null>(null);

  private readonly _PodcastsListFacade = inject(PodcastsListFacade);
  private readonly _modalService = inject(ModalService);
  private readonly platformId = inject(PLATFORM_ID);
  @HostListener('document:keydown.escape')
  handleEscape(): void {
    this.closeDetailsPopup();
  }

  protected toggleMediaFullscreen(): void {
    this.fullScreen.update((state) => !state);
  }

  protected minimize(time: number): void {
    console.log('PodcastDetailsComponent.minimize called with time:', time);
    this.OpenPodcastAudioPlayer(time);
    this.closeDetailsPopup();
  }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.isFullScreenFromAudio) {
        this.openFullScreen.emit();
      }
    }, 0);
  }

  protected closeDetailsPopup(): void {
    this.closed.emit();
  }

  protected OpenPodcastAudioPlayer(currentTime?: number): void {
    console.log('PodcastDetailsComponent.OpenPodcastAudioPlayer called with currentTime:', currentTime);
    this._PodcastsListFacade._openPodcastAudioPlayer$.next({
      isOpen: true,
      item: this.item,
      currentTime: currentTime
    });
  }

  protected toggleBrowserFullscreen(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const element = this.cardRef.nativeElement;
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch(() => { });
    } else {
      document.exitFullscreen().catch(() => { });
    }
  }

  protected onPodcastFavouriteToggled(item: IGlobalPodcastItemModel): void {
    this.externalFavouriteToggled.set(item);
  }

  protected openPodcastMediaPlayer(): void {
    let modalInputs: any = {};
    let modalOutputs: any = {};

    modalInputs = {
      item: this.item,
      title: 'podcast_details2',
      externalFavouriteToggled: this.externalFavouriteToggled,
      isPhone: true

    };
    modalOutputs = {
      favouriteToggled: (podcast: IGlobalPodcastItemModel) => {
        this.favouriteToggled.emit(podcast);
      }
    };

    this._modalService.open(PodcastMediaPlayerComponent, {
      inputs: modalInputs,
      outputs: modalOutputs,
      showMobileHeader: true,
    });
  }
}
