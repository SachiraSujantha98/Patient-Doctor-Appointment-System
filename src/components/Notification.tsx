import React from 'react';
import { Snackbar, Alert, AlertProps } from '@mui/material';

interface NotificationProps {
  open: boolean;
  message: string;
  severity?: AlertProps['severity'];
  autoHideDuration?: number;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({
  open,
  message,
  severity = 'success',
  autoHideDuration = 6000,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}; 