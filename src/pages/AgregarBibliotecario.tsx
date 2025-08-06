import '@fontsource/league-spartan/400.css';
import '@fontsource/league-spartan/500.css';
import '@fontsource/rowdies/400.css';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAppStore } from '../store/appStore';
import { registroBibliotecarioSchema, type RegistroBibliotecarioFormData } from '../utils/validation';
import PageHeader from '../components/PageHeader';
import NotificationDialog from '../components/NotificationDialog';

const AgregarBibliotecario: React.FC = () => {
  const navigate = useNavigate();
  const { addBibliotecario, error, notification, hideNotification } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);

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
    formState: { errors, isSubmitting }
  } = useForm<RegistroBibliotecarioFormData>({
    resolver: yupResolver(registroBibliotecarioSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      curp: '',
      rfc: '',
      password: ''
    }
  });

  const handleFormSubmit = (data: RegistroBibliotecarioFormData) => {
    // Convert registration data to bibliotecario format
    const bibliotecarioData = {
      nombre: `${data.firstName} ${data.lastName}`,
      correo: data.email,
      numeroTelefono: data.phone
    };
    
    addBibliotecario(bibliotecarioData);
    navigate('/bibliotecarios');
  };

  const handleCancel = () => {
    navigate('/bibliotecarios');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      overflow: 'hidden',
      padding: { xs: '0.125rem', sm: '0.25rem', md: '0.5rem', lg: '1rem' }
    }}>
      <PageHeader
        title="Añadir bibliotecario"
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
          Ingresa los siguientes datos para registrar al nuevo bibliotecario
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

            {/* Contraseña */}
            <Box>
              <Typography sx={commonLabelStyles}>
                Contraseña
              </Typography>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={togglePasswordVisibility}
                              edge="end"
                              sx={{ 
                                color: '#453726',
                                '&:hover': { backgroundColor: 'rgba(69,55,38,0.1)' }
                              }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={commonFieldStyles}
                  />
                )}
              />
            </Box>
          </Box>

          {/* Right Column */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: '0.5rem', sm: '0.75rem', md: '1rem' } }}>
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
            {isSubmitting ? 'Registrando...' : 'Registrar'}
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

export default AgregarBibliotecario;
