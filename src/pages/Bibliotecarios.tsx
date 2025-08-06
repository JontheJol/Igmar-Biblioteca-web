import '@fontsource/league-spartan/400.css';
import '@fontsource/league-spartan/500.css';
import '@fontsource/rowdies/400.css';
import {
  Box,
  Typography
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'iconoir-react';
import { useAppStore } from '../store/appStore';
import BibliotecarioCard from '../components/BibliotecarioCard';
import PageHeader from '../components/PageHeader';
import ActionButton from '../components/ActionButton';

const Bibliotecarios: React.FC = () => {
  const navigate = useNavigate();
  const { bibliotecarios } = useAppStore();

  const handleAddNew = () => {
    navigate('/bibliotecarios/agregar');
  };

  const handleEdit = (id: number) => {
    navigate(`/bibliotecarios/editar/${id}`);
  };

  return (
    <Box sx={{ 
      backgroundColor: '#fff9ec', 
      position: 'relative', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      overflow: 'hidden'
    }}>
      <PageHeader
        title="Gestion de bibliotecarios"
        subtitle="Administra a los encargados del espacio de la biblioteca"
        actionButton={
          <ActionButton
            label="Nuevo bibliotecario"
            icon={<PlusCircle width={16} height={16} color="#FFF9EC" />}
            onClick={handleAddNew}
          />
        }
      />

      {/* Lista de Bibliotecarios */}
      <Box
        sx={{
          backgroundColor: 'rgba(225,197,171,0.8)',
          borderRadius: '10px',
          padding: { xs: '12px 8px', sm: '16px 10px', md: '21px 10px' },
          width: '100%',
          maxWidth: { xs: '100%', lg: '900px', xl: '1000px' },
          maxHeight: { 
            xs: '70vh', 
            sm: '600px', 
              md: '650px', 
              lg: '516px' 
            },
            overflowY: 'auto',
            overflowX: 'hidden', // Previene scroll horizontal
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Centra las cards horizontalmente
            gap: { xs: '12px', sm: '16px', md: '20px', lg: '23px' },
            mx: { xs: 'auto', lg: 0 },
            // Scroll suave en todos los dispositivos
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch', // Scroll suave en iOS
            // Mejoras del scroll
            '&::-webkit-scrollbar': {
              width: { xs: '6px', sm: '8px' },
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(164, 113, 73, 0.1)',
              borderRadius: '4px',
              margin: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(164, 113, 73, 0.5)',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(164, 113, 73, 0.7)',
              },
            },
            // Asegurar que el scroll funcione correctamente
            '&:hover': {
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(164, 113, 73, 0.7)',
              },
            },
            // Padding bottom para evitar que la última card se corte
            paddingBottom: { xs: '8px', sm: '10px' }
          }}
        >
          {bibliotecarios.map((bibliotecario) => (
            <BibliotecarioCard
              key={bibliotecario.id}
              bibliotecario={bibliotecario}
              onEdit={handleEdit}
            />
          ))}
          
          {bibliotecarios.length === 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: { xs: '30px 15px', sm: '40px 20px' },
                textAlign: 'center',
                width: '100%'
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: { xs: '16px', sm: '18px' },
                  color: '#4B453D',
                  marginBottom: '8px'
                }}
              >
                No hay bibliotecarios registrados
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: { xs: '12px', sm: '14px' },
                  color: '#8d8d8d'
                }}
              >
                Agrega el primer bibliotecario para comenzar
              </Typography>
            </Box>
          )}
          
          {/* Indicador de scroll si hay muchos elementos */}
          {bibliotecarios.length > 3 && (
            <Box
              sx={{
                position: 'sticky',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(transparent, rgba(225,197,171,0.9))',
                width: '100%',
                height: '20px',
                pointerEvents: 'none',
                display: { xs: 'block', md: 'none' } // Solo en móvil
              }}
            />
          )}
        </Box>
    </Box>
  );
};

export default Bibliotecarios;
