import '@fontsource/league-spartan/400.css';
import '@fontsource/league-spartan/500.css';
import '@fontsource/rowdies/400.css';
import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { editarBibliotecarioSchema, type EditarBibliotecarioFormData } from '../utils/validation';
import PageHeader from '../components/PageHeader';
import NotificationDialog from '../components/NotificationDialog';

const EditarBibliotecario: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { bibliotecarios, updateBibliotecario, error, notification, hideNotification } = useAppStore();

  // Buscar el bibliotecario por ID
  const bibliotecario = bibliotecarios.find(b => b.id === Number(id));

  // Estilos comunes para los campos
  const commonFieldStyles = {
    '& .MuiOutlinedInput-root': {
      height: { xs: '1.75rem', sm: '2rem', md: '2.25rem', lg: '2.5rem' },
      backgroundColor: '#fff9ec',
      borderRadius: '0.625rem',
      fontFamily: 'League Spartan',
      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
      fontWeight: 400,
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
    '& .MuiFormHelperText-root': {
      fontFamily: 'League Spartan',
      fontSize: { xs: '0.5rem', sm: '0.625rem', md: '0.75rem' },
      margin: '0.1rem 0 0 0'
    }
  };

  const commonLabelStyles = {
    fontFamily: 'League Spartan',
    fontWeight: 400,
    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem' },
    color: '#453726',
    marginBottom: { xs: '0.125rem', sm: '0.25rem' }
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<EditarBibliotecarioFormData>({
    resolver: yupResolver(editarBibliotecarioSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      curp: '',
      rfc: '',
      email: '',
      estado: 'Activo'
    }
  });

  // Cargar datos del bibliotecario cuando se encuentra
  useEffect(() => {
    if (bibliotecario) {
      const [firstName, ...lastNameParts] = bibliotecario.nombre.split(' ');
      const lastName = lastNameParts.join(' ');
      
      reset({
        firstName: firstName || '',
        lastName: lastName || '',
        phone: bibliotecario.numeroTelefono || '',
        curp: '', // No tenemos CURP en el modelo actual
        rfc: '', // No tenemos RFC en el modelo actual
        email: bibliotecario.correo || '',
        estado: 'Activo' // Estado por defecto
      });
    }
  }, [bibliotecario, reset]);

  const handleFormSubmit = (data: EditarBibliotecarioFormData) => {
    if (!bibliotecario) return;
    
    // Convertir datos del formulario al formato del bibliotecario
    const bibliotecarioData = {
      id: bibliotecario.id,
      nombre: `${data.firstName} ${data.lastName}`,
      correo: data.email,
      numeroTelefono: data.phone
    };
    
    updateBibliotecario(bibliotecario.id, bibliotecarioData);
    navigate('/bibliotecarios');
  };

  const handleCancel = () => {
    navigate('/bibliotecarios');
  };

  // Si no se encuentra el bibliotecario, mostrar error
  if (!bibliotecario) {
    return (
      <Box sx={{ 
        backgroundColor: '#fff9ec', 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <Alert severity="error" sx={{ maxWidth: '500px' }}>
          No se encontró el bibliotecario con ID {id}
        </Alert>
        <Button 
          onClick={() => navigate('/bibliotecarios')}
          sx={{ marginTop: '1rem' }}
        >
          Volver a Bibliotecarios
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: '#fff9ec', 
      position: 'relative', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      overflow: 'hidden',
      padding: { xs: '0.125rem', sm: '0.25rem', md: '0.5rem', lg: '1rem' }
    }}>
      <PageHeader
        title="Editar bibliotecario"
        subtitle=""
      />

      {/* Form Container */}
      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{
          backgroundColor: 'rgba(225,197,171,0.8)',
          borderRadius: '1rem',
          padding: { 
            xs: '0.5rem 0.375rem', 
            sm: '1rem 0.75rem', 
            md: '1.25rem 1rem',
            lg: '1.5rem 1.25rem'
          },
          width: '100%',
          maxWidth: { 
            xs: '100%', 
            sm: '95%', 
            md: '90%', 
            lg: '85%',
            xl: '80%'
          },
          maxHeight: '70vh',
          margin: '0 auto',
          marginBottom: { xs: '0.5rem', sm: '0.75rem', md: '1rem', lg: '1.25rem' },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: '0.375rem', sm: '0.75rem', md: '1rem' },
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Subtitle */}
        <Typography
          sx={{
            fontFamily: 'League Spartan',
            fontWeight: 500,
            fontSize: { xs: '1rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' },
            color: '#fff9ec',
            textAlign: 'center',
            lineHeight: { xs: 1.2, sm: 1.35, md: 1.3, lg: 1.25 },
            marginBottom: { xs: '0.5rem', sm: '1rem', md: '1.25rem' },
            padding: { xs: '0.125rem', sm: '0.5rem', md: '0.75rem' }
          }}
        >
          Edita los datos del bibliotecario seleccionado
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              marginBottom: '0.5rem',
              '& .MuiAlert-message': {
                fontFamily: 'League Spartan',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }
            }}
          >
            {error}
          </Alert>
        )}

        {/* Form Fields Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr 1fr' },
            gap: { xs: '0.5rem', sm: '1rem', md: '1.25rem' },
            alignItems: 'start',
            flex: 1
          }}
        >
          {/* Left Column */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: '0.5rem', sm: '0.75rem', md: '1rem' } }}>
            {/* Nombre(s) */}
            <Box>
              <Typography sx={commonLabelStyles}>
                Nombre(s)
              </Typography>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Box>

            {/* Apellidos */}
            <Box>
              <Typography sx={commonLabelStyles}>
                Apellidos
              </Typography>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Box>

            {/* Celular */}
            <Box>
              <Typography sx={commonLabelStyles}>
                Celular
              </Typography>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="tel"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Box>

            {/* Estado */}
            <Box>
              <Typography sx={commonLabelStyles}>
                Estado
              </Typography>
              <Controller
                name="estado"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.estado}>
                    <Select
                      {...field}
                      sx={{
                        ...commonFieldStyles['& .MuiOutlinedInput-root'],
                        '& .MuiSelect-select': {
                          fontFamily: 'League Spartan',
                          fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                          color: '#453726',
                        }
                      }}
                    >
                      <MenuItem value="Activo" sx={{ fontFamily: 'League Spartan' }}>
                        Activo
                      </MenuItem>
                      <MenuItem value="Inactivo" sx={{ fontFamily: 'League Spartan' }}>
                        Inactivo
                      </MenuItem>
                    </Select>
                    {errors.estado && (
                      <Typography 
                        sx={{
                          color: '#d32f2f',
                          fontFamily: 'League Spartan',
                          fontSize: { xs: '0.5rem', sm: '0.625rem', md: '0.75rem' },
                          margin: '0.1rem 0 0 0'
                        }}
                      >
                        {errors.estado.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Box>
          </Box>

          {/* Right Column */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: '0.5rem', sm: '0.75rem', md: '1rem' } }}>
            {/* Correo electrónico */}
            <Box>
              <Typography sx={commonLabelStyles}>
                Correo electrónico
              </Typography>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Box>

            {/* CURP */}
            <Box>
              <Typography sx={commonLabelStyles}>
                CURP
              </Typography>
              <Controller
                name="curp"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    error={!!errors.curp}
                    helperText={errors.curp?.message}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Box>

            {/* RFC */}
            <Box>
              <Typography sx={commonLabelStyles}>
                RFC
              </Typography>
              <Controller
                name="rfc"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    error={!!errors.rfc}
                    helperText={errors.rfc?.message}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Box>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: '0.5rem', sm: '0.75rem', md: '1rem' },
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: { xs: '0.5rem', sm: '0.75rem', md: '1rem' }
          }}
        >
          {/* Cancel Button */}
          <Button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            sx={{
              backgroundColor: '#3a332a',
              color: '#fff9ec',
              fontFamily: 'League Spartan',
              fontWeight: 500,
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem' },
              textTransform: 'none',
              borderRadius: '0.5rem',
              padding: { xs: '0.375rem 0.75rem', sm: '0.5rem 1rem', md: '0.625rem 1.25rem', lg: '0.75rem 1.5rem' },
              minWidth: { xs: '6rem', sm: '7.5rem', md: '8.75rem', lg: '10rem' },
              height: { xs: '1.75rem', sm: '2rem', md: '2.25rem', lg: '2.5rem' },
              boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
              '&:hover': {
                backgroundColor: '#2d2520',
                boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.3), 0px 2px 6px 2px rgba(0,0,0,0.15)',
              },
              '&:disabled': {
                backgroundColor: '#6d6d6d',
                color: 'rgba(255,249,236,0.6)'
              }
            }}
          >
            Cancelar
          </Button>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            sx={{
              backgroundColor: '#2f5232',
              color: '#fff9ec',
              fontFamily: 'League Spartan',
              fontWeight: 600,
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem' },
              textTransform: 'none',
              borderRadius: '0.625rem',
              padding: { xs: '0.375rem 0.75rem', sm: '0.5rem 1rem', md: '0.625rem 1.25rem', lg: '0.75rem 1.5rem' },
              minWidth: { xs: '6rem', sm: '7.5rem', md: '8.75rem', lg: '10rem' },
              height: { xs: '1.75rem', sm: '2rem', md: '2.25rem', lg: '2.5rem' },
              '&:hover': {
                backgroundColor: '#254428',
              },
              '&:disabled': {
                backgroundColor: '#6d6d6d',
                color: 'rgba(255,249,236,0.6)'
              }
            }}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </Box>
      </Box>

      {/* Notification Dialog */}
      <NotificationDialog
        open={!!notification}
        notification={notification}
        onClose={hideNotification}
      />
    </Box>
  );
};

export default EditarBibliotecario;
