import React from 'react';
import { Box, Button } from '@mui/material';
import { Appointment, User } from '../../types';

interface AppointmentActionsProps {
  appointment: Appointment;
  user: User | null;
  onBack: () => void;
  onAccept: () => void;
  onComplete: () => void;
  onCancel: () => void;
}

export const AppointmentActions: React.FC<AppointmentActionsProps> = ({
  appointment,
  user,
  onBack,
  onAccept,
  onComplete,
  onCancel,
}) => {
  return (
    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
      <Button onClick={onBack}>Back</Button>

      {user?.role === 'doctor' && appointment.status === 'pending' && (
        <Button variant="contained" color="primary" onClick={onAccept}>
          Accept & Schedule
        </Button>
      )}

      {user?.role === 'doctor' && appointment.status === 'accepted' && (
        <Button variant="contained" color="success" onClick={onComplete}>
          Complete & Add Prescription
        </Button>
      )}

      {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
        <Button variant="outlined" color="error" onClick={onCancel}>
          Cancel Appointment
        </Button>
      )}
    </Box>
  );
}; 