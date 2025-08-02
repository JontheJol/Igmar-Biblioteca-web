import React from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useUserRole } from '../hooks/useUserRole';
import ConditionalNavigation from './ConditionalNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { hasAdminAccess } = useUserRole();

  // Admin users on home page get full control layout (AdminHome handles its own navbar)
  if (hasAdminAccess && location.pathname === '/') {
    return <>{children}</>;
  }

  // Everyone else gets the standard layout with ConditionalNavigation
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <ConditionalNavigation />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
