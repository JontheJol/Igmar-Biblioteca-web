import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';

export interface LoadingSpinnerProps {
  /** Indica si el loading está activo */
  loading: boolean;
  /** Mensaje personalizado a mostrar */
  message?: string;
  /** Tamaño del spinner */
  size?: number;
  /** Color del spinner */
  color?: 'primary' | 'secondary' | 'inherit';
  /** Si debe ocupar toda la pantalla */
  fullscreen?: boolean;
  /** Si debe tener overlay/fondo */
  overlay?: boolean;
  /** Posición del spinner */
  position?: 'center' | 'top' | 'bottom';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  loading,
  message = 'Cargando...',
  size = 40,
  color = 'primary',
  fullscreen = false,
  overlay = false,
  position = 'center'
}) => {
  if (!loading) return null;

  const spinnerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        padding: 2,
        ...(fullscreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          backgroundColor: overlay ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
        }),
        ...(position === 'top' && { paddingTop: 8 }),
        ...(position === 'bottom' && { paddingBottom: 8 }),
      }}
    >
      <CircularProgress
        size={size}
        color={color}
        sx={{
          animationDuration: '1.4s',
        }}
      />
      {message && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontFamily: 'League Spartan',
            fontWeight: 500,
            textAlign: 'center',
            minHeight: '1.5rem',
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  return (
    <Fade in={loading} timeout={300}>
      {spinnerContent}
    </Fade>
  );
};

export default LoadingSpinner;
