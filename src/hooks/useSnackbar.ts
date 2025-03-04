import { useCallback } from 'react';
import { useSnackbar as useNotistack } from 'notistack';

export const useSnackbar = () => {
  const { enqueueSnackbar } = useNotistack();

  const showSuccess = useCallback((message: string) => {
    enqueueSnackbar(message, { variant: 'success' });
  }, [enqueueSnackbar]);

  const showError = useCallback((message: string) => {
    enqueueSnackbar(message, { variant: 'error' });
  }, [enqueueSnackbar]);

  const showWarning = useCallback((message: string) => {
    enqueueSnackbar(message, { variant: 'warning' });
  }, [enqueueSnackbar]);

  const showInfo = useCallback((message: string) => {
    enqueueSnackbar(message, { variant: 'info' });
  }, [enqueueSnackbar]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}; 