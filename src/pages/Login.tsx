import React, { useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { useAppStore } from '../store/appStore';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, authLoading, authError, shouldRedirectTo2FA, clearRedirectTo2FA } = useAppStore();

  // Handle redirection to 2FA
  useEffect(() => {
    if (shouldRedirectTo2FA) {
      clearRedirectTo2FA();
      setTimeout(() => {
        navigate('/two-factor-auth');
      }, 1500);
    }
  }, [shouldRedirectTo2FA, clearRedirectTo2FA, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#fff9ec',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '-760px',
          left: '242px',
          transform: 'rotate(300deg)',
          opacity: 0.1,
          zIndex: 0,
        }}
      >
        {/* Decorative background blend */}
        <Box
          sx={{
            width: '1760px',
            height: '1404px',
            background: 'linear-gradient(135deg, #f3edf7 0%, #fff9ec 100%)',
          }}
        />
      </Box>

      <Container
        maxWidth={false}
        disableGutters
        sx={{
          display: 'flex',
          alignItems: 'center',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
          px: { xs: 2, sm: 4 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '1200px',
            mx: 'auto',
            gap: { xs: 4, md: 8 },
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          {/* Left side - Login Form */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-start' },
              maxWidth: { xs: '100%', md: '50%' },
              pl: { xs: 0, md: 4 },
            }}
          >
            <LoginForm
              onLogin={login}
              loading={authLoading}
              error={authError}
            />
          </Box>

          {/* Right side - BookSmart Logo */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              maxWidth: { xs: '300px', md: '50%' },
              order: { xs: -1, md: 1 },
            }}
          >
            {/* BookSmart Logo */}
            <Box
              component="img"
              src="/booksmart Logo.svg"
              alt="BookSmart Logo"
              sx={{
                width: { xs: '200px', sm: '280px', md: '350px' },
                height: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>
        </Box>
      </Container>

      {/* Demo Credentials Info */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: 2,
          borderRadius: 2,
          border: '1px solid rgba(69, 55, 38, 0.2)',
          fontSize: '13px',
          color: '#453726',
          fontFamily: 'League Spartan, sans-serif',
          zIndex: 1000,
          display: { xs: 'none', sm: 'block' },
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <strong>Credenciales Demo:</strong><br />
        <Box sx={{ mt: 1, mb: 1 }}>
          <strong style={{ color: '#1976d2' }}>👤 Administrador:</strong><br />
          Email: admin@booksmart.com<br />
          Password: password
        </Box>
        <Box>
          <strong style={{ color: '#ed6c02' }}>⭐ Super Administrador:</strong><br />
          Email: superadmin@booksmart.com<br />
          Password: password
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
