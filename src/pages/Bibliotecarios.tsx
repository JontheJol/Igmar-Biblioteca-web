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
  InputAdornment
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, StatsDownSquare } from 'iconoir-react';
import { useAppStore } from '../store/appStore';
import BibliotecarioCard from '../components/BibliotecarioCard';
import PageHeader from '../components/PageHeader';
import ActionButton from '../components/ActionButton';

const Bibliotecarios: React.FC = () => {
  const navigate = useNavigate();
  const { bibliotecarios } = useAppStore();
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('nombre');

  const handleFiltroChange = (event: SelectChangeEvent) => {
    setFiltroTipo(event.target.value);
  };

  const handleBusquedaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(event.target.value);
  };

  const bibliotecariosFiltrados = bibliotecarios.filter(bibliotecario => {
    if (!busqueda.trim()) return true;
    
    const busquedaLower = busqueda.toLowerCase().trim();
    
    switch (filtroTipo) {
      case 'nombre':
        return bibliotecario.nombre.toLowerCase().includes(busquedaLower);
      case 'correo':
        return bibliotecario.correo.toLowerCase().includes(busquedaLower);
      case 'telefono':
        return bibliotecario.numeroTelefono.toLowerCase().includes(busquedaLower);
      default:
        return true;
    }
  });

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
            placeholder="Buscar bibliotecarios..."
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

          {/* Selector de filtro */}
          <FormControl sx={{ width: { xs: '100%', sm: '200px' } }}>
            <Select
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
              <MenuItem value="correo">Filtrar por correo</MenuItem>
              <MenuItem value="telefono">Filtrar por teléfono</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </PageHeader>

      {/* Grid de Bibliotecarios */}
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
          gridTemplateColumns: '1fr', // Solo 1 columna en todas las pantallas
          gridAutoRows: { 
            xs: 'minmax(120px, auto)', 
            sm: 'minmax(140px, auto)', 
            md: 'minmax(130px, auto)',
            lg: 'minmax(140px, auto)'
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
          {bibliotecariosFiltrados.map((bibliotecario) => (
            <BibliotecarioCard
              key={bibliotecario.id}
              bibliotecario={bibliotecario}
              onEdit={handleEdit}
            />
          ))}
          
          {bibliotecariosFiltrados.length === 0 && bibliotecarios.length > 0 && (
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
              <Search width={48} height={48} color="rgba(69,55,38,0.5)" style={{ marginBottom: '16px' }} />
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: { xs: '16px', sm: '18px' },
                  color: '#4B453D',
                  marginBottom: '8px'
                }}
              >
                No se encontraron bibliotecarios
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: { xs: '12px', sm: '14px' },
                  color: '#8d8d8d'
                }}
              >
                Intenta con otros términos de búsqueda
              </Typography>
            </Box>
          )}
          
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
        </Box>
    </Box>
  );
};

export default Bibliotecarios;
