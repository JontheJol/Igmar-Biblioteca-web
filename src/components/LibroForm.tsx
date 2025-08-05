import '@fontsource/league-spartan/400.css';
import '@fontsource/league-spartan/700.css';
import { 
  Box, 
  Typography, 
  Button,
  Alert,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Libro } from '../types';
import BookIcon from '../assets/bookIcon';
import { posicionLibroSchema, type PosicionLibroFormData } from '../utils/validation';

interface LibroFormProps {
  onSubmit: (data: PosicionLibroFormData) => void;
  initialData?: Libro;
  loading?: boolean;
  error?: string | null;
  isEditing?: boolean;
}

// Datos simulados para los dropdowns
const estantesOptions = ['A12', 'B15', 'C08', 'D12', 'E05', 'F03', 'G11', 'H07', 'I19'];
const etiquetasOptions = [
  { value: 'sin-etiqueta', label: 'Sin etiqueta', filas: ['1', '2', '3', '4', '5'], columnas: ['1', '2', '3', '4', '5', '6'] },
  { value: 'ficcion', label: 'Ficción', filas: ['1', '2', '3'], columnas: ['1', '2', '3'] },
  { value: 'historia', label: 'Historia', filas: ['1', '2'], columnas: ['1', '2', '3', '4'] },
  { value: 'ciencia', label: 'Ciencia', filas: ['1', '2', '3', '4'], columnas: ['1', '2'] },
  { value: 'literatura', label: 'Literatura', filas: ['1', '2', '3'], columnas: ['1', '2', '3', '4', '5'] },
];

