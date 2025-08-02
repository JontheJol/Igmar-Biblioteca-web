import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import BibliotecarioForm from '../components/BibliotecarioForm';
import type { BibliotecarioFormData } from '../utils/validation';
import { Box, Typography } from '@mui/material';

const EditarBibliotecario: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { bibliotecarios, updateBibliotecario, bibliotecarioLoading, bibliotecarioError } = useAppStore();

  const bibliotecario = bibliotecarios.find(b => b.id === Number(id));

  const handleSubmit = (data: BibliotecarioFormData) => {
    if (bibliotecario) {
      updateBibliotecario(bibliotecario.id, data);
      // Navigate back to the bibliotecarios list after successful update
      navigate('/bibliotecarios');
    }
  };

  if (!bibliotecario) {
    return (
      <Box sx={{ 
        backgroundColor: '#fff9ec', 
        minHeight: '100vh', 
        padding: { xs: 2, sm: 3, md: 4 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{ 
          maxWidth: { xs: '100%', sm: '500px', md: '600px' }, 
          margin: '0 auto', 
          textAlign: 'center',
          padding: { xs: 2, sm: 3 }
        }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '24px', sm: '28px', md: '32px' },
              fontWeight: 400,
              color: '#453726',
              fontFamily: 'League Spartan',
              marginBottom: 2
            }}
          >
            Bibliotecario no encontrado
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '16px', sm: '18px' },
              color: '#4B453D',
              fontFamily: 'League Spartan'
            }}
          >
            El bibliotecario que intentas editar no existe.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <BibliotecarioForm
      title="Editar Bibliotecario"
      bibliotecario={bibliotecario}
      onSubmit={handleSubmit}
      error={bibliotecarioError}
      loading={bibliotecarioLoading}
    />
  );
};

export default EditarBibliotecario;
