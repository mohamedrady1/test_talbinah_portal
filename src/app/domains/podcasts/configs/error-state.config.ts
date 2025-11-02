import { ErrorStateConfig } from "../../../shared";

export function getRecommendedPodcastsError(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/emptyStates/podcast.svg',
    title: 'general.errorLoadingPodcasts',
    imgWidth: '15%',

    onRetry
  };
}

export function getPodcastsInCategoryError(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/emptyStates/podcast.svg',
    title: 'general.errorLoadingPodcastCategories',
    imgWidth: '25%',
    onRetry
  };
}

export function getRandomPodcastsError(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/emptyStates/podcast.svg',
    title: 'general.errorLoadingRandomPodcasts',
    imgWidth: '25%',
    onRetry
  };
}

export function getFavoritePodcastsError(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/emptyStates/podcast.svg',
    title: 'general.errorLoadingFavoritePodcasts',
    imgWidth: '25%',
    onRetry
  };
}
