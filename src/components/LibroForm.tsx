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
import { useAppStore } from '../store/appStore';

interface LibroFormProps {
  onSubmit: (data: PosicionLibroFormData) => void;
  initialData?: Libro;
  loading?: boolean;
  error?: string | null;
  isEditing?: boolean;
}

const LibroForm: React.FC<LibroFormProps> = ({ 
  onSubmit, 
  initialData, 
  loading = false, 
  error = null,
  isEditing = false 
}) => {
  const navigate = useNavigate();
  const { estantes, loadEstantes, estanteLoading, obtenerEtiquetasUnicas, loadSecciones, secciones } = useAppStore();
  const [filasDisponibles, setFilasDisponibles] = useState<string[]>(['1', '2', '3', '4', '5']);
  const [columnasDisponibles, setColumnasDisponibles] = useState<string[]>(['1', '2', '3', '4', '5', '6']);
  const [etiquetasDisponibles, setEtiquetasDisponibles] = useState<string[]>(['sin-etiqueta']);
  const [etiquetasLoading, setEtiquetasLoading] = useState<boolean>(false);
  
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting }
  } = useForm<PosicionLibroFormData>({
    resolver: yupResolver(posicionLibroSchema),
    defaultValues: {
      estante: '',  // Iniciar vacío para evitar errores de MUI
      etiqueta: 'sin-etiqueta',
      fila: '1',
      columna: '1'
    }
  });

  const estanteSeleccionado = watch('estante');
  const etiquetaSeleccionada = watch('etiqueta');

  // Cargar estantes al montar el componente
  useEffect(() => {
    loadEstantes();
  }, [loadEstantes]);

  // Establecer valores iniciales cuando los datos estén disponibles
  useEffect(() => {
    // Solo establecer valores si tenemos estantes cargados
    if (estantes.length > 0) {
      const currentEstante = watch('estante');
      if (!currentEstante) {
        // Si hay datos iniciales y el estante existe en la lista, mantenerlo
        if (initialData?.estante) {
          const estanteExiste = estantes.some(e => e.nombre === initialData.estante);
          if (estanteExiste) {
            setValue('estante', initialData.estante);
          } else {
            // Si el estante inicial no existe en la lista, usar el primero disponible
            setValue('estante', estantes[0].nombre);
          }
        } else {
          // Si no hay datos iniciales, usar el primer estante
          setValue('estante', estantes[0].nombre);
        }
      }
    }
  }, [estantes, setValue, initialData?.estante, watch]);

  // Cargar etiquetas cuando cambie el estante seleccionado
  useEffect(() => {
    const cargarEtiquetasYDimensiones = async () => {
      if (estanteSeleccionado && estantes.length > 0) {
        setEtiquetasLoading(true);
        try {
          const estante = estantes.find(e => e.nombre === estanteSeleccionado);
          if (estante) {
            // Cargar etiquetas
            const etiquetas = await obtenerEtiquetasUnicas(estante.id);
            const etiquetasConSinEtiqueta = ['sin-etiqueta', ...etiquetas.filter(e => e !== 'sin-etiqueta')];
            setEtiquetasDisponibles(etiquetasConSinEtiqueta);
            
            // Cargar secciones para obtener las dimensiones disponibles
            await loadSecciones(estante.id);
            
          }
        } catch (error) {
          console.error('Error al cargar etiquetas:', error);
          setEtiquetasDisponibles(['sin-etiqueta']);
          // Usar dimensiones por defecto en caso de error
          const filasDefault = ['1', '2', '3', '4', '5'];
          const columnasDefault = ['1', '2', '3', '4', '5', '6'];
          setFilasDisponibles(filasDefault);
          setColumnasDisponibles(columnasDefault);
        } finally {
          setEtiquetasLoading(false);
        }
      } else {
        // Si no hay estante seleccionado, usar valores por defecto
        setEtiquetasDisponibles(['sin-etiqueta']);
        const filasDefault = ['1', '2', '3', '4', '5'];
        const columnasDefault = ['1', '2', '3', '4', '5', '6'];
        setFilasDisponibles(filasDefault);
        setColumnasDisponibles(columnasDefault);
      }
    };

    cargarEtiquetasYDimensiones();
  }, [estanteSeleccionado, estantes, obtenerEtiquetasUnicas, loadSecciones]);

  // Efecto separado para procesar las secciones una vez que se cargan
  useEffect(() => {
    if (secciones && secciones.length > 0) {
      let seccionesFiltradas = secciones;
      
      // Si hay una etiqueta seleccionada y no es "sin-etiqueta", filtrar por esa etiqueta
      if (etiquetaSeleccionada && etiquetaSeleccionada !== 'sin-etiqueta') {
        seccionesFiltradas = secciones.filter(s => s.etiqueta === etiquetaSeleccionada);
      }
      
      // Determinar filas y columnas disponibles basándose en las secciones filtradas
      const filasUnicas = [...new Set(seccionesFiltradas.map(s => s.fila?.toString()).filter(Boolean))].sort((a, b) => parseInt(a) - parseInt(b));
      const columnasUnicas = [...new Set(seccionesFiltradas.map(s => s.columna?.toString()).filter(Boolean))].sort((a, b) => parseInt(a) - parseInt(b));
      
      // Usar las dimensiones encontradas o valores por defecto
      setFilasDisponibles(filasUnicas.length > 0 ? filasUnicas : ['1', '2', '3', '4', '5']);
      setColumnasDisponibles(columnasUnicas.length > 0 ? columnasUnicas : ['1', '2', '3', '4', '5', '6']);
      
      // Reset fila y columna si están fuera del nuevo rango
      const currentFila = watch('fila');
      const currentColumna = watch('columna');
      
      if (filasUnicas.length > 0 && !filasUnicas.includes(currentFila)) {
        setValue('fila', filasUnicas[0]);
      }
      if (columnasUnicas.length > 0 && !columnasUnicas.includes(currentColumna)) {
        setValue('columna', columnasUnicas[0]);
      }
    }
  }, [secciones, etiquetaSeleccionada, setValue, watch]);

  // Inicializar con datos por defecto al montar el componente
  useEffect(() => {
    const filasDefault = ['1', '2', '3', '4', '5'];
    const columnasDefault = ['1', '2', '3', '4', '5', '6'];
    setFilasDisponibles(filasDefault);
    setColumnasDisponibles(columnasDefault);
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
                  {estanteLoading ? (
                    <MenuItem value="" disabled>
                      Cargando estantes...
                    </MenuItem>
                  ) : estantes.length === 0 ? (
                    <MenuItem value="" disabled>
                      No hay estantes disponibles
                    </MenuItem>
                  ) : (
                    estantes.map((estante) => (
                      <MenuItem key={estante.id} value={estante.nombre}>
                        {estante.nombre}
                      </MenuItem>
                    ))
                  )}
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
                  {etiquetasLoading ? (
                    <MenuItem value="" disabled>
                      Cargando etiquetas...
                    </MenuItem>
                  ) : etiquetasDisponibles.length === 0 ? (
                    <MenuItem value="sin-etiqueta">
                      Sin etiqueta
                    </MenuItem>
                  ) : (
                    etiquetasDisponibles.map((etiqueta) => (
                      <MenuItem key={etiqueta} value={etiqueta}>
                        {etiqueta === 'sin-etiqueta' ? 'Sin etiqueta' : etiqueta}
                      </MenuItem>
                    ))
                  )}
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
              : (isEditing ? 'Guardar' : 'Guardar libro')
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
