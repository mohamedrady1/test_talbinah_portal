import { ErrorStateConfig } from '../../../shared';

export function getDiscountErrorConfig(errorMessage?: string, onRetry?: () => void): ErrorStateConfig {
    return {
        title: 'payments.discount.error.title',
        retryLabel: 'general.cancel',
        onRetry: onRetry,
        imgWidth: '30%'
    };
}

