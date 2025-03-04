import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link as MuiLink,
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { LoadingOverlay } from '../../components/LoadingOverlay';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <Container maxWidth="sm">
      <LoadingOverlay open={loading} />
      <Paper sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          {t('auth.login.title')}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('email', { required: true })}
            label={t('auth.login.email')}
            type="email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email && t('auth.login.email')}
          />
          <TextField
            {...register('password', { required: true })}
            label={t('auth.login.password')}
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password && t('auth.login.password')}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
          >
            {t('auth.login.submit')}
          </Button>
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            {t('auth.login.noAccount')}{' '}
            <MuiLink component={Link} to="/register">
              {t('auth.login.register')}
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}; 