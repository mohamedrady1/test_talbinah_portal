import { ErrorStateConfig } from "../../../shared";

export function getMeasurementsError(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/not-found/mental-health/tests-error.svg',
        title: 'no_results_found',
        gap: '.5rem',
        onRetry
    };
}
export function getmyMeasurementsError(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/not-found/mental-health/tests-error.svg',
        title: 'no_results_found',
        gap: '.5rem',
        onRetry
    };
}


