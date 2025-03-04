export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'patient' | 'doctor' | 'admin';
  createdAt: string;
  updatedAt: string;
  specialization?: string;
}

export interface Doctor extends User {
  specialization: string;
  availability: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  categoryId: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  appointmentDate?: string;
  prescription?: string;
  createdAt: string;
  updatedAt: string;
  patient?: User;
  doctor?: User;
  category?: Category;
}

export interface AppointmentUpdate {
  id: string;
  status?: 'pending' | 'accepted' | 'completed' | 'cancelled';
  appointmentDate?: string;
}

export interface PrescriptionUpdate {
  id: string;
  prescription: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

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

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

export interface CreateAppointmentData {
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  notes?: string;
}

export interface UpdateAppointmentData extends Partial<CreateAppointmentData> {
  status?: 'scheduled' | 'completed' | 'cancelled';
}

export enum UserRole {
  DOCTOR = 'doctor',
  PATIENT = 'patient',
  ADMIN = 'admin',
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  specialization?: string;
  [key: string]: string | undefined;
} 