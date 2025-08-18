/**
 * Business API Service for BookSmart - ACTUALIZADO
 * Implementación actualizada basada en la documentación real de la API Business
 * Basado en: API_DOCUMENTATION copy.md
 */

import { apiClient, ApiError } from './api';
import type { ApiResponse } from './api';

// Base URL para Business API
const BUSINESS_API_BASE_URL = '/api/business';

// Tipos de respuesta basados en la documentación real
export interface BibliotecaResponse {
  id: number;
  nombre: string;
  ubicacion?: string;
  estado: 'Pendiente' | 'Autorizado' | 'No autorizado' | 'Desactivado';
  admin_id?: number;
}

export interface EstanteResponse {
  id: number;
  etiqueta: string; // Campo real de la API
  biblioteca_id: number;
  cant_columnas: number; // Campo real de la API
  cant_filas: number; // Campo real de la API
  // Campos opcionales para compatibilidad con versiones anteriores
  nombre?: string;
  capacidad?: number;
}

export interface LibroResponse {
  id: number;
  nombre: string;
  autor: string;
  descripcion?: string;
  isbn: string;
  biblioteca_id: number;
  cantidad?: number;
}

export interface LibroBibliotecaResponse {
  id: number;
  libro_biblioteca_id: number;
  seccion_estante_id: number;
}

export interface UsuarioBibliotecaResponse {
  id: number;
  usuario_id: number;
  biblioteca_id: number;
}

export interface VerificarRegistroResponse {
  usuario_id: number;
  rfid_registrado: boolean;
}

export interface BuscarUsuarioEmailResponse {
  id: number;
  email: string;
  nombre: string;
}

export interface VerificarRfidResponse {
  usuario_id: number;
  email: string;
}

export interface PrestamoResponse {
  id: number;
  usuario_id: number;
  libro_biblioteca_id: number;
  fecha_prestamo: string;
  fecha_devolucion_esperada: string;
  fecha_devolucion_real?: string;
  observaciones?: string;
  estado: string;
}

export interface SeccionResponse {
  id: number;
  estante_id: number;
  etiqueta: string;
  columna: number;
  fila: number;
}

