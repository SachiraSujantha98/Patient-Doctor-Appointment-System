import { AxiosError } from 'axios';
import { ApiError } from '../types';

export class AppError extends Error {
  code: string;
  details?: Record<string, unknown>;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', details?: Record<string, unknown>) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network error occurred') {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError;
    
    switch (error.response?.status) {
      case 401:
        return new AuthenticationError(apiError?.message);
      case 400:
        return new ValidationError(apiError?.message || 'Validation failed', apiError?.details);
      case 404:
        return new AppError(apiError?.message || 'Resource not found', 'NOT_FOUND');
      case 403:
        return new AppError(apiError?.message || 'Access denied', 'FORBIDDEN');
      case 500:
        return new AppError(apiError?.message || 'Internal server error', 'SERVER_ERROR');
      default:
        if (!error.response) {
          return new NetworkError();
        }
        return new AppError(apiError?.message || 'An error occurred', apiError?.code);
    }
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  return new AppError('An unknown error occurred');
};

export const logError = (error: unknown): void => {
  const appError = error instanceof AppError ? error : handleApiError(error);
  
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      name: appError.name,
      message: appError.message,
      code: appError.code,
      details: appError.details,
      stack: appError.stack,
    });
  }

  // TODO: In production, send to error tracking service (e.g., Sentry)
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(appError);
  // }
};

export const getErrorMessage = (error: unknown): string => {
  const appError = error instanceof AppError ? error : handleApiError(error);
  return appError.message;
}; 