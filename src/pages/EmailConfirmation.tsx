import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  TextField,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
} from '@mui/icons-material';
import { useAppStore } from '../store/appStore';
import NotificationDialog from '../components/NotificationDialog';

const EmailConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authError, setAuthError, confirmEmail, authLoading, notification, isAuthenticated, hideNotification } = useAppStore();
  const [verificationCode, setVerificationCode] = useState('');

  // Get email from navigation state or default message
  const userEmail = location.state?.email || 'tu correo electrónico';

  // Auto-navigate when user becomes authenticated after email confirmation
  useEffect(() => {
    if (isAuthenticated) {
      // Add a small delay to show the success notification briefly
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setAuthError('Por favor ingresa un código de 6 dígitos');
      return;
    }

    try {
      await confirmEmail(userEmail);
      // El store ya maneja la notificación automáticamente
    } catch (error) {
      // Error handled by store
    }
  };

  const handleNotificationClose = () => {
    hideNotification();
    // Navigation is now handled automatically by useEffect when user is authenticated
  };

  const handleBackToLogin = () => {
    setAuthError(null);
    navigate('/login');
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only numbers, max 6 digits
    setVerificationCode(value);
    // Clear any existing errors when user starts typing
    if (authError) {
      setAuthError(null);
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          background: '#fff9ec', // Matching Figma background
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: 2, sm: 3 },
          position: 'relative',
        }}
      >
        {/* Back Button */}
        <IconButton
          onClick={handleBackToLogin}
          sx={{
            position: 'absolute',
            top: 20,
            left: 20,
            color: '#453726',
            zIndex: 10,
          }}
        >
          <ArrowBack />
        </IconButton>

        <Paper
          elevation={8}
          sx={{
            padding: { xs: 4, sm: 6 },
            borderRadius: '15px', // Matching Figma border radius
            maxWidth: 672, // Matching Figma width
            width: '100%',
            backgroundColor: '#fff9ec', // Same as background
            boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.25)', // Matching Figma shadow
            border: '1px solid rgba(0,0,0,0.05)', // Matching Figma border
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* BookSmart Logo */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 4,
            }}
          >
            <Box
              component="img"
              src="/booksmart Logo.svg"
              alt="BookSmart"
              sx={{
                width: 195,
                height: 195,
              }}
            />
          </Box>

          {/* Main Title */}
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'League Spartan', sans-serif",
              fontWeight: 500,
              fontSize: '36px',
              color: '#453726',
              lineHeight: 'normal',
              mb: 2,
              maxWidth: 477,
              mx: 'auto',
            }}
          >
            Por tu seguridad, necesitamos verificar tu correo electrónico
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'League Spartan', sans-serif",
              fontWeight: 400,
              fontSize: '20px',
              color: '#a47149',
              lineHeight: 'normal',
              mb: 4,
              maxWidth: 397,
              mx: 'auto',
            }}
          >
            Ingresa el código que te enviamos
          </Typography>

          {/* Error Message */}
          {authError && (
            <Alert severity="error" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
              {authError}
            </Alert>
          )}

          {/* Verification Code Input */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <TextField
              value={verificationCode}
              onChange={handleCodeChange}
              placeholder="000000"
              inputProps={{
                maxLength: 6,
                style: {
                  textAlign: 'center',
                  fontSize: '24px',
                  letterSpacing: '8px',
                  fontWeight: 'bold',
                  color: '#453726',
                },
              }}
              sx={{
                width: 306, // Matching Figma width
                height: 88, // Matching Figma height
                '& .MuiOutlinedInput-root': {
                  height: '88px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px', // Matching Figma border radius
                  '& fieldset': {
                    borderColor: '#cac4d0', // Matching Figma border color
                  },
                  '&:hover fieldset': {
                    borderColor: '#453726',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#453726',
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputBase-input': {
                  padding: '0',
                  height: '88px',
                  display: 'flex',
                  alignItems: 'center',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#cac4d0',
                  opacity: 1,
                },
              }}
            />
          </Box>

          {/* Validate Button */}
          <Button
            variant="contained"
            onClick={handleVerifyCode}
            disabled={authLoading || verificationCode.length !== 6}
            sx={{
              width: 342, // Matching Figma width
              height: 58, // Matching Figma height
              backgroundColor: '#2f5233', // Matching Figma color
              borderRadius: '25px', // Matching Figma border radius
              fontFamily: "'League Spartan', sans-serif",
              fontWeight: 600,
              fontSize: '20px',
              color: '#ffffff',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#1f3522',
              },
              '&:disabled': {
                backgroundColor: 'rgba(47, 82, 51, 0.5)',
              },
            }}
          >
            {authLoading ? (
              <CircularProgress size={24} sx={{ color: '#ffffff' }} />
            ) : (
              'Validar código'
            )}
          </Button>

          {/* Email Information */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "'League Spartan', sans-serif",
                fontWeight: 400,
                fontSize: '20px',
                color: '#a47149',
                lineHeight: 'normal',
                mb: 0.5,
              }}
            >
              El Correo fue enviado a
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "'League Spartan', sans-serif",
                fontWeight: 400,
                fontSize: '20px',
                color: '#a47149',
                lineHeight: 'normal',
              }}
            >
              {userEmail}
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Notification Dialog */}
      <NotificationDialog
        open={!!notification}
        notification={notification}
        onClose={handleNotificationClose}
      />
    </>
  );
};

export default EmailConfirmation;
