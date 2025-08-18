// services/estanteService.ts - Servicio de estantes actualizado
import { estanteApi } from './businessApiUpdated';
import { ApiError } from './api';

export const estanteService = {
  // Crear estante (Rol 3 - Administrador)
  async crear(datos: {
    etiqueta: string;
    biblioteca_id?: number; // Ahora es opcional
    cant_columnas?: number;
    cant_filas?: number;
    // Campos de compatibilidad con el frontend
    nombre?: string;
    ubicacion?: string;
    fila?: string;
    columna?: string;
  }) {
    try {
      // Mapear datos del frontend a formato de API
      const datosApi: any = {
        etiqueta: datos.etiqueta || datos.ubicacion || datos.nombre || '',
        cant_columnas: datos.cant_columnas || parseInt(datos.columna || '0') || undefined,
        cant_filas: datos.cant_filas || parseInt(datos.fila || '0') || undefined,
      };

      // Solo agregar biblioteca_id si se proporciona
      if (datos.biblioteca_id) {
        datosApi.biblioteca_id = datos.biblioteca_id;
      }

      const estante = await estanteApi.crear(datosApi);
      return {
        success: true,
        data: estante,
        message: 'Estante creado exitosamente'
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.message,
          details: error.details,
          code: error.code
        };
      }
      return {
        success: false,
        error: 'Error inesperado al crear estante'
      };
    }
  },

  // Listar estantes (Rol 3 - Administrador)
  async listar() {
    try {
      const estantes = await estanteApi.listar();
      return {
        success: true,
        data: estantes,
        message: 'Estantes obtenidos exitosamente'
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }
      return {
        success: false,
        error: 'Error al obtener estantes'
      };
    }
  },

  // Obtener estante por ID (Rol 3 - Administrador)
  async obtenerPorId(id: number) {
    try {
      const estante = await estanteApi.obtener(id);
      return {
        success: true,
        data: estante,
        message: 'Estante encontrado'
      };
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 404) {
          return {
            success: false,
            error: 'Estante no encontrado',
            code: error.code
          };
        }
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }
      return {
        success: false,
        error: 'Error al obtener estante'
      };
    }
  },

  // Actualizar estante (Rol 3 - Administrador)
  async actualizar(id: number, datos: {
    etiqueta?: string;
    cant_columnas?: number;
    cant_filas?: number;
    // Campos de compatibilidad con el frontend
    nombre?: string;
    ubicacion?: string;
    fila?: string;
    columna?: string;
  }) {
    console.log('estanteService.actualizar - ID:', id);
    console.log('estanteService.actualizar - Datos recibidos:', datos);
    
    try {
      // Mapear datos del frontend a formato de API
      const datosApi: any = {};
      
      if (datos.etiqueta || datos.ubicacion || datos.nombre) {
        datosApi.etiqueta = datos.etiqueta || datos.ubicacion || datos.nombre;
      }
      
      if (datos.cant_columnas !== undefined) {
        datosApi.cant_columnas = datos.cant_columnas;
      } else if (datos.columna) {
        datosApi.cant_columnas = parseInt(datos.columna);
      }
      
      if (datos.cant_filas !== undefined) {
        datosApi.cant_filas = datos.cant_filas;
      } else if (datos.fila) {
        datosApi.cant_filas = parseInt(datos.fila);
      }

      console.log('estanteService.actualizar - Datos API preparados:', datosApi);
      
      const estante = await estanteApi.actualizar(id, datosApi);
      console.log('estanteService.actualizar - Respuesta API:', estante);
      
      return {
        success: true,
        data: estante,
        message: 'Estante actualizado exitosamente'
      };
    } catch (error) {
      console.error('estanteService.actualizar - Error:', error);
      
      if (error instanceof ApiError) {
        console.error('estanteService.actualizar - ApiError details:', {
          status: error.status,
          code: error.code,
          message: error.message,
          details: error.details
        });
        
        if (error.status === 404) {
          return {
            success: false,
            error: 'Estante no encontrado',
            code: error.code
          };
        }
        return {
          success: false,
          error: error.message,
          details: error.details,
          code: error.code
        };
      }
      return {
        success: false,
        error: 'Error al actualizar estante'
      };
    }
  },

  // Eliminar estante (Rol 3 - Administrador)
  async eliminar(id: number) {
    try {
      await estanteApi.eliminar(id);
      return {
        success: true,
        message: 'Estante eliminado exitosamente'
      };
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 404) {
          return {
            success: false,
            error: 'Estante no encontrado',
            code: error.code
          };
        }
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }
      return {
        success: false,
        error: 'Error al eliminar estante'
      };
    }
  },

  // Obtener secciones de un estante (Rol 3 - Administrador)
  async obtenerSecciones(estanteId: number) {
    try {
      const secciones = await estanteApi.secciones(estanteId);
      return {
        success: true,
        data: secciones,
        message: 'Secciones obtenidas exitosamente'
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }
      return {
        success: false,
        error: 'Error al obtener secciones del estante'
      };
    }
  },

  // Actualizar sección de un estante
  async actualizarSeccion(seccionId: number, datos: any) {
    try {
      const seccion = await estanteApi.actualizarSeccion(seccionId, datos);
      return {
        success: true,
        data: seccion,
        message: 'Sección actualizada exitosamente'
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }
      return {
        success: false,
        error: 'Error al actualizar sección'
      };
    }
  }
};
