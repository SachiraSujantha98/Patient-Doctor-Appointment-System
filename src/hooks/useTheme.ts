import { useMemo } from 'react';
import {
  createTheme,
  ThemeOptions,
  PaletteOptions,
  Theme,
  useMediaQuery,
} from '@mui/material';

const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
  },
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2',
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
};

const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#90caf9',
    light: '#e3f2fd',
    dark: '#42a5f5',
  },
  secondary: {
    main: '#ce93d8',
    light: '#f3e5f5',
    dark: '#ab47bc',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
};

const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: mode === 'light' ? lightPalette : darkPalette,
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export const useTheme = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const savedMode = localStorage.getItem('themeMode') as 'light' | 'dark' | null;
  const mode = savedMode || (prefersDarkMode ? 'dark' : 'light');

  const theme = useMemo<Theme>(() => createTheme(getThemeOptions(mode)), [mode]);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    localStorage.setItem('themeMode', newMode);
    window.location.reload(); // Force reload to apply new theme
  };

  return {
    theme,
    mode,
    toggleTheme,
  };
}; 