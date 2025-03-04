import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dayjs } from 'dayjs';
import { Appointment } from '../types';
import { useAppointments } from './useAppointments';
import { useSnackbar } from './useSnackbar';
import { logError, getErrorMessage } from '../services/error.service';

interface AppointmentActionsState {
  isDateDialogOpen: boolean;
  isPrescriptionDialogOpen: boolean;
  selectedDate: Dayjs | null;
  prescription: string;
  isSubmitting: boolean;
}

export const useAppointmentActions = (appointment: Appointment | undefined) => {
  const navigate = useNavigate();
  const { updateAppointment, addPrescription } = useAppointments();
  const { showSuccess, showError } = useSnackbar();

  const [state, setState] = useState<AppointmentActionsState>({
    isDateDialogOpen: false,
    isPrescriptionDialogOpen: false,
    selectedDate: null,
    prescription: '',
    isSubmitting: false,
  });

  const setSubmitting = (isSubmitting: boolean) => {
    setState(prev => ({ ...prev, isSubmitting }));
  };

  const handleAcceptAppointment = () => {
    setState(prev => ({ ...prev, isDateDialogOpen: true }));
  };

  const handleDateConfirm = async () => {
    if (!state.selectedDate || state.isSubmitting || !appointment) return;

    try {
      setSubmitting(true);
      const success = await updateAppointment({
        id: appointment.id,
        appointmentDate: state.selectedDate.toISOString(),
        status: 'accepted',
      });
      
      if (success) {
        showSuccess('Appointment scheduled successfully');
        setState(prev => ({ ...prev, isDateDialogOpen: false }));
      }
    } catch (error) {
      logError(error);
      showError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteAppointment = () => {
    setState(prev => ({ ...prev, isPrescriptionDialogOpen: true }));
  };

  const handlePrescriptionSubmit = async () => {
    if (!state.prescription.trim() || state.isSubmitting || !appointment) return;

    try {
      setSubmitting(true);
      const success = await addPrescription({
        id: appointment.id,
        prescription: state.prescription,
      });

      if (success) {
        const updateSuccess = await updateAppointment({
          id: appointment.id,
          status: 'completed',
          appointmentDate: appointment.appointmentDate || new Date().toISOString(),
        });

        if (updateSuccess) {
          showSuccess('Prescription added and appointment completed');
          setState(prev => ({ ...prev, isPrescriptionDialogOpen: false }));
        }
      }
    } catch (error) {
      logError(error);
      showError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!appointment || state.isSubmitting) return;

    try {
      setSubmitting(true);
      const success = await updateAppointment({
        id: appointment.id,
        status: 'cancelled',
        appointmentDate: appointment.appointmentDate || new Date().toISOString(),
      });

      if (success) {
        showSuccess('Appointment cancelled successfully');
        navigate(-1);
      }
    } catch (error) {
      logError(error);
      showError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    state,
    setState,
    actions: {
      handleAcceptAppointment,
      handleDateConfirm,
      handleCompleteAppointment,
      handlePrescriptionSubmit,
      handleCancelAppointment,
    },
  };
}; 