import { ErrorStateConfig } from "../../../shared";

export function getCardsError(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/not-found/community/no-data-icon-error.svg',
        title: 'no_posts_available_at_the_moment',
        gap: '1rem',
        onRetry
    };
}

export function getNotificationsError(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/not-found/community/no-notifications-icon-error.svg',
        title: 'no_notifications_found',
        gap: '1rem',
        onRetry
    };
}

export function getInterestsError(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/not-found/community/avatars/no-interests-error.svg',
        title: 'no_interests_available_at_the_moment',
        gap: '1rem',
        onRetry
    };
}
export function getAvatarsError(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/not-found/community/avatars/no-avatar-error.svg',
        title: 'no_avatars_available_at_the_moment',
        gap: '1rem',
        onRetry
    };
}

export function GetCommunity(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/emptyStates/image-11.svg',
        title: 'error',
        onRetry
    };
}
