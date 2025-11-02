import { ErrorStatusCode } from './error-status-code.enum';
import { ErrorType } from './error-type.enum';

export interface IApiError {
  type: ErrorType;
  statusCode: ErrorStatusCode;
  message: string | string[];
  details?: unknown;
}


export interface ApiError {
  status?: number;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

export class ApiErrorFactory {
  static create(status: number, message: string, details?: Record<string, any>): ApiError {
    return {
      status,
      message,
      details,
      timestamp: new Date().toISOString(),
    };
  }
}
