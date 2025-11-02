import { ErrorStateConfig } from '../../../shared';

export function getDiscountErrorConfig(errorMessage?: string, onRetry?: () => void): ErrorStateConfig {
    return {
        title: 'discount_code_application_error',
        retryLabel: 'retry',
        onRetry: onRetry,
        imgWidth: '30%'
    };
}

