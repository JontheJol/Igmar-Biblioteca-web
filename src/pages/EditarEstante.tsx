import '@fontsource/league-spartan/400.css';
import '@fontsource/league-spartan/500.css';
import '@fontsource/league-spartan/600.css';
import '@fontsource/rowdies/400.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button,
  Card,
  FormHelperText,
  Switch,
  FormControlLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppStore } from '../store/appStore';
import { estanteSchema } from '../utils/validation';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLoading } from '../hooks/useLoading';
import type { EstanteFormData } from '../utils/validation';

const EditarEstante: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { estantes, updateEstante, removeEstante, loadSecciones, updateSeccion, secciones, currentUser } = useAppStore(); // Añadido currentUser

  // Estados para el manejo de etiquetas
  const [mostrarEtiquetas, setMostrarEtiquetas] = useState(false);
  const [etiquetas, setEtiquetas] = useState<string[]>([]);
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');
  const [etiquetaEditando, setEtiquetaEditando] = useState<{ index: number; valor: string } | null>(null);
  const [espaciosSeleccionados, setEspaciosSeleccionados] = useState<number[]>([]);
  const [modoSeleccionMultiple, setModoSeleccionMultiple] = useState(false);
  const [etiquetasCargadas, setEtiquetasCargadas] = useState(false);
  
  // Estado para confirmar eliminación
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);
  
  // Etiquetas únicas disponibles para este estante específico
  const etiquetasDisponiblesEstante = Array.from(new Set(etiquetas.filter(e => e && e.trim())));

  // Buscar el estante a editar
  const estante = estantes.find(e => e.id === Number(id));

  // Hook de loading reutilizable
  const {
    loading: operationLoading,
    startLoading,
    stopLoading
  } = useLoading();

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<EstanteFormData>({
    resolver: yupResolver(estanteSchema),
    defaultValues: {
      ubicacion: '',
      fila: '',
      columna: '',
    },
  });

  // Observar cambios en tiempo real para actualizar la vista del estante
  const watchedValues = useWatch({
    control,
    name: ['ubicacion', 'fila', 'columna']
  });

  const [ubicacion, fila, columna] = watchedValues;

  // Función para generar el estante dinámico
  const generateEstante = () => {
    const filas = parseInt(fila) || 0;
    const columnas = parseInt(columna) || 0;
    
    if (filas <= 0 || columnas <= 0) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#666',
            fontFamily: 'League Spartan',
            fontSize: '18px'
          }}
        >
          Ingresa filas y columnas para ver el estante
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: `repeat(${filas}, 1fr)`,
          gridTemplateColumns: `repeat(${columnas}, 1fr)`,
          gap: '4px',
          width: '100%',
          height: '100%',
          padding: '10px',
          maxWidth: '400px',
          maxHeight: '350px',
          margin: '0 auto'
        }}
      >
        {Array.from({ length: filas * columnas }, (_, index) => {
          const filaActual = Math.floor(index / columnas) + 1;
          const columnaActual = (index % columnas) + 1;
          const etiquetaDefault = `${filaActual}-${columnaActual}`;
          
          // Si estamos en modo etiquetas, mostrar la etiqueta solo si es personalizada
          // (diferente al formato por defecto)
          const etiquetaPersonalizada = etiquetas[index] && 
                                       etiquetas[index].trim() !== '' && 
                                       etiquetas[index] !== etiquetaDefault;
          
          const contenido = mostrarEtiquetas && etiquetaPersonalizada
            ? etiquetas[index] 
            : etiquetaDefault;
          
          const estaSeleccionado = espaciosSeleccionados.includes(index);
          
          return (
            <Box
              key={index}
              sx={{
                backgroundColor: mostrarEtiquetas 
                  ? (estaSeleccionado ? '#2f5232' : (etiquetaPersonalizada ? '#E1C5AB' : '#B8A9C9'))
                  : '#B8A9C9',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: estaSeleccionado ? '#fff' : '#fff',
                fontFamily: 'League Spartan',
                fontSize: { xs: '10px', md: '12px' },
                fontWeight: 500,
                minHeight: '30px',
                border: `2px solid ${
                  estaSeleccionado 
                    ? '#1a3d1e' 
                    : mostrarEtiquetas 
                      ? (etiquetaPersonalizada ? '#C9A876' : '#9A8AA8')
                      : '#9A8AA8'
                }`,
                boxShadow: estaSeleccionado 
                  ? '0px 2px 4px rgba(0,0,0,0.3)' 
                  : '0px 1px 2px rgba(0,0,0,0.1)',
                cursor: mostrarEtiquetas ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                '&:hover': mostrarEtiquetas ? {
                  backgroundColor: estaSeleccionado ? '#234026' : '#D4B896',
                  transform: 'scale(1.05)'
                } : {}
              }}
              onClick={() => {
                if (mostrarEtiquetas) {
                  handleClickEspacio(index);
                }
              }}
            >
              {contenido}
            </Box>
          );
        })}
      </Box>
    );
  };

  // Funciones para manejo de etiquetas
  const handleClickEspacio = (index: number) => {
    if (modoSeleccionMultiple) {
      // Modo selección múltiple - agregar/quitar del array
      setEspaciosSeleccionados(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    } else {
      // Modo individual - abrir diálogo para editar
      setEtiquetaEditando({ index, valor: etiquetas[index] || '' });
      setNuevaEtiqueta(etiquetas[index] || '');
      setDialogAbierto(true);
    }
  };

  const handleActivarSeleccionMultiple = () => {
    setModoSeleccionMultiple(true);
    setEspaciosSeleccionados([]);
  };

  const handleDesactivarSeleccionMultiple = () => {
    setModoSeleccionMultiple(false);
    setEspaciosSeleccionados([]);
  };

  const handleAsignarEtiquetaMultiple = (etiqueta: string) => {
    const nuevasEtiquetas = [...etiquetas];
    espaciosSeleccionados.forEach(index => {
      nuevasEtiquetas[index] = etiqueta;
    });
    setEtiquetas(nuevasEtiquetas);
    setEspaciosSeleccionados([]);
    setModoSeleccionMultiple(false);
  };

  const handleAgregarEtiqueta = () => {
    setEtiquetaEditando(null);
    setNuevaEtiqueta('');
    setDialogAbierto(true);
  };

  const handleGuardarEtiqueta = () => {
    if (nuevaEtiqueta.trim()) {
      const nuevasEtiquetas = [...etiquetas];
      
      if (modoSeleccionMultiple && espaciosSeleccionados.length > 0) {
        // Asignar a múltiples espacios seleccionados
        espaciosSeleccionados.forEach(index => {
          nuevasEtiquetas[index] = nuevaEtiqueta.trim();
        });
        setEspaciosSeleccionados([]);
        setModoSeleccionMultiple(false);
      } else if (etiquetaEditando !== null) {
        // Editar etiqueta existente
        nuevasEtiquetas[etiquetaEditando.index] = nuevaEtiqueta.trim();
      } else {
        // Agregar nueva etiqueta al primer espacio disponible
        const filas = parseInt(fila) || 0;
        const columnas = parseInt(columna) || 0;
        const totalEspacios = filas * columnas;
        
        for (let i = 0; i < totalEspacios; i++) {
          if (!nuevasEtiquetas[i]) {
            nuevasEtiquetas[i] = nuevaEtiqueta.trim();
            break;
          }
        }
      }
      setEtiquetas(nuevasEtiquetas);
    }
    setDialogAbierto(false);
    setEtiquetaEditando(null);
    setNuevaEtiqueta('');
  };

  const handleEliminarEtiqueta = (index: number) => {
    const nuevasEtiquetas = [...etiquetas];
    delete nuevasEtiquetas[index];
    setEtiquetas(nuevasEtiquetas);
  };

  const handleCerrarDialog = () => {
    setDialogAbierto(false);
    setEtiquetaEditando(null);
    setNuevaEtiqueta('');
  };

  const onSubmit = async (values: EstanteFormData) => {
    startLoading();
    
    try {
      if (!estante) {
        console.error('No se encontró el estante a editar');
        setTimeout(() => {
          stopLoading();
          navigate('/estantes');
        }, 1500);
        return;
      }

      // Actualizar el estante
      const estanteData = {
        ...estante,
        ...values,
        nombre: values.ubicacion, // El nombre es exactamente la ubicación ingresada
      };

      await updateEstante(estante.id, estanteData);
      
      // Si está en modo etiquetas, guardar las etiquetas como secciones
      if (mostrarEtiquetas && etiquetas.length > 0) {
        await guardarEtiquetasComoSecciones(values);
        // Recargar las etiquetas después de guardar para reflejar los cambios
        setEtiquetasCargadas(false);
        // El loading y navegación se maneja en guardarEtiquetasComoSecciones
      } else {
        setTimeout(() => {
          stopLoading();
          navigate('/estantes');
        }, 1500);
      }
      
    } catch (error) {
      console.error('Error al actualizar estante:', error);
      setTimeout(() => {
        stopLoading();
        navigate('/estantes');
      }, 2000);
    }
  };

  const guardarEtiquetasComoSecciones = async (values: EstanteFormData) => {
    startLoading();
    
    try {
      // Verificar permisos del usuario
      if (!currentUser || currentUser.roleId < 3) {
        console.warn('Usuario no tiene permisos para actualizar secciones');
        setTimeout(() => {
          stopLoading();
          navigate('/estantes');
        }, 1500);
        return;
      }

      // Cargar las secciones actuales del estante
      await loadSecciones(estante!.id);
      
      // Actualizar secciones existentes con las etiquetas
      const columnas = parseInt(values.columna || '0');
      
      let seccionesActualizadas = 0;
      
      for (let i = 0; i < etiquetas.length; i++) {
        const etiqueta = etiquetas[i];
        
        if (!etiqueta || !etiqueta.trim()) {
          continue; // Saltar espacios vacíos
        }
        
        // Calcular posición (fila, columna) basada en el índice
        const fila = Math.floor(i / columnas) + 1;
        const columna = (i % columnas) + 1;
        const etiquetaDefault = `${fila}-${columna}`;
        
        // No guardar etiquetas que coincidan con el formato por defecto
        if (etiqueta.trim() === etiquetaDefault) {
          console.log(`Saltando etiqueta por defecto: ${etiqueta.trim()}`);
          continue;
        }
        
        // Buscar si ya existe una sección en esta posición
        const seccionExistente = secciones.find(s => 
          s.estante_id === estante!.id && s.fila === fila && s.columna === columna
        );
        
        if (seccionExistente) {
          // Actualizar sección existente con la etiqueta personalizada
          await updateSeccion(seccionExistente.id, {
            etiqueta: etiqueta.trim(),
            fila,
            columna
          });
          
          seccionesActualizadas++;
          console.log(`Sección actualizada: ${fila}-${columna} con etiqueta personalizada "${etiqueta.trim()}"`);
        } else {
          console.log(`No se encontró sección para posición ${fila}-${columna}`);
        }
      }
      
      if (seccionesActualizadas > 0) {
        console.log(`Se actualizaron ${seccionesActualizadas} secciones con etiquetas`);
      }
      
      setTimeout(() => {
        stopLoading();
        navigate('/estantes');
      }, 2000);
      
    } catch (error) {
      console.error('Error al guardar etiquetas:', error);
      setTimeout(() => {
        stopLoading();
        navigate('/estantes');
      }, 2000);
      // No interrumpir el flujo, solo mostrar error en consola
    }
  };

  // Cargar los datos del estante cuando el componente se monta
  useEffect(() => {
    if (estante && !etiquetasCargadas) {
      setValue('ubicacion', estante.ubicacion || '');
      setValue('fila', estante.fila || '');
      setValue('columna', estante.columna || '');
      
      // Cargar etiquetas existentes del estante
      const filas = parseInt(estante.fila || '0');
      const columnas = parseInt(estante.columna || '0');
      const totalEspacios = (filas > 0 && columnas > 0) ? filas * columnas : 0;
      
      if (totalEspacios > 0 && totalEspacios <= 1000) { // Límite razonable
        const etiquetasArray = new Array(totalEspacios).fill('');
        
        const cargarEtiquetasDesdeAPI = async () => {
          startLoading();
          try {
            // Verificar permisos del usuario
            if (!currentUser || currentUser.roleId < 3) {
              console.warn('Usuario no tiene permisos para cargar secciones, usando etiquetas locales');
              cargarEtiquetasLocales();
              return;
            }
            
            // Cargar secciones desde la API
            await loadSecciones(estante.id);
            
            // Poblar etiquetas basadas en las secciones (usar el estado actualizado)
            // Nota: Las secciones se actualizarán en el store, las usaremos en el próximo render
            setEtiquetasCargadas(true);
            setTimeout(() => stopLoading(), 1000);
            
          } catch (error) {
            console.error('Error al cargar etiquetas desde API:', error);
            setTimeout(() => {
              cargarEtiquetasLocales();
              stopLoading();
            }, 1000);
          }
        };

        const cargarEtiquetasLocales = () => {
          // Fallback: usar etiquetas del estante si las hay
          if (estante.etiquetas && estante.etiquetas.length > 0) {
            estante.etiquetas.forEach((etiqueta, index) => {
              if (index < totalEspacios) {
                // Calcular la etiqueta por defecto para esta posición
                const fila = Math.floor(index / columnas) + 1;
                const columna = (index % columnas) + 1;
                const etiquetaDefault = `${fila}-${columna}`;
                
                // Solo asignar si no coincide con el formato por defecto
                if (etiqueta && etiqueta.trim() !== etiquetaDefault) {
                  etiquetasArray[index] = etiqueta;
                }
              }
            });
            console.log('Etiquetas personalizadas cargadas localmente:', etiquetasArray.filter(e => e));
          }
          setEtiquetas(etiquetasArray);
          setEtiquetasCargadas(true);
        };
          
        cargarEtiquetasDesdeAPI();
      } else {
        // Si los espacios no son válidos, usar un array vacío
        setEtiquetas([]);
        setEtiquetasCargadas(true);
      }
    } else if (id && !estante) {
      // Si no se encuentra el estante, redirigir
      console.error('Estante no encontrado');
      navigate('/estantes');
    }
  }, [estante, id, setValue, navigate, currentUser, etiquetasCargadas]);

  // Efecto separado para mapear las secciones a etiquetas cuando se cargan
  useEffect(() => {
    if (etiquetasCargadas && estante && secciones.length > 0) {
      const filas = parseInt(estante.fila || '0');
      const columnas = parseInt(estante.columna || '0');
      const totalEspacios = (filas > 0 && columnas > 0) ? filas * columnas : 0;
      
      if (totalEspacios > 0) {
        const etiquetasArray = new Array(totalEspacios).fill('');
        
        // Poblar etiquetas basadas en las secciones
        secciones.forEach(seccion => {
          if (seccion.estante_id === estante.id && seccion.etiqueta) {
            // Calcular índice basado en fila y columna
            const index = (seccion.fila - 1) * columnas + (seccion.columna - 1);
            if (index >= 0 && index < totalEspacios) {
              const etiquetaDefault = `${seccion.fila}-${seccion.columna}`;
              // Solo asignar la etiqueta si no coincide con el formato por defecto
              if (seccion.etiqueta.trim() !== etiquetaDefault) {
                etiquetasArray[index] = seccion.etiqueta;
              }
            }
          }
        });
        
        setEtiquetas(etiquetasArray);
        console.log('Etiquetas cargadas desde secciones:', etiquetasArray.filter(e => e));
      }
    }
  }, [secciones, estante, etiquetasCargadas]);

  const handleCancelar = () => {
    navigate('/estantes');
  };

  const handleEliminarEstante = () => {
    setMostrarConfirmacionEliminar(true);
  };

  const handleConfirmarEliminacion = async () => {
    try {
      if (!estante) return;
      
      await removeEstante(estante.id);
      setMostrarConfirmacionEliminar(false);
      navigate('/estantes');
    } catch (error) {
      console.error('Error al eliminar estante:', error);
      setMostrarConfirmacionEliminar(false);
    }
  };

  const handleCancelarEliminacion = () => {
    setMostrarConfirmacionEliminar(false);
  };

  if (!estante) {
    return null; // O un componente de loading
  }

  return (
    <Box sx={{ backgroundColor: '#fff9ec', minHeight: '100vh', position: 'relative' }}>
      <LoadingSpinner 
        loading={operationLoading} 
        fullscreen={true}
        overlay={true}
        size={60}
      />
      
      <Box
        sx={{
          padding: { xs: 3, sm: 4 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Título */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '32px', sm: '48px', md: '64px' },
            fontWeight: 400,
            color: '#453726',
            fontFamily: 'Rowdies, sans-serif',
            marginBottom: { xs: '20px', md: '35px' },
            width: { xs: '100%', md: '859px' },
            lineHeight: { xs: '36px', sm: '52px', md: '70px' },
            letterSpacing: '0.1px'
          }}
        >
          Editar estante
        </Typography>

        {/* Línea divisoria */}
        <Box
          sx={{
            width: { xs: '100%', md: '859px' },
            height: 0,
            borderTop: '3px solid #3A332A',
            marginBottom: '20px'
          }}
        />

        {/* Debug de usuario - información temporal */}
        {currentUser && (
          <Box
            sx={{
              mb: 2,
              p: 2,
              bgcolor: '#f5f5f5',
              borderRadius: 2,
              border: '1px solid #ddd'
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              🔍 Debug - Info del Usuario:
            </Typography>
            <Typography variant="body2">
              <strong>Nombre:</strong> {currentUser.name} | <strong>Email:</strong> {currentUser.email}
            </Typography>
            <Typography variant="body2">
              <strong>Rol ID:</strong> {currentUser.roleId} | <strong>Rol:</strong> {currentUser.roleName}
            </Typography>
            <Typography variant="body2" sx={{ 
              color: currentUser.roleId >= 3 ? 'green' : 'red',
              fontWeight: 'bold'
            }}>
              Estado secciones: {currentUser.roleId >= 3 ? '✅ Permitido (Rol ≥ 3)' : '❌ No permitido (Requiere Rol ≥ 3)'}
            </Typography>
          </Box>
        )}

        {/* Slider para alternar entre vista normal y etiquetas */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '20px'
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={mostrarEtiquetas}
                onChange={(e) => setMostrarEtiquetas(e.target.checked)}
                disabled={!currentUser || currentUser.roleId < 3}
                sx={{
                  '& .MuiSwitch-track': {
                    backgroundColor: '#B8A9C9',
                  },
                  '& .MuiSwitch-thumb': {
                    backgroundColor: '#453726',
                  },
                  '& .Mui-checked': {
                    '& .MuiSwitch-thumb': {
                      backgroundColor: '#2f5232',
                    },
                  },
                  '& .Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#E1C5AB !important',
                  },
                }}
              />
            }
            label={
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  fontSize: '18px',
                  color: '#453726',
                }}
              >
                {mostrarEtiquetas ? 'Modo Etiquetas' : 'Vista Normal'}
              </Typography>
            }
          />
          {(!currentUser || currentUser.roleId < 3) && (
            <Typography
              sx={{
                fontFamily: 'League Spartan',
                fontSize: '14px',
                color: '#d32f2f',
                fontStyle: 'italic',
                marginTop: '5px',
                textAlign: 'center'
              }}
            >
              * Se requiere rol de Administrador para usar el sistema de etiquetas persistente
            </Typography>
          )}
        </Box>

        {/* Contenedor principal */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: '20px', md: '24px' },
            maxWidth: '1200px',
            width: '100%'
          }}
        >
          {/* Panel izquierdo - Estante virtual */}
          <Card
            sx={{
              backgroundColor: 'rgba(225,197,171,0.8)',
              borderRadius: '10px',
              padding: { xs: '20px', md: '24px' },
              width: { xs: '100%', md: '65%' },
              height: '560px',
              order: { xs: 2, md: 1 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* Título */}
            <Typography
              sx={{
                fontFamily: 'League Spartan',
                fontWeight: 600,
                fontSize: { xs: '28px', md: '32px' },
                color: '#453726',
                textAlign: 'center',
                marginBottom: '24px',
                lineHeight: '20px',
                letterSpacing: '0.1px'
              }}
            >
              Estante virtual
            </Typography>

            {/* Imagen/representación del estante */}
            <Box
              sx={{
                backgroundColor: '#f5eff7',
                borderRadius: '8px',
                width: { xs: '280px', md: '100%' },
                height: { xs: '280px', md: '371px' },
                maxWidth: '450px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                maxHeight: '371px',
                position: 'relative'
              }}
            >
              {generateEstante()}
            </Box>

            {/* Información del estante generado */}
            <Box
              sx={{
                textAlign: 'center',
                marginTop: '16px',
                padding: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '8px'
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  fontSize: '16px',
                  color: '#453726',
                  marginBottom: '4px'
                }}
              >
                {(() => {
                  const ubicacionValue = ubicacion || '';
                  return ubicacionValue 
                    ? `Nombre: ${ubicacionValue}`
                    : 'Nombre: Ingrese una ubicación';
                })()}
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 400,
                  fontSize: '14px',
                  color: '#666',
                }}
              >
                {(() => {
                  const filas = parseInt(fila) || 0;
                  const columnas = parseInt(columna) || 0;
                  const total = filas * columnas;
                  return total > 0 
                    ? `${filas} fila${filas !== 1 ? 's' : ''} × ${columnas} columna${columnas !== 1 ? 's' : ''} = ${total} espacios`
                    : 'Configura las dimensiones para ver los espacios';
                })()}
              </Typography>
            </Box>

            {/* Botones de acción */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: { xs: '12px', md: '16px' },
                marginTop: '24px',
                paddingTop: '16px'
              }}
            >
              <Button
                onClick={handleCancelar}
                sx={{
                  backgroundColor: '#3a332a',
                  color: '#fff9ec',
                  borderRadius: '8px',
                  height: '38px',
                  width: { xs: '100%', sm: '120px' },
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  fontSize: '16px',
                  letterSpacing: '0.1px',
                  lineHeight: '20px',
                  textTransform: 'none',
                  boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
                  '&:hover': {
                    backgroundColor: '#2d2620',
                  }
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleEliminarEstante}
                sx={{
                  backgroundColor: '#d32f2f',
                  color: '#fff',
                  borderRadius: '8px',
                  height: '38px',
                  width: { xs: '100%', sm: '120px' },
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  fontSize: '16px',
                  letterSpacing: '0.1px',
                  lineHeight: '20px',
                  textTransform: 'none',
                  boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
                  '&:hover': {
                    backgroundColor: '#c62828',
                  }
                }}
              >
                Eliminar
              </Button>
              <Button
                type="submit"
                form="estante-form"
                sx={{
                  backgroundColor: '#2f5232',
                  color: '#fff9ec',
                  borderRadius: '8px',
                  height: '38px',
                  width: { xs: '100%', sm: '120px' },
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  fontSize: '16px',
                  letterSpacing: '0.1px',
                  lineHeight: '20px',
                  textTransform: 'none',
                  boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
                  '&:hover': {
                    backgroundColor: '#234026',
                  }
                }}
              >
                Actualizar
              </Button>
            </Box>
          </Card>

          {/* Panel derecho - Datos del estante */}
          <Card
            sx={{
              backgroundColor: 'rgba(225,197,171,0.8)',
              borderRadius: '10px',
              padding: { xs: '20px', md: '24px' },
              width: { xs: '100%', md: '35%' },
              minWidth: { md: '320px' },
              height: '560px',
              order: { xs: 1, md: 2 },
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography
              sx={{
                fontFamily: 'League Spartan',
                fontWeight: 600,
                fontSize: '30px',
                color: '#453726',
                textAlign: 'center',
                marginBottom: '24px',
                lineHeight: '20px',
                letterSpacing: '0.1px'
              }}
            >
              Estante
            </Typography>

            <form id="estante-form" onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '20px',
                height: '100%',
                justifyContent: 'space-between'
              }}>
                {/* Campos del formulario */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* Ubicación */}
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: 'League Spartan',
                        fontWeight: 400,
                        fontSize: '24px',
                        color: '#453726',
                        marginBottom: '6px',
                        lineHeight: '20px',
                        letterSpacing: '0.1px'
                      }}
                    >
                      Ubicación:
                    </Typography>
                    <Controller
                      name="ubicacion"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          placeholder="Ej: A24, Sector-B-001, Planta-2-Sala-A"
                          error={Boolean(errors.ubicacion)}
                          sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#fff9ec',
                              borderRadius: '10px',
                              height: '44px',
                              fontFamily: 'League Spartan',
                              fontSize: '20px', // Reducido para que quepa el placeholder más largo
                              fontWeight: 500,
                              color: '#372c1e',
                              '& fieldset': {
                                border: 'none',
                              },
                              '&:hover fieldset': {
                                border: 'none',
                              },
                              '&.Mui-focused fieldset': {
                                border: '1px solid #2f5232',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              textAlign: 'center',
                            }
                          }}
                        />
                      )}
                    />
                    {errors.ubicacion && (
                      <FormHelperText error sx={{ fontFamily: 'League Spartan' }}>
                        {errors.ubicacion.message}
                      </FormHelperText>
                    )}
                  </Box>

                  {/* Fila - Solo se muestra si NO está en modo etiquetas */}
                  {!mostrarEtiquetas && (
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: 'League Spartan',
                          fontWeight: 400,
                          fontSize: '24px',
                          color: '#3a332a',
                          marginBottom: '6px',
                          lineHeight: '20px',
                          letterSpacing: '0.1px'
                        }}
                      >
                        Fila:
                      </Typography>
                      <Controller
                        name="fila"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            placeholder="1"
                            disabled={true} // Campo deshabilitado - no se puede editar una vez creado
                            error={Boolean(errors.fila)}
                            sx={{
                              width: '100%',
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: '#f5f5f5', // Color más gris para indicar que está deshabilitado
                                borderRadius: '10px',
                                height: '44px',
                                fontFamily: 'League Spartan',
                                fontSize: '24px',
                                fontWeight: 500,
                                color: '#9e9e9e', // Color más tenue para texto deshabilitado
                                '& fieldset': {
                                  border: 'none',
                                },
                                '&:hover fieldset': {
                                  border: 'none',
                                },
                                '&.Mui-focused fieldset': {
                                  border: '1px solid #2f5232',
                                },
                              },
                              '& .MuiOutlinedInput-input': {
                                textAlign: 'center',
                              }
                            }}
                          />
                        )}
                      />
                      {errors.fila && (
                        <FormHelperText error sx={{ fontFamily: 'League Spartan' }}>
                          {errors.fila.message}
                        </FormHelperText>
                      )}
                      {/* Texto explicativo para campo deshabilitado */}
                      <Typography
                        sx={{
                          color: '#9e9e9e',
                          fontSize: '12px',
                          fontFamily: 'League Spartan',
                          fontStyle: 'italic',
                          textAlign: 'center',
                          marginTop: '4px'
                        }}
                      >
                        No se puede modificar una vez creado el estante
                      </Typography>
                    </Box>
                  )}

                  {/* Columna - Solo se muestra si NO está en modo etiquetas */}
                  {!mostrarEtiquetas && (
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: 'League Spartan',
                          fontWeight: 400,
                          fontSize: '24px',
                          color: '#3a332a',
                          marginBottom: '6px',
                          lineHeight: '20px',
                          letterSpacing: '0.1px'
                        }}
                      >
                        Columna:
                      </Typography>
                      <Controller
                        name="columna"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            placeholder="1"
                            disabled={true} // Campo deshabilitado - no se puede editar una vez creado
                            error={Boolean(errors.columna)}
                            sx={{
                              width: '100%',
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: '#f5f5f5', // Color más gris para indicar que está deshabilitado
                                borderRadius: '10px',
                                height: '44px',
                                fontFamily: 'League Spartan',
                                fontSize: '24px',
                                fontWeight: 500,
                                color: '#9e9e9e', // Color más tenue para texto deshabilitado
                                '& fieldset': {
                                  border: 'none',
                                },
                                '&:hover fieldset': {
                                  border: 'none',
                                },
                                '&.Mui-focused fieldset': {
                                  border: '1px solid #2f5232',
                                },
                              },
                              '& .MuiOutlinedInput-input': {
                                textAlign: 'center',
                              }
                            }}
                          />
                        )}
                      />
                      {errors.columna && (
                        <FormHelperText error sx={{ fontFamily: 'League Spartan' }}>
                          {errors.columna.message}
                        </FormHelperText>
                      )}
                      {/* Texto explicativo para campo deshabilitado */}
                      <Typography
                        sx={{
                          color: '#9e9e9e',
                          fontSize: '12px',
                          fontFamily: 'League Spartan',
                          fontStyle: 'italic',
                          textAlign: 'center',
                          marginTop: '4px'
                        }}
                      >
                        No se puede modificar una vez creado el estante
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Botón Editar Etiquetas o Panel de Etiquetas */}
                <Box sx={{ marginTop: 'auto', paddingTop: '20px' }}>
                  {!mostrarEtiquetas ? (
                    <Button
                      onClick={() => setMostrarEtiquetas(true)}
                      sx={{
                        backgroundColor: '#2f5232',
                        color: '#fff9ec',
                        borderRadius: '8px',
                        height: '38px',
                        width: '100%',
                        fontFamily: 'League Spartan',
                        fontWeight: 500,
                        fontSize: '20px',
                        letterSpacing: '0.1px',
                        lineHeight: '20px',
                        textTransform: 'none',
                        boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
                        '&:hover': {
                          backgroundColor: '#234026',
                        }
                      }}
                    >
                      Editar Etiquetas
                    </Button>
                  ) : (
                    <Box>
                      {/* Panel de gestión de etiquetas */}
                      <Typography
                        sx={{
                          fontFamily: 'League Spartan',
                          fontWeight: 600,
                          fontSize: '18px',
                          color: '#453726',
                          marginBottom: '8px',
                          textAlign: 'center'
                        }}
                      >
                        Gestión de Etiquetas
                      </Typography>
                      
                      {/* Información del estante en modo etiquetas */}
                      <Typography
                        sx={{
                          fontFamily: 'League Spartan',
                          fontWeight: 400,
                          fontSize: '14px',
                          color: '#666',
                          marginBottom: '12px',
                          textAlign: 'center'
                        }}
                      >
                        {(() => {
                          const filas = parseInt(fila) || 0;
                          const columnas = parseInt(columna) || 0;
                          const total = filas * columnas;
                          const etiquetasAsignadas = etiquetas.filter(e => e && e.trim()).length;
                          return total > 0 
                            ? `Estante: ${filas}×${columnas} (${etiquetasAsignadas}/${total} etiquetas)`
                            : 'Configure las dimensiones del estante';
                        })()}
                      </Typography>

                      {/* Modo de selección */}
                      {!modoSeleccionMultiple ? (
                        <Box sx={{ marginBottom: '12px', textAlign: 'center' }}>
                          <Button
                            onClick={handleActivarSeleccionMultiple}
                            variant="outlined"
                            size="small"
                            sx={{
                              fontFamily: 'League Spartan',
                              fontSize: '12px',
                              color: '#2f5232',
                              borderColor: '#2f5232',
                              '&:hover': {
                                backgroundColor: 'rgba(47, 82, 50, 0.1)',
                                borderColor: '#234026'
                              }
                            }}
                          >
                            Selección Múltiple
                          </Button>
                        </Box>
                      ) : (
                        <Box sx={{ marginBottom: '12px' }}>
                          <Typography
                            sx={{
                              fontFamily: 'League Spartan',
                              fontSize: '14px',
                              color: '#2f5232',
                              textAlign: 'center',
                              marginBottom: '8px',
                              fontWeight: 600
                            }}
                          >
                            {espaciosSeleccionados.length} espacios seleccionados
                          </Typography>
                          
                          {espaciosSeleccionados.length > 0 && etiquetasDisponiblesEstante.length > 0 && (
                            <FormControl fullWidth size="small" sx={{ marginBottom: '8px' }}>
                              <InputLabel
                                sx={{
                                  fontFamily: 'League Spartan',
                                  '&.Mui-focused': { color: '#2f5232' }
                                }}
                              >
                                Asignar etiqueta existente
                              </InputLabel>
                              <Select
                                label="Asignar etiqueta existente"
                                onChange={(e) => handleAsignarEtiquetaMultiple(e.target.value as string)}
                                sx={{
                                  fontFamily: 'League Spartan',
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#2f5232'
                                  }
                                }}
                              >
                                {etiquetasDisponiblesEstante.map((etiqueta) => (
                                  <MenuItem 
                                    key={etiqueta} 
                                    value={etiqueta}
                                    sx={{ fontFamily: 'League Spartan' }}
                                  >
                                    {etiqueta}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                          
                          {espaciosSeleccionados.length > 0 && (
                            <Button
                              onClick={() => {
                                setEtiquetaEditando(null);
                                setNuevaEtiqueta('');
                                setDialogAbierto(true);
                              }}
                              variant="outlined"
                              size="small"
                              fullWidth
                              sx={{
                                fontFamily: 'League Spartan',
                                fontSize: '12px',
                                color: '#2f5232',
                                borderColor: '#2f5232',
                                marginBottom: '8px',
                                '&:hover': {
                                  backgroundColor: 'rgba(47, 82, 50, 0.1)',
                                  borderColor: '#234026'
                                }
                              }}
                            >
                              Crear nueva etiqueta
                            </Button>
                          )}
                          
                          <Button
                            onClick={handleDesactivarSeleccionMultiple}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{
                              fontFamily: 'League Spartan',
                              fontSize: '12px',
                              color: '#3a332a',
                              borderColor: '#3a332a',
                              '&:hover': {
                                backgroundColor: 'rgba(58, 51, 42, 0.1)',
                                borderColor: '#2d2620'
                              }
                            }}
                          >
                            Cancelar Selección
                          </Button>
                        </Box>
                      )}
                      
                      {/* Contenedor de etiquetas */}
                      <Box
                        sx={{
                          backgroundColor: '#fff9ec',
                          borderRadius: '8px',
                          padding: '12px',
                          minHeight: mostrarEtiquetas ? '200px' : '80px', // Más alto en modo etiquetas
                          maxHeight: mostrarEtiquetas ? '300px' : '120px', // Límite máximo
                          marginBottom: '12px',
                          border: '1px solid #E1C5AB',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '6px',
                          alignItems: etiquetas.length > 0 ? 'flex-start' : 'center',
                          justifyContent: etiquetas.length > 0 ? 'flex-start' : 'center',
                          overflowY: 'auto', // Agregar scroll vertical
                          '&::-webkit-scrollbar': {
                            width: '6px',
                          },
                          '&::-webkit-scrollbar-track': {
                            backgroundColor: '#f0f0f0',
                            borderRadius: '3px',
                          },
                          '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#E1C5AB',
                            borderRadius: '3px',
                            '&:hover': {
                              backgroundColor: '#D4B896',
                            },
                          },
                        }}
                      >
                        {etiquetas.length > 0 ? (
                          etiquetas.map((etiqueta, index) => (
                            etiqueta && (
                              <Chip
                                key={index}
                                label={`${Math.floor(index / (parseInt(columna) || 1)) + 1}-${(index % (parseInt(columna) || 1)) + 1}: ${etiqueta}`}
                                onDelete={() => handleEliminarEtiqueta(index)}
                                onClick={() => handleClickEspacio(index)}
                                sx={{
                                  backgroundColor: '#E1C5AB',
                                  color: '#453726',
                                  fontFamily: 'League Spartan',
                                  fontSize: '11px',
                                  height: '28px',
                                  maxWidth: '100%',
                                  '& .MuiChip-label': {
                                    paddingLeft: '8px',
                                    paddingRight: '4px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  },
                                  '& .MuiChip-deleteIcon': {
                                    color: '#453726',
                                    fontSize: '16px',
                                    '&:hover': {
                                      color: '#2f5232'
                                    }
                                  },
                                  '&:hover': {
                                    backgroundColor: '#D4B896'
                                  },
                                  cursor: 'pointer',
                                  margin: '2px'
                                }}
                              />
                            )
                          ))
                        ) : (
                          <Typography
                            sx={{
                              fontFamily: 'League Spartan',
                              fontSize: '14px',
                              color: '#666',
                              textAlign: 'center'
                            }}
                          >
                            No hay etiquetas asignadas
                          </Typography>
                        )}
                      </Box>

                      {/* Botones de acción */}
                      <Box sx={{ display: 'flex', gap: '8px' }}>
                        <Button
                          onClick={handleAgregarEtiqueta}
                          startIcon={<AddIcon />}
                          sx={{
                            backgroundColor: '#2f5232',
                            color: '#fff9ec',
                            borderRadius: '6px',
                            height: '32px',
                            flex: 1,
                            fontFamily: 'League Spartan',
                            fontWeight: 500,
                            fontSize: '14px',
                            textTransform: 'none',
                            '&:hover': {
                              backgroundColor: '#234026',
                            }
                          }}
                        >
                          Agregar
                        </Button>
                        <Button
                          onClick={() => setMostrarEtiquetas(false)}
                          sx={{
                            backgroundColor: '#3a332a',
                            color: '#fff9ec',
                            borderRadius: '6px',
                            height: '32px',
                            flex: 1,
                            fontFamily: 'League Spartan',
                            fontWeight: 500,
                            fontSize: '14px',
                            textTransform: 'none',
                            '&:hover': {
                              backgroundColor: '#2d2620',
                            }
                          }}
                        >
                          Cerrar
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </form>
          </Card>
        </Box>
      </Box>

      {/* Diálogo de confirmación para eliminar estante */}
      <Dialog 
        open={mostrarConfirmacionEliminar} 
        onClose={handleCancelarEliminacion}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontFamily: 'League Spartan',
            fontWeight: 600,
            fontSize: '24px',
            color: '#d32f2f',
            textAlign: 'center',
            paddingBottom: '8px'
          }}
        >
          ⚠️ Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', padding: '16px 0' }}>
            <Typography
              sx={{
                fontFamily: 'League Spartan',
                fontWeight: 500,
                fontSize: '18px',
                color: '#453726',
                marginBottom: '16px'
              }}
            >
              ¿Estás seguro de que deseas eliminar este estante?
            </Typography>
            <Typography
              sx={{
                fontFamily: 'League Spartan',
                fontWeight: 600,
                fontSize: '20px',
                color: '#d32f2f',
                marginBottom: '8px'
              }}
            >
              {estante?.nombre || 'Estante'}
            </Typography>
            <Typography
              sx={{
                fontFamily: 'League Spartan',
                fontWeight: 400,
                fontSize: '14px',
                color: '#666',
                fontStyle: 'italic'
              }}
            >
              Esta acción no se puede deshacer
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px', justifyContent: 'center', gap: '16px' }}>
          <Button 
            onClick={handleCancelarEliminacion}
            sx={{
              fontFamily: 'League Spartan',
              color: '#453726',
              borderColor: '#453726',
              '&:hover': {
                backgroundColor: 'rgba(69, 55, 38, 0.1)',
                borderColor: '#453726'
              }
            }}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmarEliminacion}
            sx={{
              fontFamily: 'League Spartan',
              backgroundColor: '#d32f2f',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#c62828',
              }
            }}
            variant="contained"
          >
            Sí, Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para agregar/editar etiquetas */}
      <Dialog 
        open={dialogAbierto} 
        onClose={handleCerrarDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontFamily: 'League Spartan',
            fontWeight: 600,
            fontSize: '24px',
            color: '#453726',
            textAlign: 'center'
          }}
        >
          {modoSeleccionMultiple && espaciosSeleccionados.length > 0
            ? `Asignar etiqueta a ${espaciosSeleccionados.length} espacios`
            : etiquetaEditando 
              ? 'Editar Etiqueta' 
              : 'Agregar Nueva Etiqueta'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Etiquetas existentes en este estante */}
            {etiquetasDisponiblesEstante.length > 0 && (
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'League Spartan',
                    fontWeight: 500,
                    fontSize: '16px',
                    color: '#453726',
                    marginBottom: '8px'
                  }}
                >
                  Etiquetas ya usadas en este estante:
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    maxHeight: '120px',
                    overflowY: 'auto',
                    padding: '8px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px'
                  }}
                >
                  {etiquetasDisponiblesEstante.map((etiqueta) => (
                    <Chip
                      key={etiqueta}
                      label={etiqueta}
                      onClick={() => setNuevaEtiqueta(etiqueta)}
                      sx={{
                        backgroundColor: nuevaEtiqueta === etiqueta ? '#2f5232' : '#E1C5AB',
                        color: nuevaEtiqueta === etiqueta ? '#fff' : '#453726',
                        fontFamily: 'League Spartan',
                        fontSize: '12px',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: nuevaEtiqueta === etiqueta ? '#234026' : '#D4B896'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Campo para nueva etiqueta */}
            <Box>
              <Typography
                sx={{
                  fontFamily: 'League Spartan',
                  fontWeight: 500,
                  fontSize: '16px',
                  color: '#453726',
                  marginBottom: '8px'
                }}
              >
                {etiquetasDisponiblesEstante.length > 0 
                  ? 'O crear una nueva etiqueta:' 
                  : 'Crear etiqueta para este estante:'}
              </Typography>
              <TextField
                autoFocus
                fullWidth
                label="Nombre de la etiqueta"
                value={nuevaEtiqueta}
                onChange={(e) => setNuevaEtiqueta(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: 'League Spartan',
                    '&.Mui-focused fieldset': {
                      borderColor: '#2f5232',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'League Spartan',
                    '&.Mui-focused': {
                      color: '#2f5232',
                    },
                  },
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleGuardarEtiqueta();
                  }
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button 
            onClick={handleCerrarDialog}
            sx={{
              fontFamily: 'League Spartan',
              color: '#453726',
              '&:hover': {
                backgroundColor: 'rgba(69, 55, 38, 0.1)'
              }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleGuardarEtiqueta}
            disabled={!nuevaEtiqueta.trim()}
            sx={{
              fontFamily: 'League Spartan',
              backgroundColor: '#2f5232',
              color: '#fff9ec',
              '&:hover': {
                backgroundColor: '#234026',
              },
              '&:disabled': {
                backgroundColor: '#ccc',
                color: '#666'
              }
            }}
          >
            {etiquetaEditando ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditarEstante;