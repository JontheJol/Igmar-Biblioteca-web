import '@fontsource/league-spartan/400.css';
import '@fontsource/league-spartan/500.css';
import '@fontsource/rowdies/400.css';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Card
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from '@mui/icons-material';
import { useAppStore } from '../store/appStore';
import PageHeader from '../components/PageHeader';
import StatsIcon from '../assets/statsIcon';
import EditIcon from '../assets/editIcon';

const Administradores: React.FC = () => {
  const navigate = useNavigate();
  const { administradores } = useAppStore();
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('nombre');

  const handleFiltroChange = (event: SelectChangeEvent) => {
    setFiltroTipo(event.target.value);
  };

  const handleBusquedaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(event.target.value);
  };

  const administradoresFiltrados = administradores?.filter(administrador => {
    if (!busqueda.trim()) return true;
    
    const busquedaLower = busqueda.toLowerCase().trim();
    
    switch (filtroTipo) {
      case 'nombre':
        return administrador.nombre.toLowerCase().includes(busquedaLower);
      case 'correo':
        return administrador.correo.toLowerCase().includes(busquedaLower);
      case 'biblioteca':
        return administrador.biblioteca?.toLowerCase().includes(busquedaLower);
      default:
        return true;
    }
  }) || [];

  const handleEditarAdministrador = (id: string) => {
    navigate(`/editar-administrador/${id}`);
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
      overflow: 'hidden'
    }}>
      <PageHeader
        title="Administradores"
        subtitle="Gestiona los datos de los administradores de tus bibliotecas"
      >
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
            placeholder="Buscar administradores..."
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
              value={filtroTipo}
              onChange={handleFiltroChange}
              startAdornment={
                <InputAdornment position="start">
                  <StatsIcon 
                    width={22} 
                    height={22} 
                    color="#453726"
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
              <MenuItem value="correo">Filtrar por correo</MenuItem>
              <MenuItem value="biblioteca">Filtrar por biblioteca</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </PageHeader>

      {/* Lista de Administradores */}
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
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: { 
            xs: '12px', 
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
        {administradoresFiltrados.length === 0 ? (
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
              No se encontraron administradores
            </Typography>
            <Typography
              sx={{
                fontFamily: 'League Spartan',
                fontSize: { xs: '14px', sm: '16px' },
                fontWeight: 300
              }}
            >
              {busqueda.trim() 
                ? `No hay administradores que coincidan con "${busqueda}" en ${
                    filtroTipo === 'nombre' ? 'nombre' : 
                    filtroTipo === 'correo' ? 'correo' : 
                    filtroTipo === 'biblioteca' ? 'biblioteca' : 'campo seleccionado'
                  }`
                : 'No hay administradores registrados'
              }
            </Typography>
          </Box>
        ) : (
          administradoresFiltrados.map((administrador) => (
            <Card
              key={administrador.id}
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: { xs: '12px', sm: '16px', md: '18px' },
                padding: { 
                  xs: '16px', 
                  sm: '20px', 
                  md: '24px',
                  lg: '28px'
                },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                width: '100%',
                minHeight: { xs: '140px', sm: '143px', md: '143px' },
                boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                gap: { xs: '16px', sm: '20px', md: '24px' },
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
              {/* Información del administrador */}
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: { xs: '8px', sm: '6px' },
                  width: { xs: '100%', sm: 'auto' },
                  textAlign: { xs: 'center', sm: 'left' }
                }}
              >
                {/* Nombre */}
                <Typography
                  sx={{
                    fontFamily: 'League Spartan',
                    fontWeight: 500,
                    fontSize: { xs: '18px', sm: '20px', md: '24px' },
                    color: '#453726',
                    letterSpacing: '0.1px',
                    lineHeight: '1.2',
                    margin: 0,
                  }}
                >
                  {administrador.nombre}
                </Typography>

                {/* Biblioteca */}
                <Typography
                  sx={{
                    fontFamily: 'League Spartan',
                    fontWeight: 400,
                    fontSize: { xs: '16px', sm: '18px', md: '20px' },
                    color: '#453726',
                    letterSpacing: '0.1px',
                    lineHeight: '1.2',
                    margin: 0,
                  }}
                >
                  {administrador.biblioteca || 'Sin biblioteca asignada'}
                </Typography>

                {/* Correo */}
                <Typography
                  sx={{
                    fontFamily: 'League Spartan',
                    fontWeight: 400,
                    fontSize: { xs: '14px', sm: '16px', md: '18px' },
                    color: '#453726',
                    letterSpacing: '0.1px',
                    lineHeight: '1.2',
                    margin: 0,
                    opacity: 0.8
                  }}
                >
                  {administrador.correo}
                </Typography>
              </Box>

              {/* Botón Editar */}
              <Box
                onClick={() => handleEditarAdministrador(administrador.id)}
                sx={{
                  backgroundColor: '#a47149',
                  color: '#ffffff',
                  borderRadius: { xs: '6px', sm: '8px' },
                  height: { xs: '32px', sm: '32px', md: '32px' },
                  width: { xs: 'auto', sm: 'auto' },
                  minWidth: { xs: '92px', sm: '100px', md: '92px' },
                  boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  flexShrink: 0,
                  padding: '0 8px',
                  alignSelf: { xs: 'center', sm: 'flex-start' },
                  transition: 'background-color 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: '#8b5e3c',
                  }
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'League Spartan',
                    fontWeight: 500,
                    fontSize: { xs: '13px', sm: '15px' },
                    letterSpacing: '0.1px',
                    lineHeight: '1',
                    color: '#fff9ec',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Editar
                </Typography>
                <EditIcon width={14} height={14} color="#fff9ec" />
              </Box>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
};

export default Administradores;
