import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button } from '@mui/material';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { AppointmentDetails } from '../../components/data-display/AppointmentDetails';
import { AppointmentActions } from '../../components/data-display/AppointmentActions';
import { DateSelectionDialog } from '../../components/forms/DateSelectionDialog';
import { PrescriptionDialog } from '../../components/forms/PrescriptionDialog';
import { useAppointments } from '../../hooks/useAppointments';
import { useAuth } from '../../hooks/useAuth';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import { useAppointmentActions } from '../../hooks/useAppointmentActions';
import { Appointment } from '../../types';

export const AppointmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showConfirmDialog } = useConfirmDialog();
  const { appointments, loading } = useAppointments();

  const appointment = appointments.find((apt) => apt.id === id) as Appointment | undefined;
  const { state, setState, actions } = useAppointmentActions(appointment);

  if (!id) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 3, mt: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            Invalid appointment ID
          </Typography>
          <Button sx={{ mt: 2 }} onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!appointment && !loading) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 3, mt: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            Appointment not found
          </Typography>
          <Button sx={{ mt: 2 }} onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!appointment) {
    return <LoadingOverlay open={true} />;
  }

  const handleCancelWithConfirm = () => {
    showConfirmDialog(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      actions.handleCancelAppointment
    );
  };

  return (
    <Container maxWidth="md">
      <LoadingOverlay open={loading || state.isSubmitting} />
      <Paper sx={{ p: 3, mt: 3 }}>
        <AppointmentDetails appointment={appointment} />
        
        <AppointmentActions
          appointment={appointment}
          user={user}
          onBack={() => navigate(-1)}
          onAccept={actions.handleAcceptAppointment}
          onComplete={actions.handleCompleteAppointment}
          onCancel={handleCancelWithConfirm}
        />
      </Paper>

      <DateSelectionDialog
        open={state.isDateDialogOpen}
        selectedDate={state.selectedDate}
        onClose={() => setState(prev => ({ ...prev, isDateDialogOpen: false }))}
        onConfirm={actions.handleDateConfirm}
        onDateChange={(date) => setState(prev => ({ ...prev, selectedDate: date }))}
      />

      <PrescriptionDialog
        open={state.isPrescriptionDialogOpen}
        prescription={state.prescription}
        onClose={() => setState(prev => ({ ...prev, isPrescriptionDialogOpen: false }))}
        onConfirm={actions.handlePrescriptionSubmit}
        onPrescriptionChange={(value) => setState(prev => ({ ...prev, prescription: value }))}
      />
    </Container>
  );
}; 