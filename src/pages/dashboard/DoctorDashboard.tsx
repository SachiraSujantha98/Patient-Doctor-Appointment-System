import React, { useEffect } from 'react';
import { Grid, Paper, Typography, Button, Box, Chip } from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppointments } from '../../hooks/useAppointments';
import { useDate } from '../../hooks/useDate';
import { usePagination } from '../../hooks/usePagination';
import { DataTable } from '../../components/DataTable';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { Appointment } from '../../types';

type StatusColor = 'warning' | 'info' | 'success' | 'error' | 'default';

export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { appointments, total, loading, error, fetchAppointments } = useAppointments();
  const { formatAppointmentDate } = useDate();
  const {
    pagination,
    handlePageChange,
    handleRowsPerPageChange,
    handleSort,
  } = usePagination();

  useEffect(() => {
    fetchAppointments(pagination.page + 1, pagination.rowsPerPage);
  }, [fetchAppointments, pagination.page, pagination.rowsPerPage]);

  const getStatusColor = (status: string): StatusColor => {
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

  const columns = [
    {
      id: 'patient',
      label: 'Patient',
      render: (row: Appointment) =>
        `${row.patient?.firstName || ''} ${row.patient?.lastName || 'Unknown'}`,
    },
    {
      id: 'appointmentDate',
      label: 'Date & Time',
      render: (row: Appointment) =>
        row.appointmentDate ? formatAppointmentDate(row.appointmentDate) : 'Not Scheduled',
    },
    {
      id: 'status',
      label: 'Status',
      render: (row: Appointment) => (
        <Chip
          label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          color={getStatusColor(row.status)}
          size="small"
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (row: Appointment) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(`/appointments/${row.id}`)}
        >
          Manage
        </Button>
      ),
    },
  ];

  const pendingAppointments = appointments.filter(
    (apt) => apt.status === 'pending' || apt.status === 'accepted'
  );
  const completedAppointments = appointments.filter(
    (apt) => apt.status === 'completed' || apt.status === 'cancelled'
  );

  return (
    <>
      <LoadingOverlay open={loading} />
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarIcon sx={{ mr: 1 }} color="primary" />
            <Typography variant="h6">Pending & Upcoming Appointments</Typography>
          </Box>
          <DataTable<Appointment>
            columns={columns}
            rows={pendingAppointments}
            totalCount={total}
            page={pagination.page}
            rowsPerPage={pagination.rowsPerPage}
            loading={loading}
            error={error || undefined}
            orderBy={pagination.orderBy}
            orderDirection={pagination.orderDirection}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onSort={handleSort}
          />
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <HistoryIcon sx={{ mr: 1 }} color="primary" />
            <Typography variant="h6">Past Appointments</Typography>
          </Box>
          <DataTable<Appointment>
            columns={columns}
            rows={completedAppointments}
            totalCount={total}
            page={pagination.page}
            rowsPerPage={pagination.rowsPerPage}
            loading={loading}
            error={error || undefined}
            orderBy={pagination.orderBy}
            orderDirection={pagination.orderDirection}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onSort={handleSort}
          />
        </Paper>
      </Grid>
    </>
  );
}; 