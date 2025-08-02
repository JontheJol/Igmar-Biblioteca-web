import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import NavbarAdmin from '../components/navbarAdmin';

const AdminHome: React.FC = () => {
  const [reportFilter, setReportFilter] = React.useState('Día');

  const handleFilterChange = (event: SelectChangeEvent) => {
    setReportFilter(event.target.value);
  };

  // Sample data - in a real app this would come from your store/API
  const visitData = {
    hombres: 178,
    mujeres: 212,
    otros: 105,
    total: 495,
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        bgcolor: '#fff9ec',
        position: 'relative',
      }}
    >
      {/* Navbar - Always rendered, handles its own responsivity */}
      <NavbarAdmin />
      
      {/* Main content - Now takes remaining space automatically */}
      <Box
        sx={{
          flex: 1, // Take all remaining space
          p: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 10, md: 4 }, // Extra top padding on mobile for hamburger button
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden', // Prevent horizontal scroll
        }}
      >
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h1"
            sx={{
              fontFamily: 'Rowdies, sans-serif',
              fontSize: { xs: '48px', sm: '64px' },
              fontWeight: 'normal',
              color: '#453726',
              letterSpacing: '0.1px',
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            Bienvenido
          </Typography>
          
          {/* Divider line */}
          <Box
            sx={{
              height: '3px',
              bgcolor: '#453726',
              mb: 4,
              maxWidth: '800px',
            }}
          />
        </Box>

        {/* Filter Section */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            sx={{
              fontFamily: 'League Spartan, sans-serif',
              fontSize: '24px',
              color: '#453726',
              fontWeight: 'normal',
            }}
          >
            Filtrar reporte por
          </Typography>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={reportFilter}
              onChange={handleFilterChange}
              sx={{
                bgcolor: '#ffffff',
                borderRadius: '10px',
                height: '35px',
                fontSize: '20px',
                fontFamily: 'League Spartan, sans-serif',
                fontWeight: 300,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(69, 55, 38, 0.15)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(69, 55, 38, 0.25)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#453726',
                },
              }}
            >
              <MenuItem value="Día">Día</MenuItem>
              <MenuItem value="Semana">Semana</MenuItem>
              <MenuItem value="Mes">Mes</MenuItem>
              <MenuItem value="Año">Año</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Statistics Card */}
        <Box
          sx={{
            bgcolor: '#e1c5ab',
            borderRadius: '10px',
            p: 3,
            maxWidth: '900px',
            position: 'relative',
          }}
        >
          {/* Chart Area */}
          <Box
            sx={{
              bgcolor: '#fef7ff',
              borderRadius: '20px',
              p: 3,
              mb: 3,
              ml: { xs: 0, sm: '200px' },
              position: 'relative',
              minHeight: '300px',
            }}
          >
            {/* Chart bars - simplified representation */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'center',
                gap: 4,
                height: '200px',
                mt: 2,
              }}
            >
              {/* Y-axis line */}
              <Box
                sx={{
                  position: 'absolute',
                  left: '30px',
                  top: '20px',
                  bottom: '40px',
                  width: '2px',
                  bgcolor: '#453726',
                }}
              />
              
              {/* X-axis line */}
              <Box
                sx={{
                  position: 'absolute',
                  left: '30px',
                  right: '30px',
                  bottom: '40px',
                  height: '2px',
                  bgcolor: '#453726',
                }}
              />

              {/* Bars */}
              <Box sx={{ display: 'flex', alignItems: 'end', gap: 3, ml: 4 }}>
                {/* Hombres */}
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: '60px',
                      height: `${(visitData.hombres / visitData.mujeres) * 160}px`,
                      bgcolor: '#a47149',
                      mb: 1,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '16px',
                      color: '#4b453d',
                      fontFamily: 'League Spartan, sans-serif',
                    }}
                  >
                    Hombres
                  </Typography>
                </Box>

                {/* Mujeres */}
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: '60px',
                      height: '160px', // Tallest bar
                      bgcolor: '#2f5233',
                      mb: 1,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '16px',
                      color: '#4b453d',
                      fontFamily: 'League Spartan, sans-serif',
                    }}
                  >
                    Mujeres
                  </Typography>
                </Box>

                {/* Otros */}
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: '60px',
                      height: `${(visitData.otros / visitData.mujeres) * 160}px`,
                      bgcolor: '#8e9775',
                      mb: 1,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '16px',
                      color: '#4b453d',
                      fontFamily: 'League Spartan, sans-serif',
                    }}
                  >
                    Otros
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Total Card */}
          <Box
            sx={{
              position: 'absolute',
              left: '20px',
              top: '85px',
              bgcolor: 'rgba(255, 249, 236, 0.9)',
              borderRadius: '20px',
              p: 3,
              width: '150px',
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                sx={{
                  fontSize: '32px',
                  fontWeight: 600,
                  color: '#3a332a',
                  fontFamily: 'League Spartan, sans-serif',
                  lineHeight: 1.2,
                  mb: 1,
                }}
              >
                Total:
              </Typography>
              <Typography
                sx={{
                  fontSize: '32px',
                  fontWeight: 600,
                  color: '#3a332a',
                  fontFamily: 'League Spartan, sans-serif',
                  lineHeight: 1.2,
                }}
              >
                {visitData.total} visitas
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Register Book Button */}
        <Box
          sx={{
            position: 'fixed',
            top: { xs: '80px', sm: '100px', md: '140px' },
            right: { xs: '16px', sm: '24px', md: '40px' },
            bgcolor: '#453726',
            color: '#ffffff',
            borderRadius: '8px',
            p: { xs: 1.5, sm: 2 },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(69, 55, 38, 0.3)',
            zIndex: 999,
            minWidth: { xs: 'auto', sm: '160px' },
            '&:hover': {
              bgcolor: '#3a332a',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(69, 55, 38, 0.4)',
            },
            '&:active': {
              transform: 'translateY(0px)',
            },
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <AddIcon sx={{ 
            fontSize: { xs: '20px', sm: '22px' } 
          }} />
          <Typography
            sx={{
              fontSize: { xs: '14px', sm: '15px' },
              fontWeight: 500,
              fontFamily: 'League Spartan, sans-serif',
              display: { xs: 'none', sm: 'block' }, // Hide text on very small screens
            }}
          >
            Registrar libro
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminHome;
