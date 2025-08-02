import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { useAppStore, ROLES } from '../store/appStore';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: number; // ROLES.ADMIN (3) or ROLES.SUPER_ADMIN (4)
  requireSuperAdmin?: boolean; // Shorthand for super admin only
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  requiredRole,
  requireSuperAdmin = false,
}) => {
  const { isAuthenticated, currentUser, logout } = useAppStore();

  // If not authenticated, redirect to login
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Determine required role
  const roleRequired = requireSuperAdmin ? ROLES.SUPER_ADMIN : requiredRole;

  // If no specific role is required, just check authentication
  if (!roleRequired) {
    return <>{children}</>;
  }

  // Check if user has the required role
  const hasAccess = () => {
    if (roleRequired === ROLES.SUPER_ADMIN) {
      return currentUser.roleId === ROLES.SUPER_ADMIN;
    }
    // For admin access, both admin and super admin can access
    return currentUser.roleId === ROLES.ADMIN || currentUser.roleId === ROLES.SUPER_ADMIN;
  };

  // If user doesn't have required role, show access denied
  if (!hasAccess()) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          px: 3,
        }}
      >
        <Box
          sx={{
            fontSize: '4rem',
            mb: 2,
          }}
        >
          🚫
        </Box>
        <Typography variant="h4" gutterBottom color="error">
          Acceso Denegado
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
          No tienes permisos suficientes para acceder a esta sección. 
          Se requiere el rol de {roleRequired === ROLES.SUPER_ADMIN ? 'Super Administrador' : 'Administrador'}.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Tu rol actual: <strong>{currentUser.roleName}</strong>
        </Typography>
        <Button
          variant="outlined"
          onClick={() => window.history.back()}
          sx={{ mr: 2 }}
        >
          Volver
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={logout}
        >
          Cerrar Sesión
        </Button>
      </Box>
    );
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
