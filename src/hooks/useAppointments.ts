import { useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import {
  fetchAppointments,
  createAppointment,
  updateAppointment,
  addPrescription,
  clearError,
} from '../store/slices/appointmentSlice';
import type { RootState } from '../store';

interface CreateAppointmentData {
  doctorId: string;
  categoryId: string;
}

interface UpdateAppointmentData {
  id: string;
  appointmentDate: string;
  status: 'accepted' | 'completed' | 'cancelled';
}

interface AddPrescriptionData {
  id: string;
  prescription: string;
}

export const useAppointments = () => {
  const dispatch = useAppDispatch();
  const { appointments, total, currentPage, totalPages, loading, error } = useAppSelector(
    (state: RootState) => state.appointments
  );

  const handleFetchAppointments = useCallback(
    async (page = 1, limit = 10) => {
      try {
        await dispatch(fetchAppointments({ page, limit })).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [dispatch]
  );

  const handleCreateAppointment = useCallback(
    async (data: CreateAppointmentData) => {
      try {
        await dispatch(createAppointment(data)).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [dispatch]
  );

  const handleUpdateAppointment = useCallback(
    async (data: UpdateAppointmentData) => {
      try {
        await dispatch(updateAppointment(data)).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [dispatch]
  );

  const handleAddPrescription = useCallback(
    async (data: AddPrescriptionData) => {
      try {
        await dispatch(addPrescription(data)).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [dispatch]
  );

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    appointments,
    total,
    currentPage,
    totalPages,
    loading,
    error,
    fetchAppointments: handleFetchAppointments,
    createAppointment: handleCreateAppointment,
    updateAppointment: handleUpdateAppointment,
    addPrescription: handleAddPrescription,
    clearError: handleClearError,
  };
}; 