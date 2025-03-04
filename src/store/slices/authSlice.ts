import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { AuthResponse, LoginCredentials, RegisterCredentials, User, ApiError } from '../../types';
import { authService } from '../../services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  redirectTo: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: authService.getToken(),
  loading: false,
  error: null,
  redirectTo: null,
  isAuthenticated: false,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      return rejectWithValue(axiosError.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.register(credentials);
      return response;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      return rejectWithValue(axiosError.response?.data?.message || 'Registration failed');
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await authService.googleLogin(token);
      return response;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      return rejectWithValue(axiosError.response?.data?.message || 'Google login failed');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    ...initialState,
    // TEMPORARY: Development-only mock authentication
    user: {
      id: 'mock-user-id',
      firstName: 'Dev',
      lastName: 'User',
      email: 'dev@example.com',
      role: 'doctor',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as User,
    token: 'mock-token',
    isAuthenticated: true
  } as AuthState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.token = null;
      state.error = null;
      state.redirectTo = '/login';
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearRedirect: (state) => {
      state.redirectTo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.redirectTo = '/dashboard';
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.redirectTo = '/dashboard';
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.redirectTo = '/dashboard';
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, clearRedirect } = authSlice.actions;
export default authSlice.reducer; 