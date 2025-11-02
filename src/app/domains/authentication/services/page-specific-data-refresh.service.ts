import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Logger } from '../../../common';

// Import all the facades we need
import { SeminarsFacade } from '../../support-groups/services/seminars.facade';
import { FavoritePodcastsFacade } from '../../podcasts/services/favorite-podcasts.facade';
import { PsychologicalPostsFacade } from '../../talbinah-community/services/psychological-posts.facade';
import { LastSevenUserMoodsFacade } from '../../mental-health-scales/services/last-seven-user-moods.facade';
import { MyMeasurementsFacade } from '../../mental-health-scales/services/my-measurements.facade';
import { FavoriteArticlesFacade } from '../../articles/services/favorite-articles.facade';
import { TherapeuticProgramsFacade } from '../../therapeutic-programs/services/therapeutic-programs.facade';
import { ChatHistoryFacade } from '../../talbinah-bot/services/chat-history.facade';

@Injectable({
    providedIn: 'root'
})
export class PageSpecificDataRefreshService {
    private readonly router = inject(Router);
    private readonly platformId = inject(PLATFORM_ID);

    // Inject all the facades
    private readonly seminarsFacade = inject(SeminarsFacade);
    private readonly favoritePodcastsFacade = inject(FavoritePodcastsFacade);
    private readonly psychologicalPostsFacade = inject(PsychologicalPostsFacade);
    private readonly lastSevenUserMoodsFacade = inject(LastSevenUserMoodsFacade);
    private readonly myMeasurementsFacade = inject(MyMeasurementsFacade);
    private readonly favoriteArticlesFacade = inject(FavoriteArticlesFacade);
    private readonly therapeuticProgramsFacade = inject(TherapeuticProgramsFacade);
    private readonly chatHistoryFacade = inject(ChatHistoryFacade);

    /**
     * Refreshes data based on the current page/route
     * This method should be called after successful login
     */
    refreshDataForCurrentPage(): void {
        if (!isPlatformBrowser(this.platformId)) {
            Logger.debug('PageSpecificDataRefreshService: Skipping refresh on server side');
            return;
        }

        const currentUrl = this.router.url;
        Logger.debug('PageSpecificDataRefreshService: Current URL:', currentUrl);

        // Define page patterns and their corresponding refresh methods
        const pageRefreshMap = this.getPageRefreshMap();

        // Find matching page and execute refresh
        for (const [pattern, refreshMethod] of pageRefreshMap) {
            if (currentUrl.includes(pattern)) {
                Logger.debug(`PageSpecificDataRefreshService: Refreshing data for page: ${pattern}`);
                refreshMethod();
                return;
            }
        }

        Logger.debug('PageSpecificDataRefreshService: No specific page refresh needed for:', currentUrl);
    }

    /**
     * Returns a map of page patterns to their refresh methods
     */
    private getPageRefreshMap(): Array<[string, () => void]> {
        return [
            // Support Groups (my-seminars)
            ['support-groups', () => {
                Logger.debug('Refreshing support groups data...');
                this.seminarsFacade.fetchMySeminars();
            }],

            // Podcasts (podcastfavorites) - بدون pagination parameters
            ['podcasts', () => {
                Logger.debug('Refreshing favorite podcasts data...');
                this.favoritePodcastsFacade.fetchFavoritesWithoutPagination(); // بدون ?page=1&per_page=10
            }],

            // Community posts (talbinah community)
            ['community', () => {
                Logger.debug('Refreshing community posts data...');
                this.psychologicalPostsFacade.fetchPosts();
            }],
            ['talbinah-community', () => {
                Logger.debug('Refreshing community posts data...');
                this.psychologicalPostsFacade.fetchPosts();
            }],

            // Mental Health Scales (last-seven and report)
            ['mental-health-scales', () => {
                Logger.debug('Refreshing mental health scales data...');
                this.lastSevenUserMoodsFacade.getLastSevenUserMoods();
                this.myMeasurementsFacade.fetchMyMeasurements();
            }],
            ['mental-health', () => {
                Logger.debug('Refreshing mental health scales data...');
                this.lastSevenUserMoodsFacade.getLastSevenUserMoods();
                this.myMeasurementsFacade.fetchMyMeasurements();
            }],

            // Articles (bookmark)
            ['articles', () => {
                Logger.debug('Refreshing favorite articles data...');
                this.favoriteArticlesFacade.fetchFavoriteArticles();
            }],

            // Therapeutic Programs (my-programs)
            ['therapeutic-programs', () => {
                Logger.debug('Refreshing therapeutic programs data...');
                this.therapeuticProgramsFacade.fetchMyTherapeuticPrograms();
            }],
            ['programs', () => {
                Logger.debug('Refreshing therapeutic programs data...');
                this.therapeuticProgramsFacade.fetchMyTherapeuticPrograms();
            }],

            // Khawiik Bot (text-chat, voice-chat)
            ['khawiik', () => {
                Logger.debug('Refreshing chat history data...');
                this.chatHistoryFacade.fetchChatHistory();
            }],
            ['khawiik-text-chat', () => {
                Logger.debug('Refreshing chat history data...');
                this.chatHistoryFacade.fetchChatHistory();
            }],
            ['khawiik-voice-chat', () => {
                Logger.debug('Refreshing chat history data...');
                this.chatHistoryFacade.fetchChatHistory();
            }]
        ];
    }

    /**
     * Refreshes all data regardless of current page
     * This can be used as a fallback or for comprehensive refresh
     */
    refreshAllData(): void {
        if (!isPlatformBrowser(this.platformId)) {
            Logger.debug('PageSpecificDataRefreshService: Skipping refresh all on server side');
            return;
        }

        Logger.debug('PageSpecificDataRefreshService: Refreshing all data...');

        // Refresh all facades
        this.seminarsFacade.fetchMySeminars();
        this.favoritePodcastsFacade.fetchFavoritesWithoutPagination(); // بدون pagination parameters
        this.psychologicalPostsFacade.fetchPosts();
        this.lastSevenUserMoodsFacade.getLastSevenUserMoods();
        this.myMeasurementsFacade.fetchMyMeasurements();
        this.favoriteArticlesFacade.fetchFavoriteArticles();
        this.therapeuticProgramsFacade.fetchMyTherapeuticPrograms();
        this.chatHistoryFacade.fetchChatHistory();

        Logger.debug('PageSpecificDataRefreshService: All data refresh initiated');
    }
}
