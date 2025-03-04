import React, { useState, Suspense, lazy } from 'react';
import { Outlet } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { PageLoader } from '../components/PageLoader';
import { mainLayoutStyles } from './styles/MainLayout.styles';

// Lazy load the sidebar menu
const SidebarMenu = lazy(() => import('../components/SidebarMenu').then(module => ({
  default: module.SidebarMenu
})));

const SuspendedSidebarMenu: React.FC<{ onClose?: () => void }> = ({ onClose }) => (
  <Suspense fallback={<PageLoader />}>
    <SidebarMenu onClose={onClose} />
  </Suspense>
);

export const MainLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={mainLayoutStyles.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={mainLayoutStyles.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {t(user?.role === 'doctor' ? 'dashboard.doctorTitle' : 'dashboard.patientTitle')}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={mainLayoutStyles.nav} aria-label="mailbox folders">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={mainLayoutStyles.temporaryDrawer}
        >
          <SuspendedSidebarMenu onClose={handleDrawerToggle} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={mainLayoutStyles.permanentDrawer}
          open
        >
          <SuspendedSidebarMenu />
        </Drawer>
      </Box>
      <Box component="main" sx={mainLayoutStyles.main}>
        <Outlet />
      </Box>
    </Box>
  );
}; 