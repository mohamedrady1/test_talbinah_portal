import { ErrorStateConfig } from "../../../shared";

export function GetDoctors(onRetry?: () => void): ErrorStateConfig {
    return {
        imageUrl: 'images/errorStates/doctors.svg',
        onRetry,
        imgWidth: '25%',
    };
}