import { ApiError, ApiErrorFactory } from '../error.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorHandlingService {
  handleApiErrors(error: ApiError): ApiError {
    if (error instanceof HttpErrorResponse) {
      return this.handleHttpError(error);
    }
    return ApiErrorFactory.create(0, 'An unexpected error occurred', { error });
  }

  private handleHttpError(error: HttpErrorResponse): ApiError {
    let message: string;
    switch (error.status) {
      case 0:
        message = 'No internet connection. Please check your network.';
        break;
      case 400:
        message = error.error?.message || 'Invalid request. Please check your input.';
        break;
      case 401:
        message = 'Unauthorized. Please log in again.';
        break;
      case 403:
        message = 'Access denied.';
        break;
      case 404:
        message = 'Resource not found.';
        break;
      case 500:
        message = 'Server error. Please try again later.';
        break;
      default:
        message = 'An unexpected error occurred.';
    }
    return ApiErrorFactory.create(error.status, message, error.error);
  }
}
