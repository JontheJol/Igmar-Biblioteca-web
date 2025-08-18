/**
 * Business API Service for BookSmart
 * Implementación de la API business para gestión de bibliotecas, estantes, libros, etc.
 * Basado en: API_DOCUMENTATION.md
 */

import { apiClient, ApiError } from './api';
import type { ApiResponse } from './api';

// Base URL para Business API
const BUSINESS_API_BASE_URL = import.meta.env.VITE_BUSINESS_API_URL || 'http://localhost:5174/api/business';

// Tipos de respuesta específicos de Business API
export interface BibliotecaResponse {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  horarioApertura: string;
  horarioCierre: string;
  estado: number; // 1 = activa, 0 = inactiva
}

export interface EstanteResponse {
  id: number;
  etiqueta: string;
  biblioteca_id: number;
  capacidad: number;
  ubicacion: string;
  estado: number;
}

export interface SeccionResponse {
  id: number;
  estante_id: number;
  etiqueta: string;
  fila: number;
  columna: number;
  created_at: string;
  updated_at: string;
}

export interface LibroResponse {
  id: number;
  titulo: string;
  autor: string;
  isbn: string;
  genero: string;
  fecha_publicacion: string;
  numero_paginas: number;
  editorial: string;
  estado: number;
}

export interface LibroBibliotecaResponse {
  id: number;
  libro_id: number;
  biblioteca_id: number;
  cantidad_disponible: number;
  cantidad_prestada: number;
  ubicacion_fisica: string;
  seccion_estante_id?: number;
}

export interface UsuarioBibliotecaResponse {
  id: number;
  usuario_id: number;
  biblioteca_id: number;
  fecha_registro: string;
  activo: number;
}

export interface BiometricStatusResponse {
  foto_registrada: boolean;
  huella_registrada: boolean;
  tarjeta_registrada: boolean;
  registro_completo: boolean;
}

export interface PrestamoResponse {
  id: number;
  usuario_id: number;
  libro_biblioteca_id: number;
  fecha_prestamo: string;
  fecha_devolucion_esperada: string;
  fecha_devolucion_real?: string;
  estado: string; // 'prestado', 'devuelto', 'vencido'
}

