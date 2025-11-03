import { ErrorStateConfig } from "../../../shared";

export function getRecommendedPodcastsError(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/emptyStates/podcast.svg',
    title: 'an_error_has_occurredLoadingPodcasts',
    imgWidth: '15%',

    onRetry
  };
}

export function getPodcastsInCategoryError(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/emptyStates/podcast.svg',
    title: 'an_error_has_occurredLoadingPodcastCategories',
    imgWidth: '25%',
    onRetry
  };
}

export function getRandomPodcastsError(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/emptyStates/podcast.svg',
    title: 'an_error_has_occurredLoadingRandomPodcasts',
    imgWidth: '25%',
    onRetry
  };
}

export function getFavoritePodcastsError(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/emptyStates/podcast.svg',
    title: 'an_error_has_occurredLoadingFavoritePodcasts',
    imgWidth: '25%',
    onRetry
  };
}
