import { ErrorStateConfig } from "../../../shared";

export function getError(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/not-found/Treatment-programs/no-data-icon-error.svg',
        title: 'no_treatment_programs_availableAvailable',
        gap: '1rem',
        onRetry
    };
}

export function getErrorForProgramSubscription(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/emptyStates/image-4.svg',
        title: 'no_treatment_programs_availableAvailableError',
        gap: '1rem',
        imgWidth: '50%',
        onRetry
    };
}
