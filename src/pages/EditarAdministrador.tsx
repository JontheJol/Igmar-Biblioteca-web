import '@fontsource/league-spartan/400.css';
import '@fontsource/league-spartan/700.css';
import '@fontsource/rowdies/400.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  FormControl, 
  Select, 
  MenuItem, 
  TextField,
  Button
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useAppStore } from '../store/appStore';
import PageHeader from '../components/PageHeader';

// Extendemos el tipo del administrador para incluir todos los campos necesarios
interface AdministradorEditFormData {
  nombres: string;
  apellido: string;
  correo: string;
  celular: string;
  curp: string;
  rfc: string;
  estado: 'activo' | 'inactivo';
}

const EditarAdministrador: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { administradores } = useAppStore();
  
  // Estados para el formulario
  const [formData, setFormData] = useState<AdministradorEditFormData>({
    nombres: '',
    apellido: '',
    correo: '',
    celular: '',
    curp: '',
    rfc: '',
    estado: 'activo'
  });

  // Buscar el administrador por ID
  const administrador = administradores?.find(admin => admin.id === id);

  useEffect(() => {
    if (administrador) {
      // Dividir el nombre completo en nombres y apellido si es necesario
      const nombreCompleto = administrador.nombre.split(' ');
      const nombres = nombreCompleto.slice(0, -1).join(' ') || administrador.nombre;
      const apellido = nombreCompleto.length > 1 ? nombreCompleto[nombreCompleto.length - 1] : '';

      setFormData({
        nombres: nombres,
        apellido: apellido,
        correo: administrador.correo,
        celular: administrador.telefono || '',
        curp: '', // Estos campos no están en el tipo actual, los dejamos vacíos
        rfc: '',
        estado: 'activo' // Por defecto activo
      });
    }
  }, [administrador]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      estado: event.target.value as 'activo' | 'inactivo'
    }));
  };

  const handleGuardarCambios = () => {
    // Aquí iría la lógica para guardar los cambios
    console.log('Guardando cambios:', formData);
    // Redirigir de vuelta a la página de administradores
    navigate('/administradores');
  };

  const handleCancelar = () => {
    navigate('/administradores');
  };

  if (!administrador) {
    return (
      <Box sx={{ 
        backgroundColor: '#fff9ec', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography
          sx={{
            fontFamily: 'League Spartan',
            fontSize: '24px',
            color: '#453726'
          }}
        >
          Administrador no encontrado
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: '#fff9ec', 
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      height: '100vh', // Altura fija del viewport
      overflow: 'hidden', // Evitar scroll
      padding: { xs: '8px', sm: '12px', md: '16px' }, // Padding más compacto
    }}>
      <PageHeader
        title="Editar Administrador"
        subtitle="Modifica los detalles del administrador seleccionado"
      />

      {/* Formulario principal */}
      <Box
        sx={{
          backgroundColor: 'rgba(225,197,171,0.8)',
          borderRadius: '15px',
          padding: { xs: '16px', sm: '20px', md: '24px' }, // Padding más compacto
          width: { xs: '95%', sm: '90%', md: '85%', lg: '80%' }, // Ancho responsivo
          flex: 1, // Tomar el espacio disponible
          display: 'flex',
          flexDirection: 'column',
          mt: { xs: 1, md: 2 }, // Margen superior reducido
          mb: { xs: 1, md: 2 }, // Margen inferior reducido
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(0,0,0,0.05)',
          overflow: 'hidden', // Evitar overflow
          maxHeight: 'calc(100vh - 180px)', // Altura máxima considerando header
        }}
      >
        {/* Título del formulario */}
        <Typography
          sx={{
            fontFamily: 'League Spartan',
            fontWeight: 600,
            fontSize: { xs: '24px', sm: '28px', md: '32px' }, // Tamaños más compactos
            color: '#ffffff',
            textAlign: 'center',
            mb: { xs: 2, sm: 2.5, md: 3 }, // Margen inferior reducido
            letterSpacing: '0.1px',
            lineHeight: { xs: '28px', sm: '32px', md: '36px' }, // Line height más compacto
            flexShrink: 0 // No permitir que se encoja
          }}
        >
          Detalles del administrador
        </Typography>

        {/* Campos del formulario en layout responsivo */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 0, md: 3 }, // Gap reducido
            flex: 1, // Tomar espacio disponible
            overflow: 'hidden' // Evitar overflow
          }}
        >
          {/* Primera columna */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Nombre(s) */}
            <Box sx={{ mb: { xs: 2, md: 2.5 } }}> {/* Margen reducido */}
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: { xs: '16px', sm: '18px', md: '20px' }, // Tamaños más compactos
                  color: '#453726',
                  mb: 0.5 // Margen más pequeño
                }}
              >
                Nombre(s)
              </Typography>
              <TextField
                name="nombres"
                value={formData.nombres}
                onChange={handleInputChange}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: { xs: '32px', sm: '36px', md: '38px' }, // Altura más compacta
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid rgba(69,55,38,0.15)',
                    fontFamily: 'League Spartan',
                    fontSize: { xs: '14px', sm: '16px' }, // Fuente más pequeña
                    color: '#453726',
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: '2px solid #453726',
                    },
                  },
                }}
              />
            </Box>

            {/* Apellido */}
            <Box sx={{ mb: { xs: 2, md: 2.5 } }}>
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: { xs: '16px', sm: '18px', md: '20px' },
                  color: '#453726',
                  mb: 0.5
                }}
              >
                Apellido
              </Typography>
              <TextField
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: { xs: '32px', sm: '36px', md: '38px' },
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid rgba(69,55,38,0.15)',
                    fontFamily: 'League Spartan',
                    fontSize: { xs: '14px', sm: '16px' },
                    color: '#453726',
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: '2px solid #453726',
                    },
                  },
                }}
              />
            </Box>

            {/* Correo electrónico */}
            <Box sx={{ mb: { xs: 2, md: 2.5 } }}>
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: { xs: '16px', sm: '18px', md: '20px' },
                  color: '#453726',
                  mb: 0.5
                }}
              >
                Correo electrónico
              </Typography>
              <TextField
                name="correo"
                type="email"
                value={formData.correo}
                onChange={handleInputChange}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: { xs: '32px', sm: '36px', md: '38px' },
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid rgba(69,55,38,0.15)',
                    fontFamily: 'League Spartan',
                    fontSize: { xs: '14px', sm: '16px' },
                    color: '#453726',
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: '2px solid #453726',
                    },
                  },
                }}
              />
            </Box>
          </Box>

          {/* Segunda columna */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Celular */}
            <Box sx={{ mb: { xs: 2, md: 2.5 } }}>
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: { xs: '16px', sm: '18px', md: '20px' },
                  color: '#453726',
                  mb: 0.5
                }}
              >
                Celular
              </Typography>
              <TextField
                name="celular"
                value={formData.celular}
                onChange={handleInputChange}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: { xs: '32px', sm: '36px', md: '38px' },
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid rgba(69,55,38,0.15)',
                    fontFamily: 'League Spartan',
                    fontSize: { xs: '14px', sm: '16px' },
                    color: '#453726',
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: '2px solid #453726',
                    },
                  },
                }}
              />
            </Box>

            {/* CURP */}
            <Box sx={{ mb: { xs: 2, md: 2.5 } }}>
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: { xs: '16px', sm: '18px', md: '20px' },
                  color: '#453726',
                  mb: 0.5
                }}
              >
                CURP
              </Typography>
              <TextField
                name="curp"
                value={formData.curp}
                onChange={handleInputChange}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: { xs: '32px', sm: '36px', md: '38px' },
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid rgba(69,55,38,0.15)',
                    fontFamily: 'League Spartan',
                    fontSize: { xs: '14px', sm: '16px' },
                    color: '#453726',
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: '2px solid #453726',
                    },
                  },
                }}
              />
            </Box>

            {/* RFC */}
            <Box sx={{ mb: { xs: 2, md: 2.5 } }}>
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: { xs: '16px', sm: '18px', md: '20px' },
                  color: '#453726',
                  mb: 0.5
                }}
              >
                RFC
              </Typography>
              <TextField
                name="rfc"
                value={formData.rfc}
                onChange={handleInputChange}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: { xs: '32px', sm: '36px', md: '38px' },
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid rgba(69,55,38,0.15)',
                    fontFamily: 'League Spartan',
                    fontSize: { xs: '14px', sm: '16px' },
                    color: '#453726',
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: '2px solid #453726',
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Campo Estado (centrado) */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: { xs: 2, md: 3 }, // Margen reducido
            flexShrink: 0 // No permitir que se encoja
          }}
        >
          <Typography
            sx={{
              fontFamily: 'League Spartan',
              fontWeight: 400,
              fontSize: { xs: '16px', sm: '18px', md: '20px' }, // Tamaño reducido
              color: '#453726',
              mb: 0.5 // Margen reducido
            }}
          >
            Estado
          </Typography>
          <FormControl sx={{ width: { xs: '180px', sm: '200px' } }}> {/* Ancho reducido */}
            <Select
              value={formData.estado}
              onChange={handleSelectChange}
              sx={{
                height: { xs: '32px', sm: '36px', md: '38px' }, // Altura reducida
                backgroundColor: '#ffffff',
                border: '1px solid rgba(69,55,38,0.15)',
                borderRadius: '10px',
                fontFamily: 'League Spartan',
                fontSize: { xs: '16px', sm: '18px' }, // Fuente reducida
                fontWeight: 300,
                color: '#000000',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: '2px solid #453726',
                },
              }}
            >
              <MenuItem value="activo">Activo</MenuItem>
              <MenuItem value="inactivo">Inactivo</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Botones de acción */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 3 }, // Gap reducido
            justifyContent: 'center',
            mt: 'auto', // Empujar hacia abajo
            pt: { xs: 1, md: 2 }, // Padding top mínimo
            flexShrink: 0 // No permitir que se encoja
          }}
        >
          <Button
            onClick={handleCancelar}
            sx={{
              backgroundColor: '#3a332a',
              color: '#ffffff',
              borderRadius: '10px',
              height: { xs: '40px', sm: '44px' }, // Altura reducida
              width: { xs: '100%', sm: '180px' }, // Ancho reducido
              fontFamily: 'League Spartan',
              fontSize: { xs: '16px', sm: '18px', md: '20px' }, // Fuente reducida
              fontWeight: 600,
              textTransform: 'none',
              letterSpacing: '0.1px',
              boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
              '&:hover': {
                backgroundColor: '#2d251e',
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleGuardarCambios}
            sx={{
              backgroundColor: '#2f5232',
              color: '#ffffff',
              borderRadius: '10px',
              height: { xs: '40px', sm: '44px' }, // Altura reducida
              width: { xs: '100%', sm: '180px' }, // Ancho reducido
              fontFamily: 'League Spartan',
              fontSize: { xs: '16px', sm: '18px', md: '20px' }, // Fuente reducida
              fontWeight: 600,
              textTransform: 'none',
              letterSpacing: '0.1px',
              boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
              '&:hover': {
                backgroundColor: '#244028',
              }
            }}
          >
            Guardar cambios
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditarAdministrador;
