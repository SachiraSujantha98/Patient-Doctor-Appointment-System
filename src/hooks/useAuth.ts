import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import {
  login,
  register,
  logout,
  googleLogin,
  clearError,
  clearRedirect,
} from '../store/slices/authSlice';
import type { LoginCredentials, RegisterCredentials } from '../types';
import type { RootState } from '../store';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token, loading, error, redirectTo } = useAppSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (redirectTo) {
      navigate(redirectTo);
      dispatch(clearRedirect());
    }
  }, [redirectTo, navigate, dispatch]);

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        await dispatch(login(credentials)).unwrap();
        return true;
      } catch (_error) {
        return false;
      }
    },
    [dispatch]
  );

  const handleRegister = useCallback(
    async (credentials: RegisterCredentials) => {
      try {
        await dispatch(register(credentials)).unwrap();
        return true;
      } catch (_error) {
        return false;
      }
    },
    [dispatch]
  );

  const handleGoogleLogin = useCallback(
    async (token: string) => {
      try {
        await dispatch(googleLogin(token)).unwrap();
        return true;
      } catch (_error) {
        return false;
      }
    },
    [dispatch]
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    token,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    googleLogin: handleGoogleLogin,
    logout: handleLogout,
    clearError: handleClearError,
    isAuthenticated: !!token,
  };
}; 