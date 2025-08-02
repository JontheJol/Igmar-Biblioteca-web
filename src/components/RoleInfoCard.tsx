import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { AdminPanelSettings, Check, Close } from '@mui/icons-material';
import { ROLES, ROLE_NAMES } from '../store/appStore';

interface RoleInfoCardProps {
  currentUserRole?: number;
}

const RoleInfoCard: React.FC<RoleInfoCardProps> = ({ currentUserRole }) => {
  const permissions = [
    { name: 'Acceso al sistema', admin: true, superAdmin: true },
    { name: 'Ver usuarios', admin: true, superAdmin: true },
    { name: 'Agregar usuarios', admin: true, superAdmin: true },
    { name: 'Editar usuarios', admin: true, superAdmin: true },
    { name: 'Eliminar usuarios', admin: true, superAdmin: true },
    { name: 'Configuración del sistema', admin: false, superAdmin: true },
    { name: 'Reportes avanzados', admin: false, superAdmin: true },
    { name: 'Configuración de seguridad', admin: false, superAdmin: true },
    { name: 'Gestión de roles', admin: false, superAdmin: true },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <AdminPanelSettings sx={{ mr: 1, verticalAlign: 'middle' }} />
          Información de Roles del Sistema
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Chip
            label={`${ROLE_NAMES[3]} (ID: 3)`}
            color={currentUserRole === ROLES.ADMIN ? 'primary' : 'default'}
            variant={currentUserRole === ROLES.ADMIN ? 'filled' : 'outlined'}
          />
          <Chip
            label={`${ROLE_NAMES[4]} (ID: 4)`}
            color={currentUserRole === ROLES.SUPER_ADMIN ? 'warning' : 'default'}
            variant={currentUserRole === ROLES.SUPER_ADMIN ? 'filled' : 'outlined'}
          />
        </Box>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          Permisos por Rol:
        </Typography>
        
        <List dense>
          {permissions.map((permission, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemText 
                primary={permission.name}
                sx={{ minWidth: '200px' }}
              />
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '60px' }}>
                  <ListItemIcon sx={{ minWidth: '24px' }}>
                    {permission.admin ? (
                      <Check color="success" fontSize="small" />
                    ) : (
                      <Close color="error" fontSize="small" />
                    )}
                  </ListItemIcon>
                  <Typography variant="caption" color="text.secondary">
                    Admin
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '60px' }}>
                  <ListItemIcon sx={{ minWidth: '24px' }}>
                    {permission.superAdmin ? (
                      <Check color="success" fontSize="small" />
                    ) : (
                      <Close color="error" fontSize="small" />
                    )}
                  </ListItemIcon>
                  <Typography variant="caption" color="text.secondary">
                    S.Admin
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default RoleInfoCard;
