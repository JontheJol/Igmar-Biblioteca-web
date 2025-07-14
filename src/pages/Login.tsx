import React from 'react';
import { Box, Container } from '@mui/material';
import LoginForm from '../components/LoginForm';
import { useAppStore } from '../store/appStore';

const Login: React.FC = () => {
  const { login, authLoading, authError } = useAppStore();

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
            <Box
              sx={{
                width: { xs: '250px', sm: '350px', md: '450px' },
                height: { xs: '250px', sm: '350px', md: '450px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #f3edf7 0%, #e8f5e8 100%)',
                boxShadow: '0 10px 30px rgba(69, 55, 38, 0.1)',
                position: 'relative',
              }}
            >
              {/* Book and Tree Icon */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                {/* Tree Icon */}
                <Box
                  sx={{
                    fontSize: { xs: '80px', sm: '100px', md: '120px' },
                    color: '#2e5131',
                  }}
                >
                  🌳
                </Box>
                {/* Book Icon */}
                <Box
                  sx={{
                    fontSize: { xs: '60px', sm: '80px', md: '100px' },
                    color: '#8B4513',
                    mt: -4,
                  }}
                >
                  📚
                </Box>
                {/* BookSmart Text */}
                <Box
                  sx={{
                    fontFamily: 'League Spartan, sans-serif',
                    fontWeight: 700,
                    fontSize: { xs: '32px', sm: '40px', md: '48px' },
                    color: '#2e5131',
                    textAlign: 'center',
                    letterSpacing: '2px',
                    mt: 2,
                  }}
                >
                  BookSmart
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Demo Credentials Info */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: 2,
          borderRadius: 2,
          border: '1px solid rgba(69, 55, 38, 0.2)',
          fontSize: '14px',
          color: '#453726',
          fontFamily: 'League Spartan, sans-serif',
          zIndex: 1000,
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <strong>Demo:</strong><br />
        Email: admin@booksmart.com<br />
        Password: password
      </Box>
    </Box>
  );
};

export default Login;