// Cliente Business API
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
          'No se puede conectar con el servidor. Verifica que el servidor esté ejecutándose y que CORS esté configurado correctamente.',
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
  async createBiblioteca(data: {
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
    horarioApertura: string;
    horarioCierre: string;
  }): Promise<BibliotecaResponse> {
    const response = await this.request<BibliotecaResponse>('/biblioteca', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async getBibliotecas(estado?: number): Promise<BibliotecaResponse[]> {
    const params = estado !== undefined ? `?estado=${estado}` : '';
    const response = await this.request<BibliotecaResponse[]>(`/bibliotecas${params}`, {
      method: 'GET',
    });
    return response.data;
  }

  async getBiblioteca(id: number): Promise<BibliotecaResponse> {
    const response = await this.request<BibliotecaResponse>(`/biblioteca/${id}`, {
      method: 'GET',
    });
    return response.data;
  }

  async updateBiblioteca(id: number, data: Partial<{
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
    horarioApertura: string;
    horarioCierre: string;
  }>): Promise<BibliotecaResponse> {
    const response = await this.request<BibliotecaResponse>(`/biblioteca/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deleteBiblioteca(id: number): Promise<void> {
    await this.request(`/biblioteca/${id}`, {
      method: 'DELETE',
    });
  }

  async getBibliotecasByUsuario(usuarioId: number): Promise<BibliotecaResponse[]> {
    const response = await this.request<BibliotecaResponse[]>(`/bibliotecas/usuario/${usuarioId}`, {
      method: 'GET',
    });
    return response.data;
  }

  // === ESTANTES ===
  async createEstante(data: {
    etiqueta: string;
    biblioteca_id: number;
    capacidad: number;
    ubicacion: string;
  }): Promise<EstanteResponse> {
    const response = await this.request<EstanteResponse>('/estante', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async getEstantes(bibliotecaId?: number): Promise<EstanteResponse[]> {
    const params = bibliotecaId ? `?biblioteca_id=${bibliotecaId}` : '';
    const response = await this.request<EstanteResponse[]>(`/estantes${params}`, {
      method: 'GET',
    });
    return response.data;
  }

  async getEstante(id: number): Promise<EstanteResponse> {
    const response = await this.request<EstanteResponse>(`/estante/${id}`, {
      method: 'GET',
    });
    return response.data;
  }

  async updateEstante(id: number, data: Partial<{
    etiqueta: string;
    capacidad: number;
    ubicacion: string;
  }>): Promise<EstanteResponse> {
    const response = await this.request<EstanteResponse>(`/estante/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deleteEstante(id: number): Promise<void> {
    await this.request(`/estante/${id}`, {
      method: 'DELETE',
    });
  }

  // === SECCIONES ===
  async getSecciones(estanteId: number): Promise<SeccionResponse[]> {
    const response = await this.request<SeccionResponse[]>(`/secciones/${estanteId}`, {
      method: 'GET',
    });
    return response.data;
  }

  async updateSeccion(id: number, data: Partial<{
    etiqueta: string;
    fila: number;
    columna: number;
  }>): Promise<SeccionResponse> {
    const response = await this.request<SeccionResponse>(`/seccion/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  // === LIBROS ===
  async createLibro(data: {
    titulo: string;
    autor: string;
    isbn: string;
    genero: string;
    fecha_publicacion: string;
    numero_paginas: number;
    editorial: string;
    biblioteca_id: number;
    cantidad_disponible: number;
    ubicacion_fisica: string;
  }): Promise<{
    libro: LibroResponse;
    biblioteca_instancia: LibroBibliotecaResponse;
  }> {
    const response = await this.request<{
      libro: LibroResponse;
      biblioteca_instancia: LibroBibliotecaResponse;
    }>('/libro', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async assignLibroToEstante(data: {
    libro_id: number;
    biblioteca_id: number;
    seccion_estante_id: number;
    cantidad_disponible: number;
  }): Promise<LibroBibliotecaResponse> {
    const response = await this.request<LibroBibliotecaResponse>('/libro/estante', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async getLibros(params?: {
    biblioteca_id?: number;
    estado?: number;
  }): Promise<LibroResponse[]> {
    const searchParams = new URLSearchParams();
    if (params?.biblioteca_id) searchParams.append('biblioteca_id', params.biblioteca_id.toString());
    if (params?.estado !== undefined) searchParams.append('estado', params.estado.toString());
    
    const queryString = searchParams.toString();
    const url = `/libros${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request<LibroResponse[]>(url, {
      method: 'GET',
    });
    return response.data;
  }

  async getLibro(id: number): Promise<LibroResponse> {
    const response = await this.request<LibroResponse>(`/libro/${id}`, {
      method: 'GET',
    });
    return response.data;
  }

  async getLibroByISBN(isbn: string): Promise<LibroResponse[]> {
    const response = await this.request<LibroResponse[]>(`/libro/isbn?isbn=${encodeURIComponent(isbn)}`, {
      method: 'GET',
    });
    return response.data;
  }

  async getLibrosByNombre(nombre: string): Promise<LibroResponse[]> {
    const response = await this.request<LibroResponse[]>(`/libro/nombre?nombre=${encodeURIComponent(nombre)}`, {
      method: 'GET',
    });
    return response.data;
  }

  async updateLibro(id: number, data: Partial<{
    titulo: string;
    autor: string;
    isbn: string;
    genero: string;
    fecha_publicacion: string;
    numero_paginas: number;
    editorial: string;
  }>): Promise<LibroResponse> {
    const response = await this.request<LibroResponse>(`/libro/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deleteLibro(id: number): Promise<void> {
    await this.request(`/libro/${id}`, {
      method: 'DELETE',
    });
  }

  // === USUARIO-BIBLIOTECA ===
  async createUsuarioBiblioteca(data: {
    usuario_id: number;
    biblioteca_id: number;
  }): Promise<{
    usuario_biblioteca: UsuarioBibliotecaResponse;
    biometric_status: BiometricStatusResponse;
    next_steps: string[];
  }> {
    const response = await this.request<{
      usuario_biblioteca: UsuarioBibliotecaResponse;
      biometric_status: BiometricStatusResponse;
      next_steps: string[];
    }>('/usuario-biblioteca', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deleteUsuarioBiblioteca(id: number): Promise<void> {
    await this.request(`/usuario-biblioteca/${id}`, {
      method: 'DELETE',
    });
  }

  async verificarRegistroCompleto(usuarioId: number): Promise<{
    usuario_id: number;
    usuario_nombre: string;
    usuario_apellido: string;
    biblioteca_nombre: string;
    biometric_status: BiometricStatusResponse;
    codigo_tarjeta?: string;
    ready_for_use: boolean;
  }> {
    const response = await this.request<{
      usuario_id: number;
      usuario_nombre: string;
      usuario_apellido: string;
      biblioteca_nombre: string;
      biometric_status: BiometricStatusResponse;
      codigo_tarjeta?: string;
      ready_for_use: boolean;
    }>(`/verificar-registro-completo/${usuarioId}`, {
      method: 'GET',
    });
    return response.data;
  }

  async buscarUsuarioPorEmail(data: {
    email: string;
    biblioteca_id: number;
  }): Promise<any> {
    const response = await this.request('/buscar-usuario-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  // === BIOMÉTRICOS ===
  async registrarRFID(data: {
    usuario_id: number;
    codigo_tarjeta: string;
  }): Promise<any> {
    const response = await this.request('/registrar-rfid', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async verificarRFID(data: {
    codigo_tarjeta: string;
  }): Promise<any> {
    const response = await this.request('/verificar-rfid', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async detectarHuella(data: {
    usuario_id: number;
  }): Promise<any> {
    const response = await this.request('/detectar-huella', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async verificarHuella(): Promise<any> {
    const response = await this.request('/verificar-huella', {
      method: 'POST',
    });
    return response.data;
  }

  async registrarRostro(data: {
    usuario_id: number;
  }): Promise<any> {
    const response = await this.request('/registrar-rostro', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  // === PRÉSTAMOS ===
  async createPrestamo(data: {
    usuario_id: number;
    libro_biblioteca_id: number;
    fecha_prestamo: string;
    fecha_devolucion_esperada: string;
  }): Promise<PrestamoResponse> {
    const response = await this.request<PrestamoResponse>('/prestamo', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async getPrestamos(): Promise<PrestamoResponse[]> {
    const response = await this.request<PrestamoResponse[]>('/prestamos', {
      method: 'GET',
    });
    return response.data;
  }

  async getPrestamo(id: number): Promise<PrestamoResponse> {
    const response = await this.request<PrestamoResponse>(`/prestamo/${id}`, {
      method: 'GET',
    });
    return response.data;
  }

  async updatePrestamo(id: number, data: Partial<{
    fecha_devolucion_real: string;
    estado: string;
  }>): Promise<PrestamoResponse> {
    const response = await this.request<PrestamoResponse>(`/prestamo/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async getPrestamosByBiblioteca(bibliotecaId: number): Promise<PrestamoResponse[]> {
    const response = await this.request<PrestamoResponse[]>(`/prestamos/biblioteca/${bibliotecaId}`, {
      method: 'GET',
    });
    return response.data;
  }

  // === HEALTH CHECK ===
  async healthCheck(): Promise<{ hello: string }> {
    const response = await this.request<{ hello: string }>('/', {
      method: 'GET',
    });
    return response.data;
  }
}

// Instancia singleton del cliente Business API
export const businessApiClient = new BusinessApiClient(BUSINESS_API_BASE_URL);

// Funciones de conveniencia para usar en el store
export const businessApi = {
  // Bibliotecas
  createBiblioteca: (data: Parameters<typeof businessApiClient.createBiblioteca>[0]) => 
    businessApiClient.createBiblioteca(data),
  getBibliotecas: (estado?: number) => businessApiClient.getBibliotecas(estado),
  getBiblioteca: (id: number) => businessApiClient.getBiblioteca(id),
  updateBiblioteca: (id: number, data: Parameters<typeof businessApiClient.updateBiblioteca>[1]) => 
    businessApiClient.updateBiblioteca(id, data),
  deleteBiblioteca: (id: number) => businessApiClient.deleteBiblioteca(id),
  getBibliotecasByUsuario: (usuarioId: number) => businessApiClient.getBibliotecasByUsuario(usuarioId),

  // Estantes
  createEstante: (data: Parameters<typeof businessApiClient.createEstante>[0]) => 
    businessApiClient.createEstante(data),
  getEstantes: (bibliotecaId?: number) => businessApiClient.getEstantes(bibliotecaId),
  getEstante: (id: number) => businessApiClient.getEstante(id),
  updateEstante: (id: number, data: Parameters<typeof businessApiClient.updateEstante>[1]) => 
    businessApiClient.updateEstante(id, data),
  deleteEstante: (id: number) => businessApiClient.deleteEstante(id),

  // Secciones
  getSecciones: (estanteId: number) => businessApiClient.getSecciones(estanteId),
  updateSeccion: (id: number, data: Parameters<typeof businessApiClient.updateSeccion>[1]) => 
    businessApiClient.updateSeccion(id, data),

  // Libros
  createLibro: (data: Parameters<typeof businessApiClient.createLibro>[0]) => 
    businessApiClient.createLibro(data),
  assignLibroToEstante: (data: Parameters<typeof businessApiClient.assignLibroToEstante>[0]) => 
    businessApiClient.assignLibroToEstante(data),
  getLibros: (params?: Parameters<typeof businessApiClient.getLibros>[0]) => 
    businessApiClient.getLibros(params),
  getLibro: (id: number) => businessApiClient.getLibro(id),
  getLibroByISBN: (isbn: string) => businessApiClient.getLibroByISBN(isbn),
  getLibrosByNombre: (nombre: string) => businessApiClient.getLibrosByNombre(nombre),
  updateLibro: (id: number, data: Parameters<typeof businessApiClient.updateLibro>[1]) => 
    businessApiClient.updateLibro(id, data),
  deleteLibro: (id: number) => businessApiClient.deleteLibro(id),

  // Usuario-Biblioteca
  createUsuarioBiblioteca: (data: Parameters<typeof businessApiClient.createUsuarioBiblioteca>[0]) => 
    businessApiClient.createUsuarioBiblioteca(data),
  deleteUsuarioBiblioteca: (id: number) => businessApiClient.deleteUsuarioBiblioteca(id),
  verificarRegistroCompleto: (usuarioId: number) => businessApiClient.verificarRegistroCompleto(usuarioId),
  buscarUsuarioPorEmail: (data: Parameters<typeof businessApiClient.buscarUsuarioPorEmail>[0]) => 
    businessApiClient.buscarUsuarioPorEmail(data),

  // Biométricos
  registrarRFID: (data: Parameters<typeof businessApiClient.registrarRFID>[0]) => 
    businessApiClient.registrarRFID(data),
  verificarRFID: (data: Parameters<typeof businessApiClient.verificarRFID>[0]) => 
    businessApiClient.verificarRFID(data),
  detectarHuella: (data: Parameters<typeof businessApiClient.detectarHuella>[0]) => 
    businessApiClient.detectarHuella(data),
  verificarHuella: () => businessApiClient.verificarHuella(),
  registrarRostro: (data: Parameters<typeof businessApiClient.registrarRostro>[0]) => 
    businessApiClient.registrarRostro(data),

  // Préstamos
  createPrestamo: (data: Parameters<typeof businessApiClient.createPrestamo>[0]) => 
    businessApiClient.createPrestamo(data),
  getPrestamos: () => businessApiClient.getPrestamos(),
  getPrestamo: (id: number) => businessApiClient.getPrestamo(id),
  updatePrestamo: (id: number, data: Parameters<typeof businessApiClient.updatePrestamo>[1]) => 
    businessApiClient.updatePrestamo(id, data),
  getPrestamosByBiblioteca: (bibliotecaId: number) => businessApiClient.getPrestamosByBiblioteca(bibliotecaId),

  // Health
  healthCheck: () => businessApiClient.healthCheck(),
};

// Funciones de mapeo para convertir respuestas de API a formatos del frontend
export const mappers = {
  bibliotecaResponseToBiblioteca: (response: BibliotecaResponse): import('../types').Biblioteca => ({
    id: response.id,
    nombre: response.nombre,
    direccion: response.direccion,
    estado: response.estado === 1 ? 'activa' : 'inactiva',
    telefono: response.telefono,
    email: response.email,
    fechaCreacion: new Date().toISOString(),
    administrador: 'Sin asignar', // Este campo puede venir de otra fuente
  }),

  estanteResponseToEstante: (response: EstanteResponse): import('../types').Estante => {
    // Extraer fila y columna de la etiqueta si tiene formato específico
    const ubicacionParts = response.etiqueta.split('-');
    let fila = '1';
    let columna = '1';
    
    // Intentar extraer fila y columna de formatos como "A24", "Sector-C-08", etc.
    if (response.etiqueta.match(/^[A-Z]\d+$/)) {
      // Formato A24
      fila = response.etiqueta.charAt(0);
      columna = response.etiqueta.substring(1);
    } else if (ubicacionParts.length >= 3) {
      // Formato Sector-C-08
      fila = ubicacionParts[1] || '1';
      columna = ubicacionParts[2] || '1';
    }

    return {
      id: response.id,
      nombre: response.etiqueta,
      ubicacion: response.ubicacion,
      fila,
      columna,
      cantidadLibros: 0, // Este dato vendría de una consulta separada a libros
      espaciosDisponibles: response.capacidad,
      etiquetas: [], // Agregar lógica de etiquetas si es necesario
    };
  },

  libroResponseToLibro: (response: LibroResponse): import('../types').Libro => ({
    id: response.id,
    titulo: response.titulo,
    autor: response.autor,
    editorial: response.editorial,
    estante: 'Sin asignar', // Extraer de biblioteca_instancia si está disponible
    isbn: response.isbn,
    fechaPublicacion: response.fecha_publicacion,
    estado: response.estado === 1 ? 'disponible' : 'no disponible',
    descripcion: '', // Agregar si la API lo proporciona en el futuro
  }),

  // Convertir datos del frontend a formato de API
  bibliotecaToApiRequest: (biblioteca: Partial<import('../types').Biblioteca>) => ({
    nombre: biblioteca.nombre || '',
    direccion: biblioteca.direccion || '',
    telefono: biblioteca.telefono || '',
    email: biblioteca.email || '',
    horarioApertura: '08:00',
    horarioCierre: '18:00',
  }),

  estanteToApiRequest: (estante: Partial<import('../types').Estante>, bibliotecaId: number) => ({
    etiqueta: estante.nombre || '',
    biblioteca_id: bibliotecaId,
    capacidad: (estante.espaciosDisponibles || 0) + (estante.cantidadLibros || 0),
    ubicacion: estante.ubicacion || '',
  }),

  libroToApiRequest: (libro: Partial<import('../types').Libro>, bibliotecaId: number) => ({
    titulo: libro.titulo || '',
    autor: libro.autor || '',
    isbn: libro.isbn || '',
    genero: 'General', // Valor por defecto
    fecha_publicacion: libro.fechaPublicacion || new Date().toISOString().split('T')[0],
    numero_paginas: 0, // Valor por defecto
    editorial: libro.editorial || '',
    biblioteca_id: bibliotecaId,
    cantidad_disponible: 1, // Valor por defecto
    ubicacion_fisica: libro.estante || 'Sin asignar',
  }),
};
