import '@fontsource/league-spartan/400.css';
import '@fontsource/league-spartan/700.css';
import '@fontsource/rowdies/400.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  FormControl, 
  Select, 
  MenuItem, 
  Card,
  InputAdornment,
  TextField
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useAppStore } from '../store/appStore';
import { Edit, StatsDownSquare } from 'iconoir-react';
import { Search as SearchIcon } from '@mui/icons-material';
import PageHeader from '../components/PageHeader';
import { ApiStatusComponent } from '../components/ApiStatusComponent';

const AdminSettings: React.FC = () => {
  const navigate = useNavigate();
  const { bibliotecas } = useAppStore();
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('nombre');
  const [filtroEstado, setFiltroEstado] = useState('');

  const handleFiltroChange = (event: SelectChangeEvent) => {
    if (event.target.name === 'tipo') {
      setFiltroTipo(event.target.value);
    } else {
      setFiltroEstado(event.target.value);
    }
  };

  const handleBusquedaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(event.target.value);
  };

  const bibliotecasFiltradas = bibliotecas.filter(biblioteca => {
    // Filtro por búsqueda
    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase().trim();
      
      switch (filtroTipo) {
        case 'nombre':
          if (!biblioteca.nombre.toLowerCase().includes(busquedaLower)) return false;
          break;
        case 'direccion':
          if (!biblioteca.direccion.toLowerCase().includes(busquedaLower)) return false;
          break;
        case 'estado':
          if (!getEstadoLabel(biblioteca.estado).toLowerCase().includes(busquedaLower)) return false;
          break;
        default:
          break;
      }
    }
    
    // Filtro por estado
    if (filtroEstado.trim()) {
      return biblioteca.estado === filtroEstado;
    }
    
    return true;
  });

  const handleEditarBiblioteca = (bibliotecaId: number) => {
    navigate(`/editar-biblioteca/${bibliotecaId}`);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activa':
        return '#4caf50';
      case 'inactiva':
        return '#f44336';
      case 'mantenimiento':
        return '#ff9800';
      default:
        return '#757575';
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'activa':
        return 'Activa';
      case 'inactiva':
        return 'Inactiva';
      case 'mantenimiento':
        return 'Mantenimiento';
      default:
        return estado;
    }
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
      overflowX: 'hidden',
      padding: { xs: 2, sm: 3 },
    }}>
      <PageHeader
        title="Bienvenido"
        subtitle="Administra las bibliotecas que implementan este sistema."
      >
        {/* Estado de conectividad de APIs */}
        <ApiStatusComponent />
        
        {/* Filtros */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 3 },
            mb: { xs: 4, md: 5 },
            width: '100%'
          }}
        >
          {/* Campo de búsqueda */}
          <TextField
            placeholder="Buscar configuraciones..."
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
                  <SearchIcon sx={{ color: '#453726', fontSize: '20px' }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Selector de tipo de filtro */}
          <FormControl sx={{ width: { xs: '100%', sm: '200px' } }}>
            <Select
              name="tipo"
              value={filtroTipo}
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
              <MenuItem value="nombre">Filtrar por nombre</MenuItem>
              <MenuItem value="direccion">Filtrar por dirección</MenuItem>
              <MenuItem value="estado">Filtrar por estado</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </PageHeader>

        {/* Lista de Bibliotecas */}
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
            height: { 
              xs: '50vh', 
              sm: '62vh', 
              md: '60vh',
              lg: '60vh',
              xl: '60vh'
            },
            minHeight: { xs: '300px', sm: '350px', md: '400px' },
            overflowY: 'auto',
            overflowX: 'hidden',
            display: { xs: 'grid', sm: 'flex' },
            gridTemplateColumns: { xs: 'repeat(auto-fit, minmax(140px, 1fr))', sm: 'none' },
            flexDirection: { xs: 'row', sm: 'column' },
            gap: { 
              xs: '8px', 
              sm: '16px', 
              md: '20px',
              lg: '24px'
            },
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
          {bibliotecasFiltradas.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '250px',
                textAlign: 'center',
                color: '#453726',
                opacity: 0.7,
                padding: '32px'
              }}
            >
              <SearchIcon sx={{ fontSize: '48px', mb: 2, opacity: 0.5 }} />
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontSize: { xs: '18px', sm: '20px' },
                  fontWeight: 500,
                  mb: 1
                }}
              >
                No se encontraron bibliotecas
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontSize: { xs: '14px', sm: '16px' },
                  fontWeight: 300
                }}
              >
                {busqueda.trim() 
                  ? `No hay bibliotecas que coincidan con "${busqueda}" en ${
                      filtroTipo === 'nombre' ? 'nombre' : 
                      filtroTipo === 'direccion' ? 'dirección' : 
                      filtroTipo === 'estado' ? 'estado' : 'campo seleccionado'
                    }`
                  : filtroEstado
                    ? `No hay bibliotecas en estado "${getEstadoLabel(filtroEstado)}"`
                    : 'No hay bibliotecas registradas'
                }
              </Typography>
            </Box>
          ) : (
            bibliotecasFiltradas.map((biblioteca) => (
            <Card
              key={biblioteca.id}
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: { xs: '8px', sm: '16px', md: '18px' },
                padding: { 
                  xs: '8px', 
                  sm: '20px', 
                  md: '24px',
                  lg: '28px'
                },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'center' },
                justifyContent: { xs: 'space-between', sm: 'space-between' },
                width: { xs: '100%', sm: '100%' },
                height: { xs: '120px', sm: 'auto' },
                minHeight: { xs: '120px', sm: '100px', md: '120px' },
                maxHeight: { xs: '140px', sm: 'none' },
                boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                gap: { xs: '4px', sm: '20px', md: '24px' },
                position: 'relative',
                overflow: 'hidden',
                boxSizing: 'border-box',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              {/* Información de la biblioteca */}
              <Box
                sx={{
                  flex: { xs: 1, sm: 1 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: { xs: 'center', sm: 'flex-start' },
                  gap: { xs: '2px', sm: '6px' },
                  width: { xs: '100%', sm: 'auto' },
                  textAlign: { xs: 'center', sm: 'left' },
                  minWidth: 0,
                  overflow: 'hidden',
                }}
              >
                {/* Nombre */}
                <Typography
                  sx={{
                    fontFamily: 'League Spartan',
                    fontWeight: 500,
                    fontSize: { xs: '11px', sm: '18px', md: '20px', lg: '24px' },
                    color: '#453726',
                    letterSpacing: '0.1px',
                    lineHeight: { xs: '1.1', sm: '1.2' },
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                  }}
                >
                  {biblioteca.nombre}
                </Typography>

                {/* Dirección */}
                <Typography
                  sx={{
                    fontFamily: 'League Spartan',
                    fontWeight: 400,
                    fontSize: { xs: '9px', sm: '16px', md: '18px', lg: '20px' },
                    color: '#453726',
                    letterSpacing: '0.1px',
                    lineHeight: { xs: '1.1', sm: '1.2' },
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                  }}
                >
                  {biblioteca.direccion}
                </Typography>

                {/* Estado */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                    gap: { xs: '3px', sm: '6px' },
                    mt: { xs: '1px', sm: '2px' }
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: '4px', sm: '8px' },
                      height: { xs: '4px', sm: '8px' },
                      borderRadius: '50%',
                      backgroundColor: getEstadoColor(biblioteca.estado),
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: 'League Spartan',
                      fontWeight: 400,
                      fontSize: { xs: '8px', sm: '14px', md: '15px', lg: '16px' },
                      color: getEstadoColor(biblioteca.estado),
                      letterSpacing: '0.1px',
                      lineHeight: { xs: '1.1', sm: '1.2' },
                      margin: 0,
                      textTransform: 'capitalize',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {getEstadoLabel(biblioteca.estado)}
                  </Typography>
                </Box>
              </Box>

              {/* Botón Editar */}
              <Box
                onClick={() => handleEditarBiblioteca(biblioteca.id)}
                sx={{
                  backgroundColor: '#a47149',
                  color: '#ffffff',
                  borderRadius: { xs: '4px', sm: '8px' },
                  height: { xs: '20px', sm: '32px', md: '36px' },
                  minWidth: { xs: '40px', sm: '80px', md: '92px' },
                  maxWidth: { xs: '50px', sm: '100px', md: 'none' },
                  boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: { xs: '1px', sm: '4px' },
                  flexShrink: 0,
                  padding: { xs: '0 4px', sm: '0 8px' },
                  transition: 'background-color 0.2s ease-in-out',
                  mt: { xs: '2px', sm: 0 },
                  '&:hover': {
                    backgroundColor: '#8b5e3c',
                  }
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'League Spartan',
                    fontWeight: 500,
                    fontSize: { xs: '7px', sm: '12px', md: '14px', lg: '15px' },
                    letterSpacing: '0.1px',
                    lineHeight: '1',
                    color: '#fff9ec',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Editar
                </Typography>
                <Edit 
                  width={8} 
                  height={8} 
                  color="#fff9ec" 
                  style={{ 
                    flexShrink: 0,
                    width: '8px',
                    height: '8px'
                  }} 
                />
              </Box>
            </Card>
            ))
          )}
        </Box>
    </Box>
  );
};

export default AdminSettings;
