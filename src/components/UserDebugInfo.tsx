import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { useAppStore } from '../store/appStore';
import { ROLE_NAMES } from '../store/appStore';

const UserDebugInfo: React.FC = () => {
  const { currentUser } = useAppStore();

  if (!currentUser) {
    return (
      <Box sx={{ position: 'fixed', bottom: 10, right: 10, p: 2, bgcolor: 'rgba(255,255,255,0.9)', borderRadius: 2 }}>
        <Typography variant="caption" color="error">
          Usuario no autenticado
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      position: 'fixed', 
      bottom: 10, 
      right: 10, 
      p: 2, 
      bgcolor: 'rgba(255,255,255,0.95)', 
      borderRadius: 2,
      border: '2px solid #e0e0e0',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      zIndex: 9999,
      minWidth: '250px'
    }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#d32f2f' }}>
        🐛 DEBUG INFO
      </Typography>
      <Typography variant="caption" display="block">
        <strong>Usuario:</strong> {currentUser.name}
      </Typography>
      <Typography variant="caption" display="block">
        <strong>Email:</strong> {currentUser.email}
      </Typography>
      <Typography variant="caption" display="block">
        <strong>Rol ID:</strong> {currentUser.roleId}
      </Typography>
      <Typography variant="caption" display="block">
        <strong>Rol:</strong> {currentUser.roleName}
      </Typography>
      <Box sx={{ mt: 1 }}>
        <Chip 
          label={currentUser.roleId >= 3 ? 'Permisos Secciones: ✓' : 'Permisos Secciones: ✗'} 
          color={currentUser.roleId >= 3 ? 'success' : 'error'}
          size="small"
        />
      </Box>
    </Box>
  );
};

export default UserDebugInfo;
