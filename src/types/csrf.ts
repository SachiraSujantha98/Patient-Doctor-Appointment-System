export interface CSRFTokenResponse {
  token: string;
}

export interface CSRFError {
  message: string;
  code: string;
}

export interface CSRFHeaders {
  'X-CSRF-Token': string;
}

export interface CSRFConfig {
  tokenRefreshInterval: number;
  cookieName: string;
  headerName: string;
} 