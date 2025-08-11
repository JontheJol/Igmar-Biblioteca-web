import { create } from 'zustand';
import type { NotificationData } from '../components/NotificationDialog';
import type { Bibliotecario, Libro, Estante, Biblioteca, Administrador } from '../types';
import { authApi, getErrorMessage, getErrorDetails } from '../services/api';
import { businessApi, mappers } from '../services/businessApi';

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
  setLibroLoading: (loading: boolean) => void;
  setLibroError: (error: string | null) => void;
  getLibroById: (id: number) => Libro | undefined;
  // Estante CRUD actions
  loadEstantes: (bibliotecaId?: number) => Promise<void>;
  addEstante: (estante: Omit<Estante, 'id'>) => Promise<void>;
  removeEstante: (id: number) => Promise<void>;
  updateEstante: (id: number, updates: Partial<Estante>) => Promise<void>;
  setEstanteLoading: (loading: boolean) => void;
  setEstanteError: (error: string | null) => void;
  getEstanteById: (id: number) => Estante | undefined;
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
  estantes: [],
  estanteLoading: false,
  estanteError: null,
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
      const params = bibliotecaId ? { biblioteca_id: bibliotecaId } : undefined;
      const apiResponse = await businessApi.getLibros(params);
      const libros = apiResponse.map(mappers.libroResponseToLibro);
      
      set({
        libros,
        libroLoading: false,
        libroError: null,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        libroLoading: false,
        libroError: errorMessage,
      });
      
      get().showErrorNotification(
        'Error al cargar libros',
        errorMessage,
        getErrorDetails(error)
      );
    }
  },
  addLibro: async (libro) => {
    set({ libroLoading: true, libroError: null });
    
    try {
      // Necesitamos el biblioteca_id del usuario actual
      const currentUser = get().currentUser;
      const bibliotecaId = currentUser?.bibliotecaId || 1; // Default o manejar error
      
      const apiData = mappers.libroToApiRequest(libro, bibliotecaId);
      const apiResponse = await businessApi.createLibro(apiData);
      const newLibro = mappers.libroResponseToLibro(apiResponse.libro);
      
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
      await businessApi.deleteLibro(id);
      
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
      if (updates.titulo) apiData.titulo = updates.titulo;
      if (updates.autor) apiData.autor = updates.autor;
      if (updates.isbn) apiData.isbn = updates.isbn;
      if (updates.editorial) apiData.editorial = updates.editorial;
      if (updates.fechaPublicacion) apiData.fecha_publicacion = updates.fechaPublicacion;
      
      const apiResponse = await businessApi.updateLibro(id, apiData);
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
  setLibroLoading: (libroLoading) => set({ libroLoading }),
  setLibroError: (libroError) => set({ libroError }),
  getLibroById: (id) => {
    return get().libros.find(l => l.id === id);
  },
  // Estante CRUD actions
  loadEstantes: async (bibliotecaId?: number) => {
    set({ estanteLoading: true, estanteError: null });
    
    try {
      const apiResponse = await businessApi.getEstantes(bibliotecaId);
      const estantes = apiResponse.map(mappers.estanteResponseToEstante);
      
      set({
        estantes,
        estanteLoading: false,
        estanteError: null,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        estanteLoading: false,
        estanteError: errorMessage,
      });
      
      get().showErrorNotification(
        'Error al cargar estantes',
        errorMessage,
        getErrorDetails(error)
      );
    }
  },
  addEstante: async (newEstante) => {
    set({ estanteLoading: true, estanteError: null });
    
    try {
      // Necesitamos el biblioteca_id del usuario actual o seleccionado
      const currentUser = get().currentUser;
      const bibliotecaId = currentUser?.bibliotecaId || 1; // Default o manejar error
      
      const apiData = mappers.estanteToApiRequest(newEstante, bibliotecaId);
      const apiResponse = await businessApi.createEstante(apiData);
      const estante = mappers.estanteResponseToEstante(apiResponse);
      
      set(state => ({
        estantes: [...state.estantes, estante],
        estanteLoading: false,
        estanteError: null,
      }));
      
      get().showSuccessNotification(
        'Estante agregado',
        `El estante ${estante.nombre} ha sido agregado exitosamente`
      );
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
      await businessApi.deleteEstante(id);
      
      set(state => ({
        estantes: state.estantes.filter(estante => estante.id !== id),
        estanteLoading: false,
        estanteError: null,
      }));
      
      if (estante) {
        get().showSuccessNotification(
          'Estante eliminado',
          `El estante ${estante.nombre} ha sido eliminado exitosamente`
        );
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
    set({ estanteLoading: true, estanteError: null });
    
    try {
      const apiData: any = {};
      if (updates.nombre) apiData.etiqueta = updates.nombre;
      if (updates.ubicacion) apiData.ubicacion = updates.ubicacion;
      if (updates.espaciosDisponibles !== undefined || updates.cantidadLibros !== undefined) {
        const estante = get().estantes.find(e => e.id === id);
        if (estante) {
          apiData.capacidad = (updates.espaciosDisponibles ?? estante.espaciosDisponibles) + 
                            (updates.cantidadLibros ?? estante.cantidadLibros);
        }
      }
      
      const apiResponse = await businessApi.updateEstante(id, apiData);
      const estante = mappers.estanteResponseToEstante(apiResponse);
      
      set(state => ({
        estantes: state.estantes.map(e => 
          e.id === id ? estante : e
        ),
        estanteLoading: false,
        estanteError: null,
      }));
      
      get().showSuccessNotification(
        'Estante actualizado',
        `El estante ${estante.nombre} ha sido actualizado exitosamente`
      );
    } catch (error) {
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
  // Biblioteca CRUD actions
  loadBibliotecas: async () => {
    set({ bibliotecaLoading: true, bibliotecaError: null });
    
    try {
      const apiResponse = await businessApi.getBibliotecas();
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
      const apiResponse = await businessApi.createBiblioteca(apiData);
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
      await businessApi.deleteBiblioteca(id);
      
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
      if (updates.direccion) apiData.direccion = updates.direccion;
      if (updates.telefono) apiData.telefono = updates.telefono;
      if (updates.email) apiData.email = updates.email;
      
      const apiResponse = await businessApi.updateBiblioteca(id, apiData);
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
