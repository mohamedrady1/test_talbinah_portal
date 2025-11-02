
import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { AutoExactHeightDirective, CardType, IGlobalDoctorContactInfoModel, IGlobalPodcastItemModel, Logger, ReservationModel } from '../../../../common';
import { PodcastCardForMeetingChatComponent } from '../podcast-card-for-meeting-chat';
import { ReservationHomeworkFacade } from '../../services';
import { ArticleCardComponent } from '../../../articles';
import { IGlobalReservationModel } from '../../models';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from '../../../mental-health-scales';
import { EmptyStateCardComponent, ErrorStateCardComponent } from '../../../../shared';
import { GetArticlesTasksError, GetPodcastsTasksError, GetMentalHealthTasksError, GetSessionTasksError } from '../../configs/error-state.config';
import { NoArticlesTasksEmptyState, NoMentalHealthTasksEmptyState, NoPodcastsTasksEmptyState, NoTasksEmptyState } from '../../configs/empty-state.config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-session-tasks-modal',
  standalone: true,
  imports: [
    AutoExactHeightDirective,
    TranslateModule,
    CommonModule,
    ArticleCardComponent,
    CardComponent,
    PodcastCardForMeetingChatComponent,
    EmptyStateCardComponent,
    ErrorStateCardComponent
  ],
  templateUrl: './session-tasks-modal.component.html',
  styleUrls: ['./session-tasks-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionTasksModalComponent {
  // --- Inputs/Outputs ---
  @Input({ required: false }) protected type!: string;
  @Input() protected session: IGlobalReservationModel | null = null;
  @Input() protected doctor: IGlobalDoctorContactInfoModel | null = null;

  @Output() protected closed = new EventEmitter<{ status?: boolean } | null>();

  protected readonly cardTypes = CardType;
  protected readonly reservation = signal<ReservationModel | any>(null);
  // Reservation Homework Facade
  protected readonly _ReservationHomeworkFacade = inject(ReservationHomeworkFacade);

  /* ───────────── UI state ───────────── */
  protected selected = signal<'all' | 'podcasts' | 'articles' | 'mentalHealth'>('all');
  protected searchQuery = signal('');

  /* ───────────── Raw lists from the facade (signals) ───────────── */
  private podcasts = computed(() => this._ReservationHomeworkFacade.podcasts());
  private articles = computed(() => this._ReservationHomeworkFacade.articles());
  private mentalHealth = computed(() => this._ReservationHomeworkFacade.mentalHealth());

  /* ───────────── Filtered lists derived from searchQuery ───────────── */
  protected filteredPodcasts = computed(() => this.filterByQuery(this.podcasts()));
  protected podcastCards = computed(() => this.filteredPodcasts());
  protected filteredArticles = computed(() => this.filterByQuery(this.articles()));
  protected filteredMental = computed(() => this.filterByQuery(this.mentalHealth()));

  // Error State Configs
  protected readonly podcastsTasksErrorConfig = GetPodcastsTasksError(() => this.retryLoadTasks());
  protected readonly articlesTasksErrorConfig = GetArticlesTasksError(() => this.retryLoadTasks());
  protected readonly mentalHealthTasksErrorConfig = GetMentalHealthTasksError(() => this.retryLoadTasks());
  protected readonly sessionTasksErrorConfig = GetSessionTasksError(() => this.retryLoadTasks());

  // Empty State Configs
  protected readonly podcastsTasksEmptyStateConfig = NoPodcastsTasksEmptyState;
  protected readonly articlesTasksEmptyStateConfig = NoArticlesTasksEmptyState;
  protected readonly mentalHealthTasksEmptyStateConfig = NoMentalHealthTasksEmptyState;
  protected readonly sessionTasksEmptyStateConfig = NoTasksEmptyState;

  /* ───────────── Helpers ───────────── */
  private filterByQuery<
    T extends { assignment?: { title?: string } | null }
  >(list: T[] | undefined) {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return list ?? [];
    return (list ?? []).filter(item =>
      item.assignment?.title?.toLowerCase().includes(q)
    );
  }

  protected onSearch(value: string): void {
    this.searchQuery.set(value);
  }
  protected clearSearch(): void {
    this.searchQuery.set('');
  }
  protected selectTab(tab: 'all' | 'podcasts' | 'articles' | 'mentalHealth'): void {
    this.selected.set(tab);
  }

  ngOnInit(): void {
    if (this.session?.id) {
      this._ReservationHomeworkFacade.loadHomework(this.session?.id);
      this.reservation.set({ user: { id: this.session?.user?.id ?? null }, doctor: { id: this.session?.doctor?.id ?? null } });
    }
    Logger.debug('SessionTasksModalComponent initialized with data:', {
      session: this.session,
      doctor: this.doctor,
      reservation: this.reservation()
    });
  }

  protected retryLoadTasks(): void {
    if (this.session?.id) {
      this._ReservationHomeworkFacade.loadHomework(this.session?.id);
    }
  }
}