const LibroForm: React.FC<LibroFormProps> = ({ 
  onSubmit, 
  initialData, 
  loading = false, 
  error = null,
  isEditing = false 
}) => {
  const navigate = useNavigate();
  const [filasDisponibles, setFilasDisponibles] = useState<string[]>([]);
  const [columnasDisponibles, setColumnasDisponibles] = useState<string[]>([]);
  
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting }
  } = useForm<PosicionLibroFormData>({
    resolver: yupResolver(posicionLibroSchema),
    defaultValues: {
      estante: initialData?.estante || 'A12',
      etiqueta: 'sin-etiqueta',
      fila: '1',
      columna: '1'
    }
  });

  const etiquetaSeleccionada = watch('etiqueta');

  // Efecto para actualizar filas y columnas cuando cambia la etiqueta
  useEffect(() => {
    const etiqueta = etiquetasOptions.find(e => e.value === etiquetaSeleccionada);
    if (etiqueta) {
      setFilasDisponibles(etiqueta.filas);
      setColumnasDisponibles(etiqueta.columnas);
      
      // Reset fila y columna a los primeros valores disponibles
      setValue('fila', etiqueta.filas[0]);
      setValue('columna', etiqueta.columnas[0]);
    }
  }, [etiquetaSeleccionada, setValue]);

  // Inicializar con datos por defecto
  useEffect(() => {
    const etiquetaDefault = etiquetasOptions[0]; // Sin etiqueta
    setFilasDisponibles(etiquetaDefault.filas);
    setColumnasDisponibles(etiquetaDefault.columnas);
  }, []);

  const handleFormSubmit = (data: PosicionLibroFormData) => {
    onSubmit(data);
  };

  const handleCancel = () => {
    navigate('/libros');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{
        backgroundColor: '#fff9ec',
        minHeight: '100vh',
        padding: { xs: 3, sm: 4 }
      }}
    >
      {/* Título */}
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '32px', sm: '48px', md: '56px' },
          fontWeight: 400,
          color: '#453726',
          fontFamily: 'Rowdies, sans-serif',
          marginBottom: { xs: '20px', md: '35px' },
          lineHeight: { xs: '36px', sm: '52px', md: '64px' },
          letterSpacing: '0.1px'
        }}
      >
        {isEditing ? 'Editar ubicación del libro' : 'Agregar nuevo libro'}
      </Typography>

      {/* Subtítulo */}
      <Typography
        variant="subtitle1"
        sx={{
          fontSize: { xs: '18px', sm: '20px', md: '24px' },
          color: '#4B453D',
          fontWeight: 400,
          fontFamily: 'League Spartan, sans-serif',
          lineHeight: '20px',
          letterSpacing: '0.1px',
          marginBottom: '16px'
        }}
      >
        {isEditing 
          ? 'Modifica la ubicación del libro en la biblioteca.'
          : 'Establece la ubicación del libro en la biblioteca.'
        }
      </Typography>

      {/* Línea divisoria */}
      <Box
        sx={{
          width: '100%',
          height: 0,
          borderTop: '3px solid #3A332A',
          marginBottom: '32px'
        }}
      />

      {/* Error message */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            marginBottom: '24px',
            fontFamily: 'League Spartan'
          }}
        >
          {error}
        </Alert>
      )}

      {/* Contenedor principal del formulario */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: { xs: '24px', lg: '32px' },
          maxWidth: '1200px',
          width: '100%'
        }}
      >
        {/* Panel principal del formulario */}
        <Box
          sx={{
            backgroundColor: 'rgba(225,197,171,0.8)',
            borderRadius: '10px',
            padding: { xs: '24px', sm: '32px' },
            width: { xs: '100%', lg: '573px' },
            minHeight: { xs: 'auto', lg: '560px' },
            height: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
        {/* Información del libro (solo lectura) */}
        {initialData && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: '16px', sm: '24px' },
              marginBottom: '32px',
              padding: '16px',
              backgroundColor: 'rgba(255, 249, 236, 0.7)',
              borderRadius: '10px'
            }}
          >
            {/* Imagen del libro */}
            <Box
              sx={{
                width: { xs: '80px', sm: '100px' },
                height: { xs: '80px', sm: '100px' },
                backgroundColor: '#e6dde8',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                alignSelf: { xs: 'center', sm: 'flex-start' }
              }}
            >
              <BookIcon color="#999" width={40} height={40} />
            </Box>

            {/* Información del libro */}
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 600,
                  fontSize: { xs: '20px', sm: '24px' },
                  color: '#453726',
                  marginBottom: '8px'
                }}
              >
                {initialData.titulo}
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: { xs: '16px', sm: '18px' },
                  color: '#666666',
                  marginBottom: '4px'
                }}
              >
                {initialData.autor}
              </Typography>
              {initialData.isbn && (
                <Typography
                  sx={{
                    fontFamily: 'League Spartan',
                    fontWeight: 400,
                    fontSize: { xs: '14px', sm: '16px' },
                    color: '#888888',
                    marginBottom: '4px'
                  }}
                >
                  ISBN: {initialData.isbn}
                </Typography>
              )}
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: { xs: '14px', sm: '16px' },
                  color: '#888888'
                }}
              >
                {initialData.editorial}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Formulario de posición - Grid de 2 columnas como en Figma */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '207px 206px',
            gap: '23px',
            justifyContent: 'center',
            maxWidth: '436px',
            margin: '0 auto',
            flex: 1
          }}
        >
          {/* Estante */}
          <Typography
            sx={{
              fontFamily: 'League Spartan',
              fontWeight: 400,
              fontSize: '24px',
              color: '#3a332a',
              letterSpacing: '0.1px',
              lineHeight: '20px',
              display: 'flex',
              alignItems: 'center',
              height: '34px'
            }}
          >
            Estante:
          </Typography>
          
          <Controller
            name="estante"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <Select
                  {...field}
                  sx={{
                    height: '35px',
                    backgroundColor: '#fff9ec',
                    borderRadius: '10px',
                    border: '1px solid rgba(69,55,38,0.15)',
                    fontFamily: 'League Spartan',
                    fontSize: '20px',
                    fontWeight: 300,
                    color: '#000000',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiSelect-select': {
                      padding: '0 17px',
                      lineHeight: '35px',
                      letterSpacing: '0.1px'
                    }
                  }}
                >
                  {estantesOptions.map((estante) => (
                    <MenuItem key={estante} value={estante}>
                      {estante}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          {/* Etiqueta */}
          <Typography
            sx={{
              fontFamily: 'League Spartan',
              fontWeight: 400,
              fontSize: '24px',
              color: '#3a332a',
              letterSpacing: '0.1px',
              lineHeight: '20px',
              display: 'flex',
              alignItems: 'center',
              height: '34px'
            }}
          >
            Etiqueta:
          </Typography>
          
          <Controller
            name="etiqueta"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <Select
                  {...field}
                  sx={{
                    height: '35px',
                    backgroundColor: '#fff9ec',
                    borderRadius: '10px',
                    border: '1px solid rgba(69,55,38,0.15)',
                    fontFamily: 'League Spartan',
                    fontSize: '20px',
                    fontWeight: 300,
                    color: '#000000',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiSelect-select': {
                      padding: '0 17px',
                      lineHeight: '35px',
                      letterSpacing: '0.1px'
                    }
                  }}
                >
                  {etiquetasOptions.map((etiqueta) => (
                    <MenuItem key={etiqueta.value} value={etiqueta.value}>
                      {etiqueta.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          {/* Fila */}
          <Typography
            sx={{
              fontFamily: 'League Spartan',
              fontWeight: 400,
              fontSize: '24px',
              color: '#3a332a',
              letterSpacing: '0.1px',
              lineHeight: '20px',
              display: 'flex',
              alignItems: 'center',
              height: '34px'
            }}
          >
            Fila:
          </Typography>
          
          <Controller
            name="fila"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <Select
                  {...field}
                  sx={{
                    height: '35px',
                    backgroundColor: '#fff9ec',
                    borderRadius: '10px',
                    border: '1px solid rgba(69,55,38,0.15)',
                    fontFamily: 'League Spartan',
                    fontSize: '20px',
                    fontWeight: 300,
                    color: '#000000',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiSelect-select': {
                      padding: '0 17px',
                      lineHeight: '35px',
                      letterSpacing: '0.1px'
                    }
                  }}
                >
                  {filasDisponibles.map((fila) => (
                    <MenuItem key={fila} value={fila}>
                      {fila}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          {/* Columna */}
          <Typography
            sx={{
              fontFamily: 'League Spartan',
              fontWeight: 400,
              fontSize: '24px',
              color: '#3a332a',
              letterSpacing: '0.1px',
              lineHeight: '20px',
              display: 'flex',
              alignItems: 'center',
              height: '34px'
            }}
          >
            Columna:
          </Typography>
          
          <Controller
            name="columna"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <Select
                  {...field}
                  sx={{
                    height: '35px',
                    backgroundColor: '#fff9ec',
                    borderRadius: '10px',
                    border: '1px solid rgba(69,55,38,0.15)',
                    fontFamily: 'League Spartan',
                    fontSize: '20px',
                    fontWeight: 300,
                    color: '#000000',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiSelect-select': {
                      padding: '0 17px',
                      lineHeight: '35px',
                      letterSpacing: '0.1px'
                    }
                  }}
                >
                  {columnasDisponibles.map((columna) => (
                    <MenuItem key={columna} value={columna}>
                      {columna}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Box>

        {/* Botones */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: '16px', sm: '20px' },
            marginTop: 'auto',
            justifyContent: 'center',
            paddingTop: '24px'
          }}
        >
          <Button
            type="button"
            onClick={handleCancel}
            sx={{
              height: '48px',
              minWidth: { xs: '100%', sm: '140px' },
              backgroundColor: '#A47149',
              color: '#fff9ec',
              borderRadius: '8px',
              fontFamily: 'League Spartan',
              fontSize: { xs: '16px', sm: '18px' },
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#8b5e3c',
              }
            }}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting || loading}
            sx={{
              height: '48px',
              minWidth: { xs: '100%', sm: '140px' },
              backgroundColor: '#2F5233',
              color: '#fff9ec',
              borderRadius: '8px',
              fontFamily: 'League Spartan',
              fontSize: { xs: '16px', sm: '18px' },
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#234026',
              },
              '&:disabled': {
                backgroundColor: 'rgba(47, 82, 51, 0.5)',
                color: 'rgba(255, 249, 236, 0.5)'
              }
            }}
          >
            {isSubmitting || loading 
              ? (isEditing ? 'Actualizando...' : 'Guardando...') 
              : (isEditing ? 'Agregar Libro' : 'Guardar libro')
            }
          </Button>
        </Box>
        </Box>

        {/* Panel de Descripción */}
        {initialData && (
          <Box
            sx={{
              backgroundColor: 'rgba(225,197,171,0.8)',
              borderRadius: '10px',
              padding: { xs: '24px', sm: '32px' },
              width: { xs: '100%', lg: '301px' },
              height: { xs: 'auto', lg: '560px' },
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Título Descripción */}
            <Typography
              sx={{
                fontFamily: 'League Spartan',
                fontWeight: 600,
                fontSize: '30px',
                color: '#453726',
                letterSpacing: '0.1px',
                lineHeight: '20px',
                textAlign: 'center',
                marginBottom: '24px'
              }}
            >
              Descripcion
            </Typography>

            {/* Área de contenido de descripción */}
            <Box
              sx={{
                backgroundColor: '#fff9ec',
                borderRadius: '10px',
                padding: '24px',
                flex: 1,
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  fontSize: '24px',
                  color: '#3a332a',
                  letterSpacing: '0.1px',
                  lineHeight: '20px',
                  textAlign: 'justify'
                }}
              >
                {initialData.descripcion || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut magna nisi, vulputate vitae sapien vitae, laoreet pharetra justo. Duis fringilla non nisi eu viverra. Nullam in aliquam arcu. Donec sodales eu tellus ac finibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer placerat consectetur bibendum.'}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LibroForm;
