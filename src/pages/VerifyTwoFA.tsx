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
import { useAppStore, ROLES } from '../store/appStore';
import { syncValidators } from '../utils/validation';
import NotificationDialog from '../components/NotificationDialog';

const VerifyTwoFA: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    authError, 
    setAuthError, 
    verifyTwoFactor, 
    authLoading, 
    notification, 
    isAuthenticated, 
    hideNotification, 
    tempAuthData, 
    currentUser 
  } = useAppStore();
  const [verificationCode, setVerificationCode] = useState('');

  // Get email from tempAuthData or navigation state or default message
  const userEmail = tempAuthData?.user.email || location.state?.email || 'tu correo electrónico';

  // Redirect back to login if no temp auth data
  useEffect(() => {
    if (!tempAuthData && !isAuthenticated) {
      navigate('/login');
    }
  }, [tempAuthData, isAuthenticated, navigate]);

  // Auto-navigate when user becomes authenticated after 2FA verification
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Add a small delay to show the success notification briefly
      const timer = setTimeout(() => {
        // Redirect based on user role
        if (currentUser.roleId === ROLES.SUPER_ADMIN) { // Super Admin
          navigate('/admin-settings');
        } else {
          navigate('/'); // Regular admin or other roles go to home
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleVerifyCode = async () => {
    const validationError = syncValidators.validateTwoFA(verificationCode);
    if (validationError) {
      setAuthError(validationError);
      return;
    }

    try {
      await verifyTwoFactor({ codigo: verificationCode });
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
    const value = e.target.value.replace(/[^A-Za-z0-9$@!%*?&]/g, '').slice(0, 8); // Solo caracteres permitidos, máximo 8
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
            Verifica tu inicio de sesión
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
            Ingresa el código que enviamos a tu correo
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
              placeholder="Ej: Abc123$!"
              inputProps={{
                style: {
                  textAlign: 'center',
                  fontSize: '18px',
                  letterSpacing: '2px',
                  fontWeight: 'bold',
                  color: '#453726',
                },
                maxLength: 8,
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
            disabled={authLoading || !verificationCode || syncValidators.validateTwoFA(verificationCode) !== null}
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
              El código fue enviado a
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

export default VerifyTwoFA;
