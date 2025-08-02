import React from 'react';
import { useLocation } from 'react-router-dom';
import { useUserRole } from '../hooks/useUserRole';
import Navigation from './Navigation';

const ConditionalNavigation: React.FC = () => {
  const location = useLocation();
  const { hasAdminAccess, isAuthenticated } = useUserRole();

  // Don't show navigation for admin users on the home page (they have their own sidebar)
  // or for non-authenticated users
  if (!isAuthenticated) {
    return null;
  }

  // Admin users get their sidebar on home page, regular nav elsewhere  
  if (hasAdminAccess && location.pathname === '/') {
    return null; // AdminHome handles its own navigation
  }

  return <Navigation />;
};

export default ConditionalNavigation;
