import { estanteApi } from './businessApiUpdated';
import type { SeccionResponse } from './businessApiUpdated';

// Tipos específicos para secciones basados en la API
export type SeccionAPI = SeccionResponse;

export interface SeccionFormData {
  etiqueta?: string;
  columna?: number;
  fila?: number;
}

export interface SeccionCrearData {
  estante_id: number;
  etiqueta: string;
  columna: number;
  fila: number;
}

// Clase para manejar errores específicos de secciones
class SeccionError extends Error {
  public code?: string;
  
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'SeccionError';
    this.code = code;
  }
}

// Servicio completo para manejar secciones
class SeccionService {
  // Listar secciones de un estante específico (Rol 3)
  async listarPorEstante(estanteId: number) {
    try {
      if (!estanteId || estanteId <= 0) {
        throw new SeccionError('ID de estante inválido');
      }

      const secciones = await estanteApi.secciones(estanteId);

      return {
        success: true,
        data: secciones,
        message: 'Secciones obtenidas exitosamente'
      };
    } catch (error: any) {
      console.error('Error al obtener secciones - ERROR COMPLETO:', error);
      console.error('Error message:', error.message);
      console.error('Error status:', error.status);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
      console.error('Error name:', error.name);
      console.error('Error instanceof ApiError:', error.name === 'ApiError');
      
      // Manejo específico para ApiError del Business API
      if (error.name === 'ApiError') {
        console.error('Procesando ApiError:', error);
        
        // Manejo específico para errores de rol
        if (error.message === 'Error en la validación de roles' || error.code === 'ROLE_VALIDATION_ERROR') {
          console.error('Error de rol detectado:', error);
          return {
            success: false,
            error: 'No tienes permisos para acceder a las secciones. Se requiere rol de Administrador (Rol 3).',
            code: 'ROLE_ERROR',
            details: error.details
          };
        }
        
        return {
          success: false,
          error: error.message || 'Error al obtener secciones del estante',
          code: error.code,
          details: error.details
        };
      }
      
      if (error instanceof SeccionError) {
        console.error('Error tipo SeccionError:', error);
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }
      
      console.error('Error desconocido, devolviendo error genérico');
      return {
        success: false,
        error: 'Error de conexión al obtener secciones',
        originalError: error
      };
    }
  }

