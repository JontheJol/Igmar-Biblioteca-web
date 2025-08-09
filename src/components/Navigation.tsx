import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import NavbarAdmin from './navbarAdmin';
import NavbarSuperAdmin from './NavbarSuperAdmin';
import { useUserRole } from '../hooks/useUserRole';

const Navigation: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isSuperAdmin } = useUserRole();

  // Choose the appropriate navbar based on user role
  const NavbarComponent = isSuperAdmin ? NavbarSuperAdmin : NavbarAdmin;

  // Only show navbar for desktop, mobile navbar is handled internally by NavbarComponent
  if (isMobile) {
    return <NavbarComponent />;
  }

  return <NavbarComponent />;
};

export default Navigation;
