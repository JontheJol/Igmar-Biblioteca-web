/**
 * API Service for Booksmart Auth
 * Implementación de la API de autenticación para Administradores y Super Administradores
 * Basado en: ADMIN_SUPERADMIN_ROUTES_GUIDE.md
 */

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL ;

// Tipos de respuesta de la API
export interface ApiResponse<T = any> {
  status: string;
  msg: string;
  data: T;
}

export interface LoginResponse {
  token?: string;
  type?: 'bearer';
  expires_at?: string;
  user?: {
    id: number;
    nombre: string;
    apellido?: string;
    correo: string;
    rol: string;
    bibliotecaId?: number;
    activo?: boolean;
  };
  requires_2fa?: boolean;
  temp_token?: string;
  user_id?: number;
  email_sent?: boolean;
  codigo_2fa_debug?: string; // Solo en desarrollo
}

export interface TwoFactorResponse {
  token: string;
  type: 'bearer';
  expires_at: string;
  user: {
    id: number;
    nombre: string;
    apellido?: string;
    correo: string;
    rol: string;
    bibliotecaId?: number;
  };
}

export interface RegisterResponse {
  usuario_id: number;
  nombre: string;
  correo: string;
  email_sent?: boolean;
  email_token?: string;
}

export interface UserInfoResponse {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: string;
  bibliotecaId?: number;
  activo: boolean;
}

// Manejo de errores de la API
export class ApiError extends Error {
  public status: number;
  public code: string;
  public details?: Record<string, any>;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Cliente HTTP base
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private loadToken() {
    this.token = localStorage.getItem('auth_token');
  }

  private saveToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  private removeToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
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

    // Agregar token de autorización si está disponible
    if (this.token && !endpoint.includes('/login') && !endpoint.includes('/register')) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      // Manejar errores de la API
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
      
      // Error de red o parsing
      throw new ApiError(
        500,
        'NETWORK_ERROR',
        'Error de conexión con el servidor',
        { originalError: error }
      );
    }
  }

  // Métodos de autenticación
  async login(correo: string, contraseña: string): Promise<LoginResponse> {
    console.log('🔐 API Login llamado con:', { correo, contraseña: '***' });
    
    const requestBody = { correo, contraseña };
    console.log('📤 Enviando datos:', requestBody);
    
    // Intentar con la API real
    try {
      const response = await this.request<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      console.log('📥 Respuesta recibida:', response);

      // Si el login es exitoso y no requiere 2FA, guardar el token
      if (response.data.token && !response.data.requires_2fa) {
        this.saveToken(response.data.token);
      }

      return response.data;
    } catch (error) {
      // Si es error 403 de bibliotecarios, intentar con /api/auth/login
      if (error instanceof ApiError && error.status === 403) {
        console.log('🔄 Reintentando con /api/auth/login...');
        
        try {
          const response = await this.request<LoginResponse>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(requestBody),
          });

          console.log('📥 Respuesta de /api/auth/login:', response);

          if (response.data.token && !response.data.requires_2fa) {
            this.saveToken(response.data.token);
          }

          return response.data;
        } catch (apiError) {
          console.log('❌ También falló /api/auth/login:', apiError);
          throw apiError;
        }
      }
      
      throw error;
    }
  }

  async verifyTwoFactor(code: string, userId: number): Promise<TwoFactorResponse> {
    console.log('🔐 Verificando 2FA:', { code, userId });
    
    // Usar API real
    const response = await this.request<TwoFactorResponse>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ 
        '2fa': code,
        user_id: userId 
      }),
    });

    // Guardar el token definitivo después de 2FA exitoso
    if (response.data.token) {
      this.saveToken(response.data.token);
    }

    return response.data;
  }

  async registerAdmin(data: {
    nombre: string;
    apellido: string;
    correo: string;
    contraseña: string;
    curp: string;
    rfc: string;
  }): Promise<RegisterResponse> {
    const response = await this.request<RegisterResponse>('/api/auth/admin/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response.data;
  }

  async registerBibliotecario(data: {
    nombre: string;
    apellido: string;
    correo: string;
    contraseña: string;
    Celular: string;
    curp: string;
    rfc: string;
    Biblioteca_id: number;
  }): Promise<RegisterResponse> {
    const response = await this.request<RegisterResponse>('/bibliotecario/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response.data;
  }

  async getUserInfo(): Promise<UserInfoResponse> {
    const response = await this.request<UserInfoResponse>('/api/auth/userinfo', {
      method: 'GET',
    });

    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/api/auth/logout', {
        method: 'POST',
      });
    } finally {
      // Siempre remover el token local, incluso si la API falla
      this.removeToken();
    }
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await this.request<{ token: string }>('/api/auth/refresh', {
      method: 'POST',
    });

    if (response.data.token) {
      this.saveToken(response.data.token);
    }

    return response.data;
  }

  // Validar token actual
  async validateToken(): Promise<boolean> {
    try {
      await this.getUserInfo();
      return true;
    } catch (error) {
      this.removeToken();
      return false;
    }
  }

  // Getters
  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient(API_BASE_URL);

// Funciones de conveniencia para usar en el store
export const authApi = {
  login: (correo: string, contraseña: string) => apiClient.login(correo, contraseña),
  verifyTwoFactor: (code: string, userId: number) => apiClient.verifyTwoFactor(code, userId),
  registerAdmin: (data: Parameters<typeof apiClient.registerAdmin>[0]) => apiClient.registerAdmin(data),
  registerBibliotecario: (data: Parameters<typeof apiClient.registerBibliotecario>[0]) => apiClient.registerBibliotecario(data),
  getUserInfo: () => apiClient.getUserInfo(),
  logout: () => apiClient.logout(),
  refreshToken: () => apiClient.refreshToken(),
  validateToken: () => apiClient.validateToken(),
  getToken: () => apiClient.getToken(),
  isAuthenticated: () => apiClient.isAuthenticated(),
};

// Utilidades para manejo de errores
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Error desconocido';
};

export const getErrorDetails = (error: unknown): Record<string, any> | undefined => {
  if (error instanceof ApiError) {
    return error.details;
  }
  return undefined;
};

// Códigos de error conocidos para manejo específico
export const ERROR_CODES = {
  // Autenticación
  AUTH_01: 'AUTH_01', // Credenciales inválidas
  AUTH_02: 'AUTH_02', // Correo electrónico no encontrado
  AUTH_03: 'AUTH_03', // Datos con formato inválido
  
  // Registro
  REG_01: 'REG_01', // Registro exitoso
  REG_02: 'REG_02', // Formato de datos incorrecto
  REG_03: 'REG_03', // Correo ya registrado
  
  // Verificación 2FA
  VER_04: 'VER_04', // Código incorrecto o expirado
  VER_05: 'VER_05', // Formato de código incorrecto
  VER_07: 'VER_07', // Falta user_id
  
  // Generales
  ERR_500: 'ERR_500', // Error interno del servidor
} as const;
