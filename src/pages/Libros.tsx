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
  InputAdornment,
  TextField
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import BookIcon from '../assets/bookIcon';
import { Edit, StatsDownSquare } from 'iconoir-react';
import { Search as SearchIcon } from '@mui/icons-material';
import PageHeader from '../components/PageHeader';
import ActionButton from '../components/ActionButton';
import AddIcon from '../assets/addIcon';

const Libros: React.FC = () => {
  const navigate = useNavigate();
  const { libros, loadLibros } = useAppStore();
  const [filtro, setFiltro] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('titulo');

  // Cargar libros al montar el componente
  useEffect(() => {
    loadLibros();
  }, [loadLibros]);

  const handleFiltroChange = (event: SelectChangeEvent) => {
    setFiltroTipo(event.target.value);
  };

  const librosFiltrados = libros.filter(libro => {
    if (!filtro.trim()) return true;
    
    const filtroLower = filtro.toLowerCase().trim();
    
    switch (filtroTipo) {
      case 'titulo':
        return libro.titulo.toLowerCase().includes(filtroLower);
      case 'autor':
        return libro.autor.toLowerCase().includes(filtroLower);
      case 'editorial':
        return libro.editorial.toLowerCase().includes(filtroLower);
      case 'estante':
        return libro.estante.toLowerCase().includes(filtroLower);
      case 'isbn':
        return libro.isbn ? libro.isbn.toLowerCase().includes(filtroLower) : false;
      default:
        return true;
    }
  });

  const handleEditarLibro = (id: number) => {
    navigate(`/libros/editar/${id}`);
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
        title="Gestión de libros"
        subtitle="Administra la ubicación de los libros de la biblioteca en este espacio."
        actionButton={
          <ActionButton
            label="Nuevo Libro"
            icon={<AddIcon />}
            onClick={() => navigate('/libros/nuevo')}
          />
        }
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
            placeholder="Buscar libros..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
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
              <MenuItem value="titulo">Filtrar por título</MenuItem>
              <MenuItem value="autor">Filtrar por autor</MenuItem>
              <MenuItem value="editorial">Filtrar por editorial</MenuItem>
              <MenuItem value="estante">Filtrar por estante</MenuItem>
              <MenuItem value="isbn">Filtrar por ISBN</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </PageHeader>

        {/* Lista de Libros */}
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
          {librosFiltrados.length === 0 ? (
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
                No se encontraron libros
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontSize: { xs: '14px', sm: '16px' },
                  fontWeight: 300
                }}
              >
                {filtro.trim() 
                  ? `No hay libros que coincidan con "${filtro}" en ${
                      filtroTipo === 'titulo' ? 'título' : 
                      filtroTipo === 'autor' ? 'autor' : 
                      filtroTipo === 'editorial' ? 'editorial' : 
                      filtroTipo === 'estante' ? 'estante' :
                      filtroTipo === 'isbn' ? 'ISBN' : 'campo seleccionado'
                    }`
                  : 'No hay libros registrados'
                }
              </Typography>
            </Box>
          ) : (
            librosFiltrados.map((libro) => (
            <Card
              key={libro.id}
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
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                width: '100%',
                minHeight: { xs: '220px', sm: '140px', md: '160px' },
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
              {/* Imagen del libro */}
              <Box
                sx={{
                  width: { xs: '60px', sm: '64px', md: '80px' },
                  height: { xs: '60px', sm: '64px', md: '80px' },
                  backgroundColor: '#f5eff7',
                  borderRadius: { xs: '6px', sm: '7px', md: '8px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  alignSelf: { xs: 'center', sm: 'flex-start' }
                }}
              >
                <BookIcon color="#999" width={32} height={32} />
              </Box>

              {/* Información del libro */}
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'center', sm: 'flex-start' },
                  width: { xs: '100%', sm: 'auto' },
                  textAlign: { xs: 'center', sm: 'left' },
                  gap: { xs: '8px', sm: '16px' }
                }}
              >
                {/* Columna izquierda - Información principal */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: '6px', sm: '4px' },
                    flex: 1,
                    minWidth: 0, // Para permitir text overflow
                    width: { xs: '100%', sm: 'auto' }
                  }}
                >
                  {/* Título */}
                  <Typography
                    sx={{
                      fontFamily: 'League Spartan',
                      fontWeight: 500,
                      fontSize: { xs: '16px', sm: '18px', md: '20px' },
                      color: '#000000',
                      letterSpacing: '0.1px',
                      lineHeight: '1.2',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: { xs: 'normal', sm: 'nowrap' },
                      maxWidth: '100%'
                    }}
                  >
                    {libro.titulo}
                  </Typography>

                  {/* Autor */}
                  <Typography
                    sx={{
                      fontFamily: 'League Spartan',
                      fontWeight: 400,
                      fontSize: { xs: '14px', sm: '15px', md: '15px' },
                      color: '#666666',
                      letterSpacing: '0.1px',
                      lineHeight: '1.2',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: { xs: 'normal', sm: 'nowrap' }
                    }}
                  >
                    {libro.autor}
                  </Typography>

                  {/* ISBN */}
                  {libro.isbn && (
                    <Typography
                      sx={{
                        fontFamily: 'League Spartan',
                        fontWeight: 400,
                        fontSize: { xs: '12px', sm: '13px', md: '14px' },
                        color: '#888888',
                        letterSpacing: '0.1px',
                        lineHeight: '1.2',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: { xs: 'normal', sm: 'nowrap' }
                      }}
                    >
                      ISBN: {libro.isbn}
                    </Typography>
                  )}

                  {/* Editorial */}
                  <Typography
                    sx={{
                      fontFamily: 'League Spartan',
                      fontWeight: 400,
                      fontSize: { xs: '13px', sm: '14px', md: '15px' },
                      color: '#888888',
                      letterSpacing: '0.1px',
                      lineHeight: '1.2',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: { xs: 'normal', sm: 'nowrap' }
                    }}
                  >
                    {libro.editorial}
                  </Typography>
                </Box>

                {/* Columna derecha - Estante y botón */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'row', sm: 'column' },
                    alignItems: { xs: 'center', sm: 'flex-end' },
                    justifyContent: { xs: 'space-between', sm: 'flex-start' },
                    gap: { xs: '20px', sm: '12px' },
                    width: { xs: '100%', sm: 'auto' },
                    minWidth: { sm: '140px', md: '160px' }
                  }}
                >
                  {/* Información del estante */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: { xs: 'flex-start', sm: 'flex-end' },
                      gap: '2px'
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'League Spartan',
                        fontWeight: 400,
                        fontSize: { xs: '12px', sm: '13px', md: '15px' },
                        color: '#000000',
                        letterSpacing: '0.1px',
                        lineHeight: '1.2',
                        margin: 0,
                        display: { xs: 'none', sm: 'block' }
                      }}
                    >
                      En Estante
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'League Spartan',
                        fontWeight: 500,
                        fontSize: { xs: '14px', sm: '14px', md: '14px' },
                        color: '#453726',
                        letterSpacing: '0.1px',
                        lineHeight: '1.2',
                        margin: 0
                      }}
                    >
                      {libro.estante}
                    </Typography>
                  </Box>

                  {/* Botón Editar */}
                  <Box
                    onClick={() => handleEditarLibro(libro.id)}
                    sx={{
                      backgroundColor: '#a47149',
                      color: '#ffffff',
                      borderRadius: { xs: '6px', sm: '7px', md: '8px' },
                      height: { xs: '32px', sm: '32px', md: '32px' },
                      width: { xs: 'auto', sm: 'auto' },
                      minWidth: { xs: '80px', sm: '85px', md: '92px' },
                      maxWidth: { xs: '120px', sm: 'none' },
                      boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      flexShrink: 0,
                      padding: '0 8px',
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
                        fontSize: { xs: '12px', sm: '13px', md: '15px' },
                        letterSpacing: '0.1px',
                        lineHeight: '1',
                        color: '#fff9ec',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Editar
                    </Typography>
                    <Edit width={14} height={14} color="#fff9ec" />
                  </Box>
                </Box>
              </Box>
            </Card>
            ))
          )}
        </Box>
    </Box>
  );
};

export default Libros;