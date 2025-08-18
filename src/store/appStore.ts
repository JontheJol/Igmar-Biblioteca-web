import { create } from 'zustand';
import type { NotificationData } from '../components/NotificationDialog';
import type { Bibliotecario, Libro, Estante, Biblioteca, Administrador } from '../types';
import { authApi, getErrorMessage, getErrorDetails } from '../services/api';
import { 
  bibliotecaApi, 
  libroApi,
  type SeccionResponse
} from '../services/businessApiUpdated';
import { businessApi } from '../services/businessApi';
import { estanteService } from '../services/estanteService';
import { seccionService, type SeccionFormData } from '../services/seccionService';
import { mappers } from '../services/mappers';

// Roles constants
export const ROLES = {
  ADMIN: 3,
  SUPER_ADMIN: 4,
} as const;

export const ROLE_NAMES = {
  3: 'Administrador',
  4: 'Super Administrador',
} as const;

// Helper functions for role checking
export const isAdmin = (roleId: number): boolean => roleId === ROLES.ADMIN;
export const isSuperAdmin = (roleId: number): boolean => roleId === ROLES.SUPER_ADMIN;
export const hasAdminAccess = (roleId: number): boolean => roleId === ROLES.ADMIN || roleId === ROLES.SUPER_ADMIN;
export const hasSuperAdminAccess = (roleId: number): boolean => roleId === ROLES.SUPER_ADMIN;

export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  gender?: 'masculino' | 'femenino' | 'otro' | 'no_especificado';
}

export interface UserStatsData {
  hombres: number;
  mujeres: number;
  otros: number;
  total: number;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  roleId: number; // 3 = Administrador, 4 = Super Administrador
  roleName: string;
  bibliotecaId?: number;
}

export interface TempAuthData {
  userId: number;
  tempToken?: string;
  user: AuthUser;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  phone: string;
  curp: string;
  rfc: string;
  email: string;
  password: string;
}

