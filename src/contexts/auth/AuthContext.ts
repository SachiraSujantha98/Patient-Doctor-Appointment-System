import { createContext } from 'react';
import { User } from '../../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
  role: 'patient' | 'doctor';
  specialization?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (data: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType); 