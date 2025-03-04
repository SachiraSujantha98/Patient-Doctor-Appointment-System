import React from 'react';
import { Grid, Typography, Chip, Box } from '@mui/material';
import { Appointment } from '../../types';
import { useDate } from '../../hooks/useDate';

interface AppointmentDetailsProps {
  appointment: Appointment;
}

const getStatusColor = (status: string): 'warning' | 'info' | 'success' | 'error' | 'default' => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'accepted':
      return 'info';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

export const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({ appointment }) => {
  const { formatAppointmentDate } = useDate();

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Appointment Details</Typography>
        <Chip
          label={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          color={getStatusColor(appointment.status)}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Patient
          </Typography>
          <Typography variant="body1">
            {appointment.patient?.firstName} {appointment.patient?.lastName}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Doctor
          </Typography>
          <Typography variant="body1">
            Dr. {appointment.doctor?.lastName} - {appointment.doctor?.specialization}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Category
          </Typography>
          <Typography variant="body1">{appointment.category?.name}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Date & Time
          </Typography>
          <Typography variant="body1">
            {appointment.appointmentDate
              ? formatAppointmentDate(appointment.appointmentDate)
              : 'Not scheduled'}
          </Typography>
        </Grid>

        {appointment.prescription && (
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Prescription
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {appointment.prescription}
            </Typography>
          </Grid>
        )}
      </Grid>
    </>
  );
}; 