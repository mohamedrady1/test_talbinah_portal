import { ErrorStateConfig } from "../../../shared";

export function getErrorSupportGroups(onRetry?: () => void, errorMessage?: string): ErrorStateConfig {
    return {
        imageUrl: 'images/emptyStates/image-13.svg',
        title: errorMessage || 'support_groups_no_groups_found',
        gap: '1rem',
        onRetry
    };
}
export function getErrorTherapeuticPrograms(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/errorStates/appointments.svg',
        title: 'no_treatment_programs_availableAvailableError',
        gap: '1rem',
        imgWidth: '30%',
        onRetry
    };
}
