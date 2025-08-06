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
            alignItems: { xs: 'stretch', sm: 'center' },
            marginBottom: { xs: 2, sm: 3 },
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
              value={filtroTipo}
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
                    {value === 'nombre' ? 'Filtrar por nombre' :
                     value === 'correo' ? 'Filtrar por correo' : 'Filtrar por teléfono'}
                  </Typography>
                </Box>
              )}
            >
              <MenuItem value="nombre">Filtrar por nombre</MenuItem>
              <MenuItem value="correo">Filtrar por correo</MenuItem>
              <MenuItem value="telefono">Filtrar por teléfono</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </PageHeader>

      {/* Lista de Bibliotecarios */}
      <Box
        sx={{
          backgroundColor: 'rgba(225,197,171,0.8)',
          borderRadius: '10px',
          padding: { 
            xs: '16px 12px', 
            sm: '20px 16px', 
            md: '24px 20px',
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
            overflowX: 'hidden', // Previene scroll horizontal
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Centra las cards horizontalmente
            gap: { xs: '12px', sm: '16px', md: '20px', lg: '24px' },
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
