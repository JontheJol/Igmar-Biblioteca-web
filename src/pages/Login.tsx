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
    </Box>
  );
};

export default Login;
