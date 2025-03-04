import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Dayjs } from 'dayjs';

interface DateSelectionDialogProps {
  open: boolean;
  selectedDate: Dayjs | null;
  onClose: () => void;
  onConfirm: () => void;
  onDateChange: (date: Dayjs | null) => void;
}

export const DateSelectionDialog: React.FC<DateSelectionDialogProps> = ({
  open,
  selectedDate,
  onClose,
  onConfirm,
  onDateChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Schedule Appointment</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <DateTimePicker
            label="Appointment Date & Time"
            value={selectedDate}
            onChange={onDateChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" disabled={!selectedDate}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 