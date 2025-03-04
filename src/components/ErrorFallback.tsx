import React from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
}) => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md">
      <Paper
        sx={{
          p: 4,
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          {t('error.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          {t('error.message')}
        </Typography>
        {error && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2" color="text.secondary" component="pre">
              {error.message}
            </Typography>
          </Box>
        )}
        <Button variant="contained" onClick={resetError}>
          {t('error.retry')}
        </Button>
      </Paper>
    </Container>
  );
}; 