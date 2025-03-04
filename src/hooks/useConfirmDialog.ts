import { useState, useCallback } from 'react';

interface ConfirmDialogState {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  severity?: 'error' | 'warning' | 'info';
  onConfirm?: () => void | Promise<void>;
}

const initialState: ConfirmDialogState = {
  open: false,
  title: '',
  message: '',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  severity: 'warning',
};

export const useConfirmDialog = () => {
  const [dialog, setDialog] = useState<ConfirmDialogState>(initialState);

  const showConfirmDialog = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void | Promise<void>,
      options?: Partial<Omit<ConfirmDialogState, 'open' | 'title' | 'message' | 'onConfirm'>>
    ) => {
      setDialog({
        ...initialState,
        ...options,
        open: true,
        title,
        message,
        onConfirm,
      });
    },
    []
  );

  const hideConfirmDialog = useCallback(() => {
    setDialog((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  const handleConfirm = useCallback(async () => {
    try {
      if (dialog.onConfirm) {
        await dialog.onConfirm();
      }
    } finally {
      hideConfirmDialog();
    }
  }, [dialog, hideConfirmDialog]);

  return {
    dialog,
    showConfirmDialog,
    hideConfirmDialog,
    handleConfirm,
  };
}; 