import { ErrorStateConfig } from "../../../shared";

export function GetReservations(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/errorStates/appointments.svg',
        title: 'Appointments.errorState.error_loading_appointments',
        message: 'Appointments.errorState.subtitle',
        onRetry
    };
}

export function GetReservationDetails(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/errorStates/appointments.svg',
        imgWidth: '30%',
        onRetry
    };
}

// Session Tasks Error States
export function GetSessionTasksError(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/errorStates/appointments.svg',
        title: 'Appointments.errorState.error_loading_session_tasks',
        message: 'Appointments.errorState.subtitle',
        imgWidth: '30%',
        onRetry
    };
}

export function GetPodcastsTasksError(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/errorStates/podcasts.svg',
        title: 'Appointments.errorState.error_loading_podcasts_tasks',
        message: 'Appointments.errorState.subtitle',
        imgWidth: '30%',
        onRetry
    };
}

export function GetArticlesTasksError(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/errorStates/articles.svg',
        title: 'Appointments.errorState.error_loading_articles_tasks',
        message: 'Appointments.errorState.subtitle',
        imgWidth: '30%',
        onRetry
    };
}

export function GetMentalHealthTasksError(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/errorStates/mental-health.svg',
        title: 'Appointments.errorState.error_loading_mental_health_tasks',
        message: 'Appointments.errorState.subtitle',
        imgWidth: '30%',
        onRetry
    };
}