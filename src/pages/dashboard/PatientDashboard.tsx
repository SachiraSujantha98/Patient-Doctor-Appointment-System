import React, { useEffect } from 'react';
import { Grid, Paper, Typography, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Add as AddIcon,
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

export const PatientDashboard: React.FC = () => {
  const { t } = useTranslation();
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

  const columns = [
    {
      id: 'doctor',
      label: t('common.doctor'),
      render: (row: Appointment) => `Dr. ${row.doctor?.lastName || 'Unknown'}`,
    },
    {
      id: 'appointmentDate',
      label: t('common.date'),
      render: (row: Appointment) =>
        row.appointmentDate ? formatAppointmentDate(row.appointmentDate) : t('dashboard.appointments.status.pending'),
    },
    { 
      id: 'status',
      label: t('common.status'),
      render: (row: Appointment) => t(`dashboard.appointments.status.${row.status}`),
    },
    {
      id: 'actions',
      label: t('common.actions'),
      render: (row: Appointment) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(`/appointments/${row.id}`)}
        >
          {t('dashboard.appointments.actions.view')}
        </Button>
      ),
    },
  ];

  const upcomingAppointments = appointments.filter((apt) => apt.status !== 'completed');
  const pastAppointments = appointments.filter((apt) => apt.status === 'completed');

  return (
    <>
      <LoadingOverlay open={loading} />
      <Grid item xs={12}>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/appointments/new')}
          >
            {t('dashboard.appointments.book')}
          </Button>
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarIcon sx={{ mr: 1 }} color="primary" />
            <Typography variant="h6">{t('dashboard.appointments.upcoming')}</Typography>
          </Box>
          <DataTable<Appointment>
            columns={columns}
            rows={upcomingAppointments}
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
            <Typography variant="h6">{t('dashboard.appointments.past')}</Typography>
          </Box>
          <DataTable<Appointment>
            columns={columns}
            rows={pastAppointments}
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