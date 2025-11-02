/**
 * Common HTTP error status codes as enum for consistency and type safety
 * Use with HttpClient, interceptors, guards, and global error handlers.
 */
export enum ErrorStatusCode {
  /** 400 Bad Request - Validation or schema errors */
  BadRequest = 400,

  /** 401 Unauthorized - Not authenticated */
  Unauthorized = 401,

  /** 403 Forbidden - Authenticated but not authorized */
  Forbidden = 403,

  /** 404 Not Found - Resource doesn't exist */
  NotFound = 404,

  /** 408 Request Timeout - Client did not produce a request in time */
  RequestTimeout = 408,

  /** 409 Conflict - Duplicate data or conflicting operation */
  Conflict = 409,

  /** 410 Gone - Resource has been deleted or is no longer available */
  Gone = 410,

  /** 422 Unprocessable Entity - Validation failed */
  UnprocessableEntity = 422,

  /** 429 Too Many Requests - Rate limit exceeded */
  TooManyRequests = 429,

  /** 500 Internal Server Error - Server malfunction */
  InternalServerError = 500,

  /** 502 Bad Gateway - Invalid response from upstream server */
  BadGateway = 502,

  /** 503 Service Unavailable - Server is temporarily down */
  ServiceUnavailable = 503,

  /** 504 Gateway Timeout - Server didn't respond in time */
  GatewayTimeout = 504,
}
