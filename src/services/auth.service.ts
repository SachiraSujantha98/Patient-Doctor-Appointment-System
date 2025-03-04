import { AxiosResponse } from 'axios';
import api from './api';
import { config } from '../config/env.config';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../types';
import { storage } from '../utils/storage';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';

interface TokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

class AuthService {
  private refreshPromise: Promise<TokenResponse> | null = null;

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse & TokenResponse> = await api.post(
      config.apiEndpoints.auth.login,
      credentials
    );
    this.handleAuthResponse(response.data);
    return response.data;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse & TokenResponse> = await api.post(
      config.apiEndpoints.auth.register,
      credentials
    );
    this.handleAuthResponse(response.data);
    return response.data;
  }

  async googleLogin(token: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse & TokenResponse> = await api.post(
      config.apiEndpoints.auth.googleLogin,
      { token }
    );
    this.handleAuthResponse(response.data);
    return response.data;
  }

  private handleAuthResponse(authResponse: AuthResponse & TokenResponse): void {
    const expiresAt = Date.now() + (authResponse.expiresIn * 1000);
    storage.set(TOKEN_KEY, authResponse.token);
    storage.set(REFRESH_TOKEN_KEY, authResponse.refreshToken);
    storage.set(TOKEN_EXPIRY_KEY, expiresAt);
  }

  async refreshToken(): Promise<TokenResponse> {
    // If there's already a refresh request in progress, return its promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    try {
      this.refreshPromise = (async () => {
        const refreshToken = storage.get<string | null>(REFRESH_TOKEN_KEY, null);
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response: AxiosResponse<TokenResponse> = await api.post(
          config.apiEndpoints.auth.refresh,
          { refreshToken }
        );

        const { token, refreshToken: newRefreshToken, expiresIn } = response.data;
        const expiresAt = Date.now() + (expiresIn * 1000);

        storage.set(TOKEN_KEY, token);
        storage.set(REFRESH_TOKEN_KEY, newRefreshToken);
        storage.set(TOKEN_EXPIRY_KEY, expiresAt);

        return response.data;
      })();

      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  async getValidToken(): Promise<string | null> {
    const token = storage.get<string | null>(TOKEN_KEY, null);
    const expiry = storage.get<number | null>(TOKEN_EXPIRY_KEY, null);

    if (!token || !expiry) {
      return null;
    }

    // If token is expired or about to expire (within 1 minute), refresh it
    if (Date.now() > expiry - 60000) {
      try {
        const response = await this.refreshToken();
        return response.token;
      } catch (error) {
        this.logout();
        return null;
      }
    }

    return token;
  }

  logout(): void {
    storage.remove(TOKEN_KEY);
    storage.remove(REFRESH_TOKEN_KEY);
    storage.remove(TOKEN_EXPIRY_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return storage.get<string | null>(TOKEN_KEY, null);
  }
}

export const authService = new AuthService(); 