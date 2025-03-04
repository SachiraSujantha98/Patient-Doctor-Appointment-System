import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

interface PrescriptionDialogProps {
  open: boolean;
  prescription: string;
  onClose: () => void;
  onConfirm: () => void;
  onPrescriptionChange: (value: string) => void;
}

export const PrescriptionDialog: React.FC<PrescriptionDialogProps> = ({
  open,
  prescription,
  onClose,
  onConfirm,
  onPrescriptionChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Prescription</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Prescription"
          fullWidth
          multiline
          rows={4}
          value={prescription}
          onChange={(e) => onPrescriptionChange(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={!prescription.trim()}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 