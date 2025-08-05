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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import BookIcon from '../assets/bookIcon';
import { Edit, StatsDownSquare } from 'iconoir-react';
import { Search as SearchIcon } from '@mui/icons-material';

const Libros: React.FC = () => {
  const navigate = useNavigate();
  const { libros } = useAppStore();
  const [filtro, setFiltro] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('titulo');

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
    <Box sx={{ backgroundColor: '#fff9ec', position: 'relative' }}>
      <Box
        sx={{
          padding: { xs: '24px', sm: '32px', md: '40px' },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Título */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '32px', sm: '48px', md: '64px' },
            fontWeight: 400,
            color: '#453726',
            fontFamily: 'Rowdies, sans-serif',
            marginBottom: { xs: '30px', md: '45px' },
            width: { xs: '100%', md: '859px' },
            lineHeight: { xs: '36px', sm: '52px', md: '20px' },
            letterSpacing: '0.1px'
          }}
        >
          Gestión de libros
        </Typography>

        {/* Subtítulo y botón alineados */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'flex-start' },
            justifyContent: { xs: 'flex-start', md: 'space-between' },
            marginBottom: { xs: '24px', md: '28px' },
            width: '100%',
            gap: { xs: 2, md: 3 }
          }}
        >
          {/* Subtítulo */}
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: { xs: '18px', sm: '20px', md: '24px' },
              color: '#4B453D',
              fontWeight: 400,
              fontFamily: 'League Spartan, sans-serif',
              lineHeight: '20px',
              letterSpacing: '0.1px',
              flex: { md: 1 },
              order: { xs: 1, md: 1 }
            }}
          >
            Administra la ubicación de los libros de la biblioteca en este espacio.
          </Typography>

          {/* Botón Nuevo Libro */}
          <Box
            onClick={() => navigate('/libros/nuevo')}
            sx={{
              backgroundColor: '#2f5232',
              color: '#fff9ec',
              borderRadius: '8px',
              height: { xs: '38px', md: '44px' },
              minWidth: { xs: '140px', md: '160px' },
              boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              order: { xs: 2, md: 2 },
              '&:hover': {
                backgroundColor: '#254428',
              }
            }}
          >
            <Typography
              sx={{
                fontFamily: 'League Spartan',
                fontWeight: 500,
                fontSize: { xs: '16px', md: '18px' },
                letterSpacing: '0.1px',
                lineHeight: '1',
                whiteSpace: 'nowrap'
              }}
            >
              Nuevo Libro
            </Typography>
          </Box>
        </Box>

        {/* Línea divisoria */}
        <Box
          sx={{
            width: '100%',
            height: 0,
            borderTop: '3px solid #3A332A',
            marginBottom: { xs: '20px', md: '24px' }
          }}
        />

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

        {/* Lista de Libros */}
        <Box
          sx={{
            backgroundColor: 'rgba(225,197,171,0.8)',
            borderRadius: '10px',
            padding: { xs: '20px 12px', sm: '24px 16px', md: '28px 20px' },
            width: '100%',
            maxHeight: { xs: 'calc(100vh - 400px)', sm: '950px', md: '600px' },
            minHeight: { xs: '450px', sm: '550px' },
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: '18px', sm: '22px', md: '26px' },
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
                backgroundColor: '#fef7ff',
                borderRadius: '10px',
                padding: { xs: '16px', sm: '20px', md: '24px' },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                width: '100%',
                minHeight: { xs: '220px', sm: '140px', md: '160px' },
                boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                gap: { xs: '16px', sm: '20px', md: '24px' },
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Imagen del libro */}
              <Box
                sx={{
                  width: { xs: '60px', sm: '64px', md: '80px' },
                  height: { xs: '60px', sm: '64px', md: '80px' },
                  backgroundColor: '#ece6f0',
                  borderRadius: '8px',
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
                      borderRadius: '8px',
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
    </Box>
  );
};

export default Libros;