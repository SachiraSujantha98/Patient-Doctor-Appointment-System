import React, { useCallback, useEffect, useState } from 'react';
import { AppointmentsContext, AppointmentsContextType, CreateAppointmentData, UpdateAppointmentData } from './AppointmentsContext';
import { Appointment } from '../../types';
import { useApi } from '../../hooks/useApi';
import axios from 'axios';

export const AppointmentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.request(() => 
        axios.get('/appointments')
      );
      setAppointments(response.data.appointments);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, [api]);

  const createAppointment = useCallback(async (data: CreateAppointmentData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.request(() => 
        axios.post('/appointments', data)
      );
      setAppointments(prev => [...prev, response.data.appointment]);
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

  const updateAppointment = useCallback(async (id: string, data: UpdateAppointmentData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.request(() => 
        axios.put(`/appointments/${id}`, data)
      );
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id ? response.data.appointment : appointment
        )
      );
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

  const deleteAppointment = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.request(() => 
        axios.delete(`/appointments/${id}`)
      );
      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
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

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const value: AppointmentsContextType = {
    appointments,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };

  return (
    <AppointmentsContext.Provider value={value}>
      {children}
    </AppointmentsContext.Provider>
  );
};

export default AppointmentsProvider; 