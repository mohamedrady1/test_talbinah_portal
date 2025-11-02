import { HttpErrorResponse } from '@angular/common/http';
import { ApiError, ApiErrorFactory } from './error.interface';
import { Logger } from '../../utilities';
/**
 * Standalone exported function to handle API errors without needing the service.
 */
export function handleApiErrorsMessage(apiError: ApiError): void {
  if (apiError?.message) {
    Logger.debug('Handle Error Message: ', apiError?.message);
    // if (_ToastService) {
    //   _ToastService.add({
    //     severity: 'error',
    //     summary: 'general.error',
    //     detail: apiError?.message,
    //     life: 5000,
    //   });
    // }
  }
}
export function handleApiErrors(error: ApiError | HttpErrorResponse): ApiError {
  if (error instanceof HttpErrorResponse) {
    return handleHttpError(error);
  }

  return ApiErrorFactory.create(0, 'An unexpected error occurred', { error });
}

function handleHttpError(error: HttpErrorResponse): ApiError {
  let message: string;
  Logger.debug('handleHttpError: ', error);
  switch (error.status) {
    case 0:
      message = error.error?.message || 'No internet connection. Please check your network.';
      break;
    case 400:
      message = error.error?.message || 'Invalid request. Please check your input.';
      break;
    case 401:
      message = error.error?.message || 'Unauthorized. Please log in again.';
      break;
    case 403:
      message = error.error?.message || 'Access denied.';
      break;
    case 404:
      message = error.error?.message || 'Resource not found.';
      break;
    case 500:
      message = error.error?.message || 'Server error. Please try again later.';
      break;
    default:
      message = error.error?.message || 'An unexpected error occurred.';
  }

  return ApiErrorFactory.create(error.status, message, error.error);
}