// Cliente Business API actualizado
class BusinessApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Obtener token de la instancia principal
    const token = apiClient.getToken();
    console.log('Token disponible:', !!token);
    console.log('Token preview:', token ? `${token.substring(0, 20)}...` : 'N/A');
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          response.status,
          data.code || `HTTP_${response.status}`,
          data.msg || 'Error en la solicitud',
          data.details || data.data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Detectar errores de CORS y de red
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(
          0,
          'NETWORK_ERROR',
          'No se puede conectar con el servidor Business. Verifica que el servidor esté ejecutándose en el puerto 37447.',
          { 
            originalError: error.message,
            url,
            corsHelp: 'Si ves errores de CORS, asegúrate de que el servidor tenga configurado Access-Control-Allow-Origin.'
          }
        );
      }
      
      throw new ApiError(
        500,
        'UNKNOWN_ERROR',
        'Error desconocido al comunicarse con el servidor business',
        { originalError: error }
      );
    }
  }

  // === BIBLIOTECAS ===
  // POST /biblioteca - Crear biblioteca (Rol 3)
  async createBiblioteca(data: {
    nombre: string;
    ubicacion?: string;
    estado?: 'Pendiente' | 'Autorizado' | 'No autorizado' | 'Desactivado';
    admin_id?: number;
  }): Promise<BibliotecaResponse> {
    const response = await this.request<BibliotecaResponse>('/biblioteca', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  // GET /bibliotecas - Listar bibliotecas (Rol 4)
  async getBibliotecas(estado?: string): Promise<BibliotecaResponse[]> {
    const params = estado ? `?estado=${estado}` : '';
    const response = await this.request<BibliotecaResponse[]>(`/bibliotecas${params}`, {
      method: 'GET',
    });
    return response.data;
  }

  // GET /biblioteca/:id - Ver biblioteca específica (Rol 4)
  async getBiblioteca(id: number): Promise<BibliotecaResponse> {
    const response = await this.request<BibliotecaResponse>(`/biblioteca/${id}`, {
      method: 'GET',
    });
    return response.data;
  }

  // GET /bibliotecas/usuario/:usuario_id - Bibliotecas por usuario
  async getBibliotecasByUsuario(usuarioId: number): Promise<BibliotecaResponse[]> {
    const response = await this.request<BibliotecaResponse[]>(`/bibliotecas/usuario/${usuarioId}`, {
      method: 'GET',
    });
    return response.data;
  }

  // PUT /biblioteca/:id - Actualizar biblioteca (Rol 4)
  async updateBiblioteca(id: number, data: Partial<{
    nombre: string;
    ubicacion: string;
    estado: string;
  }>): Promise<BibliotecaResponse> {
    const response = await this.request<BibliotecaResponse>(`/biblioteca/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  // DELETE /biblioteca/:id - Eliminar biblioteca (Rol 4)
  async deleteBiblioteca(id: number): Promise<void> {
    await this.request(`/biblioteca/${id}`, {
      method: 'DELETE',
    });
  }

  // === ESTANTES ===
  // POST /estante - Crear estante (Rol 3)
  async createEstante(data: {
    etiqueta: string; // Campo real de la API
    biblioteca_id?: number; // Ahora es opcional - se asigna automáticamente
    cant_columnas?: number; // Campo real de la API
    cant_filas?: number; // Campo real de la API
    // Campos opcionales para compatibilidad
    nombre?: string;
    capacidad?: number;
  }): Promise<EstanteResponse> {
    const response = await this.request<EstanteResponse>('/estante', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  // GET /estantes - Listar estantes (Rol 3)
  async getEstantes(): Promise<EstanteResponse[]> {
    const response = await this.request<EstanteResponse[]>('/estantes', {
      method: 'GET',
    });
    return response.data;
  }

  // GET /estante/:id - Ver estante específico (Rol 3)
  async getEstante(id: number): Promise<EstanteResponse> {
    const response = await this.request<EstanteResponse>(`/estante/${id}`, {
      method: 'GET',
    });
    return response.data;
  }

  // PUT /estante/:id - Actualizar estante (Rol 3)
  async updateEstante(id: number, data: Partial<{
    etiqueta: string; // Campo real de la API
    cant_columnas: number; // Campo real de la API
    cant_filas: number; // Campo real de la API
    // Campos opcionales para compatibilidad
    nombre: string;
    capacidad: number;
  }>): Promise<EstanteResponse> {
    console.log('BusinessAPI updateEstante - ID:', id);
    console.log('BusinessAPI updateEstante - Data:', data);
    
    try {
      const response = await this.request<EstanteResponse>(`/estante/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      console.log('BusinessAPI updateEstante - Response:', response);
      return response.data;
    } catch (error) {
      console.error('BusinessAPI updateEstante - Error:', error);
      throw error;
    }
  }

  // DELETE /estante/:id - Eliminar estante (Rol 3)
  async deleteEstante(id: number): Promise<void> {
    await this.request(`/estante/${id}`, {
      method: 'DELETE',
    });
  }

  // === SECCIONES ===
  // GET /secciones/:id - Listar secciones de estante (Rol 3)
  async getSecciones(estanteId: number): Promise<SeccionResponse[]> {
    console.log('getSecciones llamado para estante:', estanteId);
    try {
      const response = await this.request<SeccionResponse[]>(`/secciones/${estanteId}`, {
        method: 'GET',
      });
      console.log('getSecciones respuesta exitosa:', response);
      return response.data;
    } catch (error) {
      console.error('getSecciones ERROR:', error);
      throw error; // Re-lanzar para que lo maneje el servicio
    }
  }

  // PUT /seccion/:id - Actualizar sección
  async updateSeccion(id: number, data: any): Promise<SeccionResponse> {
    const response = await this.request<SeccionResponse>(`/seccion/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  // === LIBROS ===
  // POST /libro - Crear libro (Rol 3)
  async createLibro(data: {
    nombre: string;
    autor: string;
    descripcion?: string;
    isbn: string;
    biblioteca_id: number;
    cantidad?: number;
  }): Promise<LibroResponse> {
    const response = await this.request<LibroResponse>('/libro', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  // POST /libro/estante - Asignar libro a estante (Rol 3)
  async assignLibroToEstante(data: {
    libro_biblioteca_id: number;
    seccion_estante_id: number;
  }): Promise<LibroBibliotecaResponse> {
    const response = await this.request<LibroBibliotecaResponse>('/libro/estante', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  // GET /libros - Listar libros
  async getLibros(params?: {
    biblioteca_id?: number;
    page?: number;
    limit?: number;
  }): Promise<LibroResponse[]> {
    const searchParams = new URLSearchParams();
    if (params?.biblioteca_id) searchParams.append('biblioteca_id', params.biblioteca_id.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    const response = await this.request<LibroResponse[]>(`/libros${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
    return response.data;
  }

  // GET /libro/:id - Ver libro específico
  async getLibro(id: number): Promise<LibroResponse> {
    const response = await this.request<LibroResponse>(`/libro/${id}`, {
      method: 'GET',
    });
    return response.data;
  }

  // GET /libro/isbn - Buscar por ISBN (Catálogo General)
  async buscarLibroPorIsbn(isbn: string): Promise<LibroResponse> {
    const response = await this.request<LibroResponse>(`/libro/isbn?isbn=${isbn}`, {
      method: 'GET',
    });
    return response.data;
  }

  // GET /libro/isbn/biblioteca - Buscar por ISBN en biblioteca
  async buscarLibroPorIsbnEnBiblioteca(isbn: string, bibliotecaId: number): Promise<LibroResponse> {
    const response = await this.request<LibroResponse>(`/libro/isbn/biblioteca?isbn=${isbn}&biblioteca_id=${bibliotecaId}`, {
      method: 'GET',
    });
    return response.data;
  }

  // GET /libro/nombre - Buscar por nombre
  async buscarLibroPorNombre(nombre: string, bibliotecaId?: number): Promise<LibroResponse[]> {
    const params = new URLSearchParams({ nombre });
    if (bibliotecaId) params.append('biblioteca_id', bibliotecaId.toString());
    
    const response = await this.request<LibroResponse[]>(`/libro/nombre?${params}`, {
      method: 'GET',
    });
    return response.data;
  }

  // PUT /libro/:id - Actualizar libro (Rol 3)
  async updateLibro(id: number, data: Partial<{
    nombre: string;
    autor: string;
    descripcion: string;
    isbn: string;
    cantidad: number;
  }>): Promise<LibroResponse> {
    const response = await this.request<LibroResponse>(`/libro/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  // DELETE /libro/:id - Eliminar libro (Rol 3)
  async deleteLibro(id: number): Promise<void> {
    await this.request(`/libro/${id}`, {
      method: 'DELETE',
    });
  }

  // === USUARIO-BIBLIOTECA ===
  // POST /usuario-biblioteca - Registrar usuario en biblioteca (Rol 2)
  async registrarUsuarioEnBiblioteca(data: {
    usuario_id: number;
    biblioteca_id: number;
  }): Promise<UsuarioBibliotecaResponse> {
    const response = await this.request<UsuarioBibliotecaResponse>('/usuario-biblioteca', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  // DELETE /usuario-biblioteca/:id - Eliminar usuario de biblioteca (Rol 2)
  async eliminarUsuarioDeBiblioteca(id: number): Promise<void> {
    await this.request(`/usuario-biblioteca/${id}`, {
      method: 'DELETE',
    });
  }

  // GET /verificar-registro-completo/:usuario_id - Verificar registro completo (Rol 2)
  async verificarRegistroCompleto(usuarioId: number): Promise<VerificarRegistroResponse> {
    const response = await this.request<VerificarRegistroResponse>(`/verificar-registro-completo/${usuarioId}`, {
      method: 'GET',
    });
    return response.data;
  }

  // POST /buscar-usuario-email - Buscar usuario por email (Rol 2)
  async buscarUsuarioPorEmail(email: string): Promise<BuscarUsuarioEmailResponse> {
    const response = await this.request<BuscarUsuarioEmailResponse>('/buscar-usuario-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return response.data;
  }

  // POST /registrar-rostro - Registrar rostro (Rol 2)
  async registrarRostro(data: {
    usuario_id: number;
    foto_base64: string;
  }): Promise<void> {
    await this.request('/registrar-rostro', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // === BIOMÉTRICOS ===
  // POST /registrar-rfid - Registrar RFID (Rol 2)
  async registrarRfid(data: {
    usuario_id: number;
    rfid_code: string;
  }): Promise<void> {
    await this.request('/registrar-rfid', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // POST /verificar-rfid - Verificar RFID (Rol 2)
  async verificarRfid(rfidCode: string): Promise<VerificarRfidResponse> {
    const response = await this.request<VerificarRfidResponse>('/verificar-rfid', {
      method: 'POST',
      body: JSON.stringify({ rfid_code: rfidCode }),
    });
    return response.data;
  }

  // POST /verificar-huella - Verificar huella (Rol 2)
  async verificarHuella(data: {
    huella_data: string;
    usuario_id?: number;
  }): Promise<any> {
    const response = await this.request('/verificar-huella', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  // POST /detectar-huella - Detectar/Registrar huella (Rol 2)
  async detectarHuella(data: {
    usuario_id: number;
    huella_data: string;
  }): Promise<any> {
    const response = await this.request('/detectar-huella', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  // === PRÉSTAMOS ===
  // POST /prestamo - Crear préstamo (Rol 2)
  async createPrestamo(data: {
    usuario_id: number;
    libro_biblioteca_id: number;
    fecha_prestamo: string; // YYYY-MM-DD
    fecha_devolucion_esperada: string; // YYYY-MM-DD
    observaciones?: string;
  }): Promise<PrestamoResponse> {
    const response = await this.request<PrestamoResponse>('/prestamo', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  // GET /prestamos - Listar préstamos
  async getPrestamos(params?: {
    usuario_id?: number;
    estado?: string;
    biblioteca_id?: number;
  }): Promise<PrestamoResponse[]> {
    const searchParams = new URLSearchParams();
    if (params?.usuario_id) searchParams.append('usuario_id', params.usuario_id.toString());
    if (params?.estado) searchParams.append('estado', params.estado);
    if (params?.biblioteca_id) searchParams.append('biblioteca_id', params.biblioteca_id.toString());
    
    const queryString = searchParams.toString();
    const response = await this.request<PrestamoResponse[]>(`/prestamos${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
    return response.data;
  }

  // GET /prestamo/:id - Ver préstamo específico
  async getPrestamo(id: number): Promise<PrestamoResponse> {
    const response = await this.request<PrestamoResponse>(`/prestamo/${id}`, {
      method: 'GET',
    });
    return response.data;
  }

  // PUT /prestamo/:id - Actualizar préstamo (Rol 2)
  async updatePrestamo(id: number, data: {
    fecha_devolucion_real?: string; // YYYY-MM-DD
    observaciones?: string;
  }): Promise<PrestamoResponse> {
    const response = await this.request<PrestamoResponse>(`/prestamo/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  // GET /prestamos/biblioteca/:bibliotecaId/:usuarioId - Préstamos por biblioteca
  async getPrestamosPorBiblioteca(bibliotecaId: number, usuarioId: number): Promise<PrestamoResponse[]> {
    const response = await this.request<PrestamoResponse[]>(`/prestamos/biblioteca/${bibliotecaId}/${usuarioId}`, {
      method: 'GET',
    });
    return response.data;
  }
}

// Instancia singleton del cliente Business API
const businessApiClientInstance = new BusinessApiClient(BUSINESS_API_BASE_URL);

// Funciones de conveniencia organizadas por módulo
export const bibliotecaApi = {
  crear: (data: Parameters<typeof businessApiClientInstance.createBiblioteca>[0]) => businessApiClientInstance.createBiblioteca(data),
  listar: (estado?: string) => businessApiClientInstance.getBibliotecas(estado),
  obtener: (id: number) => businessApiClientInstance.getBiblioteca(id),
  actualizar: (id: number, data: Parameters<typeof businessApiClientInstance.updateBiblioteca>[1]) => businessApiClientInstance.updateBiblioteca(id, data),
  eliminar: (id: number) => businessApiClientInstance.deleteBiblioteca(id),
  porUsuario: (usuarioId: number) => businessApiClientInstance.getBibliotecasByUsuario(usuarioId),
};

export const estanteApi = {
  crear: (data: Parameters<typeof businessApiClientInstance.createEstante>[0]) => businessApiClientInstance.createEstante(data),
  listar: () => businessApiClientInstance.getEstantes(),
  obtener: (id: number) => businessApiClientInstance.getEstante(id),
  actualizar: (id: number, data: Parameters<typeof businessApiClientInstance.updateEstante>[1]) => businessApiClientInstance.updateEstante(id, data),
  eliminar: (id: number) => businessApiClientInstance.deleteEstante(id),
  secciones: (estanteId: number) => businessApiClientInstance.getSecciones(estanteId),
  actualizarSeccion: (id: number, data: any) => businessApiClientInstance.updateSeccion(id, data),
};

export const libroApi = {
  crear: (data: Parameters<typeof businessApiClientInstance.createLibro>[0]) => businessApiClientInstance.createLibro(data),
  listar: (params?: Parameters<typeof businessApiClientInstance.getLibros>[0]) => businessApiClientInstance.getLibros(params),
  obtener: (id: number) => businessApiClientInstance.getLibro(id),
  actualizar: (id: number, data: Parameters<typeof businessApiClientInstance.updateLibro>[1]) => businessApiClientInstance.updateLibro(id, data),
  eliminar: (id: number) => businessApiClientInstance.deleteLibro(id),
  buscarPorIsbn: (isbn: string) => businessApiClientInstance.buscarLibroPorIsbn(isbn),
  buscarPorIsbnEnBiblioteca: (isbn: string, bibliotecaId: number) => businessApiClientInstance.buscarLibroPorIsbnEnBiblioteca(isbn, bibliotecaId),
  buscarPorNombre: (nombre: string, bibliotecaId?: number) => businessApiClientInstance.buscarLibroPorNombre(nombre, bibliotecaId),
  asignarAEstante: (data: Parameters<typeof businessApiClientInstance.assignLibroToEstante>[0]) => businessApiClientInstance.assignLibroToEstante(data),
};

export const usuarioBibliotecaApi = {
  registrar: (data: Parameters<typeof businessApiClientInstance.registrarUsuarioEnBiblioteca>[0]) => businessApiClientInstance.registrarUsuarioEnBiblioteca(data),
  eliminar: (id: number) => businessApiClientInstance.eliminarUsuarioDeBiblioteca(id),
  verificarRegistro: (usuarioId: number) => businessApiClientInstance.verificarRegistroCompleto(usuarioId),
  buscarPorEmail: (email: string) => businessApiClientInstance.buscarUsuarioPorEmail(email),
  registrarRostro: (data: Parameters<typeof businessApiClientInstance.registrarRostro>[0]) => businessApiClientInstance.registrarRostro(data),
};

export const biometricoApi = {
  registrarRfid: (data: Parameters<typeof businessApiClientInstance.registrarRfid>[0]) => businessApiClientInstance.registrarRfid(data),
  verificarRfid: (rfidCode: string) => businessApiClientInstance.verificarRfid(rfidCode),
  verificarHuella: (data: Parameters<typeof businessApiClientInstance.verificarHuella>[0]) => businessApiClientInstance.verificarHuella(data),
  detectarHuella: (data: Parameters<typeof businessApiClientInstance.detectarHuella>[0]) => businessApiClientInstance.detectarHuella(data),
};

export const prestamoApi = {
  crear: (data: Parameters<typeof businessApiClientInstance.createPrestamo>[0]) => businessApiClientInstance.createPrestamo(data),
  listar: (params?: Parameters<typeof businessApiClientInstance.getPrestamos>[0]) => businessApiClientInstance.getPrestamos(params),
  obtener: (id: number) => businessApiClientInstance.getPrestamo(id),
  actualizar: (id: number, data: Parameters<typeof businessApiClientInstance.updatePrestamo>[1]) => businessApiClientInstance.updatePrestamo(id, data),
  porBiblioteca: (bibliotecaId: number, usuarioId: number) => businessApiClientInstance.getPrestamosPorBiblioteca(bibliotecaId, usuarioId),
};

// Exportar también el cliente principal para uso directo si es necesario
export const businessApiClient = businessApiClientInstance;
