import { ICardHeaderConfig } from "../../../shared"
import { SegmentOption } from '../../../shared/components/segment-control/segment-control.component';

export const PodcastSegmentOptions: SegmentOption[] = [
  { id: 'recommended', title: 'podcast_card_recommended_title' },
  { id: 'explore', title: 'podcast_card_explore_title' },
  { id: 'favourite', title: 'podcast_card_favorites_title' }
];

export const MostListenedHeaderConfig: ICardHeaderConfig = {
  title: 'podcast_card_most_listened_title',
  // title: 'most_listened_this_week',
  isButtonsVisible: false,
  isAllButtonVisible: false,
}

export const RecommendedPodcastListHeaderConfig: ICardHeaderConfig = {
  title: 'podcast_card_recommended_title',
  // title: 'suggested_podcasts_for_you',
  isButtonsVisible: true,
  isAllButtonVisible: false,
}
export const FavouritePodcastListHeaderConfig: ICardHeaderConfig = {
  title: 'podcast_card_favorites_title',
  // title: 'favorite_podcasts',
  isButtonsVisible: false,
  isAllButtonVisible: true,
}
export const AllPodcastListHeaderConfig: ICardHeaderConfig = {
  title: 'podcast_card_explore_title',
  // title: 'explore_podcasts',
  isButtonsVisible: false,
  isAllButtonVisible: false,
  isTabsEnabled: true,
  tabs: ['all'],
  selectedTab: 'social.support'
}
export const selectionsPodcastListHeaderConfig: ICardHeaderConfig = {
  title: 'podcast_selections',
  isButtonsVisible: false,
  isAllButtonVisible: false,
}
