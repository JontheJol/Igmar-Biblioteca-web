import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { bibliotecarioSchema, type BibliotecarioFormData } from '../utils/validation';
import type { Bibliotecario } from '../types';

interface BibliotecarioFormProps {
  bibliotecario?: Bibliotecario;
  onSubmit: (data: BibliotecarioFormData) => void;
  error: string | null;
  loading: boolean;
  title: string;
}

const BibliotecarioForm: React.FC<BibliotecarioFormProps> = ({
  bibliotecario,
  onSubmit,
  error,
  loading,
  title
}) => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<BibliotecarioFormData>({
    resolver: yupResolver(bibliotecarioSchema),
    defaultValues: {
      nombre: bibliotecario?.nombre || '',
      correo: bibliotecario?.correo || '',
      numeroTelefono: bibliotecario?.numeroTelefono || ''
    }
  });

  const handleFormSubmit = (data: BibliotecarioFormData) => {
    onSubmit(data);
  };

  const handleCancel = () => {
    navigate('/bibliotecarios');
  };

  return (
    <Box sx={{ 
      backgroundColor: '#fff9ec', 
      minHeight: '100vh', 
      padding: { xs: 2, sm: 3, md: 4 },
      display: 'flex',
      alignItems: { xs: 'flex-start', md: 'center' },
      justifyContent: 'center'
    }}>
      <Box sx={{ 
        maxWidth: { xs: '100%', sm: '500px', md: '600px' }, 
        width: '100%',
        margin: '0 auto'
      }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '24px', sm: '32px', md: '40px', lg: '48px' },
            fontWeight: 400,
            color: '#453726',
            fontFamily: 'Rowdies, sans-serif',
            marginBottom: { xs: '16px', sm: '20px' },
            lineHeight: '1.2',
            textAlign: { xs: 'center', sm: 'left' },
            wordBreak: 'break-word'
          }}
        >
          {title}
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              marginBottom: 2,
              '& .MuiAlert-message': {
                fontSize: { xs: '14px', sm: '16px' }
              }
            }}
          >
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          sx={{
            backgroundColor: 'rgba(225,197,171,0.8)',
            borderRadius: '10px',
            padding: { xs: 2, sm: 3 },
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2, sm: 3 }
          }}
        >
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre completo"
                variant="outlined"
                fullWidth
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    fontFamily: 'League Spartan',
                    fontSize: { xs: '14px', sm: '16px' },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#a47149',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2f5233',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'League Spartan',
                    fontSize: { xs: '14px', sm: '16px' },
                    color: '#453726',
                    '&.Mui-focused': {
                      color: '#2f5233',
                    }
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: { xs: '12px', sm: '14px' }
                  }
                }}
              />
            )}
          />

          <Controller
            name="correo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Correo electrónico"
                type="email"
                variant="outlined"
                fullWidth
                error={!!errors.correo}
                helperText={errors.correo?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    fontFamily: 'League Spartan',
                    fontSize: { xs: '14px', sm: '16px' },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#a47149',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2f5233',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'League Spartan',
                    fontSize: { xs: '14px', sm: '16px' },
                    color: '#453726',
                    '&.Mui-focused': {
                      color: '#2f5233',
                    }
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: { xs: '12px', sm: '14px' }
                  }
                }}
              />
            )}
          />

          <Controller
            name="numeroTelefono"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Número de teléfono"
                type="tel"
                variant="outlined"
                fullWidth
                placeholder="Ej: 5551234567"
                error={!!errors.numeroTelefono}
                helperText={errors.numeroTelefono?.message || "Formato: 10 dígitos sin espacios ni guiones"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    fontFamily: 'League Spartan',
                    fontSize: { xs: '14px', sm: '16px' },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#a47149',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2f5233',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'League Spartan',
                    fontSize: { xs: '14px', sm: '16px' },
                    color: '#453726',
                    '&.Mui-focused': {
                      color: '#2f5233',
                    }
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: { xs: '12px', sm: '14px' }
                  }
                }}
              />
            )}
          />

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2, 
            justifyContent: 'flex-end',
            width: '100%'
          }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={loading}
              sx={{
                borderColor: '#a47149',
                color: '#a47149',
                fontFamily: 'League Spartan',
                fontWeight: 500,
                fontSize: { xs: '14px', sm: '16px' },
                borderRadius: '8px',
                padding: { xs: '10px 20px', sm: '8px 16px' },
                minHeight: { xs: '44px', sm: '40px' },
                '&:hover': {
                  borderColor: '#8b5e3c',
                  color: '#8b5e3c',
                  backgroundColor: 'rgba(164, 113, 73, 0.1)'
                }
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: '#2f5233',
                color: '#fff9ec',
                fontFamily: 'League Spartan',
                fontWeight: 500,
                fontSize: { xs: '14px', sm: '16px' },
                borderRadius: '8px',
                padding: { xs: '10px 20px', sm: '8px 16px' },
                minHeight: { xs: '44px', sm: '40px' },
                '&:hover': {
                  backgroundColor: '#234026'
                },
                '&:disabled': {
                  backgroundColor: 'rgba(47, 82, 51, 0.5)'
                }
              }}
            >
              {loading ? 'Guardando...' : (bibliotecario ? 'Actualizar' : 'Agregar')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BibliotecarioForm;
