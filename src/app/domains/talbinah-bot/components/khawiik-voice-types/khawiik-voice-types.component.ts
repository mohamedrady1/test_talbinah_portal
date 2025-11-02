import { Component, inject, signal, computed, ChangeDetectionStrategy, PLATFORM_ID, ElementRef, ViewChild, AfterViewInit, OnDestroy, OnInit, Input, Injector, runInInjectionContext, untracked, effect } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { VoicesLookupFacade, VoicePreferenceFacade, SwipeService, KhawiikVoiceRealtimeSessionFacade } from '../../services';
import { KHAWIIK_VOICE_TYPES, KhawiikVoiceTypesPage, } from '../../constants';
import { ModalService, ErrorStateCardComponent, } from '../../../../shared';
import { SimpleSwipeService } from '../../services/simple-swipe.service';
import { AutoExactHeightDirective, Logger } from '../../../../common';
import { KhawiikVoiceTypesSkeletonComponent } from '../../skeletons';
import { KhawiikChatTypesComponent } from '../khawiik-chat-types';
import { getKhawiikVoiceTypesErrorConfig } from '../../configs';
import { SwipeEvent } from '../../interfaces';
import { IKhawiikVoice } from '../../dtos';

@Component({
  selector: 'app-khawiik-voice-types',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    RouterModule,

    KhawiikVoiceTypesSkeletonComponent,
    ErrorStateCardComponent,

    AutoExactHeightDirective
  ],
  templateUrl: './khawiik-voice-types.component.html',
  styleUrls: ['./khawiik-voice-types.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KhawiikVoiceTypesComponent
  implements OnInit, AfterViewInit, OnDestroy {
  // ====== Inputs ======
  @Input() from!: string;

  // ====== Dependencies ======
  private readonly _voicesFacade = inject(VoicesLookupFacade);
  private readonly _voicePrefFacade = inject(VoicePreferenceFacade);
  private readonly _modalService = inject(ModalService);
  private readonly _swipeService = inject(SwipeService);
  private readonly _simpleSwipeService = inject(SimpleSwipeService);
  protected readonly _sessionFacade = inject(KhawiikVoiceRealtimeSessionFacade);
  private readonly _injector = inject(Injector);

  // ====== View Refs ======
  @ViewChild('swipeContainer', { static: false })
  private readonly _swipeContainerRef?: ElementRef<HTMLElement>;

  // ====== SSR Check ======
  private readonly platformId = inject(PLATFORM_ID);
  protected isBrowser: boolean;

  // ====== Page Content ======
  readonly content = signal<KhawiikVoiceTypesPage | null>(KHAWIIK_VOICE_TYPES);
  readonly pageTitle = computed(() => this.content()?.title ?? '');
  readonly pageSubtitle = computed(() => this.content()?.subtitle ?? '');

  // ====== Facade Signals ======
  readonly isLoading = this._voicesFacade.isLoading;
  readonly errorMessage = this._voicesFacade.errorMessage;
  readonly voicesResponse = this._voicesFacade.voices;

  readonly isSaving = this._voicePrefFacade.isSaving;
  readonly saveStatus = this._voicePrefFacade.status;

  // ====== UI State ======
  private readonly _activeVoice = signal<IKhawiikVoice | null>(null);
  readonly activeVoice = this._activeVoice.asReadonly();

  readonly errorStateConfig = getKhawiikVoiceTypesErrorConfig(() =>
    this.retry(),
  );

  // ====== Swipe State ======
  readonly isSwipeActive = this._swipeService.isActive;
  readonly currentSwipeIndex = this._swipeService.currentIndex;
  readonly isSwipeAnimating = this._swipeService.isAnimating;

  private _audioPlayer: HTMLAudioElement | null = null;
  private _voiceItems: HTMLElement[] = [];
  private _swipeInitialized = false;

  // ====== Lifecycle ======

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (!this.isBrowser) return;

    this._voicesFacade.fetchVoices();
    this._setupSwipeListeners();

    // Initialize effects in constructor (proper injection context)
    runInInjectionContext(this._injector, () => {
      this._initVoicesEffect();
      this._initSaveStatusEffect();
    });
  }

  // ====== Effects ======
  private _initVoicesEffect(): void {
    effect(() => {
      const voices = this.voicesResponse()?.data?.voices ?? [];

      if (voices.length > 1 && !this._activeVoice()) {
        this.selectVoice(voices[1]);
      }

      if (voices.length > 0 && this._swipeContainerRef?.nativeElement) {
        setTimeout(() => this._reinitializeSwipe(), 200);
      }
    });
  }
  private _initSaveStatusEffect(): void {
    effect(() => {
      const status = this.saveStatus();
      if (status === true) {
        Logger.debug(
          'KhawiikVoiceTypesComponent | Voice saved successfully → opening ChatTypes modal',
        );

        // Use untracked to prevent change detection issues and setTimeout for safe execution
        untracked(() => {
          setTimeout(() => {
            if (this.from === 'chat') {
              this._voicePrefFacade.resetState();
              this._sessionFacade.resetState();
              this._modalService.closeAll();
              return;
            }
            this._openChatTypesModal();
          }, 0);
        });
      }
    });
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
  }

  private _openChatTypesModal(): void {
    if (!this.isBrowser) return;
    this._voicePrefFacade.resetState();
    this._modalService.closeAll();
    this._modalService.open(KhawiikChatTypesComponent, {
      inputs: {
        image: 'images/khawiik/khawiik-header-icon.png',
        title: 'khawiik.header.title',
        subtitle: 'khawiik.header.subtitle',
      },
      outputs: {
        closed: () =>
          Logger.debug('KhawiikVoiceTypesComponent | The modal is closed')
      },
      width: '60%',
      minHeight: '30vh',
      maxHeight: '78vh',
      backgroundColor:
        'linear-gradient(180deg, var(--Primary-50, #E7EBF8) 0%, #FFF 100%)',
      onCloseClick: () => {
        Logger.debug('KhawiikVoiceTypesComponent | onCloseClick |The modal is closed');
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    Logger.debug('KhawiikVoiceTypesComponent | AfterViewInit - initializing swipe...');
    setTimeout(() => this._initializeSwipe(), 100);
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this._stopAudio();
      if (this._swipeInitialized) {
        this._simpleSwipeService.destroy();
      }
    }
  }

  // ====== Public Actions ======
  protected selectVoice(voice: IKhawiikVoice): void {
    if (!this.isBrowser || !voice || this.isSaving()) return;

    this._activeVoice.set(voice);

    if (voice.sample_url) {
      this._playAudio(voice.sample_url);
    }

    this._scrollToActiveVoice();
  }

  protected onKeydown(event: KeyboardEvent, voice: IKhawiikVoice): void {
    if ((event.key === 'Enter' || event.key === ' ') && voice && !this.isSaving()) {
      event.preventDefault();
      this.selectVoice(voice);
    }
  }

  protected retry(): void {
    this._voicesFacade.fetchVoices();
  }

  protected onSaveVoice(): void {
    if (!this.isBrowser || !this.activeVoice() || this.isSaving()) return;

    Logger.debug('KhawiikVoiceTypesComponent | Saving voice:', this.activeVoice()?.name);

    this._voicePrefFacade.saveVoice(this.activeVoice()!.name);
  }

  public navigateToVoice(index: number): void {
    if (!this.isBrowser || !this._swipeInitialized) return;
    this._swipeService.navigateTo(index);
  }

  public nextVoice(): void {
    if (!this.isBrowser || !this._swipeInitialized) return;
    this._swipeService.next();
  }

  public previousVoice(): void {
    if (!this.isBrowser || !this._swipeInitialized) return;
    this._swipeService.previous();
  }

  // ====== Private Helpers ======

  private _playAudio(url: string): void {
    if (this._audioPlayer) {
      this._audioPlayer.pause();
      this._audioPlayer = null;
    }
    this._audioPlayer = new Audio(url);
    this._audioPlayer.play().catch((err) =>
      console.error('Error playing audio', err),
    );
  }

  private _stopAudio(): void {
    if (this._audioPlayer) {
      this._audioPlayer.pause();
      this._audioPlayer.currentTime = 0;
      this._audioPlayer = null;
    }
  }

  private _scrollToActiveVoice(): void {
    setTimeout(() => {
      const container =
        document.querySelector<HTMLElement>('.khawiik-voice-types__items');
      const activeEl = container?.querySelector<HTMLElement>(
        '.khawiik-voice-types__items--item.khawiik-voice-types__items--item--active',
      );

      if (container && activeEl) {
        const containerRect = container.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();
        const scrollLeft =
          container.scrollLeft +
          (activeRect.left - containerRect.left) -
          container.clientWidth / 2 +
          activeRect.width / 2;

        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    });
  }

  // ====== Swipe Logic ======
  private _setupSwipeListeners(): void {
    if (!this.isBrowser) return;

    this._swipeService.addEventListener('swipe', this._onSwipe.bind(this));
    this._swipeService.addEventListener(
      'stateChange',
      this._onSwipeStateChange.bind(this),
    );
  }
  private _initializeSwipe(): void {
    if (!this.isBrowser || !this._swipeContainerRef?.nativeElement) return;

    const container = this._swipeContainerRef.nativeElement;
    const voiceItems = Array.from(
      container.querySelectorAll('.khawiik-voice-types__items--item'),
    ) as HTMLElement[];

    if (voiceItems.length === 0) {
      Logger.debug('KhawiikVoiceTypesComponent | No voice items found for swipe initialization');
      return;
    }

    this._voiceItems = voiceItems;
    this._simpleSwipeService.initialize(container);

    container.addEventListener('swipeLeft', this._onSwipeLeft.bind(this));
    container.addEventListener('swipeRight', this._onSwipeRight.bind(this));

    this._swipeInitialized = true;
    Logger.debug(
      'KhawiikVoiceTypesComponent | Simple swipe initialized with',
      voiceItems.length,
      'items',
    );
  }
  private _reinitializeSwipe(): void {
    if (!this.isBrowser) return;
    Logger.debug('KhawiikVoiceTypesComponent | Reinitializing swipe...');
    this._initializeSwipe();
  }

  private _onSwipe(event: Event): void {
    const { detail: swipeEvent } = event as CustomEvent<SwipeEvent>;

    Logger.debug('KhawiikVoiceTypesComponent | Swipe detected:', swipeEvent);

    const voices = this.voicesResponse()?.data?.voices ?? [];
    if (voices.length === 0) return;

    let newIndex = this.currentSwipeIndex();
    const currentIndex = voices.findIndex(
      (v) => v.name === this.activeVoice()?.name,
    );
    if (currentIndex !== -1) newIndex = currentIndex;

    if (swipeEvent.direction === 'left') {
      newIndex = (newIndex + 1) % voices.length;
    } else if (swipeEvent.direction === 'right') {
      newIndex = newIndex === 0 ? voices.length - 1 : newIndex - 1;
    }

    if (newIndex !== currentIndex) {
      this.selectVoice(voices[newIndex]);
    }
  }
  private _onSwipeStateChange(event: Event): void {
    const state = (event as CustomEvent).detail;
    Logger.debug('KhawiikVoiceTypesComponent | Swipe state changed:', state);
  }

  private _onSwipeLeft(): void {
    Logger.debug('KhawiikVoiceTypesComponent | Swipe left detected');
    this._navigateToNextVoice();
  }
  private _onSwipeRight(): void {
    Logger.debug('KhawiikVoiceTypesComponent | Swipe right detected');
    this._navigateToPreviousVoice();
  }

  private _navigateToNextVoice(): void {
    const voices = this.voicesResponse()?.data?.voices ?? [];
    if (voices.length === 0) return;

    const currentIndex = voices.findIndex(
      (v) => v.name === this.activeVoice()?.name,
    );
    const nextIndex = (currentIndex + 1) % voices.length;
    this.selectVoice(voices[nextIndex]);
  }
  private _navigateToPreviousVoice(): void {
    const voices = this.voicesResponse()?.data?.voices ?? [];
    if (voices.length === 0) return;

    const currentIndex = voices.findIndex(
      (v) => v.name === this.activeVoice()?.name,
    );
    const prevIndex =
      currentIndex === 0 ? voices.length - 1 : currentIndex - 1;
    this.selectVoice(voices[prevIndex]);
  }
}
