import { ErrorStateConfig } from "../../../shared";

export function getMoodsError(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/not-found/mental-health/emoji-error.svg',
        title: 'no_results_found',
        gap: '.5rem',
        onRetry
    };
}

