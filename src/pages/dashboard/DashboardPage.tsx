import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { PatientDashboard } from './PatientDashboard';
import { DoctorDashboard } from './DoctorDashboard';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.firstName} {user?.lastName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {user?.role === 'doctor'
            ? 'Manage your appointments and patient records'
            : 'Book appointments and view your medical history'}
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {user?.role === 'doctor' ? <DoctorDashboard /> : <PatientDashboard />}
      </Grid>
    </Box>
  );
}; 