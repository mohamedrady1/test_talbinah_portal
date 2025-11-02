export interface EmptyStateConfig {
    imageUrl: string | null;
    title?: string;
    message?: string;
    backgroundColor?: string;
    gap?: string;
    hasButton?: boolean;
    buttonText?: string;
    imgWidth?: string;
}

export interface ErrorStateConfig {
    imageUrl: string | null;
    title?: string;
    message?: string;
    retryLabel?: string;
    onRetry?: () => void;
    backgroundColor?: string;
    gap?: string;
    imgWidth?: string;
}

export const POINTS_EMPTY_STATE_CONFIG: EmptyStateConfig = {
    title: 'points.emptyState.title',
    message: 'points.emptyState.message',
    imageUrl: 'images/emptyStates/image 230.svg'
};

export const POINTS_ERROR_STATE_CONFIG: ErrorStateConfig = {
    title: 'points.errorState.title',
    message: 'points.errorState.message',
    imageUrl: 'images/emptyStates/image 230.svg',
    retryLabel: 'general.retry',
    onRetry: () => {
        // Retry logic will be implemented in component
    }
}; 