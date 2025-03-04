import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { config } from '../config/env.config';

interface GoogleButtonConfig {
  theme: 'outline' | 'filled';
  size: 'large' | 'medium' | 'small';
  type: 'standard' | 'icon';
}

interface GoogleInitializeConfig {
  client_id: string;
  callback: (response: { credential: string }) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleInitializeConfig) => void;
          renderButton: (element: HTMLElement, config: GoogleButtonConfig) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export const useOAuth = () => {
  const { googleLogin } = useAuth();
  const scriptLoadedRef = useRef(false);
  const scriptLoadingRef = useRef(false);

  const loadGoogleScript = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (scriptLoadedRef.current) {
        resolve();
        return;
      }

      if (scriptLoadingRef.current) {
        const checkLoaded = setInterval(() => {
          if (scriptLoadedRef.current) {
            clearInterval(checkLoaded);
            resolve();
          }
        }, 100);
        return;
      }

      scriptLoadingRef.current = true;
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        scriptLoadingRef.current = false;
        resolve();
      };
      script.onerror = () => {
        scriptLoadingRef.current = false;
        reject(new Error('Failed to load Google script'));
      };
      document.body.appendChild(script);
    });
  }, []);

  const initializeGoogle = useCallback(() => {
    if (!config.auth.googleClientId) {
      console.warn('Google Client ID not configured');
      return;
    }

    window.google?.accounts.id.initialize({
      client_id: config.auth.googleClientId,
      callback: async (response: { credential: string }) => {
        if (response.credential) {
          await googleLogin(response.credential);
        }
      },
    });
  }, [googleLogin]);

  const renderGoogleButton = useCallback(async (elementId: string) => {
    if (!config.auth.googleClientId) {
      console.warn('Google Client ID not configured');
      return;
    }

    try {
      await loadGoogleScript();
      initializeGoogle();

      const element = document.getElementById(elementId);
      if (element) {
        window.google?.accounts.id.renderButton(element, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
        });
      }
    } catch (error) {
      console.error('Failed to render Google button:', error);
    }
  }, [loadGoogleScript, initializeGoogle]);

  useEffect(() => {
    return () => {
      // Cleanup script if component unmounts during loading
      if (scriptLoadingRef.current) {
        const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (script) {
          document.body.removeChild(script);
        }
        scriptLoadingRef.current = false;
        scriptLoadedRef.current = false;
      }
    };
  }, []);

  return {
    renderGoogleButton,
  };
}; 