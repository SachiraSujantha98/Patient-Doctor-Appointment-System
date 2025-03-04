import { CSRFConfig } from '../types/csrf';
import { testConfig } from './test.config';

interface Config {
  apiBaseUrl: string;
  environment: string;
  csrf: CSRFConfig;
  auth: {
    googleClientId: string;
  };
  apiEndpoints: {
    auth: {
      login: string;
      register: string;
      googleLogin: string;
      refresh: string;
    };
    csrfToken: string;
  };
}

interface EnvConfig {
  VITE_API_BASE_URL: string;
  VITE_GOOGLE_CLIENT_ID: string;
  MODE: string;
}

const getEnvConfig = (): EnvConfig => {
  if (process.env.NODE_ENV === 'test') {
    return testConfig;
  }

  // For runtime environment
  if (typeof window !== 'undefined' && 'import' in window) {
    return (window as any).import.meta.env;
  }

  // Fallback for other environments
  return {
    VITE_API_BASE_URL: 'http://localhost:3000',
    VITE_GOOGLE_CLIENT_ID: '',
    MODE: 'development'
  };
};

const env = getEnvConfig();

export const config: Config = {
  apiBaseUrl: env.VITE_API_BASE_URL,
  environment: env.MODE,
  csrf: {
    tokenRefreshInterval: 1800000, // 30 minutes
    cookieName: 'XSRF-TOKEN',
    headerName: 'X-CSRF-Token'
  },
  auth: {
    googleClientId: env.VITE_GOOGLE_CLIENT_ID,
  },
  apiEndpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      googleLogin: '/auth/google',
      refresh: '/auth/refresh'
    },
    csrfToken: '/csrf-token'
  }
}; 