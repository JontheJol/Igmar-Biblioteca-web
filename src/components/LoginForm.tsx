import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { loginSchema, type LoginFormData } from '../utils/validation';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  loading,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Mapear los campos del formulario a lo que espera la API
      await onLogin(data.email, data.password);
      navigate('/'); // Navigate to home on successful login
    } catch (err) {
      // Error handled by store
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
        maxWidth: '359px',
      }}
    >
      {/* Title */}
      <Typography
        variant="h1"
        sx={{
          fontFamily: 'League Spartan, sans-serif',
          fontWeight: 500,
          fontSize: { xs: '48px', sm: '64px' },
          lineHeight: '45px',
          color: '#453726',
          letterSpacing: '0.1px',
          mb: 2,
        }}
      >
        Hola, inicia sesión para continuar.
      </Typography>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Email Input */}
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Correo electrónico"
            type="email"
            fullWidth
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email?.message}
            placeholder="ejemplo@correo.com"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#ffffff',
                '&:hover fieldset': {
                  borderColor: '#4a5568',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2d3748',
                },
              },
            }}
          />
        )}
      />

      {/* Password Input */}
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            variant="outlined"
            error={!!errors.password}
            helperText={errors.password?.message}
            placeholder="Ingresa tu contraseña"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#ffffff',
                '&:hover fieldset': {
                  borderColor: '#4a5568',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2d3748',
                },
              },
            }}
          />
        )}
      />

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            backgroundColor: '#fef2f2',
            borderColor: '#f87171',
            color: '#b91c1c',
          }}
        >
          {error}
        </Alert>
      )}

      {/* Register Link */}
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <Typography
          sx={{
            fontFamily: 'League Spartan, sans-serif',
            fontWeight: 600,
            fontSize: '18px',
            color: '#453726',
          }}
        >
          ¿No tienes una cuenta?
        </Typography>
        <Link
          component="button"
          type="button"
          onClick={() => navigate('/register')}
          sx={{
            fontFamily: 'League Spartan, sans-serif',
            fontWeight: 600,
            fontSize: '18px',
            color: '#2e5131',
            textDecoration: 'none',
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Regístrate
        </Link>
      </Box>

      {/* Login Button */}
      <Button
        type="submit"
        disabled={loading}
        sx={{
          backgroundColor: '#453726',
          color: '#ffffff',
          borderRadius: '10px',
          height: '50px',
          fontFamily: 'League Spartan, sans-serif',
          fontWeight: 600,
          fontSize: '20px',
          textTransform: 'none',
          mt: 2,
          '&:hover': {
            backgroundColor: '#352b1f',
          },
          '&:disabled': {
            backgroundColor: 'rgba(69, 55, 38, 0.5)',
          },
        }}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: '#ffffff' }} />
        ) : (
          'Iniciar sesión'
        )}
      </Button>
    </Box>
  );
};

export default LoginForm;
