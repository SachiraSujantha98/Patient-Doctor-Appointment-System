import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useFormik } from 'formik';
import { useAuth } from '../../hooks/useAuth';
import { withAnalytics } from '../../hocs/withAnalytics';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import type { RegisterCredentials } from '../../types';

const RegisterPageComponent: React.FC = () => {
  const { t } = useTranslation();
  const { register, loading, error } = useAuth();

  const formik = useFormik<RegisterCredentials>({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'patient',
      specialization: '',
    },
    onSubmit: async (values) => {
      await register(values);
    },
  });

  return (
    <Container maxWidth="sm">
      <LoadingOverlay open={loading} />
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            {t('auth.register.title')}
          </Typography>
          {error && (
            <Typography color="error" align="center" gutterBottom>
              {error}
            </Typography>
          )}
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label={t('auth.register.firstName')}
              name="firstName"
              autoComplete="given-name"
              autoFocus
              value={formik.values.firstName}
              onChange={formik.handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastName"
              label={t('auth.register.lastName')}
              name="lastName"
              autoComplete="family-name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('auth.register.email')}
              name="email"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('auth.register.password')}
              type="password"
              id="password"
              autoComplete="new-password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">{t('auth.register.role')}</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                label={t('auth.register.role')}
              >
                <MenuItem value="patient">Patient</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
              </Select>
            </FormControl>

            {formik.values.role === 'doctor' && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="specialization"
                label={t('auth.register.specialization')}
                name="specialization"
                value={formik.values.specialization}
                onChange={formik.handleChange}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {t('auth.register.submit')}
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                {t('auth.register.hasAccount')}{' '}
                <Link to="/login">{t('auth.register.login')}</Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export const RegisterPage = withAnalytics(RegisterPageComponent, 'Register'); 