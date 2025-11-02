import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  OnInit,
} from '@angular/core';
import {
  AutoExactHeightDirective,
  CardType,
  IGlobalDoctorContactInfoModel,
  IGlobalPodcastItemModel,
  Logger,
  TranslateApiPipe,
} from '../../../../common';
import {
  PodcastCategoriesFacade,
  PodcastsListFacade,
  PodcastSkeletonComponent,
  NoRecommendedPodcasts,
} from '../../../podcasts';
import { NoPodcastsInCategoryEmptyState } from '../../configs';
import {
  EmptyStateCardComponent,
  ErrorStateCardComponent,
  SvgIconComponent,
} from '../../../../shared';
import { TranslateModule } from '@ngx-translate/core';
import { PodcastCardForMeetingChatComponent } from '../podcast-card-for-meeting-chat';

@Component({
  selector: 'app-send-podcast',
  standalone: true,
  imports: [
    PodcastCardForMeetingChatComponent,
    AutoExactHeightDirective,
    PodcastSkeletonComponent,
    ErrorStateCardComponent,
    TranslateModule,
    SvgIconComponent,
    EmptyStateCardComponent,
    TranslateApiPipe
  ],
  templateUrl: './send-podcast.component.html',
  styleUrls: ['./send-podcast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendPodcastComponent implements OnInit {
  // ───────────────────── Inputs / Outputs ─────────────────────
  @Input({ required: false }) protected type!: string;
  @Input() protected doctor: IGlobalDoctorContactInfoModel | null = null;
  @Output() protected closed = new EventEmitter<{ status?: boolean, item: IGlobalPodcastItemModel | string | null } | null>();

  // ───────────────────── Utilities & Constants ─────────────────────
  protected readonly cardTypes = CardType;
  protected readonly noPodcasts = NoPodcastsInCategoryEmptyState;
  protected readonly allPodcastsError = NoRecommendedPodcasts;

  // ───────────────────── Facades ─────────────────────
  private readonly _podcastsListFacade = inject(PodcastsListFacade);
  private readonly _podcastCategoriesFacade = inject(PodcastCategoriesFacade);

  // ───────────────────── Category Tabs State ─────────────────────
  protected readonly categoriesItem = computed(() =>
    this._podcastCategoriesFacade.categoriesResponse()
  );
  protected readonly isLoadingCategoriesItem = computed(() =>
    this._podcastCategoriesFacade.isLoading()
  );
  protected readonly errorCategoriesItem = computed(() =>
    this._podcastCategoriesFacade.errorMessage()
  );

  /** Selected tab: 'all' or a category id string */
  protected readonly selectedCategory = signal<string | number>('all');

  // ───────────────────── Search State ─────────────────────
  protected readonly searchQuery = signal('');

  // ───────────────────── Podcasts State ─────────────────────
  private readonly allPodcastsResponse = computed(() =>
    this._podcastsListFacade.allPodcasts()
  );
  protected readonly isLoadingPodcasts = computed(() =>
    this._podcastsListFacade.isLoadingAllPodcasts()
  );
  protected readonly allPodcastsErrorMessage = computed(() =>
    this._podcastsListFacade.allPodcastsErrorMessage()
  );

  protected readonly filteredPodcasts = computed(() =>
    this.filterPodcasts()
  );

  protected readonly podcastCards = computed(() =>
    (this.filteredPodcasts() ?? []) as IGlobalPodcastItemModel[]
  );

  // ───────────────────── Lifecycle ─────────────────────
  ngOnInit(): void {
    this._podcastsListFacade.fetchAllPodcasts();
    this._podcastCategoriesFacade.fetchCategories();
  }

  // ───────────────────── Event Handlers ─────────────────────
  protected onSearch(value: string): void {
    this.searchQuery.set(value);
  }

  protected clearSearch(): void {
    this.searchQuery.set('');
  }

  protected selectCategory(categoryId: string | number): void {
    this.selectedCategory.set(categoryId);
  }

  protected onPodcastSelectedToSend(item: IGlobalPodcastItemModel): void {
    Logger.debug('SendPodcastComponent => onPodcastSelectedToSend: ', item);
    this.closed.emit({ status: true, item: JSON.stringify(item) });
  }

  protected onClose(): void {
    this.closed.emit(null);
  }

  // ───────────────────── Helpers ─────────────────────
  private filterPodcasts(): IGlobalPodcastItemModel[] {
    const all = this.allPodcastsResponse()?.data?.podcasts ?? [];
    const query = this.searchQuery().trim().toLowerCase();
    const selected = this.selectedCategory();

    return all.filter((item) => {
      const matchesCategory =
        selected === 'all' || item.id === selected;
      const matchesQuery =
        !query || item.title?.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }
}
