import { SxProps } from '@mui/material';

interface ProfileStyles {
  avatar: SxProps;
  profileCard: SxProps;
  formCard: SxProps;
  divider: SxProps;
  submitButton: SxProps;
}

export const profileStyles: ProfileStyles = {
  avatar: {
    width: 100,
    height: 100,
    margin: '0 auto',
    mb: 2,
    bgcolor: 'primary.main',
  },
  profileCard: {
    p: 3,
    textAlign: 'center',
  },
  formCard: {
    p: 3,
  },
  divider: {
    my: 3,
  },
  submitButton: {
    mt: 3,
    display: 'flex',
    justifyContent: 'flex-end',
  },
}; 