import '@fontsource/league-spartan/500.css';
import '@fontsource/league-spartan/600.css';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Drawer, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '../assets/homeIcon';
import LogoutIcon from '../assets/logoutIcon';
import UserIcon from '../assets/userIcon';
import { useAppStore } from '../store/appStore';

const menuItems = [
  { label: 'Inicio', icon: <HomeIcon />, path: '/admin-settings' },
  { label: 'Administradores', icon: <UserIcon />, path: '/administradores' },
];

const NavbarSuperAdmin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAppStore();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [isOpen, setIsOpen] = useState(!isTablet);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavbarContent = () => (
    <Box
      sx={{
        width: isMobile ? '280px' : '100%',
        height: '100vh',
        bgcolor: '#453726',
        color: '#FFF9EC',
        position: 'relative',
        fontFamily: 'League Spartan, sans-serif',
        overflow: 'hidden',
        boxShadow: { 
          xs: '2px 0 8px rgba(0,0,0,0.15)',
          md: isMobile ? '2px 0 12px rgba(0,0,0,0.1)' : '2px 0 8px rgba(0,0,0,0.08)'
        },
      }}
    >
      {/* Toggle button - Hidden on mobile, always visible on desktop */}
      <IconButton
        onClick={handleDrawerToggle}
        sx={{
          position: 'absolute',
          right: { xs: 8, md: 4 },
          top: { xs: 8, md: 10 },
          color: '#FFF9EC',
          display: { xs: 'none', md: 'flex' },
          zIndex: 10,
          width: 40,
          height: 40,
          '&:hover': {
            bgcolor: 'rgba(255, 249, 236, 0.15)',
            transform: 'scale(1.05)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        <ChevronLeftIcon sx={{ 
          transform: !isOpen ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          fontSize: { md: '24px', lg: '28px' }
        }} />
      </IconButton>

      {/* Close button for mobile */}
      {isMobile && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#FFF9EC',
            zIndex: 10,
            width: 44,
            height: 44,
            '&:hover': {
              bgcolor: 'rgba(255, 249, 236, 0.15)',
            },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      )}

      {/* Top greeting */}
      <Typography
        sx={{
          fontSize: { 
            xs: '22px', 
            sm: '26px', 
            md: isOpen ? '28px' : '0px',
            lg: isOpen ? '30px' : '0px'
          },
          fontWeight: 500,
          lineHeight: '1.2',
          letterSpacing: '0.1px',
          position: 'absolute',
          top: { xs: 60, sm: 65, md: 70 },
          left: { xs: 20, sm: 25, md: isOpen ? 30 : 0 },
          right: { xs: 20, sm: 25, md: isOpen ? 30 : 0 },
          opacity: { xs: 1, md: isOpen ? 1 : 0 },
          transform: { md: isOpen ? 'translateX(0)' : 'translateX(-20px)' },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          textAlign: { xs: 'left', md: isOpen ? 'left' : 'center' },
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        Hola, administrador
      </Typography>

      {/* Top divider */}
      <Box
        sx={{
          width: { 
            xs: 'calc(100% - 40px)',
            sm: 'calc(100% - 50px)',
            md: isOpen ? 'calc(100% - 60px)' : '40px'
          },
          borderBottom: '3px solid #3A332A',
          position: 'absolute',
          top: { xs: 110, sm: 120, md: 130 },
          left: { xs: 20, sm: 25, md: isOpen ? 30 : '50%' },
          transform: { md: isOpen ? 'translateX(0)' : 'translateX(-50%)' },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: { md: isOpen ? 1 : 0.7 },
        }}
      />

      {/* Menu items */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 150, sm: 160, md: 170 },
          bottom: { xs: 140, sm: 145, md: 150 },
          left: { xs: 20, sm: 25, md: 15 },
          right: { xs: 20, sm: 25, md: 15 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          gap: 2,
          overflowY: 'auto',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 249, 236, 0.1)',
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 249, 236, 0.3)',
            borderRadius: '2px',
            '&:hover': {
              background: 'rgba(255, 249, 236, 0.5)',
            },
          },
        }}
      >
        {menuItems.map(({ label, icon, path }, index) => {
          const isActive = location.pathname === path;
          
          return (
            <Box
              key={index}
              onClick={() => handleMenuClick(path)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 2, md: isOpen ? 2 : 0 },
                minHeight: { xs: '52px', sm: '56px', md: '48px' },
                px: { xs: 2, md: isOpen ? 2 : 1 },
                py: { xs: 1.5, md: 1 },
                cursor: 'pointer',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                justifyContent: { 
                  xs: 'flex-start', 
                  md: isOpen ? 'flex-start' : 'center' 
                },
                bgcolor: isActive ? 'rgba(255, 249, 236, 0.15)' : 'transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                outline: 'none',
                '&:focus': {
                  outline: 'none',
                },
                '&:hover': {
                  bgcolor: isActive ? 'rgba(255, 249, 236, 0.2)' : 'rgba(255, 249, 236, 0.12)',
                  transform: { xs: 'translateX(4px)', md: 'translateX(2px)' },
                },
                '&:active': {
                  transform: 'scale(0.98)',
                  outline: 'none',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: isActive ? '4px' : '0px',
                  bgcolor: '#FFF9EC',
                  borderRadius: '0 2px 2px 0',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                },
              }}
            >
              {/* Icon */}
              <Box sx={{ 
                color: isActive ? '#FFF9EC' : '#FFF9EC',
                minWidth: { xs: '28px', sm: '32px', md: '28px' },
                height: { xs: '28px', sm: '32px', md: '28px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s ease',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                filter: isActive ? 'brightness(1.2)' : 'brightness(1)',
                '& svg': {
                  fontSize: { xs: '24px', sm: '28px', md: '24px' },
                },
              }}>
                {icon}
              </Box>

              {/* Label */}
              <Typography
                sx={{
                  fontSize: { 
                    xs: '18px', 
                    sm: '20px', 
                    md: isOpen ? '22px' : '0px' 
                  },
                  fontWeight: isActive ? 700 : 600,
                  lineHeight: 1.3,
                  letterSpacing: '0.1px',
                  color: isActive ? '#FFF9EC' : '#FFF9EC',
                  opacity: { xs: 1, md: isOpen ? 1 : 0 },
                  transform: { md: isOpen ? 'translateX(0)' : 'translateX(-10px)' },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: { xs: '200px', sm: '220px', md: isOpen ? '180px' : '0px' },
                  filter: isActive ? 'brightness(1.1)' : 'brightness(1)',
                }}
              >
                {label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Bottom divider */}
      <Box
        sx={{
          width: { 
            xs: 'calc(100% - 40px)',
            sm: 'calc(100% - 50px)',
            md: isOpen ? 'calc(100% - 60px)' : '40px'
          },
          borderBottom: '3px solid #3A332A',
          position: 'absolute',
          bottom: { xs: 120, sm: 125, md: 130 },
          left: { xs: 20, sm: 25, md: isOpen ? 30 : '50%' },
          transform: { md: isOpen ? 'translateX(0)' : 'translateX(-50%)' },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: { md: isOpen ? 1 : 0.7 },
        }}
      />

      {/* Logout button */}
      <Box
        onClick={handleLogout}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 2, md: isOpen ? 2 : 0 },
          minHeight: { xs: '52px', sm: '56px', md: '48px' },
          position: 'absolute',
          bottom: { xs: 60, sm: 65, md: 70 },
          left: { xs: 20, sm: 25, md: 15 },
          right: { xs: 20, sm: 25, md: 15 },
          px: { xs: 2, md: isOpen ? 2 : 1 },
          py: { xs: 1.5, md: 1 },
          cursor: 'pointer',
          borderRadius: '12px',
          bgcolor: 'transparent',
          justifyContent: { 
            xs: 'flex-start', 
            md: isOpen ? 'flex-start' : 'center' 
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          outline: 'none',
          '&:focus': {
            outline: 'none',
          },
          '&:hover': {
            bgcolor: 'rgba(255, 249, 236, 0.12)',
            transform: { xs: 'translateX(4px)', md: 'translateX(2px)' },
          },
          '&:active': {
            transform: 'scale(0.98)',
            outline: 'none',
          },
        }}
      >
        {/* Logout Icon */}
        <Box sx={{ 
          color: '#FFF9EC',
          minWidth: { xs: '28px', sm: '32px', md: '28px' },
          height: { xs: '28px', sm: '32px', md: '28px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          '& svg': {
            fontSize: { xs: '24px', sm: '28px', md: '24px' },
          },
        }}>
          <LogoutIcon />
        </Box>

        {/* Logout Label */}
        <Typography
          sx={{
            fontSize: { 
              xs: '18px', 
              sm: '20px', 
              md: isOpen ? '22px' : '0px' 
            },
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: '0.1px',
            opacity: { xs: 1, md: isOpen ? 1 : 0 },
            transform: { md: isOpen ? 'translateX(0)' : 'translateX(-10px)' },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: { xs: '200px', sm: '220px', md: isOpen ? '180px' : '0px' },
          }}
        >
          Cerrar sesión
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ 
            position: 'fixed',
            top: { xs: 16, sm: 20 },
            left: { xs: 16, sm: 20 },
            zIndex: 1300,
            bgcolor: '#453726',
            width: { xs: 48, sm: 52 },
            height: { xs: 48, sm: 52 },
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '2px solid rgba(255, 249, 236, 0.1)',
            '&:hover': {
              bgcolor: '#3A332A',
              transform: 'scale(1.05)',
              boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <MenuIcon sx={{ 
            color: '#FFF9EC',
            fontSize: { xs: '24px', sm: '28px' }
          }} />
        </IconButton>
      )}

      {/* Desktop sidebar */}
      {!isMobile ? (
        <Box
          sx={{
            width: { 
              md: isOpen ? '310px' : '80px', 
              lg: isOpen ? '320px' : '85px'
            },
            height: '100vh',
            flexShrink: 0,
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <NavbarContent />
        </Box>
      ) : (
        /* Mobile drawer */
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              backgroundColor: 'transparent',
              border: 'none',
              boxShadow: '4px 0 24px rgba(0,0,0,0.12)',
            },
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(4px)',
            },
          }}
        >
          <NavbarContent />
        </Drawer>
      )}
    </>
  );
};

export default NavbarSuperAdmin;
