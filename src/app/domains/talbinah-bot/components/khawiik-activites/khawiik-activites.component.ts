import { Component, ChangeDetectionStrategy, PLATFORM_ID, inject, computed, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AutoExactHeightDirective } from './../../../../common/core/directives/clickOutside/auto-exact-height.directive';
import { Logger } from './../../../../common/core/utilities/logging/logger';
import { KhawiikActivitiesSkeletonComponent } from './../../skeletons/khawiik-activities-skeleton/khawiik-activities-skeleton.component';
import { getKhawiikActivitiesErrorConfig } from './../../configs/error-state.config';
import { KhawiikActivitiesLookupFacade } from './../../services/activites-lookup.facade';
import { IKhawiikVoiceActivity } from './../../dtos/responses/khawiik-responses.dto';
import { ErrorStateCardComponent, ErrorStateConfig } from './../../../../shared/components/error-state-card/error-state-card.component';
import { TranslateApiPipe } from '../../../../common/core/translations/pipes/translate-api.pipe';
import { EmptyStateCardComponent, EmptyStateConfig } from '../../../../shared';
import { KhawiikActivitiesEmptyState } from '../../configs/empty-state.config';

@Component({
  selector: 'app-khawiik-activities',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    AutoExactHeightDirective,

    KhawiikActivitiesSkeletonComponent,
    EmptyStateCardComponent,
    ErrorStateCardComponent,
    TranslateApiPipe
  ],
  templateUrl: './khawiik-activites.component.html',
  styleUrls: ['./khawiik-activites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KhawiikActivitesComponent implements OnInit {
  @Output() protected closed = new EventEmitter<IKhawiikVoiceActivity | null>();

  // ====== Dependencies ======
  private readonly facade = inject(KhawiikActivitiesLookupFacade);

  // ====== SSR Check ======
  private readonly platformId = inject(PLATFORM_ID);
  protected isBrowser: boolean;

  // ====== Static UI Configs ======
  protected readonly errorState: ErrorStateConfig = getKhawiikActivitiesErrorConfig(() =>
    this.facade.fetchActivities(),
  );
  protected readonly emptyState: EmptyStateConfig = KhawiikActivitiesEmptyState;

  // ====== Facade state ======
  readonly isLoading = this.facade.isLoading;
  readonly errorMessage = this.facade.errorMessage;
  readonly status = this.facade.status;
  readonly response = this.facade.activities;

  // ====== Derived state ======
  readonly activityCards = computed<IKhawiikVoiceActivity[]>(() => {
    const apiResponse = this.response();
    const items: IKhawiikVoiceActivity[] | undefined = apiResponse?.data?.items;
    return Array.isArray(items) ? items.slice(0, 4) : [];
  });

  // ====== Lifecycle ======
  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.facade.fetchActivities();
  }

  // ====== Public / template actions ======
  protected onCardSelect(card: IKhawiikVoiceActivity): void {
    if (!this.isBrowser) return;
    Logger.info('KhawiikActivities | card selected', {
      card: card
    });

    // Close the modal
    this.closed.emit(card);
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
}
