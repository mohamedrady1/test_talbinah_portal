import { ErrorStateConfig } from "../../../shared";

export function getCardsError(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/not-found/community/no-data-icon-error.svg',
        title: 'talbinahCommunity.noPostsAvailable',
        gap: '1rem',
        onRetry
    };
}

export function getNotificationsError(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/not-found/community/no-notifications-icon-error.svg',
        title: 'talbinahCommunity.noNotificationsAvailable',
        gap: '1rem',
        onRetry
    };
}

export function getInterestsError(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/not-found/community/avatars/no-interests-error.svg',
        title: 'talbinahCommunity.notInterestsAvailable',
        gap: '1rem',
        onRetry
    };
}
export function getAvatarsError(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/not-found/community/avatars/no-avatar-error.svg',
        title: 'talbinahCommunity.noAvatarsAvailable',
        gap: '1rem',
        onRetry
    };
}

export function GetCommunity(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/emptyStates/image-11.svg',
        title: 'general.Error',
        onRetry
    };
}
