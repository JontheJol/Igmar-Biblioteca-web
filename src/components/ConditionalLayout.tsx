import React from 'react';
import { Container } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useUserRole } from '../hooks/useUserRole';
import { useAppStore } from '../store/appStore';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { hasAdminAccess } = useUserRole();
  const { isAuthenticated } = useAppStore();

  // Admin users on home page get full control (no container)
  if (hasAdminAccess && location.pathname === '/') {
    return <>{children}</>;
  }

  // Everyone else gets the container
  return (
    <Container 
      maxWidth="lg"
      disableGutters
      component="main" 
      sx={{ 
        paddingX: isAuthenticated ? { xs: 1, sm: 2 } : 0,
        paddingY: 0,
        margin: 0,
        width: '100%',
        maxWidth: '100% !important',
        flex: 1,
      }}
    >
      {children}
    </Container>
  );
};

export default ConditionalLayout;
