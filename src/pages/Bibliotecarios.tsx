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
    <Box sx={{ backgroundColor: '#fff9ec', position: 'relative', minHeight: '100vh' }}>
      <Box
        sx={{
          padding: { xs: 2, sm: 3, md: 4 },
          position: 'relative',
          overflow: 'hidden',
          maxWidth: '1400px',
          margin: '0 auto'
        }}
      >
        {/* Botón Nuevo bibliotecario - Posición responsiva */}
        <Box
          sx={{
            position: { xs: 'static', lg: 'absolute' },
            right: { lg: '24px', xl: '48px' },
            top: { lg: '74px' },
            zIndex: 1,
            mb: { xs: 2, lg: 0 },
            display: 'flex',
            justifyContent: { xs: 'center', sm: 'flex-end', lg: 'flex-start' }
          }}
        >
          <Box
            onClick={handleAddNew}
            sx={{
              background: '#2F5233',
              boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden',
              borderRadius: 2,
              justifyContent: 'space-between',
              alignItems: 'center',
              display: 'inline-flex',
              cursor: 'pointer',
              minWidth: { xs: '200px', sm: 'auto' },
              width: { xs: '100%', sm: 'auto' },
              maxWidth: '250px',
              '&:hover': {
                background: '#234026',
              }
            }}
          >
            <Box
              sx={{
                height: { xs: 36, sm: 32 },
                padding: { xs: '8px 16px', sm: '6px 16px' },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                width: '100%'
              }}
            >
              <Typography
                sx={{
                  color: '#FFF9EC',
                  fontSize: { xs: 14, sm: 15 },
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  lineHeight: '20px',
                  letterSpacing: 0.1,
                  whiteSpace: 'nowrap'
                }}
              >
                Nuevo bibliotecario
              </Typography>
              <PlusCircle width={16} height={16} color="#FFF9EC" />
            </Box>
          </Box>
        </Box>

        {/* Título */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '28px', sm: '40px', md: '48px', lg: '56px', xl: '64px' },
            fontWeight: 400,
            color: '#453726',
            fontFamily: 'Rowdies, sans-serif',
            marginBottom: { xs: '16px', sm: '20px', md: '24px', lg: '35px' },
            width: '100%',
            maxWidth: { md: '859px' },
            lineHeight: { xs: '32px', sm: '44px', md: '52px', lg: '60px', xl: '20px' },
            letterSpacing: '0.1px',
            textAlign: { xs: 'center', sm: 'left' },
            wordBreak: 'break-word'
          }}
        >
          Gestion de bibliotecarios
        </Typography>

        {/* Subtítulo */}
        <Typography
          variant="subtitle1"
          sx={{
            fontSize: { xs: '16px', sm: '18px', md: '20px', lg: '22px', xl: '24px' },
            color: '#4B453D',
            fontWeight: 400,
            fontFamily: 'League Spartan, sans-serif',
            marginBottom: { xs: '12px', sm: '14px', md: '16px' },
            width: '100%',
            maxWidth: { md: '743px' },
            lineHeight: { xs: '22px', sm: '24px', md: '20px' },
            letterSpacing: '0.1px',
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Administra a los encargados del espacio de la biblioteca
        </Typography>

        {/* Línea divisoria */}
        <Box
          sx={{
            width: '100%',
            maxWidth: { md: '859px' },
            height: 0,
            borderTop: { xs: '2px solid #3A332A', md: '3px solid #3A332A' },
            marginBottom: { xs: '12px', sm: '14px' },
            mx: { xs: 'auto', sm: 0 }
          }}
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
    </Box>
  );
};

export default Bibliotecarios;
