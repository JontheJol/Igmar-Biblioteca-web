import '@fontsource/league-spartan/400.css';
import '@fontsource/league-spartan/500.css';
import '@fontsource/league-spartan/600.css';
import '@fontsource/rowdies/400.css';
import { 
  Box, 
  Typography, 
  TextField,
  Button,
  Alert,
  Select,
  MenuItem,
  FormControl,
  FormHelperText
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppStore } from '../store/appStore';
import BookIcon from '../assets/bookIcon';

// Schema específico para este formulario
const nuevoLibroSchema = yup.object({
  titulo: yup.string().required('El título es requerido'),
  autor: yup.string().required('El autor es requerido'),
  editorial: yup.string().required('La editorial es requerida'),
  isbn: yup.string().required('El ISBN es requerido'),
  fechaPublicacion: yup.string().required('La fecha de publicación es requerida'),
  estado: yup.string().required('El estado es requerido').oneOf(['Disponible', 'No disponible', 'Prestado']),
  estante: yup.string().required('El estante es requerido'),
  fila: yup.string().required('La fila es requerida'),
  columna: yup.string().required('La columna es requerida'),
  copias: yup.string().required('El número de copias es requerido'),
});

type NuevoLibroFormData = yup.InferType<typeof nuevoLibroSchema>;

