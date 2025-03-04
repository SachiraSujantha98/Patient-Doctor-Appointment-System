import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import type { LoginCredentials } from '../../types';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {t('auth.login.title')}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={t('auth.login.email')}
            autoComplete="email"
            autoFocus
            {...register('email', {
              required: t('validation.required'),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t('validation.email'),
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label={t('auth.login.password')}
            type="password"
            id="password"
            autoComplete="current-password"
            {...register('password', {
              required: t('validation.required'),
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {t('auth.login.submit')}
          </Button>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color="primary" align="center">
              {t('auth.login.noAccount')} {t('auth.login.register')}
            </Typography>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}; 