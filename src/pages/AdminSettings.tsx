import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Alert,
  Chip,
} from '@mui/material';
import { Settings, AdminPanelSettings, Security, People, Assessment } from '@mui/icons-material';
import { useUserRole } from '../hooks/useUserRole';

const AdminSettings: React.FC = () => {
  const { currentUser, isSuperAdmin } = useUserRole();

  const adminFeatures = [
    {
      title: 'Gestión de Usuarios',
      description: 'Crear, editar y eliminar usuarios del sistema',
      icon: <People color="primary" />,
      available: true,
    },
    {
      title: 'Reportes del Sistema',
      description: 'Generar reportes de actividad y estadísticas',
      icon: <Assessment color="primary" />,
      available: isSuperAdmin,
    },
    {
      title: 'Configuración de Seguridad',
      description: 'Configurar políticas de seguridad y permisos',
      icon: <Security color="primary" />,
      available: isSuperAdmin,
    },
    {
      title: 'Configuración Global',
      description: 'Modificar configuraciones globales del sistema',
      icon: <Settings color="primary" />,
      available: isSuperAdmin,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          <AdminPanelSettings sx={{ mr: 2, verticalAlign: 'middle' }} />
          Panel de Configuración
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configuraciones disponibles según tu nivel de acceso
        </Typography>
      </Box>

      {/* User Role Info */}
      <Alert 
        severity={isSuperAdmin ? 'warning' : 'info'} 
        sx={{ mb: 4 }}
        icon={<AdminPanelSettings />}
      >
        <Typography variant="body1">
          <strong>Rol actual:</strong> {currentUser?.roleName}
          <br />
          <strong>Email:</strong> {currentUser?.email}
        </Typography>
      </Alert>

      {/* Features Grid */}
      <Grid container spacing={3}>
        {adminFeatures.map((feature, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card 
              sx={{ 
                height: '100%',
                opacity: feature.available ? 1 : 0.6,
                border: feature.available ? '1px solid rgba(25, 118, 210, 0.3)' : '1px solid rgba(0, 0, 0, 0.12)',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {feature.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {feature.title}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {feature.description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={feature.available ? 'Disponible' : 'No disponible'}
                    size="small"
                    color={feature.available ? 'success' : 'default'}
                    variant={feature.available ? 'filled' : 'outlined'}
                  />
                  
                  <Button
                    size="small"
                    variant={feature.available ? 'contained' : 'outlined'}
                    disabled={!feature.available}
                  >
                    {feature.available ? 'Configurar' : 'Bloqueado'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Access Information */}
      <Box sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ℹ️ Información sobre Permisos
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              • <strong>Administradores (Rol ID: 3):</strong> Pueden gestionar usuarios y acceder a funciones básicas del sistema.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              • <strong>Super Administradores (Rol ID: 4):</strong> Tienen acceso completo a todas las configuraciones del sistema, incluyendo reportes avanzados y configuraciones de seguridad.
            </Typography>
            {!isSuperAdmin && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Para acceder a todas las funciones, contacta a un Super Administrador para que actualice tu rol.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AdminSettings;
