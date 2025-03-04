import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Dashboard,
  CalendarMonth,
  Person,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

interface SidebarMenuProps {
  onClose?: () => void;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  const menuItems = [
    {
      text: t('navigation.dashboard'),
      icon: <Dashboard />,
      path: '/dashboard',
      roles: ['patient', 'doctor'],
    },
    {
      text: t('navigation.appointments'),
      icon: <CalendarMonth />,
      path: '/appointments',
      roles: ['patient', 'doctor'],
    },
    {
      text: t('navigation.profile'),
      icon: <Person />,
      path: '/profile',
      roles: ['patient', 'doctor'],
    },
  ].filter((item) => item.roles.includes(user?.role || ''));

  return (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          {t('app.name')}
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => handleNavigation(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary={t('navigation.logout')} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
}; 