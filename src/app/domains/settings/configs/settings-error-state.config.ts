import { ErrorStateConfig } from "../../../shared";

export function getSettingsError(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/not-found/settings/settings-error.svg',
    title: 'Settings.noSettingsAvailable',
    gap: '.5rem',
    onRetry
  };
}
export function getMostViewedArticleError(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/not-found/settings/settings-error.svg',
    title: 'Settings.noSettingsAvailable',
    gap: '.5rem',
    onRetry
  };
}
export function getmyFavouriteSettingsError(onRetry?: () => void): ErrorStateConfig {
  return {
    imageUrl: 'images/not-found/settings/settings-error.svg',
    title: 'Settings.noSettingsAvailable',
    gap: '.5rem',
    onRetry
  };
}

export const sentGiftsErrorConfig = (onRetry: () => void): ErrorStateConfig => {
  return {
    imageUrl: 'images/emptyStates/image-10.svg',
    title: 'gift.sentErrorTitle',
    retryLabel: 'general.retry',
    onRetry
  };
};

export const receivedGiftsErrorConfig = (onRetry: () => void): ErrorStateConfig => {
  return {
    imageUrl: 'images/emptyStates/image-10.svg',
    title: 'gift.receivedErrorTitle',
    retryLabel: 'general.retry',
    onRetry
  };

};

export const MyFavouritesDoctorsErrorState = (onRetry: () => void): ErrorStateConfig => {
  return {
    imageUrl: 'images/emptyStates/image-4.svg',
    title: 'settings.myFavourites.errorState.error_loading_favourites',
    retryLabel: 'general.retry',
    onRetry
  };
};

export const MyFavouritesPodcastsErrorState = (onRetry: () => void): ErrorStateConfig => {
  return {
    imageUrl: 'images/emptyStates/image-4.svg',
    title: 'settings.myFavourites.errorState.error_loading_favourites',
    retryLabel: 'general.retry',
    onRetry
  };
};

export const MyFavouritesArticlesErrorState = (onRetry: () => void): ErrorStateConfig => {
  return {
    imageUrl: 'images/emptyStates/image-4.svg',
    title: 'settings.myFavourites.errorState.error_loading_favourites',
    retryLabel: 'general.retry',
    onRetry
  };
};

export const prescriptionsErrorConfig = (onRetry: () => void): ErrorStateConfig => {
  return {
    imageUrl: 'images/emptyStates/image-4.svg',
    title: 'settings.prescription.errorTitle',
    retryLabel: 'general.retry',
    onRetry,
    imgWidth: '30%'

  };
};

export const visitReportsErrorConfig = (onRetry: () => void): ErrorStateConfig => {
  return {
    imageUrl: 'images/emptyStates/image-6.svg',
    title: 'settings.visitReports.errorTitle',
    retryLabel: 'general.retry',
    onRetry,
    imgWidth: '30%'
  };
};

export const governmentAgenciesErrorConfig = (onRetry: () => void): ErrorStateConfig => {
  return {
    imageUrl: 'images/emptyStates/image-10.svg',
    title: 'settings.governmentAgencies.errorTitle',
    retryLabel: 'general.retry',
    onRetry,
    imgWidth: '30%'
  };
};

export const technicalSupportChatsErrorConfig = (onRetry: () => void): ErrorStateConfig => {
  return {
    imageUrl: 'images/emptyStates/image-11.svg',
    title: 'settings.technicalSupportChats.errorTitle',
    retryLabel: 'general.retry',
    onRetry,
    imgWidth: '30%'
  };
};