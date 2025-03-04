import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Button } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <ErrorIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
          <Typography component="h1" variant="h4" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            You don't have permission to access this page. Please contact your administrator
            if you believe this is a mistake.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard')}
              sx={{ mr: 2 }}
            >
              Go to Dashboard
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}; 