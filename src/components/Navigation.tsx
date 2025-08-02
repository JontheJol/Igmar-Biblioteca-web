import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import NavbarAdmin from './navbarAdmin';

const Navigation: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Only show navbar for desktop, mobile navbar is handled internally by NavbarAdmin
  if (isMobile) {
    return <NavbarAdmin />;
  }

  return <NavbarAdmin />;
};

export default Navigation;
