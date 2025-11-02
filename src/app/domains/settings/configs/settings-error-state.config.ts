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
    title: 'sent_gifts_error',
    retryLabel: 'general.retry',
    onRetry
  };
};

export const receivedGiftsErrorConfig = (onRetry: () => void): ErrorStateConfig => {
  return {
    imageUrl: 'images/emptyStates/image-10.svg',
    title: 'received_gifts_error',
    retryLabel: 'general.retry',
    onRetry
  };

};

export const MyFavouritesDoctorsErrorState = (onRetry: () => void): ErrorStateConfig => {
  return {
    imageUrl: 'images/emptyStates/image-4.svg',
    title: 'favorites_loading_error',
    retryLabel: 'general.retry',
    onRetry
  };
};

export const MyFavouritesPodcastsErrorState = (onRetry: () => void): ErrorStateConfig => {
  return {
    imageUrl: 'images/emptyStates/image-4.svg',
    title: 'favorites_loading_error',
    retryLabel: 'general.retry',
    onRetry
  };
};

export const MyFavouritesArticlesErrorState = (onRetry: () => void): ErrorStateConfig => {
  return {
    imageUrl: 'images/emptyStates/image-4.svg',
    title: 'favorites_loading_error',
    retryLabel: 'general.retry',
    onRetry
  };
};

export const prescriptionsErrorConfig = (onRetry: () => void): ErrorStateConfig => {
  return {
    imageUrl: 'images/emptyStates/image-4.svg',
    title: 'error_loading_medical_prescriptions',
    retryLabel: 'general.retry',
    onRetry,
    imgWidth: '30%'

  };
};

export const visitReportsErrorConfig = (onRetry: () => void): ErrorStateConfig => {
  return {
    imageUrl: 'images/emptyStates/image-6.svg',
    title: 'visit_reports_loading_error',
    retryLabel: 'general.retry',
    onRetry,
    imgWidth: '30%'
  };
};

export const governmentAgenciesErrorConfig = (onRetry: () => void): ErrorStateConfig => {
  return {
    imageUrl: 'images/emptyStates/image-10.svg',
    title: 'government_authorities_loading_error',
    retryLabel: 'general.retry',
    onRetry,
    imgWidth: '30%'
  };
};

export const technicalSupportChatsErrorConfig = (onRetry: () => void): ErrorStateConfig => {
  return {
    imageUrl: 'images/emptyStates/image-11.svg',
    title: 'conversations_loading_error',
    retryLabel: 'general.retry',
    onRetry,
    imgWidth: '30%'
  };
};