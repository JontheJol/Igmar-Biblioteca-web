import '@fontsource/league-spartan/400.css';
import '@fontsource/league-spartan/500.css';
import '@fontsource/league-spartan/600.css';
import '@fontsource/rowdies/400.css';
import { 
  Box, 
  Typography, 
  TextField,
  Button,
  Alert
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Schema de validación específico para ISBN
const isbnSchema = yup.object({
  isbn: yup
    .string()
    .required('El ISBN es requerido')
    .matches(/^(?:\d{10}|\d{13}|97[89]\d{10})$/, 'El ISBN debe tener 10 o 13 dígitos'),
});

type ISBNFormData = yup.InferType<typeof isbnSchema>;

const NuevoLibroISBN: React.FC = () => {
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ISBNFormData>({
    resolver: yupResolver(isbnSchema)
  });

  const handleISBNSubmit = async (data: ISBNFormData) => {
    setIsValidating(true);
    setValidationError(null);

    try {
      // Simular validación de ISBN y llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navegar al formulario de libro con el ISBN
      navigate('/libros/nuevo/formulario', { 
        state: { isbn: data.isbn } 
      });
    } catch (error) {
      setValidationError('Error al validar el ISBN. Por favor, intenta nuevamente.');
    } finally {
      setIsValidating(false);
    }
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

        {/* Subtítulo centrado */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '40px'
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '28px', sm: '42px', md: '64px' },
              fontWeight: 400,
              color: '#453726',
              fontFamily: 'League Spartan, sans-serif',
              lineHeight: { xs: '32px', sm: '46px', md: '20px' },
              letterSpacing: '0.1px',
              textAlign: 'center'
            }}
          >
            Introduce el ISBN del libro
          </Typography>
        </Box>

        {/* Formulario centrado */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            width: '100%'
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit(handleISBNSubmit)}
            sx={{
              backgroundColor: '#e1c5ab',
              borderRadius: '10px',
              padding: { xs: '40px 25px', sm: '54px 27px' },
              width: { xs: '100%', sm: '465px' },
              maxWidth: '465px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '48px'
            }}
          >
            {/* Error de validación */}
            {validationError && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {validationError}
              </Alert>
            )}

            {/* Campo ISBN */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '48px',
                width: '100%',
                justifyContent: 'center'
              }}
            >
              {/* Label ISBN */}
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  fontSize: { xs: '20px', md: '24px' },
                  color: '#453726',
                  letterSpacing: '0.1px',
                  lineHeight: '20px',
                  flexShrink: 0
                }}
              >
                ISBN
              </Typography>

              {/* Campo de entrada */}
              <Controller
                name="isbn"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Ingresa el ISBN"
                    error={!!errors.isbn}
                    helperText={errors.isbn?.message}
                    sx={{
                      width: '207px',
                      '& .MuiOutlinedInput-root': {
                        height: '44px',
                        backgroundColor: '#fff9ec',
                        borderRadius: '10px',
                        fontFamily: 'League Spartan',
                        fontSize: { xs: '20px', md: '24px' },
                        fontWeight: 500,
                        color: '#453726',
                        letterSpacing: '0.1px',
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
                        textAlign: 'left',
                        padding: '0 16px',
                        '&::placeholder': {
                          color: '#453726',
                          opacity: 0.6,
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        fontFamily: 'League Spartan',
                        fontSize: '14px',
                        textAlign: 'center',
                        marginTop: '8px'
                      }
                    }}
                  />
                )}
              />
            </Box>

            {/* Botón Siguiente */}
            <Button
              type="submit"
              disabled={isValidating}
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
              {isValidating ? 'Validando...' : 'Siguiente'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NuevoLibroISBN;
