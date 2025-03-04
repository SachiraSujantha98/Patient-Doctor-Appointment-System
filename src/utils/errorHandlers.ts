import axios, { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export const handleAxiosError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;
    return {
      message: axiosError.response?.data?.message || axiosError.message,
      status: axiosError.response?.status,
      code: axiosError.code,
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
    };
  }

  return {
    message: 'An unknown error occurred',
    code: 'UNKNOWN_ERROR',
  };
};

export const isNetworkError = (error: unknown): boolean => {
  return axios.isAxiosError(error) && !error.response;
};

export const isAuthenticationError = (error: unknown): boolean => {
  return axios.isAxiosError(error) && error.response?.status === 401;
};

export const isForbiddenError = (error: unknown): boolean => {
  return axios.isAxiosError(error) && error.response?.status === 403;
}; 