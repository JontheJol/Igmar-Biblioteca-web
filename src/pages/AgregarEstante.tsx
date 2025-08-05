import '@fontsource/league-spartan/400.css';
import '@fontsource/league-spartan/500.css';
import '@fontsource/league-spartan/600.css';
import '@fontsource/rowdies/400.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button,
  Card,
  FormHelperText
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppStore } from '../store/appStore';
import { estanteSchema } from '../utils/validation';
import type { EstanteFormData } from '../utils/validation';

const AgregarEstante: React.FC = () => {
  const navigate = useNavigate();
  const { addEstante } = useAppStore(); // Solo necesitamos addEstante

  const { control, handleSubmit, formState: { errors } } = useForm<EstanteFormData>({
    resolver: yupResolver(estanteSchema),
    defaultValues: {
      ubicacion: '',
      fila: '',
      columna: '',
    },
  });

  const onSubmit = async (values: EstanteFormData) => {
    try {
      // Generar automáticamente el nombre del estante basado en ubicación + fila + columna
      const nombreGenerado = `${values.ubicacion}${values.fila}${values.columna}`;
      
      // Agregar el estante con datos básicos
      const estanteData = {
        ...values,
        nombre: nombreGenerado,
        etiquetas: [], // Por ahora etiquetas vacías
        cantidadLibros: 0,
        espaciosDisponibles: 35, // Espacios por defecto
      };

      addEstante(estanteData);
      
      // El store ya muestra la notificación automáticamente
      navigate('/estantes');
    } catch (error) {
      // En caso de error, podrías manejar aquí si es necesario
      console.error('Error al agregar estante:', error);
      navigate('/estantes');
    }
  };

  const handleCancelar = () => {
    navigate('/estantes');
  };

  const handleEditarEtiquetas = () => {
    // Función para manejar la edición de etiquetas (implementar más tarde)
    console.log('Editar etiquetas - por implementar');
  };

  return (
    <Box sx={{ backgroundColor: '#fff9ec', minHeight: '100vh', position: 'relative' }}>
      <Box
        sx={{
          padding: { xs: 3, sm: 4 },
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
            marginBottom: { xs: '20px', md: '35px' },
            width: { xs: '100%', md: '859px' },
            lineHeight: { xs: '36px', sm: '52px', md: '70px' },
            letterSpacing: '0.1px'
          }}
        >
          Nuevo estante
        </Typography>

        {/* Línea divisoria */}
        <Box
          sx={{
            width: { xs: '100%', md: '859px' },
            height: 0,
            borderTop: '3px solid #3A332A',
            marginBottom: '40px'
          }}
        />

        {/* Contenedor principal */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: '20px', md: '24px' },
            maxWidth: '1200px',
            width: '100%'
          }}
        >
          {/* Panel izquierdo - Estante virtual */}
          <Card
            sx={{
              backgroundColor: 'rgba(225,197,171,0.8)',
              borderRadius: '10px',
              padding: { xs: '20px', md: '24px' },
              width: { xs: '100%', md: '65%' },
              height: '560px',
              order: { xs: 2, md: 1 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* Título */}
            <Typography
              sx={{
                fontFamily: 'League Spartan',
                fontWeight: 600,
                fontSize: { xs: '28px', md: '32px' },
                color: '#453726',
                textAlign: 'center',
                marginBottom: '24px',
                lineHeight: '20px',
                letterSpacing: '0.1px'
              }}
            >
              Estante virtual
            </Typography>

            {/* Imagen/representación del estante */}
            <Box
              sx={{
                backgroundColor: '#f5eff7',
                borderRadius: '8px',
                width: { xs: '280px', md: '100%' },
                height: { xs: '280px', md: '371px' },
                maxWidth: '450px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                maxHeight: '371px',
                position: 'relative'
              }}
            >
              {/* Iconos/formas decorativas para representar un estante */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                  opacity: 0.3
                }}
              >
                <Box
                  sx={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#B8A9C9',
                    borderRadius: '50% 50% 50% 10px',
                    transform: 'rotate(-45deg)'
                  }}
                />
                <Box
                  sx={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#B8A9C9',
                    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                  }}
                />
                <Box
                  sx={{
                    width: '90px',
                    height: '70px',
                    backgroundColor: '#B8A9C9',
                    borderRadius: '10px'
                  }}
                />
              </Box>
            </Box>

            {/* Botones de acción */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: { xs: '20px', md: '40px' },
                marginTop: '24px',
                paddingTop: '16px'
              }}
            >
              <Button
                onClick={handleCancelar}
                sx={{
                  backgroundColor: '#3a332a',
                  color: '#fff9ec',
                  borderRadius: '8px',
                  height: '38px',
                  width: '145px',
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  fontSize: '20px',
                  letterSpacing: '0.1px',
                  lineHeight: '20px',
                  textTransform: 'none',
                  boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
                  '&:hover': {
                    backgroundColor: '#2d2620',
                  }
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="estante-form"
                sx={{
                  backgroundColor: '#2f5232',
                  color: '#fff9ec',
                  borderRadius: '8px',
                  height: '38px',
                  width: '145px',
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  fontSize: '20px',
                  letterSpacing: '0.1px',
                  lineHeight: '20px',
                  textTransform: 'none',
                  boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
                  '&:hover': {
                    backgroundColor: '#234026',
                  }
                }}
              >
                Guardar
              </Button>
            </Box>
          </Card>

          {/* Panel derecho - Datos del estante */}
          <Card
            sx={{
              backgroundColor: 'rgba(225,197,171,0.8)',
              borderRadius: '10px',
              padding: { xs: '20px', md: '24px' },
              width: { xs: '100%', md: '35%' },
              minWidth: { md: '320px' },
              height: '560px',
              order: { xs: 1, md: 2 },
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography
              sx={{
                fontFamily: 'League Spartan',
                fontWeight: 600,
                fontSize: '30px',
                color: '#453726',
                textAlign: 'center',
                marginBottom: '24px',
                lineHeight: '20px',
                letterSpacing: '0.1px'
              }}
            >
              Estante
            </Typography>

            <form id="estante-form" onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '20px',
                height: '100%',
                justifyContent: 'space-between'
              }}>
                {/* Campos del formulario */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* Ubicación */}
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: 'League Spartan',
                        fontWeight: 400,
                        fontSize: '24px',
                        color: '#453726',
                        marginBottom: '6px',
                        lineHeight: '20px',
                        letterSpacing: '0.1px'
                      }}
                    >
                      Ubicación:
                    </Typography>
                    <Controller
                      name="ubicacion"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          placeholder="A24"
                          error={Boolean(errors.ubicacion)}
                          sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#fff9ec',
                              borderRadius: '10px',
                              height: '44px',
                              fontFamily: 'League Spartan',
                              fontSize: '24px',
                              fontWeight: 500,
                              color: '#372c1e',
                              '& fieldset': {
                                border: 'none',
                              },
                              '&:hover fieldset': {
                                border: 'none',
                              },
                              '&.Mui-focused fieldset': {
                                border: '1px solid #2f5232',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              textAlign: 'center',
                            }
                          }}
                        />
                      )}
                    />
                    {errors.ubicacion && (
                      <FormHelperText error sx={{ fontFamily: 'League Spartan' }}>
                        {errors.ubicacion.message}
                      </FormHelperText>
                    )}
                  </Box>

                  {/* Fila */}
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: 'League Spartan',
                        fontWeight: 400,
                        fontSize: '24px',
                        color: '#3a332a',
                        marginBottom: '6px',
                        lineHeight: '20px',
                        letterSpacing: '0.1px'
                      }}
                    >
                      Fila:
                    </Typography>
                    <Controller
                      name="fila"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          placeholder="1"
                          error={Boolean(errors.fila)}
                          sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#fff9ec',
                              borderRadius: '10px',
                              height: '44px',
                              fontFamily: 'League Spartan',
                              fontSize: '24px',
                              fontWeight: 500,
                              color: '#453726',
                              '& fieldset': {
                                border: 'none',
                              },
                              '&:hover fieldset': {
                                border: 'none',
                              },
                              '&.Mui-focused fieldset': {
                                border: '1px solid #2f5232',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              textAlign: 'center',
                            }
                          }}
                        />
                      )}
                    />
                    {errors.fila && (
                      <FormHelperText error sx={{ fontFamily: 'League Spartan' }}>
                        {errors.fila.message}
                      </FormHelperText>
                    )}
                  </Box>

                  {/* Columna */}
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: 'League Spartan',
                        fontWeight: 400,
                        fontSize: '24px',
                        color: '#3a332a',
                        marginBottom: '6px',
                        lineHeight: '20px',
                        letterSpacing: '0.1px'
                      }}
                    >
                      Columna:
                    </Typography>
                    <Controller
                      name="columna"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          placeholder="1"
                          error={Boolean(errors.columna)}
                          sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#fff9ec',
                              borderRadius: '10px',
                              height: '44px',
                              fontFamily: 'League Spartan',
                              fontSize: '24px',
                              fontWeight: 500,
                              color: '#453726',
                              '& fieldset': {
                                border: 'none',
                              },
                              '&:hover fieldset': {
                                border: 'none',
                              },
                              '&.Mui-focused fieldset': {
                                border: '1px solid #2f5232',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              textAlign: 'center',
                            }
                          }}
                        />
                      )}
                    />
                    {errors.columna && (
                      <FormHelperText error sx={{ fontFamily: 'League Spartan' }}>
                        {errors.columna.message}
                      </FormHelperText>
                    )}
                  </Box>
                </Box>

                {/* Botón Editar Etiquetas */}
                <Box sx={{ marginTop: 'auto', paddingTop: '20px' }}>
                  <Button
                    onClick={handleEditarEtiquetas}
                    sx={{
                      backgroundColor: '#2f5232',
                      color: '#fff9ec',
                      borderRadius: '8px',
                      height: '38px',
                      width: '100%',
                      fontFamily: 'League Spartan',
                      fontWeight: 500,
                      fontSize: '20px',
                      letterSpacing: '0.1px',
                      lineHeight: '20px',
                      textTransform: 'none',
                      boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
                      '&:hover': {
                        backgroundColor: '#234026',
                      }
                    }}
                  >
                    Agregar Etiquetas
                  </Button>
                </Box>
              </Box>
            </form>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default AgregarEstante;
