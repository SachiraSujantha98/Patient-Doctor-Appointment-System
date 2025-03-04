import { createContext } from 'react';
import { Appointment } from '../../types';

export interface AppointmentsContextType {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  fetchAppointments: () => Promise<void>;
  createAppointment: (data: CreateAppointmentData) => Promise<boolean>;
  updateAppointment: (id: string, data: UpdateAppointmentData) => Promise<boolean>;
  deleteAppointment: (id: string) => Promise<boolean>;
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

export const AppointmentsContext = createContext<AppointmentsContextType>({} as AppointmentsContextType); 