import { useCallback, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import axios from 'axios';

export interface SearchResult {
  id: string;
  type: 'doctor' | 'appointment';
  title: string;
  description: string;
  url: string;
}

export interface SearchOptions {
  type?: 'doctor' | 'appointment';
  limit?: number;
  page?: number;
}

export const useSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();

  const search = useCallback(async (query: string, options: SearchOptions = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.request(() => 
        axios.get('/search', {
          params: {
            q: query,
            ...options,
          },
        })
      );

      setResults(response.data.results);
      return response.data.results;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, [api]);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearResults,
  };
}; 