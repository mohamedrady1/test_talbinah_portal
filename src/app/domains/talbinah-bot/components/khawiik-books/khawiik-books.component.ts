import { Component, ChangeDetectionStrategy, PLATFORM_ID, inject, computed, Output, EventEmitter } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { ErrorStateCardComponent, ErrorStateConfig } from './../../../../shared/components/error-state-card/error-state-card.component';
import { AutoExactHeightDirective } from './../../../../common/core/directives/clickOutside/auto-exact-height.directive';
import { KhawiikBooksLookupFacade } from './../../services/khawiik-books-lookup.facade';
import { getKhawiikBooksErrorConfig } from './../../configs/error-state.config';
import { Logger } from './../../../../common/core/utilities/logging/logger';
import { KhawiikBooksSkeletonComponent } from "../../../../shared/skeletons";
import { IKhawiikBook } from '../../dtos';
import { KhawiikBotRoutesEnum } from '../../constants';
import { MissionDataService } from '../../services';
import { TranslationsFacade } from '../../../../common/core/translations/services';
import { EmptyStateCardComponent, EmptyStateConfig } from '../../../../shared';
import { KhawiikBooksEmptyState } from '../../configs/empty-state.config';

@Component({
  selector: 'app-khawiik-books',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    AutoExactHeightDirective,

    KhawiikBooksSkeletonComponent,
    ErrorStateCardComponent,
    EmptyStateCardComponent
  ],
  templateUrl: './khawiik-books.component.html',
  styleUrls: ['./khawiik-books.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KhawiikBooksComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  
  @Output() protected closed = new EventEmitter<IKhawiikBook | null>();

  // ====== Dependencies ======
  private readonly facade = inject(KhawiikBooksLookupFacade);
  private readonly router = inject(Router);
  private readonly missionDataService = inject(MissionDataService);

  // ====== SSR Check ======
  private readonly platformId = inject(PLATFORM_ID);
  protected isBrowser: boolean;

  // ====== Static UI Configs ======
  protected readonly errorState: ErrorStateConfig = getKhawiikBooksErrorConfig(() =>
    this.facade.fetchKhawiikBooks(),
  );
  protected readonly emptyState: EmptyStateConfig = KhawiikBooksEmptyState;
  // ====== Facade state ======
  readonly isLoading = this.facade.isLoading;
  readonly isStartingMission = this.facade.isStartingMission;
  readonly errorMessage = this.facade.errorMessage;
  readonly status = this.facade.status;
  readonly response = this.facade.khawiikBooks;

  // ====== Derived state ======
  readonly activityCards = computed<IKhawiikBook[]>(() => {
    const apiResponse = this.response();
    const items: IKhawiikBook[] | undefined = apiResponse?.data?.items;
    return Array.isArray(items) ? items.slice(0, 4) : [];
  });

  // ====== Lifecycle ======
  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.facade.fetchKhawiikBooks();
  }

  // ====== Public / template actions ======
  protected onCardSelect(card: IKhawiikBook): void {
    if (!this.isBrowser) return;

    // Don't allow selection if the book is completed
    if (card.user_status === 'completed') {
      return;
    }

    Logger.info('KhawiikBooksComponent | KhawiikBook | card selected', {
      card: card
    });

    // Check if it's a text card and start mission
    if (this.getBookType(card) === 'text') {
      this.startMission(card.slug);
      this.closed.emit(card);
    } else if (this.getBookType(card) === 'voice') {
      // For voice cards, navigate to voice chat
      this.router.navigate([`/${KhawiikBotRoutesEnum.KHAWIIK_MAIN_PAGE}`, KhawiikBotRoutesEnum.VOICE_CHAT]);
      this.closed.emit(card);
    } else {
      // For other card types, just close the modal
      this.closed.emit(card);
    }
  }

  // ====== Mission start functionality ======
  private startMission(missionSlug: string): void {
    this.facade.startMission(missionSlug).subscribe({
      next: (response) => {
        if (response.status && response.data) {
          Logger.info('Mission started successfully', response.data);

          // Set the mission data in the service
          this.missionDataService.setMissionData(response.data);

          // Navigate to text chat page
          this.router.navigate([`/${KhawiikBotRoutesEnum.KHAWIIK_MAIN_PAGE}`, KhawiikBotRoutesEnum.TEXT_CHAT]);

          // Close the modal after successful mission start
          this.closed.emit(null);
        }
      },
      error: (error) => {
        Logger.error('Failed to start mission', error);
        // Close the modal even on error
        this.closed.emit(null);
      }
    });
  }

  // ====== Helper methods ======
  protected isBookCompleted(card: IKhawiikBook): boolean {
    return card.user_status === 'completed';
  }

  protected getBookType(card: IKhawiikBook): string {
    // If type is explicitly provided, use it
    if (card.type) {
      return card.type;
    }

    // If mode is provided, determine type from mode
    if (card.mode) {
      const mode = card.mode.toLowerCase();
      if (mode.includes('text') || mode.includes('نص')) {
        return 'text';
      } else if (mode.includes('voice') || mode.includes('صوت')) {
        return 'voice';
      }
    }

    // Otherwise, determine type based on config and progress data
    if (card.progress.required_seconds && card.progress.voice_seconds !== undefined) {
      return 'voice';
    } else if (card.config.min_text_msgs_per_day && !card.config.min_voice_seconds_per_day) {
      return 'text';
    } else if (card.config.min_voice_seconds_per_day && !card.config.min_text_msgs_per_day) {
      return 'voice';
    } else if (card.config.min_text_msgs_per_day && card.config.min_voice_seconds_per_day) {
      return 'mixed';
    }

    return 'text'; // Default to text
  }

  protected getDaysDone(card: IKhawiikBook): number {
    // For now, return a placeholder value
    // In a real implementation, this would come from the API or user progress
    return card.user_status === 'completed' ? card.config.days : Math.floor(card.config.days * 0.3);
  }

  protected onIconError(event: Event): void {
    if (!this.isBrowser) return;

    //  case 'journaling': return 'write';
    // case 'breathing': return 'breath';
    // case 'gratitude': return 'reflect';
    // case 'mood_checkin': return 'start';

    const img = event.target as HTMLImageElement;
    img.src = 'images/icons/logo-2.png';
  }

  // ====== Voice progress methods ======
  protected formatVoiceTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  protected getVoiceProgress(card: IKhawiikBook): number {
    if (!card.progress.required_seconds || card.progress.required_seconds === 0) {
      return 0;
    }
    const voiceSeconds = card.progress.voice_seconds || 0;
    return Math.min((voiceSeconds / card.progress.required_seconds) * 100, 100);
  }

  protected getVoiceProgressPercentage(card: IKhawiikBook): string {
    return `${this.getVoiceProgress(card)}%`;
  }

  protected getVoiceProgressDots(card: IKhawiikBook): { filled: boolean }[] {
    const totalDots = 10; // Number of dots to show
    const progressPercentage = this.getVoiceProgress(card);
    const filledDots = Math.floor((progressPercentage / 100) * totalDots);

    return Array.from({ length: totalDots }, (_, index) => ({
      filled: index < filledDots
    }));
  }

  protected trackByIndex(index: number): number {
    return index;
  }
}