const NuevoLibroFormulario: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addLibro, libroError, libroLoading } = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get ISBN from navigation state
  const { isbn } = location.state || {};

  // Mock data that would come from ISBN API
  const mockBookData = {
    titulo: 'El Quijote de la Mancha',
    autor: 'Miguel de Cervantes',
    editorial: 'Editorial Planeta',
    fechaPublicacion: '1605-01-16',
    descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut magna nisi, vulputate vitae sapien vitae, laoreet pharetra justo. Duis fringilla non nisi eu viverra. Nullam in aliquam arcu. Donec sodales eu tellus ac finibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer placerat consectetur bibendum.',
    imagen: 'placeholder'
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<NuevoLibroFormData>({
    resolver: yupResolver(nuevoLibroSchema),
    defaultValues: {
      titulo: mockBookData.titulo,
      autor: mockBookData.autor,
      editorial: mockBookData.editorial,
      isbn: isbn || '',
      fechaPublicacion: mockBookData.fechaPublicacion,
      estante: 'A12',
      fila: '2',
      columna: '3',
      estado: 'Disponible',
      copias: '1'
    }
  });

  // Pre-fill form if ISBN data is available
  useEffect(() => {
    if (isbn) {
      setValue('isbn', isbn);
      setValue('titulo', mockBookData.titulo);
      setValue('autor', mockBookData.autor);
      setValue('editorial', mockBookData.editorial);
    }
  }, [isbn, setValue]);

  const handleFormSubmit = async (data: NuevoLibroFormData) => {
    setIsSubmitting(true);
    
    try {
      // Convert form data to Libro format
      const newLibro = {
        titulo: data.titulo,
        autor: data.autor,
        editorial: data.editorial,
        isbn: data.isbn,
        fechaPublicacion: data.fechaPublicacion,
        estado: data.estado,
        estante: data.estante,
        fila: data.fila,
        columna: data.columna,
        descripcion: mockBookData.descripcion,
        imagen: mockBookData.imagen
      };
      
      addLibro(newLibro);
      
      // Navigate back to books list
      navigate('/libros');
    } catch (error) {
      console.error('Error creating book:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/libros');
  };

  // Available options for dropdowns
  const estanteOptions = ['A12', 'A13', 'B15', 'B16', 'C08', 'D12', 'E05', 'F03', 'G11', 'H07', 'I19'];
  const etiquetaOptions = ['Sin etiqueta', 'Ficción', 'No ficción', 'Ciencia', 'Historia', 'Literatura'];
  const filaOptions = ['1', '2', '3', '4', '5'];
  const columnaOptions = ['1', '2', '3', '4', '5'];

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
            lineHeight: { xs: '36px', sm: '52px', md: '20px' },
            letterSpacing: '0.1px'
          }}
        >
          Nuevo Libro
        </Typography>

        {/* Línea divisoria */}
        <Box
          sx={{
            width: '100%',
            height: 0,
            borderTop: '3px solid #3A332A',
            marginBottom: '40px'
          }}
        />

        {/* Error alert */}
        {libroError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {libroError}
          </Alert>
        )}

        {/* Main content container */}
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
            flexDirection: { xs: 'column', lg: 'row' },
            justifyContent: 'center',
            alignItems: 'stretch',
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          {/* Left panel - Book data form */}
          <Box
            component="form"
            onSubmit={handleSubmit(handleFormSubmit)}
            sx={{
              backgroundColor: '#e1c5ab',
              borderRadius: '10px',
              padding: '24px',
              width: { xs: '100%', lg: '700px' },
              maxWidth: '700px',
              minHeight: '560px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Book info header */}
            <Box
              sx={{
                backgroundColor: '#fff9ec',
                borderRadius: '20px',
                padding: '20px',
                marginBottom: '20px',
                minHeight: '211px',
                display: 'flex',
                gap: { xs: '15px', sm: '20px' },
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'flex-start' }
              }}
            >
              {/* Book image placeholder */}
              <Box
                sx={{
                  backgroundColor: '#ece6f0',
                  borderRadius: '8px',
                  width: { xs: '120px', sm: '177px' },
                  height: { xs: '120px', sm: '177px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <BookIcon 
                  width={80} 
                  height={80} 
                  color="#999" 
                />
              </Box>

              {/* Book title, author, ISBN */}
              <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: { xs: 'center', sm: 'space-around' },
                alignItems: { xs: 'center', sm: 'flex-start' },
                gap: { xs: '8px', sm: '15px' },
                textAlign: { xs: 'center', sm: 'left' }
              }}>
                <Typography
                  sx={{
                    fontFamily: 'League Spartan',
                    fontWeight: 600,
                    fontSize: { xs: '24px', sm: '28px', md: '32px' },
                    color: '#453726',
                    letterSpacing: '0.1px',
                    lineHeight: { xs: '28px', sm: '32px', md: '36px' }
                  }}
                >
                  {mockBookData.titulo}
                </Typography>
                
                <Typography
                  sx={{
                    fontFamily: 'League Spartan',
                    fontWeight: 500,
                    fontSize: { xs: '18px', sm: '20px', md: '24px' },
                    color: '#453726',
                    letterSpacing: '0.1px',
                    lineHeight: { xs: '22px', sm: '24px', md: '28px' }
                  }}
                >
                  {mockBookData.autor}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: 'League Spartan',
                    fontWeight: 500,
                    fontSize: { xs: '16px', sm: '18px', md: '20px' },
                    color: '#453726',
                    letterSpacing: '0.1px',
                    lineHeight: { xs: '20px', sm: '22px', md: '24px' },
                    opacity: 0.8
                  }}
                >
                  ISBN: {isbn}
                </Typography>
              </Box>
            </Box>

            {/* Form fields grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '23px',
                marginBottom: '30px',
                flex: 1
              }}
            >
              {/* Estante */}
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: '24px',
                  color: '#3a332a',
                  letterSpacing: '0.1px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Estante:
              </Typography>
              <Controller
                name="estante"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors.estante} sx={{ width: '206px' }}>
                    <Select
                      {...field}
                      displayEmpty
                      sx={{
                        backgroundColor: '#fff9ec',
                        borderRadius: '10px',
                        height: '35px',
                        fontFamily: 'League Spartan',
                        fontSize: '20px',
                        fontWeight: 300,
                        color: '#000000',
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid rgba(69,55,38,0.15)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid rgba(69,55,38,0.3)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          border: '2px solid #453726',
                        }
                      }}
                    >
                      {estanteOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.estante && (
                      <FormHelperText>{errors.estante.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              {/* N° de copias */}
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: '24px',
                  color: '#3a332a',
                  letterSpacing: '0.1px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                N° de copias:
              </Typography>
              <Controller
                name="copias"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="1"
                    error={!!errors.copias}
                    helperText={errors.copias?.message}
                    sx={{
                      width: '206px',
                      '& .MuiOutlinedInput-root': {
                        height: '35px',
                        backgroundColor: '#fff9ec',
                        borderRadius: '10px',
                        fontFamily: 'League Spartan',
                        fontSize: '20px',
                        fontWeight: 300,
                        color: '#000000',
                        '& fieldset': {
                          border: '1px solid rgba(69,55,38,0.15)',
                        },
                        '&:hover fieldset': {
                          border: '1px solid rgba(69,55,38,0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          border: '2px solid #453726',
                        },
                      },
                      '& .MuiInputBase-input': {
                        padding: '0 17px',
                      }
                    }}
                  />
                )}
              />

              {/* Etiqueta */}
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: '24px',
                  color: '#3a332a',
                  letterSpacing: '0.1px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Etiqueta:
              </Typography>
              <Controller
                name="estado"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors.estado} sx={{ width: '206px' }}>
                    <Select
                      {...field}
                      displayEmpty
                      sx={{
                        backgroundColor: '#fff9ec',
                        borderRadius: '10px',
                        height: '35px',
                        fontFamily: 'League Spartan',
                        fontSize: '20px',
                        fontWeight: 300,
                        color: '#000000',
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid rgba(69,55,38,0.15)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid rgba(69,55,38,0.3)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          border: '2px solid #453726',
                        }
                      }}
                    >
                      {etiquetaOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.estado && (
                      <FormHelperText>{errors.estado.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              {/* Fila */}
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: '24px',
                  color: '#3a332a',
                  letterSpacing: '0.1px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Fila:
              </Typography>
              <Controller
                name="fila"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors.fila} sx={{ width: '206px' }}>
                    <Select
                      {...field}
                      displayEmpty
                      sx={{
                        backgroundColor: '#fff9ec',
                        borderRadius: '10px',
                        height: '35px',
                        fontFamily: 'League Spartan',
                        fontSize: '20px',
                        fontWeight: 300,
                        color: '#000000',
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid rgba(69,55,38,0.15)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid rgba(69,55,38,0.3)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          border: '2px solid #453726',
                        }
                      }}
                    >
                      {filaOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.fila && (
                      <FormHelperText>{errors.fila.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              {/* Columna */}
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: '24px',
                  color: '#3a332a',
                  letterSpacing: '0.1px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Columna:
              </Typography>
              <Controller
                name="columna"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors.columna} sx={{ width: '206px' }}>
                    <Select
                      {...field}
                      displayEmpty
                      sx={{
                        backgroundColor: '#fff9ec',
                        borderRadius: '10px',
                        height: '35px',
                        fontFamily: 'League Spartan',
                        fontSize: '20px',
                        fontWeight: 300,
                        color: '#000000',
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid rgba(69,55,38,0.15)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid rgba(69,55,38,0.3)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          border: '2px solid #453726',
                        }
                      }}
                    >
                      {columnaOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.columna && (
                      <FormHelperText>{errors.columna.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            {/* Action buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: '65px',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 'auto',
                paddingTop: '20px'
              }}
            >
              {/* Cancel button */}
              <Button
                onClick={handleCancel}
                disabled={isSubmitting}
                sx={{
                  backgroundColor: '#3a332a',
                  color: '#fff9ec',
                  borderRadius: '8px',
                  height: '38px',
                  width: '145px',
                  boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  fontSize: '20px',
                  letterSpacing: '0.1px',
                  lineHeight: '20px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#2a251e',
                  },
                  '&:disabled': {
                    backgroundColor: '#999',
                    color: '#fff',
                  }
                }}
              >
                Cancelar
              </Button>

              {/* Save button */}
              <Button
                type="submit"
                disabled={isSubmitting || libroLoading}
                sx={{
                  backgroundColor: '#2f5232',
                  color: '#fff9ec',
                  borderRadius: '8px',
                  height: '38px',
                  width: '145px',
                  boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  fontSize: '20px',
                  letterSpacing: '0.1px',
                  lineHeight: '20px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#254428',
                  },
                  '&:disabled': {
                    backgroundColor: '#999',
                    color: '#fff',
                  }
                }}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </Button>
            </Box>
          </Box>

          {/* Right panel - Description */}
          <Box
            sx={{
              backgroundColor: '#e1c5ab',
              borderRadius: '10px',
              padding: '24px',
              width: { xs: '100%', lg: '400px' },
              maxWidth: '400px',
              minHeight: '560px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Description title */}
            <Typography
              sx={{
                fontFamily: 'League Spartan',
                fontWeight: 600,
                fontSize: '30px',
                color: '#453726',
                letterSpacing: '0.1px',
                lineHeight: '20px',
                textAlign: 'center',
                marginBottom: '20px'
              }}
            >
              Descripcion
            </Typography>

            {/* Description content */}
            <Box
              sx={{
                backgroundColor: '#fff9ec',
                borderRadius: '10px',
                padding: '24px',
                flex: 1,
                minHeight: '200px',
                maxHeight: '400px',
                overflow: 'auto',
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#3a332a',
                  letterSpacing: '0.1px',
                  lineHeight: '28px',
                  textAlign: 'justify'
                }}
              >
                {mockBookData.descripcion}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NuevoLibroFormulario;
