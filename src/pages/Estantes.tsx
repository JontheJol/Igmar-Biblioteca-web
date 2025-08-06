import '@fontsource/league-spartan/400.css';
import '@fontsource/league-spartan/700.css';
import '@fontsource/rowdies/400.css';
import { 
  Box, 
  Typography, 
  FormControl, 
  Select, 
  MenuItem, 
  Card,
  TextField,
  InputAdornment
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '../assets/addIcon';
import BookIcon from '../assets/bookIcon';
import { Edit, StatsDownSquare, Search } from 'iconoir-react';
import { useAppStore } from '../store/appStore';

const Estantes: React.FC = () => {
  const navigate = useNavigate();
  const { estantes } = useAppStore();
  const [filtro, setFiltro] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const handleFiltroChange = (event: SelectChangeEvent) => {
    setFiltro(event.target.value);
  };

  const handleBusquedaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(event.target.value);
  };

  const estantesFiltrados = estantes.filter(estante => {
    // Filtro por búsqueda (nombre del estante)
    const coincideBusqueda = estante.nombre.toLowerCase().includes(busqueda.toLowerCase());
    
    // Filtro por disponibilidad
    let coincideFiltro = true;
    if (filtro === 'Disponibles') coincideFiltro = estante.espaciosDisponibles > 0;
    if (filtro === 'Llenos') coincideFiltro = estante.espaciosDisponibles === 0;
    
    return coincideBusqueda && coincideFiltro;
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
    <Box sx={{ 
      backgroundColor: '#fff9ec', 
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      minHeight: '100vh',
      overflow: 'hidden' // Previene overflow horizontal
    }}>
      <Box
        sx={{
          padding: { xs: '16px 8px', sm: '20px 12px', md: '24px 16px' },
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          maxWidth: { lg: '1200px', xl: '1400px' },
          margin: '0 auto',
          boxSizing: 'border-box' // Incluye padding en el ancho total
        }}
      >
        {/* Título */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '28px', sm: '40px', md: '56px' },
            fontWeight: 400,
            color: '#453726',
            fontFamily: 'Rowdies, sans-serif',
            marginBottom: { xs: '12px', sm: '16px', md: '20px' },
            width: '100%',
            maxWidth: '100%',
            lineHeight: { xs: '32px', sm: '44px', md: '60px' },
            letterSpacing: '0.1px',
            wordWrap: 'break-word',
            overflow: 'hidden',
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          Gestión de Estantes
        </Typography>

        {/* Contenedor para Subtítulo y Botón */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: { xs: 'center', md: 'space-between' },
            alignItems: { xs: 'center', md: 'center' },
            width: '100%',
            marginBottom: { xs: '8px', sm: '10px', md: '12px' },
            gap: { xs: 2, md: 0 }
          }}
        >
          {/* Subtítulo */}
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: { xs: '16px', sm: '18px', md: '20px' },
              color: '#4B453D',
              fontWeight: 400,
              fontFamily: 'League Spartan, sans-serif',
              lineHeight: { xs: '22px', sm: '24px', md: '26px' },
              letterSpacing: '0.1px',
              wordWrap: 'break-word',
              overflow: 'hidden',
              textAlign: { xs: 'center', md: 'left' },
              flex: 1
            }}
          >
            Administra los Estantes de la biblioteca en este espacio.
          </Typography>

          {/* Botón Añadir estante */}
          <Box
            onClick={handleAddNewShelf}
            sx={{
              background: '#2F5233',
              boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden',
              borderRadius: { xs: 1.5, sm: 2 },
              justifyContent: 'space-between',
              alignItems: 'center',
              display: 'inline-flex',
              cursor: 'pointer',
              flexShrink: 0,
              minWidth: { xs: '180px', sm: '140px', md: '160px' },
              width: { xs: '100%', sm: 'auto', md: 'auto' },
              maxWidth: { xs: '220px', sm: 'none', md: 'none' },
              '&:hover': {
                background: '#234026',
                transform: 'translateY(-1px)',
                boxShadow: '0px 2px 6px 2px rgba(0, 0, 0, 0.2)',
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <Box
              sx={{
                height: { xs: 40, sm: 40, md: 44 },
                padding: { 
                  xs: '10px 16px', 
                  sm: '10px 16px', 
                  md: '12px 20px' 
                },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: { xs: '8px', sm: '8px', md: '10px' },
                width: '100%'
              }}
            >
              <Typography
                sx={{
                  color: '#FFF9EC',
                  fontSize: { xs: 15, sm: 15, md: 16 },
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  lineHeight: '20px',
                  letterSpacing: 0.1,
                  whiteSpace: 'nowrap'
                }}
              >
                Añadir estante
              </Typography>
              <AddIcon />
            </Box>
          </Box>
        </Box>

        {/* Línea divisoria */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '100%',
            height: 0,
            borderTop: '3px solid #3A332A',
            marginBottom: { xs: '8px', sm: '10px' },
            boxSizing: 'border-box'
          }}
        />

        {/* Controles de búsqueda y filtro */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 3 },
            alignItems: { xs: 'stretch', sm: 'center' },
            marginBottom: { xs: 2, sm: 3 },
            width: '100%'
          }}
        >
          {/* Barra de búsqueda */}
          <TextField
            placeholder="Buscar estantes..."
            value={busqueda}
            onChange={handleBusquedaChange}
            sx={{
              flex: 1,
              maxWidth: { xs: '100%', sm: '400px' },
              '& .MuiOutlinedInput-root': {
                height: 48,
                backgroundColor: '#FFFFFF',
                borderRadius: '10px',
                fontFamily: 'League Spartan',
                fontSize: { xs: '16px', sm: '18px' },
                fontWeight: 300,
                color: '#453726',
                '& fieldset': {
                  border: '1px solid rgba(69,55,38,0.15)',
                },
                '&:hover fieldset': {
                  border: '1px solid rgba(69,55,38,0.25)',
                },
                '&.Mui-focused fieldset': {
                  border: '1px solid rgba(69,55,38,0.35)',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'rgba(69,55,38,0.6)',
                opacity: 1,
              }
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search width={20} height={20} color="rgba(69,55,38,0.6)" />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Filtro con ícono */}
          <FormControl sx={{ 
            width: '100%',
            maxWidth: { xs: '100%', sm: '300px' },
            boxSizing: 'border-box'
          }}>
            <Select
              value={filtro}
              onChange={handleFiltroChange}
              sx={{
                height: 48,
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(69,55,38,0.15)',
                borderRadius: '10px',
                fontFamily: 'League Spartan',
                fontSize: { xs: '16px', sm: '18px' },
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
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }
              }}
              displayEmpty
              renderValue={(value) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StatsDownSquare width={20} height={20} color="#453726" />
                  <Typography sx={{ fontFamily: 'League Spartan', fontSize: 'inherit', color: 'inherit' }}>
                    {value === 'Todos' ? 'Filtrar por disponibilidad - Todos' :
                     value === 'Disponibles' ? 'Disponibles' : 'Llenos'}
                  </Typography>
                </Box>
              )}
            >
              <MenuItem value="Todos">Filtrar por disponibilidad - Todos</MenuItem>
              <MenuItem value="Disponibles">Disponibles</MenuItem>
              <MenuItem value="Llenos">Llenos</MenuItem>
            </Select>
          </FormControl>
        </Box>

      {/* Grid de Estantes */}
      <Box
        sx={{
          backgroundColor: 'rgba(225,197,171,0.8)',
          borderRadius: { xs: '8px', sm: '10px' },
          padding: { 
            xs: '12px 8px', 
            sm: '16px 12px', 
            md: '20px 16px',
            lg: '24px 20px'
          },
          width: '100%',
          maxWidth: { 
            xs: '100%', 
            sm: '100%', 
            md: '100%', 
            lg: '900px',
            xl: '1000px'
          },
          margin: '0 auto',
          maxHeight: { 
            xs: 'calc(100vh - 320px)', 
            sm: 'calc(100vh - 300px)', 
            md: 'calc(100vh - 280px)',
            lg: 'calc(100vh - 260px)',
            xl: '600px'
          },
          minHeight: { xs: '280px', sm: '350px', md: '400px' },
          overflowY: 'auto',
          overflowX: 'hidden', // Previene overflow horizontal
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)',
            lg: 'repeat(3, 1fr)',
            xl: 'repeat(3, 1fr)'
          },
          gridAutoRows: { 
            xs: 'minmax(240px, auto)', 
            sm: 'minmax(260px, auto)', 
            md: 'minmax(250px, auto)',
            lg: 'minmax(270px, auto)'
          },
          gap: { 
            xs: '12px', 
            sm: '16px', 
            md: '20px',
            lg: '24px'
          },
          justifyItems: 'center',
          alignItems: 'start',
          boxSizing: 'border-box',
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
              borderRadius: { xs: '12px', sm: '16px', md: '18px' },
              padding: { 
                xs: '12px', 
                sm: '16px', 
                md: '20px',
                lg: '22px'
              },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: '6px', sm: '8px', md: '10px' },
              height: 'fit-content',
              minHeight: { 
                xs: '220px', 
                sm: '240px', 
                md: '250px',
                lg: '270px'
              },
              width: '100%',
              maxWidth: { 
                xs: 'calc(100% - 8px)', 
                sm: '280px', 
                md: '290px',
                lg: '300px',
                xl: '320px'
              },
              margin: '0 auto',
              boxSizing: 'border-box',
              overflow: 'hidden', // Previene overflow del contenido
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }
            }}
          >
            {/* Avatar/Imagen del estante */}
            <Box
              sx={{
                width: { 
                  xs: 44, 
                  sm: 52, 
                  md: 60,
                  lg: 68 
                },
                height: { 
                  xs: 44, 
                  sm: 52, 
                  md: 60,
                  lg: 68 
                },
                backgroundColor: '#f5eff7',
                borderRadius: { xs: '6px', sm: '7px', md: '8px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Box
                sx={{
                  width: { xs: '28px', sm: '30px', md: '32px' },
                  height: { xs: '28px', sm: '30px', md: '32px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <BookIcon color="#999" width={32} height={32} />
              </Box>
            </Box>

            {/* Nombre del estante */}
            <Typography
              sx={{
                fontFamily: 'League Spartan',
                fontWeight: 500,
                fontSize: { xs: '14px', sm: '16px', md: '18px' },
                color: '#000000',
                letterSpacing: '0.1px',
                textAlign: 'center',
                lineHeight: { xs: '18px', sm: '20px', md: '22px' },
                margin: 0,
                width: '100%',
                maxWidth: '100%',
                padding: '0 4px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: { xs: '18px', sm: '20px', md: '22px' },
                wordWrap: 'break-word',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box'
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
              gap: { xs: '6px', sm: '8px', md: '12px' },
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxWidth: '100%',
              padding: '0 4px',
              boxSizing: 'border-box',
              flexShrink: 0
            }}>
              <Box
                onClick={() => handleEditShelf(estante.id)}
                sx={{
                  backgroundColor: '#a47149',
                  color: '#ffffff',
                  borderRadius: { xs: '6px', sm: '7px', md: '8px' },
                  height: { xs: '26px', sm: '28px', md: '30px' },
                  width: { 
                    xs: 'calc(50% - 3px)', 
                    sm: '80px', 
                    md: '85px',
                    lg: '90px'
                  },
                  minWidth: { xs: '60px', sm: '70px' },
                  maxWidth: '120px',
                  boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'background-color 0.2s ease-in-out',
                  boxSizing: 'border-box',
                  '&:hover': {
                    backgroundColor: '#8b5e3c',
                  }
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'League Spartan',
                    fontWeight: 500,
                    fontSize: { 
                      xs: '11px', 
                      sm: '12px', 
                      md: '14px',
                      lg: '15px'
                    },
                    letterSpacing: '0.1px',
                    lineHeight: '20px',
                    color: '#ffffff',
                    marginRight: { xs: '2px', sm: '3px', md: '4px' }
                  }}
                >
                  Editar
                </Typography>
                <Edit width={15} height={15} color="#ffffff" />
              </Box>
              <Box
                onClick={() => handleAddBooks(estante.id)}
                sx={{
                  backgroundColor: '#2f5232',
                  color: '#ffffff',
                  borderRadius: { xs: '6px', sm: '7px', md: '8px' },
                  height: { xs: '26px', sm: '28px', md: '30px' },
                  width: { 
                    xs: 'calc(50% - 3px)', 
                    sm: '85px', 
                    md: '90px',
                    lg: '95px'
                  },
                  minWidth: { xs: '65px', sm: '75px' },
                  maxWidth: '130px',
                  boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'background-color 0.2s ease-in-out',
                  boxSizing: 'border-box',
                  '&:hover': {
                    backgroundColor: '#234026',
                  }
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'League Spartan',
                    fontWeight: 500,
                    fontSize: { 
                      xs: '11px', 
                      sm: '12px', 
                      md: '14px',
                      lg: '15px'
                    },
                    letterSpacing: '0.1px',
                    lineHeight: '20px',
                    color: '#ffffff',
                    marginRight: { xs: '2px', sm: '3px', md: '4px' }
                  }}
                >
                  Añadir
                </Typography>
                <BookIcon color="#ffffff" width={15} height={15} />
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
