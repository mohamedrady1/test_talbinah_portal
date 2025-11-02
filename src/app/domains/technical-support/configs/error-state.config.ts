import { ErrorStateConfig } from "../../../shared";

export function getError(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/not-found/Treatment-programs/no-data-icon-error.svg',
        title: 'no_treatment_programs_availableAvailable',
        gap: '1rem',
        onRetry
    };
}