interface AppState {
  users: User[];
  loading: boolean;
  error: string | null;
  // User statistics
  userStats: UserStatsData | null;
  userStatsLoading: boolean;
  userStatsError: string | null;
  // Bibliotecarios state
  bibliotecarios: Bibliotecario[];
  bibliotecarioLoading: boolean;
  bibliotecarioError: string | null;
  // Administradores state
  administradores: Administrador[];
  administradorLoading: boolean;
  administradorError: string | null;
  // Libros state
  libros: Libro[];
  libroLoading: boolean;
  libroError: string | null;
  // Estantes state
  estantes: Estante[];
  estanteLoading: boolean;
  estanteError: string | null;
  // Secciones state
  secciones: SeccionResponse[];
  seccionLoading: boolean;
  seccionError: string | null;
  // Bibliotecas state
  bibliotecas: Biblioteca[];
  bibliotecaLoading: boolean;
  bibliotecaError: string | null;
  // Auth state
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  tempAuthData: TempAuthData | null; // Data stored during 2FA process
  authLoading: boolean;
  authError: string | null;
  shouldRedirectTo2FA: boolean; // New flag for 2FA redirection
  // Notification state
  notification: NotificationData | null;
  showNotification: boolean;
  // User CRUD actions
  addUser: (user: Omit<User, 'id'>) => void;
  removeUser: (id: number) => void;
  updateUser: (id: number, updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  // User statistics actions
  fetchUserStats: (period?: 'day' | 'week' | 'month' | 'year') => Promise<void>;
  setUserStatsLoading: (loading: boolean) => void;
  setUserStatsError: (error: string | null) => void;
  // Bibliotecario CRUD actions
  addBibliotecario: (bibliotecario: Omit<Bibliotecario, 'id'>) => void;
  removeBibliotecario: (id: number) => void;
  updateBibliotecario: (id: number, updates: Partial<Bibliotecario>) => void;
  setBibliotecarioLoading: (loading: boolean) => void;
  setBibliotecarioError: (error: string | null) => void;
  // Libro CRUD actions
  loadLibros: (bibliotecaId?: number) => Promise<void>;
  addLibro: (libro: Omit<Libro, 'id'>) => Promise<void>;
  removeLibro: (id: number) => Promise<void>;
  updateLibro: (id: number, updates: Partial<Libro>) => Promise<void>;
  assignLibroToEstante: (data: { libro_id: number; estante: string; etiqueta: string; fila: string; columna: string }) => Promise<void>;
  setLibroLoading: (loading: boolean) => void;
  setLibroError: (error: string | null) => void;
  getLibroById: (id: number) => Promise<Libro | undefined>;
  // Estante CRUD actions
  loadEstantes: (bibliotecaId?: number) => Promise<void>;
  addEstante: (estante: Omit<Estante, 'id'>) => Promise<void>;
  removeEstante: (id: number) => Promise<void>;
  updateEstante: (id: number, updates: Partial<Estante>) => Promise<void>;
  setEstanteLoading: (loading: boolean) => void;
  setEstanteError: (error: string | null) => void;
  getEstanteById: (id: number) => Estante | undefined;
  // Secciones CRUD actions
  loadSecciones: (estanteId: number) => Promise<void>;
  updateSeccion: (seccionId: number, updates: SeccionFormData) => Promise<void>;
  setSeccionLoading: (loading: boolean) => void;
  setSeccionError: (error: string | null) => void;
  getSeccionById: (id: number) => SeccionResponse | undefined;
  obtenerEtiquetasUnicas: (estanteId: number) => Promise<string[]>;
  generarMapaPosiciones: (estanteId: number) => Promise<{ [key: string]: SeccionResponse } | null>;
  // Biblioteca CRUD actions
  loadBibliotecas: () => Promise<void>;
  addBiblioteca: (biblioteca: Omit<Biblioteca, 'id'>) => Promise<void>;
  removeBiblioteca: (id: number) => Promise<void>;
  updateBiblioteca: (id: number, updates: Partial<Biblioteca>) => Promise<void>;
  setBibliotecaLoading: (loading: boolean) => void;
  setBibliotecaError: (error: string | null) => void;
  getBibliotecaById: (id: number) => Biblioteca | undefined;
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  verifyTwoFactor: (data: { codigo: string }) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  confirmEmail: (email: string) => Promise<void>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  setAuthLoading: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;
  clearRedirectTo2FA: () => void;
  // Notification actions
  showSuccessNotification: (title: string, message: string, buttonText?: string) => void;
  showErrorNotification: (title: string, message: string, details?: Record<string, string>, buttonText?: string) => void;
  hideNotification: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  users: [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', age: 30, gender: 'masculino' },
    { id: 2, name: 'María García', email: 'maria@example.com', age: 25, gender: 'femenino' },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com', age: 35, gender: 'masculino' },
    { id: 4, name: 'Ana Rodríguez', email: 'ana@example.com', age: 28, gender: 'femenino' },
    { id: 5, name: 'Luis Martínez', email: 'luis@example.com', age: 42, gender: 'masculino' },
    { id: 6, name: 'Carmen Jiménez', email: 'carmen@example.com', age: 33, gender: 'femenino' },
    { id: 7, name: 'Roberto Silva', email: 'roberto@example.com', age: 29, gender: 'masculino' },
    { id: 8, name: 'Patricia Morales', email: 'patricia@example.com', age: 31, gender: 'femenino' },
    { id: 9, name: 'Alex Taylor', email: 'alex@example.com', age: 27, gender: 'otro' },
    { id: 10, name: 'Jordan Smith', email: 'jordan@example.com', age: 24, gender: 'no_especificado' },
  ],
  loading: false,
  error: null,
  // User statistics
  userStats: null,
  userStatsLoading: false,
  userStatsError: null,
  // Bibliotecarios state
  bibliotecarios: [
    { id: 1, nombre: 'Ana González', correo: 'ana.gonzalez@biblioteca.com', numeroTelefono: '+52 555 123 4567' },
    { id: 2, nombre: 'Miguel Torres', correo: 'miguel.torres@biblioteca.com', numeroTelefono: '+52 555 234 5678' },
    { id: 3, nombre: 'Carmen López', correo: 'carmen.lopez@biblioteca.com', numeroTelefono: '+52 555 345 6789' },
    { id: 4, nombre: 'Roberto Martínez', correo: 'roberto.martinez@biblioteca.com', numeroTelefono: '+52 555 456 7890' },
    { id: 5, nombre: 'Laura Hernández', correo: 'laura.hernandez@biblioteca.com', numeroTelefono: '+52 555 567 8901' },
    { id: 6, nombre: 'Carlos Ruiz', correo: 'carlos.ruiz@biblioteca.com', numeroTelefono: '+52 555 678 9012' },
    { id: 7, nombre: 'María José Pérez', correo: 'maria.perez@biblioteca.com', numeroTelefono: '+52 555 789 0123' },
    { id: 8, nombre: 'Francisco Jiménez', correo: 'francisco.jimenez@biblioteca.com', numeroTelefono: '+52 555 890 1234' },
  ],
  bibliotecarioLoading: false,
  bibliotecarioError: null,
  // Administradores state
  administradores: [
    { id: '1', nombre: 'Juan Hernández Pérez', correo: 'juanhdz@outlook.com', biblioteca: 'Biblioteca Central' },
    { id: '2', nombre: 'María García López', correo: 'maria.garcia@biblioteca.com', biblioteca: 'Biblioteca Norte' },
    { id: '3', nombre: 'Carlos Mendoza Silva', correo: 'carlos.mendoza@biblioteca.com', biblioteca: 'Biblioteca Sur' },
    { id: '4', nombre: 'Ana Rodríguez Torres', correo: 'ana.rodriguez@biblioteca.com', biblioteca: 'Biblioteca Este' },
  ],
  administradorLoading: false,
  administradorError: null,
  // Libros state
  libros: [],
  libroLoading: false,
  libroError: null,
  // Estantes state
  estantes: [], // Iniciar vacío, se carga desde la API
  estanteLoading: false,
  estanteError: null,
  // Secciones state
  secciones: [], // Iniciar vacío, se carga desde la API
  seccionLoading: false,
  seccionError: null,
  // Bibliotecas state
  bibliotecas: [],
  bibliotecaLoading: false,
  bibliotecaError: null,
    // Auth state
  isAuthenticated: false,
  currentUser: null,
  tempAuthData: null, // Data stored during 2FA process
  authLoading: false,
  authError: null,
  shouldRedirectTo2FA: false,
  // Notification state
  notification: null,
  showNotification: false,
  // User CRUD actions
  addUser: (user) => {
    set((state) => ({
      users: [...state.users, { ...user, id: Date.now() }],
    }));
    // Show success notification
    get().showSuccessNotification(
      'Usuario agregado',
      `El usuario ${user.name} ha sido agregado exitosamente`
    );
  },
  removeUser: (id) => {
    const user = get().users.find(u => u.id === id);
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    }));
    // Show success notification
    if (user) {
      get().showSuccessNotification(
        'Usuario eliminado',
        `El usuario ${user.name} ha sido eliminado exitosamente`
      );
    }
  },
  updateUser: (id, updates) => {
    const user = get().users.find(u => u.id === id);
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...updates } : user
      ),
    }));
    // Show success notification
    if (user) {
      get().showSuccessNotification(
        'Usuario actualizado',
        `El usuario ${updates.name || user.name} ha sido actualizado exitosamente`
      );
    }
  },
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  // User statistics actions
  fetchUserStats: async (period = 'day') => {
    set({ userStatsLoading: true, userStatsError: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Calculate stats from current users (in a real app, this would come from API)
      const users = get().users;
      const stats = {
        hombres: users.filter(u => u.gender === 'masculino').length,
        mujeres: users.filter(u => u.gender === 'femenino').length,
        otros: users.filter(u => u.gender === 'otro' || u.gender === 'no_especificado' || !u.gender).length,
        total: users.length,
      };
      
      // Add some variation based on period for demo purposes
      const multiplier = period === 'day' ? 1 : period === 'week' ? 7 : period === 'month' ? 30 : 365;
      const periodStats = {
        hombres: Math.floor(stats.hombres * multiplier * (0.8 + Math.random() * 0.4)),
        mujeres: Math.floor(stats.mujeres * multiplier * (0.8 + Math.random() * 0.4)),
        otros: Math.floor(stats.otros * multiplier * (0.8 + Math.random() * 0.4)),
        total: 0,
      };
      periodStats.total = periodStats.hombres + periodStats.mujeres + periodStats.otros;
      
      set({ 
        userStats: periodStats,
        userStatsLoading: false,
        userStatsError: null 
      });
    } catch (error) {
      set({ 
        userStatsLoading: false,
        userStatsError: 'Error al cargar estadísticas de usuarios'
      });
      get().showErrorNotification(
        'Error al cargar estadísticas',
        'No se pudieron cargar las estadísticas de usuarios'
      );
    }
  },
  setUserStatsLoading: (userStatsLoading) => set({ userStatsLoading }),
  setUserStatsError: (userStatsError) => set({ userStatsError }),
  // Bibliotecario CRUD actions
  addBibliotecario: (bibliotecario) => {
    set((state) => ({
      bibliotecarios: [...state.bibliotecarios, { ...bibliotecario, id: Date.now() }],
    }));
    // Show success notification
    get().showSuccessNotification(
      'Bibliotecario agregado',
      `El bibliotecario ${bibliotecario.nombre} ha sido agregado exitosamente`
    );
  },
  removeBibliotecario: (id) => {
    const bibliotecario = get().bibliotecarios.find(b => b.id === id);
    set((state) => ({
      bibliotecarios: state.bibliotecarios.filter((b) => b.id !== id),
    }));
    // Show success notification
    if (bibliotecario) {
      get().showSuccessNotification(
        'Bibliotecario eliminado',
        `El bibliotecario ${bibliotecario.nombre} ha sido eliminado exitosamente`
      );
    }
  },
  updateBibliotecario: (id, updates) => {
    const bibliotecario = get().bibliotecarios.find(b => b.id === id);
    set((state) => ({
      bibliotecarios: state.bibliotecarios.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    }));
    // Show success notification
    if (bibliotecario) {
      get().showSuccessNotification(
        'Bibliotecario actualizado',
        `El bibliotecario ${updates.nombre || bibliotecario.nombre} ha sido actualizado exitosamente`
      );
    }
  },
  setBibliotecarioLoading: (bibliotecarioLoading) => set({ bibliotecarioLoading }),
  setBibliotecarioError: (bibliotecarioError) => set({ bibliotecarioError }),
  // Libro CRUD actions
  loadLibros: async (bibliotecaId?: number) => {
    set({ libroLoading: true, libroError: null });
    
    try {
      // Intentar cargar desde la API primero
      console.log('Intentando cargar libros desde API...');
      const result = await libroApi.listar({ biblioteca_id: bibliotecaId });
      
      if (result && Array.isArray(result)) {
        console.log('Respuesta de API libros:', result);
        const libros = result.map(mappers.libroResponseToLibro);
        console.log('Libros mapeados:', libros);
        
        set({
          libros,
          libroLoading: false,
          libroError: null,
        });
      } else {
        throw new Error('Respuesta de API inválida');
      }
    } catch (error) {
      console.error('Error al cargar libros desde API, usando datos mock:', error);
      
      // Fallback a datos mock si falla la API
      const librosMockeados = [
        {
          id: 1,
          titulo: 'El Quijote de la Mancha',
          autor: 'Miguel de Cervantes',
          editorial: 'Editorial Planeta',
          estante: 'A12',
          isbn: '978-84-08-12345-6',
          fechaPublicacion: '1605-01-16',
          estado: 'Disponible',
          fila: '2',
          columna: '3',
          ubicacion: 'A12-2-3'
        },
        {
          id: 2,
          titulo: 'Cien años de soledad',
          autor: 'Gabriel García Márquez',
          editorial: 'Editorial Sudamericana',
          estante: 'B15',
          isbn: '978-84-376-0494-7',
          fechaPublicacion: '1967-05-30',
          estado: 'Disponible',
          fila: '1',
          columna: '5',
          ubicacion: 'B15-1-5'
        },
        {
          id: 3,
          titulo: '1984',
          autor: 'George Orwell',
          editorial: 'Penguin Books',
          estante: 'C08',
          isbn: '978-0-452-28423-4',
          fechaPublicacion: '1949-06-08',
          estado: 'Prestado',
          fila: '3',
          columna: '2',
          ubicacion: 'C08-3-2'
        }
      ];
      
      set({
        libros: librosMockeados,
        libroLoading: false,
        libroError: 'Usando datos de prueba - API no disponible',
      });
    }
  },
  addLibro: async (libro) => {
    set({ libroLoading: true, libroError: null });
    
    try {
      // Necesitamos el biblioteca_id del usuario actual
      const currentUser = get().currentUser;
      const bibliotecaId = currentUser?.bibliotecaId || 1; // Default o manejar error
      
      const apiData = mappers.libroToApiRequest(libro, bibliotecaId);
      const apiResponse = await libroApi.crear(apiData);
      const newLibro = mappers.libroResponseToLibro(apiResponse);
      
      set((state) => ({
        libros: [...state.libros, newLibro],
        libroLoading: false,
        libroError: null,
      }));
      
      get().showSuccessNotification(
        'Libro agregado',
        `El libro "${newLibro.titulo}" ha sido agregado exitosamente`
      );
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        libroLoading: false,
        libroError: errorMessage,
      });
      
      get().showErrorNotification(
        'Error al crear libro',
        errorMessage,
        getErrorDetails(error)
      );
      throw error;
    }
  },
  removeLibro: async (id) => {
    set({ libroLoading: true, libroError: null });
    
    try {
      const libro = get().libros.find(l => l.id === id);
      await libroApi.eliminar(id);
      
      set((state) => ({
        libros: state.libros.filter((l) => l.id !== id),
        libroLoading: false,
        libroError: null,
      }));
      
      if (libro) {
        get().showSuccessNotification(
          'Libro eliminado',
          `El libro "${libro.titulo}" ha sido eliminado exitosamente`
        );
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        libroLoading: false,
        libroError: errorMessage,
      });
      
      get().showErrorNotification(
        'Error al eliminar libro',
        errorMessage,
        getErrorDetails(error)
      );
      throw error;
    }
  },
  updateLibro: async (id, updates) => {
    set({ libroLoading: true, libroError: null });
    
    try {
      const apiData: any = {};
      if (updates.titulo) apiData.nombre = updates.titulo; // Mapear titulo a nombre
      if (updates.autor) apiData.autor = updates.autor;
      if (updates.isbn) apiData.isbn = updates.isbn;
      if (updates.descripcion) apiData.descripcion = updates.descripcion;
      
      const apiResponse = await libroApi.actualizar(id, apiData);
      const libro = mappers.libroResponseToLibro(apiResponse);
      
      set((state) => ({
        libros: state.libros.map((l) =>
          l.id === id ? libro : l
        ),
        libroLoading: false,
        libroError: null,
      }));
      
      get().showSuccessNotification(
        'Libro actualizado',
        `El libro "${libro.titulo}" ha sido actualizado exitosamente`
      );
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        libroLoading: false,
        libroError: errorMessage,
      });
      
      get().showErrorNotification(
        'Error al actualizar libro',
        errorMessage,
        getErrorDetails(error)
      );
      throw error;
    }
  },
  assignLibroToEstante: async (data) => {
    set({ libroLoading: true, libroError: null });
    
    try {
      // Buscar el estante por su nombre
      const estantes = get().estantes;
      const estante = estantes.find(e => e.nombre === data.estante);
      
      if (!estante) {
        throw new Error(`No se encontró el estante ${data.estante}`);
      }
      
      // Cargar las secciones del estante si no están cargadas
      await get().loadSecciones(estante.id);
      const secciones = get().secciones;
      
      // Encontrar la sección específica por etiqueta, fila y columna
      const seccion = secciones.find(s => 
        s.etiqueta === data.etiqueta && 
        s.fila?.toString() === data.fila && 
        s.columna?.toString() === data.columna
      );
      
      if (!seccion) {
        throw new Error(`No se encontró la sección en ${data.etiqueta}, fila ${data.fila}, columna ${data.columna}`);
      }
      
      // Preparar datos para la API - aquí asumimos que libro_id es realmente libro_biblioteca_id
      const assignData = {
        libro_biblioteca_id: data.libro_id,
        seccion_estante_id: seccion.id
      };
      
      // Llamar a la API
      await libroApi.asignarAEstante(assignData);
      
      // Actualizar el estado local
      set((state) => ({
        libros: state.libros.map((l) =>
          l.id === data.libro_id ? 
          { 
            ...l, 
            estante: data.estante,
            fila: data.fila,
            columna: data.columna
          } : l
        ),
        libroLoading: false,
        libroError: null,
      }));
      
      get().showSuccessNotification(
        'Posición actualizada',
        'La posición del libro ha sido actualizada exitosamente'
      );
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        libroLoading: false,
        libroError: errorMessage,
      });
      
      get().showErrorNotification(
        'Error al actualizar posición',
        errorMessage,
        getErrorDetails(error)
      );
      throw error;
    }
  },
  setLibroLoading: (libroLoading) => set({ libroLoading }),
  setLibroError: (libroError) => set({ libroError }),
  getLibroById: async (id: number) => {
    // Primero buscar en los libros cargados localmente
    const libroLocal = get().libros.find(l => l.id === id);
    if (libroLocal) {
      return libroLocal;
    }

    // Si no está localmente, intentar cargar desde la API
    try {
      const libroResponse = await libroApi.obtener(id);
      const libro = mappers.libroResponseToLibro(libroResponse);
      
      // Agregar el libro a la lista local
      const currentLibros = get().libros;
      const updatedLibros = [...currentLibros, libro];
      set({ libros: updatedLibros });
      
      return libro;
    } catch (error) {
      console.error('Error al cargar libro por ID:', error);
    }

    // Si todo falla, retornar undefined
    return undefined;
  },
  // Estante CRUD actions
  loadEstantes: async (_bibliotecaId?: number) => {
    set({ estanteLoading: true, estanteError: null });
    
    try {
      console.log('Intentando cargar estantes desde API...');
      const result = await estanteService.listar();
      
      if (result.success && result.data) {
        console.log('Respuesta de API estantes:', result.data);
        const estantes = result.data.map(mappers.estanteResponseToEstante);
        console.log('Estantes mapeados:', estantes);
        
        set({
          estantes,
          estanteLoading: false,
          estanteError: null,
        });
        
        get().showSuccessNotification(
          'Estantes cargados',
          `Se cargaron ${estantes.length} estantes desde la API`
        );
      } else {
        throw new Error(result.error || 'Error al cargar estantes');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.warn('Error al cargar estantes desde API, usando datos mockeados:', errorMessage);
      
      // Usar datos mockeados como fallback
      const estantesMockeados = [
        { id: 1, nombre: 'Estante A1', ubicacion: 'Planta Baja', fila: 'A', columna: '1', cantidadLibros: 15, espaciosDisponibles: 5 },
        { id: 2, nombre: 'Estante A2', ubicacion: 'Planta Baja', fila: 'A', columna: '2', cantidadLibros: 20, espaciosDisponibles: 0 },
        { id: 3, nombre: 'Estante B1', ubicacion: 'Primer Piso', fila: 'B', columna: '1', cantidadLibros: 12, espaciosDisponibles: 8 },
        { id: 4, nombre: 'Estante B2', ubicacion: 'Primer Piso', fila: 'B', columna: '2', cantidadLibros: 18, espaciosDisponibles: 2 },
        { id: 5, nombre: 'Estante C1', ubicacion: 'Segundo Piso', fila: 'C', columna: '1', cantidadLibros: 10, espaciosDisponibles: 10 },
        { id: 6, nombre: 'Estante C2', ubicacion: 'Segundo Piso', fila: 'C', columna: '2', cantidadLibros: 16, espaciosDisponibles: 4 },
      ];
      
      set({
        estantes: estantesMockeados,
        estanteLoading: false,
        estanteError: null, // No mostrar error si tenemos datos de fallback
      });
      
      get().showErrorNotification(
        'Error al cargar estantes',
        'Se usaron datos de ejemplo debido a un error de conexión',
        getErrorDetails(error)
      );
    }
  },
  addEstante: async (newEstante) => {
    set({ estanteLoading: true, estanteError: null });
    
    try {
      // Verificar usuario actual
      const currentUser = get().currentUser;
      
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }
      
      if ((currentUser.roleId || 0) < 3) {
        throw new Error(`Permisos insuficientes. Necesitas rol 3 o superior, tienes rol ${currentUser.roleId || 0}`);
      }
      
      console.log('Debug - Usuario actual:', currentUser);
      
      const datosEstante = {
        etiqueta: newEstante.nombre || newEstante.ubicacion || '',
        cant_columnas: typeof newEstante.columna === 'string' ? parseInt(newEstante.columna) : newEstante.columna,
        cant_filas: typeof newEstante.fila === 'string' ? parseInt(newEstante.fila) : newEstante.fila,
        // NO enviamos biblioteca_id - se asignará automáticamente en el backend
      };
      
      console.log('Debug - Datos del estante a enviar:', datosEstante);
      
      const result = await estanteService.crear(datosEstante);
      
      if (result.success && result.data) {
        const estante = mappers.estanteResponseToEstante(result.data);
        
        set(state => ({
          estantes: [...state.estantes, estante],
          estanteLoading: false,
          estanteError: null,
        }));
        
        get().showSuccessNotification(
          'Estante agregado',
          result.message || `El estante ${estante.nombre} ha sido agregado exitosamente`
        );
      } else {
        throw new Error(result.error || 'Error al crear estante');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        estanteLoading: false,
        estanteError: errorMessage,
      });
      
      get().showErrorNotification(
        'Error al crear estante',
        errorMessage,
        getErrorDetails(error)
      );
      throw error;
    }
  },
  removeEstante: async (id) => {
    set({ estanteLoading: true, estanteError: null });
    
    try {
      const estante = get().estantes.find(e => e.id === id);
      const result = await estanteService.eliminar(id);
      
      if (result.success) {
        set(state => ({
          estantes: state.estantes.filter(estante => estante.id !== id),
          estanteLoading: false,
          estanteError: null,
        }));
        
        if (estante) {
          get().showSuccessNotification(
            'Estante eliminado',
            result.message || `El estante ${estante.nombre} ha sido eliminado exitosamente`
          );
        }
      } else {
        throw new Error(result.error || 'Error al eliminar estante');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        estanteLoading: false,
        estanteError: errorMessage,
      });
      
      get().showErrorNotification(
        'Error al eliminar estante',
        errorMessage,
        getErrorDetails(error)
      );
      throw error;
    }
  },
  updateEstante: async (id, updates) => {
    console.log('updateEstante iniciado para ID:', id);
    console.log('Updates recibidos:', updates);
    
    set({ estanteLoading: true, estanteError: null });
    
    try {
      const datosActualizacion = {
        etiqueta: updates.nombre || updates.ubicacion,
        cant_columnas: typeof updates.columna === 'string' ? parseInt(updates.columna) : updates.columna,
        cant_filas: typeof updates.fila === 'string' ? parseInt(updates.fila) : updates.fila,
        // Compatibilidad con el frontend
        nombre: updates.nombre,
        ubicacion: updates.ubicacion,
        fila: updates.fila,
        columna: updates.columna
      };
      
      console.log('Datos de actualización preparados:', datosActualizacion);
      
      const result = await estanteService.actualizar(id, datosActualizacion);
      console.log('Resultado del servicio estante:', result);
      
      if (result.success) {
        // Si el servicio devuelve datos, usarlos; si no, usar los datos de actualización
        let estanteActualizado;
        
        if (result.data) {
          estanteActualizado = mappers.estanteResponseToEstante(result.data);
        } else {
          // Crear el estante actualizado basado en los datos actuales y las actualizaciones
          const estanteExistente = get().estantes.find(e => e.id === id);
          if (!estanteExistente) {
            throw new Error('Estante no encontrado para actualizar');
          }
          
          estanteActualizado = {
            ...estanteExistente,
            nombre: updates.nombre || updates.ubicacion || estanteExistente.nombre,
            ubicacion: updates.ubicacion || estanteExistente.ubicacion,
            fila: updates.fila || estanteExistente.fila,
            columna: updates.columna || estanteExistente.columna,
          };
        }
        
        console.log('Estante actualizado:', estanteActualizado);
        
        set(state => ({
          estantes: state.estantes.map(e => 
            e.id === id ? estanteActualizado : e
          ),
          estanteLoading: false,
          estanteError: null,
        }));
        
        get().showSuccessNotification(
          'Estante actualizado',
          result.message || `El estante ${estanteActualizado.nombre} ha sido actualizado exitosamente`
        );
      } else {
        console.error('Error en resultado del servicio:', result.error);
        throw new Error(result.error || 'Error al actualizar estante');
      }
    } catch (error) {
      console.error('Error en updateEstante:', error);
      const errorMessage = getErrorMessage(error);
      set({
        estanteLoading: false,
        estanteError: errorMessage,
      });
      
      get().showErrorNotification(
        'Error al actualizar estante',
        errorMessage,
        getErrorDetails(error)
      );
      throw error;
    }
  },
  setEstanteLoading: (estanteLoading) => set({ estanteLoading }),
  setEstanteError: (estanteError) => set({ estanteError }),
  getEstanteById: (id) => {
    return get().estantes.find(e => e.id === id);
  },
  // Secciones CRUD actions
  loadSecciones: async (estanteId) => {
    console.log('loadSecciones iniciado para estante:', estanteId);
    const currentUser = get().currentUser;
    console.log('Usuario actual completo:', currentUser);
    console.log('Rol del usuario:', currentUser?.roleId);
    console.log('¿Usuario >= Rol 3?:', (currentUser?.roleId || 0) >= 3);
    
    set({ seccionLoading: true, seccionError: null });
    
    try {
      // Usar directamente businessApi en lugar de seccionService
      const secciones = await businessApi.getSecciones(estanteId);
      console.log('Secciones cargadas desde businessApi:', secciones);
      
      set({
        secciones: secciones || [],
        seccionLoading: false,
        seccionError: null,
      });
      
      get().showSuccessNotification(
        'Secciones cargadas',
        'Las secciones del estante se han cargado exitosamente'
      );
    } catch (error) {
      console.error('Error en loadSecciones:', error);
      const errorMessage = getErrorMessage(error);
      set({
        seccionLoading: false,
        seccionError: errorMessage,
      });
      get().showErrorNotification(
        'Error al cargar secciones',
        errorMessage,
        getErrorDetails(error)
      );
    }
  },
  updateSeccion: async (seccionId, updates) => {
    set({ seccionLoading: true, seccionError: null });
    
    try {
      // Usar directamente businessApi en lugar de seccionService
      const seccionActualizada = await businessApi.updateSeccion(seccionId, updates);
      console.log('Sección actualizada:', seccionActualizada);
      
      // Actualizar la sección en el estado local
      set(state => ({
        secciones: state.secciones.map(s => 
          s.id === seccionId ? { ...s, ...seccionActualizada } : s
        ),
        seccionLoading: false,
        seccionError: null,
      }));
      
      get().showSuccessNotification(
        'Sección actualizada',
        'La sección ha sido actualizada exitosamente'
      );
    } catch (error) {
      console.error('Error en updateSeccion:', error);
      const errorMessage = getErrorMessage(error);
      set({
        seccionLoading: false,
        seccionError: errorMessage,
      });
      
      get().showErrorNotification(
        'Error al actualizar sección',
        errorMessage,
        getErrorDetails(error)
      );
      throw error;
    }
  },
  setSeccionLoading: (seccionLoading) => set({ seccionLoading }),
  setSeccionError: (seccionError) => set({ seccionError }),
  getSeccionById: (id) => {
    return get().secciones.find(s => s.id === id);
  },
  obtenerEtiquetasUnicas: async (estanteId): Promise<string[]> => {
    try {
      const result = await seccionService.obtenerEtiquetasUnicas(estanteId);
      
      if (result.success && result.data) {
        return result.data;
      } else {
        console.error('Error al obtener etiquetas únicas:', result.error || 'Error desconocido');
        return [];
      }
    } catch (error) {
      console.error('Error al obtener etiquetas únicas:', error);
      return [];
    }
  },
  generarMapaPosiciones: async (estanteId): Promise<{ [key: string]: SeccionResponse } | null> => {
    try {
      const result = await seccionService.generarMapaPosiciones(estanteId);
      
      if (result.success && result.data) {
        return result.data;
      } else {
        console.error('Error al generar mapa de posiciones:', result.error || 'Error desconocido');
        return null;
      }
    } catch (error) {
      console.error('Error al generar mapa de posiciones:', error);
      return null;
    }
  },
  // Biblioteca CRUD actions
  loadBibliotecas: async () => {
    set({ bibliotecaLoading: true, bibliotecaError: null });
    
    try {
      const apiResponse = await bibliotecaApi.listar();
      const bibliotecas = apiResponse.map(mappers.bibliotecaResponseToBiblioteca);
      
      set({
        bibliotecas,
        bibliotecaLoading: false,
        bibliotecaError: null,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        bibliotecaLoading: false,
        bibliotecaError: errorMessage,
      });
      
      get().showErrorNotification(
        'Error al cargar bibliotecas',
        errorMessage,
        getErrorDetails(error)
      );
    }
  },
  addBiblioteca: async (newBiblioteca) => {
    set({ bibliotecaLoading: true, bibliotecaError: null });
    
    try {
      const apiData = mappers.bibliotecaToApiRequest(newBiblioteca);
      const apiResponse = await bibliotecaApi.crear(apiData);
      const biblioteca = mappers.bibliotecaResponseToBiblioteca(apiResponse);
      
      set((state) => ({
        bibliotecas: [...state.bibliotecas, biblioteca],
        bibliotecaLoading: false,
        bibliotecaError: null,
      }));
      
      get().showSuccessNotification(
        'Biblioteca registrada',
        `La biblioteca "${biblioteca.nombre}" ha sido registrada exitosamente.`
      );
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        bibliotecaLoading: false,
        bibliotecaError: errorMessage,
      });
      
      get().showErrorNotification(
        'Error al crear biblioteca',
        errorMessage,
        getErrorDetails(error)
      );
      throw error;
    }
  },
  removeBiblioteca: async (id) => {
    set({ bibliotecaLoading: true, bibliotecaError: null });
    
    try {
      const biblioteca = get().getBibliotecaById(id);
      await bibliotecaApi.eliminar(id);
      
      set((state) => ({
        bibliotecas: state.bibliotecas.filter(biblioteca => biblioteca.id !== id),
        bibliotecaLoading: false,
        bibliotecaError: null,
      }));
      
      get().showSuccessNotification(
        'Biblioteca eliminada',
        `La biblioteca "${biblioteca?.nombre || 'Desconocida'}" ha sido eliminada exitosamente.`
      );
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        bibliotecaLoading: false,
        bibliotecaError: errorMessage,
      });
      
      get().showErrorNotification(
        'Error al eliminar biblioteca',
        errorMessage,
        getErrorDetails(error)
      );
      throw error;
    }
  },
  updateBiblioteca: async (id, updates) => {
    set({ bibliotecaLoading: true, bibliotecaError: null });
    
    try {
      const apiData: any = {};
      if (updates.nombre) apiData.nombre = updates.nombre;
      if (updates.direccion) apiData.ubicacion = updates.direccion; // Mapear direccion a ubicacion
      if (updates.estado) apiData.estado = updates.estado;
      
      const apiResponse = await bibliotecaApi.actualizar(id, apiData);
      const biblioteca = mappers.bibliotecaResponseToBiblioteca(apiResponse);
      
      set((state) => ({
        bibliotecas: state.bibliotecas.map(b => 
          b.id === id ? biblioteca : b
        ),
        bibliotecaLoading: false,
        bibliotecaError: null,
      }));
      
      get().showSuccessNotification(
        'Biblioteca actualizada',
        'La biblioteca ha sido actualizada exitosamente.'
      );
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        bibliotecaLoading: false,
        bibliotecaError: errorMessage,
      });
      
      get().showErrorNotification(
        'Error al actualizar biblioteca',
        errorMessage,
        getErrorDetails(error)
      );
      throw error;
    }
  },
  setBibliotecaLoading: (bibliotecaLoading) => set({ bibliotecaLoading }),
  setBibliotecaError: (bibliotecaError) => set({ bibliotecaError }),
  getBibliotecaById: (id) => {
    return get().bibliotecas.find(b => b.id === id);
  },
  // Auth actions
  login: async (email: string, password: string) => {
    set({ authLoading: true, authError: null });
    
    try {
      const response = await authApi.login(email, password);
      
      if (response.requires_2fa) {
        // 2FA es requerido - redirigir a página de verificación
        const userData: AuthUser = {
          id: response.user_id!,
          name: response.user?.nombre || '',
          email: email,
          roleId: response.user?.rol === 'Administrador' ? ROLES.ADMIN : ROLES.SUPER_ADMIN,
          roleName: response.user?.rol || 'Administrador',
          bibliotecaId: response.user?.bibliotecaId,
        };

        set({
          authLoading: false,
          authError: null,
          shouldRedirectTo2FA: true,
          tempAuthData: {
            userId: response.user_id!,
            tempToken: response.temp_token,
            user: userData,
          },
        });

        get().showSuccessNotification(
          'Credenciales correctas',
          'Se ha enviado un código de verificación a tu correo electrónico'
        );
      } else {
        // Login directo (usuarios sin 2FA)
        const userData: AuthUser = {
          id: response.user!.id,
          name: response.user!.nombre,
          email: response.user!.correo,
          roleId: response.user!.rol === 'Administrador' ? ROLES.ADMIN : ROLES.SUPER_ADMIN,
          roleName: response.user!.rol,
          bibliotecaId: response.user?.bibliotecaId,
        };

        set({
          isAuthenticated: true,
          currentUser: userData,
          authLoading: false,
          authError: null,
        });

        get().showSuccessNotification(
          'Inicio de sesión exitoso',
          `¡Bienvenido de vuelta, ${userData.name}!`
        );
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      const errorDetails = getErrorDetails(error);
      
      set({
        authLoading: false,
        authError: errorMessage,
      });

      get().showErrorNotification(
        'Error de autenticación',
        errorMessage,
        errorDetails
      );
    }
  },
  verifyTwoFactor: async (data: { codigo: string }) => {
    set({ authLoading: true, authError: null });
    
    try {
      const tempData = get().tempAuthData;
      
      if (!tempData) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }

      const response = await authApi.verifyTwoFactor(data.codigo, tempData.userId);
      
      const userData: AuthUser = {
        id: response.user.id,
        name: response.user.nombre,
        email: response.user.correo,
        roleId: response.user.rol === 'Administrador' ? ROLES.ADMIN : ROLES.SUPER_ADMIN,
        roleName: response.user.rol,
        bibliotecaId: response.user.bibliotecaId,
      };

      set({
        isAuthenticated: true,
        currentUser: userData,
        tempAuthData: null, // Clear temp data
        authLoading: false,
        authError: null,
      });

      get().showSuccessNotification(
        'Verificación exitosa',
        `¡Bienvenido de vuelta, ${userData.name}!`
      );
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      const errorDetails = getErrorDetails(error);
      
      set({
        authLoading: false,
        authError: errorMessage,
      });

      get().showErrorNotification(
        'Error de verificación',
        errorMessage,
        errorDetails
      );
    }
  },
  register: async (data: RegisterData) => {
    console.log('🏪 Store: register called with data:', data);
    set({ authLoading: true, authError: null });
    
    try {
      console.log('⏳ Store: Calling API...');
      const response = await authApi.registerAdmin({
        nombre: data.firstName,
        apellido: data.lastName,
        correo: data.email,
        contraseña: data.password,
        curp: data.curp,
        rfc: data.rfc,
      });

      console.log('✅ Store: Registration API response:', response);
      
      set({
        authLoading: false,
        authError: null,
      });

      get().showSuccessNotification(
        'Registro exitoso',
        'Tu cuenta ha sido creada. Revisa tu correo para confirmar tu email.',
        'Continuar'
      );

      console.log('✅ Store: Registration completed successfully');
    } catch (error) {
      console.log('❌ Store: Registration error:', error);
      const errorMessage = getErrorMessage(error);
      const errorDetails = getErrorDetails(error);
      
      set({
        authLoading: false,
        authError: errorMessage,
      });

      get().showErrorNotification(
        'Error en el registro',
        errorMessage,
        errorDetails
      );

      throw error;
    }
  },
  confirmEmail: async (email: string) => {
    set({ authLoading: true, authError: null });
    
    // Simulate API call for email confirmation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email and authenticate them
    const user = get().users.find(u => u.email === email);
    if (user) {
      // Default role for registered users is Admin
      const defaultRole = { roleId: ROLES.ADMIN, roleName: ROLE_NAMES[3] };
      
      set({
        isAuthenticated: true,
        currentUser: {
          id: user.id,
          name: user.name,
          email: user.email,
          roleId: defaultRole.roleId,
          roleName: defaultRole.roleName,
        },
        authLoading: false,
        authError: null,
      });
      // Show success notification
      get().showSuccessNotification(
        'Email confirmado',
        `¡Bienvenido ${user.name}! Tu cuenta ha sido activada exitosamente.`
      );
    } else {
      set({
        authLoading: false,
        authError: 'Usuario no encontrado',
      });
      // Show error notification
      get().showErrorNotification(
        'Error de confirmación',
        'No se pudo confirmar el email. Usuario no encontrado.'
      );
      throw new Error('Usuario no encontrado');
    }
  },
  logout: () => {
    // Llamar a la API de logout
    authApi.logout().catch(() => {
      // Ignorar errores de logout de la API
      console.log('Error al cerrar sesión en el servidor, pero limpiando estado local');
    });

    set({
      isAuthenticated: false,
      currentUser: null,
      tempAuthData: null, // Clear temp data
      authError: null,
    });

    get().showSuccessNotification(
      'Sesión cerrada',
      'Has cerrado sesión exitosamente'
    );
  },
  changePassword: async (_currentPassword: string, _newPassword: string) => {
    set({ authLoading: true, authError: null });
    
    try {
      // Simulate API call for password change
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would validate the current password with the backend
      // For demo purposes, we'll accept any current password
      
      set({ authLoading: false });
      
      // Show success notification
      get().showSuccessNotification(
        'Contraseña actualizada',
        'Tu contraseña ha sido cambiada exitosamente.'
      );
    } catch (error) {
      set({ 
        authLoading: false,
        authError: 'Error al cambiar la contraseña'
      });
      
      // Show error notification
      get().showErrorNotification(
        'Error',
        'No se pudo cambiar la contraseña. Inténtalo de nuevo.'
      );
      throw error;
    }
  },
  setAuthLoading: (authLoading) => set({ authLoading }),
  setAuthError: (authError) => set({ authError }),
  clearRedirectTo2FA: () => set({ shouldRedirectTo2FA: false }),
  // Notification actions
  showSuccessNotification: (title: string, message: string, buttonText = 'Aceptar') =>
    set({
      notification: {
        type: 'success',
        title,
        message,
        buttonText,
      },
      showNotification: true,
    }),
  showErrorNotification: (title: string, message: string, details?: Record<string, string>, buttonText = 'Aceptar') =>
    set({
      notification: {
        type: 'error',
        title,
        message,
        details,
        buttonText,
      },
      showNotification: true,
    }),
  hideNotification: () =>
    set({
      notification: null,
      showNotification: false,
    }),
}));
