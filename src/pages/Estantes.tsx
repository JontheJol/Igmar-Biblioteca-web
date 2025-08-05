import '@fontsource/league-spartan/400.css';
import '@fontsource/league-spartan/700.css';
import '@fontsource/rowdies/400.css';
import { 
  Box, 
  Typography, 
  FormControl, 
  Select, 
  MenuItem, 
  Card
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '../assets/addIcon';
import BookIcon from '../assets/bookIcon';
import { Edit } from 'iconoir-react';
import { useAppStore } from '../store/appStore';

const Estantes: React.FC = () => {
  const navigate = useNavigate();
  const { estantes } = useAppStore();
  const [filtro, setFiltro] = useState('Todos');

  const handleFiltroChange = (event: SelectChangeEvent) => {
    setFiltro(event.target.value);
  };

  const estantesFiltrados = estantes.filter(estante => {
    if (filtro === 'Disponibles') return estante.espaciosDisponibles > 0;
    if (filtro === 'Llenos') return estante.espaciosDisponibles === 0;
    return true; // 'Todos'
  });

  const handleAddNewShelf = () => {
    navigate('/agregar-estante');
  };

  const handleEditShelf = (id: number) => {
    navigate(`/editar-estante/${id}`);
  };

  const handleAddBooks = (id: number) => {
    navigate(`/libros/nuevo?estante=${id}`);
  };

  return (
    <Box sx={{ backgroundColor: '#fff9ec', position: 'relative' }}>
      <Box
        sx={{
          padding: { xs: 3, sm: 4 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Botón Añadir estante - Posición responsiva */}
        <Box
          sx={{
            position: { xs: 'static', md: 'absolute' },
            right: { md: '48px' },
            top: { md: '74px' },
            zIndex: 1,
            mb: { xs: 2, md: 0 },
            display: 'flex',
            justifyContent: { xs: 'flex-end', md: 'flex-start' }
          }}
        >
          <Box
            onClick={handleAddNewShelf}
            sx={{
              width: '100%',
              height: '100%',
              background: '#2F5233',
              boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden',
              borderRadius: 2,
              justifyContent: 'space-between',
              alignItems: 'center',
              display: 'inline-flex',
              cursor: 'pointer',
              '&:hover': {
                background: '#234026',
              }
            }}
          >
            <Box
              sx={{
                height: 32,
                padding: '6px 16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Typography
                sx={{
                  color: '#FFF9EC',
                  fontSize: 15,
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  lineHeight: '20px',
                  letterSpacing: 0.1
                }}
              >
                Añadir estante
              </Typography>
              <AddIcon />
            </Box>
          </Box>
        </Box>

        {/* Título */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '32px', sm: '48px', md: '64px' },
            fontWeight: 400,
            color: '#453726',
            fontFamily: 'Rowdies, sans-serif',
            marginBottom: { xs: '20px', md: '35px' },
            width: { xs: '100%', md: '859px' },
            lineHeight: { xs: '36px', sm: '52px', md: '20px' },
            letterSpacing: '0.1px'
          }}
        >
          Gestión de Estantes
        </Typography>

        {/* Subtítulo */}
        <Typography
          variant="subtitle1"
          sx={{
            fontSize: { xs: '18px', sm: '20px', md: '24px' },
            color: '#4B453D',
            fontWeight: 400,
            fontFamily: 'League Spartan, sans-serif',
            marginBottom: '16px',
            width: { xs: '100%', md: '743px' },
            lineHeight: '20px',
            letterSpacing: '0.1px'
          }}
        >
          Administra los Estantes de la biblioteca en este espacio.
        </Typography>

        {/* Línea divisoria */}
        <Box
          sx={{
            width: { xs: '100%', md: '1144px' },
            height: 0,
            borderTop: '3px solid #3A332A',
            marginBottom: '14px'
          }}
        />

      {/* Filtro */}
      <FormControl sx={{ mb: 3, minWidth: { xs: '100%', sm: 306 }, maxWidth: { xs: '100%', sm: 306 } }}>
        <Select
          value={filtro}
          onChange={handleFiltroChange}
          sx={{
            height: 48,
            backgroundColor: '#fff9ec',
            border: '1px solid rgba(69,55,38,0.15)',
            borderRadius: '10px',
            fontFamily: 'League Spartan',
            fontSize: { xs: '16px', sm: '20px' },
            fontWeight: 300,
            color: '#453726',
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          }}
          displayEmpty
        >
          <MenuItem value="Todos">Filtrar por disponibilidad - Todos</MenuItem>
          <MenuItem value="Disponibles">Disponibles</MenuItem>
          <MenuItem value="Llenos">Llenos</MenuItem>
        </Select>
      </FormControl>

      {/* Grid de Estantes */}
      <Box
        sx={{
          backgroundColor: 'rgba(225,197,171,0.8)',
          borderRadius: '10px',
          padding: { xs: '15px 8px', sm: '21px 10px' },
          maxWidth: { xs: '100%', sm: '100%', md: '1200px' },
          width: '100%',
          maxHeight: { xs: '1800px', sm: '950px', md: '516px' },
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)' 
          },
          gridAutoRows: { 
            xs: 'minmax(280px, auto)', 
            sm: 'minmax(300px, auto)', 
            md: 'minmax(240px, auto)' 
          },
          gap: { xs: '15px', sm: '20px', md: '23px' },
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(164, 113, 73, 0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(164, 113, 73, 0.5)',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(164, 113, 73, 0.7)',
            },
          },
        }}
      >
                {estantesFiltrados.map((estante) => (
          <Card
            key={estante.id}
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: { xs: '12px', sm: '16px', md: '20px' },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: '8px', sm: '10px' },
              height: 'fit-content',
              minHeight: { xs: '240px', sm: '260px', md: '280px' },
              maxWidth: '280px',
              margin: '0 auto',
              boxSizing: 'border-box'
            }}
          >
            {/* Avatar/Imagen del estante */}
            <Box
              sx={{
                width: { xs: 48, sm: 56, md: 68 },
                height: { xs: 48, sm: 56, md: 68 },
                backgroundColor: '#f5eff7',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <BookIcon color="#999" width={32} height={32} />
            </Box>

            {/* Nombre del estante */}
            <Typography
              sx={{
                fontFamily: 'League Spartan',
                fontWeight: 500,
                fontSize: { xs: '16px', sm: '18px', md: '20px' },
                color: '#000000',
                letterSpacing: '0.1px',
                textAlign: 'center',
                lineHeight: '20px',
                margin: 0,
                width: { xs: '140px', sm: '150px', md: '163.831px' },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '20.302px'
              }}
            >
              {estante.nombre}
            </Typography>

            {/* Información del estante */}
            <Box 
              sx={{ 
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0px, 1fr))',
                gridTemplateRows: 'repeat(2, minmax(0px, 1fr))',
                gap: '10px 0',
                height: '68px'
              }}
            >
              <Typography
                sx={{
                  gridArea: '1 / 1',
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: { xs: '13px', sm: '14px', md: '15px' },
                  color: '#000000',
                  letterSpacing: '0.1px',
                  lineHeight: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  height: '20.302px'
                }}
              >
                Cantidad de Libros
              </Typography>
              <Typography
                sx={{
                  gridArea: '1 / 2',
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  fontSize: '14px',
                  color: '#453726',
                  letterSpacing: '0.1px',
                  lineHeight: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  whiteSpace: 'pre'
                }}
              >
                {estante.cantidadLibros}
              </Typography>
              <Typography
                sx={{
                  gridArea: '2 / 1',
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: { xs: '13px', sm: '14px', md: '15px' },
                  color: '#000000',
                  letterSpacing: '0.1px',
                  lineHeight: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  whiteSpace: 'pre'
                }}
              >
                Espacios disponible
              </Typography>
              <Typography
                sx={{
                  gridArea: '2 / 2',
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  fontSize: '14px',
                  color: '#453726',
                  letterSpacing: '0.1px',
                  lineHeight: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  whiteSpace: 'pre'
                }}
              >
                {estante.espaciosDisponibles}
              </Typography>
            </Box>

            {/* Botones de acción */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'row',
              gap: '15px',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: '200px', sm: '220px', md: '228px' },
              flexShrink: 0
            }}>
              <Box
                onClick={() => handleEditShelf(estante.id)}
                sx={{
                  backgroundColor: '#a47149',
                  color: '#ffffff',
                  borderRadius: '8px',
                  height: '30px',
                  width: { xs: '80px', sm: '85px', md: '92.187px' },
                  boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  '&:hover': {
                    backgroundColor: '#8b5e3c',
                  }
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'League Spartan',
                    fontWeight: 500,
                    fontSize: { xs: '12px', sm: '13px', md: '15px' },
                    letterSpacing: '0.1px',
                    lineHeight: '20px',
                    color: '#ffffff',
                    marginRight: '4px'
                  }}
                >
                  Editar
                </Typography>
                <Edit width={16} height={16} color="#ffffff" />
              </Box>
              <Box
                onClick={() => handleAddBooks(estante.id)}
                sx={{
                  backgroundColor: '#2f5232',
                  color: '#ffffff',
                  borderRadius: '8px',
                  height: '30px',
                  width: { xs: '85px', sm: '90px', md: '100.021px' },
                  boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  '&:hover': {
                    backgroundColor: '#234026',
                  }
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'League Spartan',
                    fontWeight: 500,
                    fontSize: { xs: '12px', sm: '13px', md: '15px' },
                    letterSpacing: '0.1px',
                    lineHeight: '20px',
                    color: '#ffffff',
                    marginRight: '4px'
                  }}
                >
                  Añadir
                </Typography>
                <BookIcon color="#ffffff" width={16} height={16} />
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
      </Box>
    </Box>
  );
};

export default Estantes;
