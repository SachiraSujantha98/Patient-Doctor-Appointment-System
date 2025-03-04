import { config } from '../config/env.config';
import { AxiosInstance } from 'axios';
import { CSRFTokenResponse } from '../types/csrf';

class CSRFTokenManager {
  private static instance: CSRFTokenManager;
  private token: string | null = null;
  private lastFetchTime: number = 0;
  private readonly TOKEN_REFRESH_INTERVAL = 1800000; // 30 minutes

  private constructor() {}

  public static getInstance(): CSRFTokenManager {
    if (!CSRFTokenManager.instance) {
      CSRFTokenManager.instance = new CSRFTokenManager();
    }
    return CSRFTokenManager.instance;
  }

  public getToken(): string | null {
    return this.token;
  }

  public setToken(token: string): void {
    this.token = token;
    this.lastFetchTime = Date.now();
  }

  public needsRefresh(): boolean {
    return (
      !this.token ||
      Date.now() - this.lastFetchTime >= this.TOKEN_REFRESH_INTERVAL
    );
  }

  public clearToken(): void {
    this.token = null;
    this.lastFetchTime = 0;
  }
}

export const csrfManager = CSRFTokenManager.getInstance();

export const extractCsrfTokenFromCookie = (): string | null => {
  const cookies = document.cookie.split(';');
  const csrfCookie = cookies.find(cookie => 
    cookie.trim().startsWith('XSRF-TOKEN=')
  );
  
  if (csrfCookie) {
    return decodeURIComponent(csrfCookie.split('=')[1]);
  }
  return null;
};

export const validateCsrfToken = (headerToken: string): boolean => {
  const cookieToken = extractCsrfTokenFromCookie();
  return cookieToken !== null && headerToken === cookieToken;
};

export const setupCsrfProtection = async (api: AxiosInstance): Promise<void> => {
  try {
    const response = await api.get<CSRFTokenResponse>(`${config.apiBaseUrl}/csrf-token`);
    const token = response.data.token;
    csrfManager.setToken(token);
  } catch (error) {
    console.error('Failed to setup CSRF protection:', error);
    throw error;
  }
}; 