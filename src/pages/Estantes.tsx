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
import PageHeader from '../components/PageHeader';
import ActionButton from '../components/ActionButton';

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
      <PageHeader
        title="Gestión de Estantes"
        subtitle="Administra los Estantes de la biblioteca en este espacio."
        actionButton={
          <ActionButton
            label="Añadir estante"
            icon={<AddIcon />}
            onClick={handleAddNewShelf}
          />
        }
      >
        {/* Controles de búsqueda y filtro */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 3 },
            mb: { xs: 4, md: 5 },
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
                backgroundColor: '#ffffff',
                border: '1px solid rgba(69,55,38,0.15)',
                borderRadius: '10px',
                fontFamily: 'League Spartan',
                fontSize: { xs: '16px', sm: '18px' },
                fontWeight: 300,
                color: '#453726',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: '2px solid #453726',
                },
              },
              '& .MuiInputBase-input': {
                '&::placeholder': {
                  color: '#453726',
                  opacity: 0.7,
                }, 
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search width={20} height={20} color="#453726" />
                </InputAdornment>
              ),
            }}
          />

          {/* Selector de filtro de disponibilidad */}
          <FormControl sx={{ width: { xs: '100%', sm: '200px' } }}>
            <Select
              value={filtro}
              onChange={handleFiltroChange}
              startAdornment={
                <InputAdornment position="start">
                  <StatsDownSquare 
                    width={22} 
                    height={22} 
                    color="#453726"
                    style={{ marginRight: '4px' }}
                  />
                </InputAdornment>
              }
              sx={{
                height: 48,
                backgroundColor: '#ffffff',
                border: '1px solid rgba(69,55,38,0.15)',
                borderRadius: '10px',
                fontFamily: 'League Spartan',
                fontSize: { xs: '16px', sm: '18px' },
                fontWeight: 400,
                color: '#453726',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: '2px solid #453726',
                },
              }}
              displayEmpty
            >
              <MenuItem value="Todos">Filtrar por disponibilidad - Todos</MenuItem>
              <MenuItem value="Disponibles">Disponibles</MenuItem>
              <MenuItem value="Llenos">Llenos</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </PageHeader>

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
          marginBottom: { xs: '20px', sm: '24px', md: '28px', lg: '32px' },
          maxHeight: { 
            xs: '60vh', 
            sm: '65vh', 
            md: '60vh',
            lg: '60vh',
            xl: '60vh'
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
  );
};

export default Estantes;