  // Actualizar una sección específica (Autenticado)
  async actualizar(seccionId: number, datos: SeccionFormData) {
    try {
      if (!seccionId || seccionId <= 0) {
        throw new SeccionError('ID de sección inválido');
      }

      // Filtrar datos vacíos/null/undefined
      const datosLimpios: any = {};
      
      if (datos.etiqueta && datos.etiqueta.trim()) {
        datosLimpios.etiqueta = datos.etiqueta.trim();
      }
      
      if (datos.columna && datos.columna > 0) {
        datosLimpios.columna = Number(datos.columna);
      }
      
      if (datos.fila && datos.fila > 0) {
        datosLimpios.fila = Number(datos.fila);
      }

      if (Object.keys(datosLimpios).length === 0) {
        return {
          success: false,
          error: 'Debe proporcionar al menos un campo para actualizar'
        };
      }

      const seccion = await estanteApi.actualizarSeccion(seccionId, datosLimpios);

      return {
        success: true,
        data: seccion,
        message: 'Sección actualizada exitosamente'
      };
    } catch (error: any) {
      console.error('Error al actualizar sección:', error);
      
      if (error.response?.data) {
        const apiError = error.response.data;
        
        // Manejar errores de validación específicos
        if (apiError.code === 'SECC_03' && apiError.data?.errors) {
          const errorMessages = apiError.data.errors
            .map((err: any) => `${err.field}: ${err.message}`)
            .join(', ');
          return {
            success: false,
            error: `Error de validación: ${errorMessages}`,
            code: apiError.code,
            details: apiError.data.errors
          };
        }
        
        return {
          success: false,
          error: apiError.msg || 'Error al actualizar sección',
          code: apiError.code
        };
      }
      
      if (error instanceof SeccionError) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }
      
      return {
        success: false,
        error: 'Error de conexión al actualizar sección'
      };
    }
  }

  // Validar datos de sección antes de enviar
  private validarDatosSeccion(datos: Partial<SeccionFormData>): string[] {
    const errores: string[] = [];

    if (datos.etiqueta !== undefined) {
      if (!datos.etiqueta.trim()) {
        errores.push('La etiqueta no puede estar vacía');
      } else if (datos.etiqueta.length > 50) {
        errores.push('La etiqueta no puede exceder 50 caracteres');
      } else if (!/^[A-Za-z0-9\-\s]+$/.test(datos.etiqueta)) {
        errores.push('La etiqueta solo puede contener letras, números, guiones y espacios');
      }
    }

    if (datos.columna !== undefined) {
      const columna = Number(datos.columna);
      if (isNaN(columna) || columna <= 0 || columna > 100) {
        errores.push('La columna debe ser un número entre 1 y 100');
      }
    }

    if (datos.fila !== undefined) {
      const fila = Number(datos.fila);
      if (isNaN(fila) || fila <= 0 || fila > 100) {
        errores.push('La fila debe ser un número entre 1 y 100');
      }
    }

    return errores;
  }

  // Validar y actualizar sección con validaciones
  async actualizarConValidacion(seccionId: number, datos: SeccionFormData) {
    try {
      // Validar datos primero
      const erroresValidacion = this.validarDatosSeccion(datos);
      if (erroresValidacion.length > 0) {
        return {
          success: false,
          error: `Errores de validación: ${erroresValidacion.join(', ')}`,
          code: 'VALIDATION_ERROR'
        };
      }

      // Si pasa la validación, proceder con la actualización normal
      return await this.actualizar(seccionId, datos);
    } catch (error) {
      return {
        success: false,
        error: 'Error inesperado en la validación'
      };
    }
  }

  // Obtener etiquetas únicas de las secciones de un estante
  async obtenerEtiquetasUnicas(estanteId: number): Promise<{
    success: boolean;
    data?: string[];
    error?: string;
    message?: string;
  }> {
    try {
      const resultado = await this.listarPorEstante(estanteId);
      
      if (!resultado.success) {
        return {
          success: false,
          error: resultado.error || 'Error al obtener secciones para extraer etiquetas'
        };
      }

      const etiquetasUnicas = [...new Set(
        resultado.data
          ?.filter((seccion: SeccionAPI) => seccion.etiqueta && seccion.etiqueta.trim())
          .map((seccion: SeccionAPI) => seccion.etiqueta.trim())
      )];

      return {
        success: true,
        data: etiquetasUnicas,
        message: 'Etiquetas únicas obtenidas exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al obtener etiquetas únicas'
      };
    }
  }

  // Generar mapa de posiciones para un estante
  async generarMapaPosiciones(estanteId: number): Promise<{
    success: boolean;
    data?: { [key: string]: SeccionAPI };
    error?: string;
    message?: string;
  }> {
    try {
      const resultado = await this.listarPorEstante(estanteId);
      
      if (!resultado.success) {
        return {
          success: false,
          error: resultado.error || 'Error al obtener secciones para generar mapa'
        };
      }

      const mapaPosiciones: { [key: string]: SeccionAPI } = {};
      
      resultado.data?.forEach((seccion: SeccionAPI) => {
        const clave = `${seccion.fila}-${seccion.columna}`;
        mapaPosiciones[clave] = seccion;
      });

      return {
        success: true,
        data: mapaPosiciones,
        message: 'Mapa de posiciones generado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al generar mapa de posiciones'
      };
    }
  }
}

// Crear y exportar la instancia del servicio
const seccionServiceInstance = new SeccionService();

export { seccionServiceInstance as seccionService };
export default seccionServiceInstance;
