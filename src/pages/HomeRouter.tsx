import React from 'react';
import { useUserRole } from '../hooks/useUserRole';
import Home from './Home';
import AdminHome from './AdminHome';

const HomeRouter: React.FC = () => {
  const { hasAdminAccess } = useUserRole();

  // Show AdminHome for users with admin access, regular Home for others
  return hasAdminAccess ? <AdminHome /> : <Home />;
};

export default HomeRouter;
