import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Alert,
  Chip,
} from '@mui/material';
import { People, PersonAdd, Dashboard, Settings, AdminPanelSettings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useUserRole } from '../hooks/useUserRole';
import RoleInfoCard from '../components/RoleInfoCard';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { users } = useAppStore();
  const { currentUser, isSuperAdmin, hasAdminAccess } = useUserRole();

  const stats = [
    {
      title: 'Total de Usuarios',
      value: users.length,
      icon: <People fontSize="large" />,
      color: '#1976d2',
    },
    {
      title: 'Edad Promedio',
      value: users.length > 0 ? Math.round(users.reduce((sum, user) => sum + user.age, 0) / users.length) : 0,
      icon: <Dashboard fontSize="large" />,
      color: '#388e3c',
    },
  ];

  return (
    <Box sx={{ padding: { xs: 1, sm: 2 } }}>
      {/* Welcome Section with Role Info */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Bienvenido a BookSmart
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h6" color="text.secondary">
            Panel de Administración
          </Typography>
          <Chip
            icon={<AdminPanelSettings />}
            label={currentUser?.roleName}
            color={isSuperAdmin ? 'warning' : 'primary'}
            variant="filled"
          />
        </Box>
        
        <Alert severity={isSuperAdmin ? 'warning' : 'info'} sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Rol:</strong> {currentUser?.roleName} • 
            <strong> Acceso:</strong> {isSuperAdmin ? 'Completo al sistema' : 'Gestión de usuarios'}
          </Typography>
        </Alert>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Sistema de gestión bibliotecaria con control de acceso basado en roles.
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ marginTop: 1 }}>
        {stats.map((stat, index) => (
          <Grid key={index} size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: stat.color }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ marginTop: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {hasAdminAccess && (
          <>
            <Button
              variant="contained"
              size="large"
              startIcon={<People />}
              onClick={() => navigate('/users')}
            >
              Ver Usuarios
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<PersonAdd />}
              onClick={() => navigate('/add-user')}
            >
              Agregar Usuario
            </Button>
          </>
        )}
        
        {isSuperAdmin && (
          <Button
            variant="contained"
            size="large"
            color="warning"
            startIcon={<Settings />}
            onClick={() => navigate('/admin-settings')}
          >
            Configuración
          </Button>
        )}
      </Box>

      {/* Role Information Card */}
      <Box sx={{ mt: 4 }}>
        <RoleInfoCard currentUserRole={currentUser?.roleId} />
      </Box>
    </Box>
  );
};

export default Home;
