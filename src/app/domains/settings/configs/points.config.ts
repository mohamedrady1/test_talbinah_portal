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
    title: 'no_gifts_available',
    message: 'no_gifts_available_detailed',
    imageUrl: 'images/emptyStates/image 230.svg'
};

export const POINTS_ERROR_STATE_CONFIG: ErrorStateConfig = {
    title: 'gifts_loading_error',
    message: 'gifts_loading_error_detailed',
    imageUrl: 'images/emptyStates/image 230.svg',
    retryLabel: 'general.retry',
    onRetry: () => {
        // Retry logic will be implemented in component
    }
}; 