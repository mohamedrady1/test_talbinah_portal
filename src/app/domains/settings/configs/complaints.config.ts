import { EmptyStateConfig, ErrorStateConfig } from '../../../shared';

export const complaintsEmptyState: EmptyStateConfig = {
    imageUrl: 'images/emptyStates/image-6.svg',
    title: 'complaints.emptyState.title',
    imgWidth: '25%'
};

export const complaintsErrorState = (onRetry: () => void): ErrorStateConfig => ({
    imageUrl: 'images/errorStates/image-6.svg',
    title: 'complaints.errorState.title',
    retryLabel: 'complaints.retry',
    onRetry,
    imgWidth: '25%'

}); 