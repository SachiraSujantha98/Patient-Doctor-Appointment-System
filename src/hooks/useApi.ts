import { useState, useCallback, useRef } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface UseApiOptions {
  cacheTime?: number;
  invalidateCache?: boolean;
  cacheKey?: string;
}

const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export function useApi() {
  const [cacheState, setCacheState] = useState<Record<string, CacheItem<unknown>>>({});
  const pendingRequests = useRef<Record<string, Promise<unknown>>>({});

  const updateCache = useCallback((key: string, data: unknown, expiresIn: number = DEFAULT_CACHE_TIME) => {
    const now = Date.now();
    setCacheState(prev => ({
      ...prev,
      [key]: {
        data,
        timestamp: now,
        expiresAt: now + expiresIn
      }
    }));
  }, []);

  const clearCache = useCallback((key?: string) => {
    if (key) {
      setCacheState(prev => {
        const newCache = { ...prev };
        delete newCache[key];
        return newCache;
      });
    } else {
      setCacheState({});
    }
  }, []);

  const request = useCallback(async <T>(
    apiCall: () => Promise<T>,
    options: UseApiOptions = {}
  ): Promise<T> => {
    const {
      cacheTime = DEFAULT_CACHE_TIME,
      invalidateCache = false,
      cacheKey
    } = options;

    if (cacheKey) {
      // Check cache
      const cachedItem = cacheState[cacheKey];
      if (!invalidateCache && cachedItem && cachedItem.expiresAt > Date.now()) {
        return cachedItem.data as T;
      }

      // Check pending requests
      const existingRequest = pendingRequests.current[cacheKey];
      if (!invalidateCache && existingRequest) {
        return existingRequest as Promise<T>;
      }

      // Make new request
      const promise = apiCall().then(data => {
        updateCache(cacheKey, data, cacheTime);
        delete pendingRequests.current[cacheKey];
        return data;
      }).catch(error => {
        delete pendingRequests.current[cacheKey];
        throw error;
      });

      // Store pending request immediately
      pendingRequests.current[cacheKey] = promise;
      return promise;
    }

    return apiCall();
  }, [cacheState, updateCache]);

  return { request, clearCache };
}