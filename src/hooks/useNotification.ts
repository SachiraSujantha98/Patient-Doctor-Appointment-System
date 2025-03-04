import { useState, useCallback } from 'react';
import { AlertProps } from '@mui/material';

interface NotificationState {
  open: boolean;
  message: string;
  severity: AlertProps['severity'];
}

const initialState: NotificationState = {
  open: false,
  message: '',
  severity: 'success',
};

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>(initialState);

  const showNotification = useCallback(
    (message: string, severity: AlertProps['severity'] = 'success') => {
      setNotification({
        open: true,
        message,
        severity,
      });
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  return {
    notification,
    showNotification,
    hideNotification,
  };
}; 