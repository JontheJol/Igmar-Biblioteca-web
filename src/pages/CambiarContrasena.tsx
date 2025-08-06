import '@fontsource/league-spartan/400.css';
import '@fontsource/league-spartan/500.css';
import '@fontsource/league-spartan/600.css';
import '@fontsource/rowdies/400.css';
import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { cambioContrasenaSchema, type CambioContrasenaFormData } from '../utils/validation';
import { useAppStore } from '../store/appStore';
import PageHeader from '../components/PageHeader';
import NotificationDialog from '../components/NotificationDialog';

const CambiarContrasena: React.FC = () => {
  const navigate = useNavigate();
  const { 
    changePassword, 
    authLoading, 
    authError, 
    notification,
    hideNotification 
  } = useAppStore();
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CambioContrasenaFormData>({
    resolver: yupResolver(cambioContrasenaSchema),
    defaultValues: {
      contrasenaActual: '',
      nuevaContrasena: '',
      confirmarContrasena: '',
    },
  });

  const onSubmit = async (data: CambioContrasenaFormData) => {
    try {
      await changePassword(data.contrasenaActual, data.nuevaContrasena);
      reset();
      // Navigation after success is handled by the notification system
      setTimeout(() => {
        navigate('/admin-home');
      }, 2000);
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#fff9ec',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <PageHeader 
        title="Cambiar Contraseña" 
        subtitle="Actualiza tu contraseña de administrador"
      />
      
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: '20px', sm: '40px' },
        }}
      >
        <Card
          sx={{
            backgroundColor: '#e1c5ab',
            borderRadius: '10px',
            padding: { xs: '20px', sm: '40px' },
            width: '100%',
            maxWidth: '684px',
            height: '70vh',
            boxShadow: 'none',
          }}
        >
          <Card
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              backgroundColor: '#fff9ec',
              borderRadius: '10px',
              padding: { xs: '20px', sm: '30px' },
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              alignItems: 'center',
              boxShadow: 'none',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'League Spartan',
                fontWeight: 500,
                fontSize: '20px',
                color: '#453726',
                textAlign: 'center',
                maxWidth: '350px',
                lineHeight: 1.2,
              }}
            >
              Ingresa los siguientes datos para Cambiar Contraseña
            </Typography>

            {/* Current Password */}
            <Box sx={{ width: '100%', maxWidth: '350px' }}>
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: '20px',
                  color: '#4b453d',
                  mb: '8px',
                }}
              >
                Contraseña actual
              </Typography>
              <Controller
                name="contrasenaActual"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type={showCurrentPassword ? 'text' : 'password'}
                    fullWidth
                    error={!!errors.contrasenaActual}
                    helperText={errors.contrasenaActual?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            edge="end"
                            sx={{ color: '#4b453d' }}
                          >
                            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fff9ec',
                        borderRadius: '10px',
                        height: '42px',
                        border: '1px solid rgba(69,55,38,0.15)',
                        '& fieldset': {
                          border: 'none',
                        },
                        '&:hover fieldset': {
                          border: 'none',
                        },
                        '&.Mui-focused fieldset': {
                          border: 'none',
                        },
                        '&.Mui-error': {
                          border: '1px solid #d32f2f',
                        },
                      },
                      '& .MuiInputBase-input': {
                        fontFamily: 'League Spartan',
                        fontSize: '16px',
                        color: '#000000',
                        padding: '8px 16px',
                      },
                      '& .MuiFormHelperText-root': {
                        fontFamily: 'League Spartan',
                        fontSize: '14px',
                        marginLeft: 0,
                        marginTop: '4px',
                      },
                    }}
                  />
                )}
              />
            </Box>

            {/* New Password */}
            <Box sx={{ width: '100%', maxWidth: '350px' }}>
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: '20px',
                  color: '#4b453d',
                  mb: '8px',
                }}
              >
                Nueva contraseña
              </Typography>
              <Controller
                name="nuevaContrasena"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type={showNewPassword ? 'text' : 'password'}
                    fullWidth
                    error={!!errors.nuevaContrasena}
                    helperText={errors.nuevaContrasena?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                            sx={{ color: '#4b453d' }}
                          >
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fff9ec',
                        borderRadius: '10px',
                        height: '42px',
                        border: '1px solid rgba(69,55,38,0.15)',
                        '& fieldset': {
                          border: 'none',
                        },
                        '&:hover fieldset': {
                          border: 'none',
                        },
                        '&.Mui-focused fieldset': {
                          border: 'none',
                        },
                        '&.Mui-error': {
                          border: '1px solid #d32f2f',
                        },
                      },
                      '& .MuiInputBase-input': {
                        fontFamily: 'League Spartan',
                        fontSize: '16px',
                        color: '#000000',
                        padding: '8px 16px',
                      },
                      '& .MuiFormHelperText-root': {
                        fontFamily: 'League Spartan',
                        fontSize: '14px',
                        marginLeft: 0,
                        marginTop: '4px',
                      },
                    }}
                  />
                )}
              />
            </Box>

            {/* Confirm Password */}
            <Box sx={{ width: '100%', maxWidth: '350px' }}>
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: '20px',
                  color: '#4b453d',
                  mb: '8px',
                }}
              >
                Confirmar nueva contraseña
              </Typography>
              <Controller
                name="confirmarContrasena"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="password"
                    fullWidth
                    error={!!errors.confirmarContrasena}
                    helperText={errors.confirmarContrasena?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fff9ec',
                        borderRadius: '10px',
                        height: '42px',
                        border: '1px solid rgba(69,55,38,0.15)',
                        '& fieldset': {
                          border: 'none',
                        },
                        '&:hover fieldset': {
                          border: 'none',
                        },
                        '&.Mui-focused fieldset': {
                          border: 'none',
                        },
                        '&.Mui-error': {
                          border: '1px solid #d32f2f',
                        },
                      },
                      '& .MuiInputBase-input': {
                        fontFamily: 'League Spartan',
                        fontSize: '16px',
                        color: '#000000',
                        padding: '8px 16px',
                      },
                      '& .MuiFormHelperText-root': {
                        fontFamily: 'League Spartan',
                        fontSize: '14px',
                        marginLeft: 0,
                        marginTop: '4px',
                      },
                    }}
                  />
                )}
              />
            </Box>

            {/* Error Alert */}
            {authError && (
              <Alert 
                severity="error" 
                sx={{ 
                  width: '100%', 
                  maxWidth: '350px',
                  fontFamily: 'League Spartan',
                }}
              >
                {authError}
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={authLoading}
              sx={{
                backgroundColor: '#a47149',
                color: '#fff9ec',
                borderRadius: '10px',
                height: '50px',
                width: '226px',
                fontFamily: 'League Spartan',
                fontWeight: 600,
                fontSize: '28px',
                textTransform: 'none',
                letterSpacing: '0.1px',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#8b5e3c',
                  boxShadow: 'none',
                },
                '&:disabled': {
                  backgroundColor: '#a47149',
                  opacity: 0.7,
                },
                '& .MuiButton-startIcon': {
                  marginRight: '8px',
                },
              }}
              startIcon={authLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {authLoading ? 'Cambiando...' : 'Cambiar'}
            </Button>
          </Card>
        </Card>
      </Box>

      <NotificationDialog
        open={!!notification}
        notification={notification}
        onClose={hideNotification}
      />
    </Box>
  );
};

export default CambiarContrasena;
