import { EmptyStateConfig, ErrorStateConfig } from '../../../shared';

export const complaintsEmptyState: EmptyStateConfig = {
    imageUrl: 'images/emptyStates/image-6.svg',
    title: 'no_complaints',
    imgWidth: '25%'
};

export const complaintsErrorState = (onRetry: () => void): ErrorStateConfig => ({
    imageUrl: 'images/errorStates/image-6.svg',
    title: 'complaints_loading_error',
    retryLabel: 'retry',
    onRetry,
    imgWidth: '25%'

}); 