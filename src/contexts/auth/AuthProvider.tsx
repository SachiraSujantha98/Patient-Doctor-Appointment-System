import React, { useCallback, useEffect, useState } from 'react';
import { AuthContext, AuthContextType, LoginCredentials, RegisterCredentials } from './AuthContext';
import { User } from '../../types';
import { useApi } from '../../hooks/useApi';
import axios from 'axios';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.request(() => 
        axios.post('/auth/login', credentials)
      );
      setUser(response.data.user);
      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.request(() => 
        axios.post('/auth/register', credentials)
      );
      setUser(response.data.user);
      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const logout = useCallback(() => {
    setUser(null);
    // Add any additional cleanup here
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.request(() => 
          axios.get('/auth/me')
        );
        setUser(response.data.user);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [api]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 