import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../components/navbarAdmin';
import PageHeader from '../components/PageHeader';
import ActionButton from '../components/ActionButton';
import AddIcon from '../assets/addIcon';

const AdminHome: React.FC = () => {
  const navigate = useNavigate();
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
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden', // Prevent horizontal scroll
        }}
      >
        <PageHeader
          title="Bienvenido"
          subtitle="Panel de administración"
          actionButton={
            <ActionButton
              label="Registrar libro"
              icon={<AddIcon />}
              onClick={() => navigate('/libros/nuevo')}
            />
          }
        >
          {/* Filter Section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 3 },
              alignItems: { xs: 'stretch', sm: 'center' },
              marginBottom: { xs: 2, sm: 3 },
              width: '100%'
            }}
          >
            <Typography
              sx={{
                fontFamily: 'League Spartan, sans-serif',
                fontSize: { xs: '18px', sm: '20px', md: '24px' },
                color: '#453726',
                fontWeight: 'normal',
              }}
            >
              Filtrar reporte por
            </Typography>
            
            <FormControl sx={{ 
              width: '100%',
              maxWidth: { xs: '100%', sm: '200px' },
              boxSizing: 'border-box'
            }}>
              <Select
                value={reportFilter}
                onChange={handleFilterChange}
                sx={{
                  height: 48,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(69,55,38,0.15)',
                  borderRadius: '10px',
                  fontSize: { xs: '16px', sm: '18px', md: '20px' },
                  fontFamily: 'League Spartan, sans-serif',
                  fontWeight: 300,
                  color: '#453726',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&:hover': {
                    backgroundColor: '#FFFFFF',
                    borderColor: 'rgba(69,55,38,0.25)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#FFFFFF',
                    borderColor: 'rgba(69,55,38,0.35)',
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
          </PageHeader>

        {/* Content Container */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, md: 4 },
            pt: { xs: 1, md: 2 }, // Reduced top padding since PageHeader has its own
            position: 'relative',
            overflow: 'hidden',
          }}
        >
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
        </Box>
      </Box>
    </Box>
  );
};

export default AdminHome;
