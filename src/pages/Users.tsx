import React from 'react';
import { Box } from '@mui/material';
import UsersTable from '../components/UsersTable';
import PageHeader from '../components/PageHeader';

const Users: React.FC = () => {
  return (
    <Box sx={{ 
      backgroundColor: '#fff9ec', 
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      minHeight: '100vh',
      overflow: 'hidden'
    }}>
      <PageHeader
        title="Gestión de Usuarios"
        subtitle="Administra los usuarios del sistema desde esta pantalla."
      />
      <Box sx={{ width: '100%', maxWidth: { lg: '1200px', xl: '1400px' }, padding: '0 16px' }}>
        <UsersTable />
      </Box>
    </Box>
  );
};

export default Users;
