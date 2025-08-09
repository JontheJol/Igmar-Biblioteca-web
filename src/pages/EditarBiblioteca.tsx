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
  Card,
  TextField,
  Button
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useAppStore } from '../store/appStore';
import type { BibliotecaFormData } from '../types';
import PageHeader from '../components/PageHeader';

const EditarBiblioteca: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { bibliotecas } = useAppStore();
  
  // Estados para el formulario
  const [formData, setFormData] = useState<BibliotecaFormData>({
    nombre: '',
    direccion: '',
    estado: 'activa',
    telefono: '',
    email: '',
    administrador: ''
  });

  // Buscar la biblioteca por ID
  const biblioteca = bibliotecas.find(bib => bib.id === Number(id));

  // Datos del administrador (simulados)
  const administradorInfo = {
    nombre: 'Juan Hernandez Pérez',
    telefono: '871-xxx-xx-xx',
    email: 'juanhdz@outlook.com'
  };

  useEffect(() => {
    if (biblioteca) {
      setFormData({
        nombre: biblioteca.nombre,
        direccion: biblioteca.direccion,
        estado: biblioteca.estado,
        telefono: biblioteca.telefono || '',
        email: biblioteca.email || '',
        administrador: biblioteca.administrador || ''
      });
    }
  }, [biblioteca]);

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
      estado: event.target.value as 'activa' | 'inactiva' | 'mantenimiento'
    }));
  };

  const handleGuardarCambios = () => {
    // Aquí iría la lógica para guardar los cambios
    console.log('Guardando cambios:', formData);
    // Redirigir de vuelta a la página de configuración
    navigate('/admin-settings');
  };

  const handleCancelar = () => {
    navigate('/admin-settings');
  };

  if (!biblioteca) {
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
          Biblioteca no encontrada
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
      minHeight: '100vh',
      overflowX: 'hidden',
      padding: { xs: 2, sm: 3 },
    }}>
      <PageHeader
        title="Editar Biblioteca"
        subtitle="Modifica los detalles de la biblioteca seleccionada"
      />

      {/* Contenedor principal */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: { xs: 3, lg: 4 },
          width: '100%',
          maxWidth: '1200px',
          mt: { xs: 2, md: 3 }
        }}
      >
        {/* Formulario principal - Detalles de la biblioteca */}
        <Card
          sx={{
            backgroundColor: 'rgba(225,197,171,0.8)',
            borderRadius: '10px',
            padding: { xs: '20px', sm: '24px', md: '32px' },
            flex: { xs: '1', lg: '2' },
            minHeight: '500px',
            boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Título del formulario */}
          <Typography
            sx={{
              fontFamily: 'League Spartan',
              fontWeight: 600,
              fontSize: { xs: '24px', sm: '28px', md: '32px' },
              color: '#ffffff',
              textAlign: 'center',
              mb: { xs: 3, md: 4 },
              letterSpacing: '0.1px'
            }}
          >
            Detalles de la biblioteca
          </Typography>

          {/* Campo: Nombre completo de la biblioteca */}
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Typography
              sx={{
                fontFamily: 'League Spartan',
                fontWeight: 400,
                fontSize: { xs: '20px', sm: '22px', md: '24px' },
                color: '#453726',
                mb: 1
              }}
            >
              Nombre completo de la biblioteca
            </Typography>
            <TextField
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: { xs: '35px', sm: '39px' },
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid rgba(69,55,38,0.15)',
                  fontFamily: 'League Spartan',
                  fontSize: { xs: '16px', sm: '18px' },
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

          {/* Campo: Dirección de la biblioteca */}
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Typography
              sx={{
                fontFamily: 'League Spartan',
                fontWeight: 400,
                fontSize: { xs: '20px', sm: '22px', md: '24px' },
                color: '#453726',
                mb: 1
              }}
            >
              Dirección de la Biblioteca
            </Typography>
            <TextField
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: { xs: '35px', sm: '39px' },
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid rgba(69,55,38,0.15)',
                  fontFamily: 'League Spartan',
                  fontSize: { xs: '16px', sm: '18px' },
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

          {/* Campo: Estado de la biblioteca */}
          <Box sx={{ mb: { xs: 4, md: 5 } }}>
            <Typography
              sx={{
                fontFamily: 'League Spartan',
                fontWeight: 400,
                fontSize: { xs: '20px', sm: '22px', md: '24px' },
                color: '#453726',
                mb: 1
              }}
            >
              Estado de la biblioteca
            </Typography>
            <FormControl sx={{ width: { xs: '100%', sm: '206px' } }}>
              <Select
                value={formData.estado}
                onChange={handleSelectChange}
                sx={{
                  height: { xs: '35px', sm: '35px' },
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(69,55,38,0.15)',
                  borderRadius: '10px',
                  fontFamily: 'League Spartan',
                  fontSize: { xs: '18px', sm: '20px' },
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
                <MenuItem value="activa">Activa</MenuItem>
                <MenuItem value="inactiva">Inactiva</MenuItem>
                <MenuItem value="mantenimiento">Mantenimiento</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Botones de acción */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 3 },
              justifyContent: 'center',
              mt: { xs: 4, md: 5 }
            }}
          >
            <Button
              onClick={handleCancelar}
              sx={{
                backgroundColor: '#3a332a',
                color: '#ffffff',
                borderRadius: '8px',
                height: '38px',
                width: { xs: '100%', sm: '145px' },
                fontFamily: 'League Spartan',
                fontSize: { xs: '18px', sm: '20px' },
                fontWeight: 500,
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
                borderRadius: '8px',
                height: '38px',
                width: { xs: '100%', sm: '180px' },
                fontFamily: 'League Spartan',
                fontSize: { xs: '18px', sm: '20px' },
                fontWeight: 500,
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
        </Card>

        {/* Panel lateral - Información del administrador */}
        <Card
          sx={{
            backgroundColor: 'rgba(225,197,171,0.8)',
            borderRadius: '10px',
            padding: { xs: '20px', sm: '24px', md: '32px' },
            flex: { xs: '1', lg: '1' },
            minHeight: { xs: '300px', lg: '500px' },
            boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Título del panel */}
          <Typography
            sx={{
              fontFamily: 'League Spartan',
              fontWeight: 600,
              fontSize: { xs: '24px', sm: '26px', md: '30px' },
              color: '#ffffff',
              textAlign: 'center',
              mb: { xs: 3, md: 4 },
              letterSpacing: '0.1px',
              lineHeight: '1.2'
            }}
          >
            Administrador de ésta biblioteca
          </Typography>

          {/* Información del administrador */}
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            {/* Nombre */}
            <Box sx={{ mb: { xs: 3, md: 4 } }}>
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  fontSize: { xs: '24px', sm: '26px', md: '28px' },
                  color: '#ffffff',
                  mb: 1,
                  letterSpacing: '0.1px'
                }}
              >
                Nombre:
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  fontSize: { xs: '24px', sm: '26px', md: '28px' },
                  color: '#453726',
                  letterSpacing: '0.1px',
                  lineHeight: 'normal'
                }}
              >
                {administradorInfo.nombre}
              </Typography>
            </Box>

            {/* Contacto */}
            <Box>
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  fontSize: { xs: '24px', sm: '26px', md: '28px' },
                  color: '#ffffff',
                  mb: 2,
                  letterSpacing: '0.1px'
                }}
              >
                Contacto:
              </Typography>
              
              {/* Teléfono */}
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  fontSize: { xs: '24px', sm: '26px', md: '28px' },
                  color: '#453726',
                  mb: 1.5,
                  letterSpacing: '0.1px',
                  lineHeight: 'normal'
                }}
              >
                {administradorInfo.telefono}
              </Typography>

              {/* Email */}
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  fontSize: { xs: '22px', sm: '24px', md: '28px' },
                  color: '#453726',
                  letterSpacing: '0.1px',
                  lineHeight: 'normal',
                  wordBreak: 'break-word'
                }}
              >
                {administradorInfo.email}
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default EditarBiblioteca;
