import { ErrorStateConfig } from "../../../shared";

export function getProfileNotificationsError(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/not-found/community/no-notifications-icon-error.svg',
        title: 'no_notifications_yet',
        gap: '1rem',
        onRetry
    };
}

