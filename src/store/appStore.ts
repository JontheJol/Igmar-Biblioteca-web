import { create } from 'zustand';
import type { NotificationData } from '../components/NotificationDialog';
import type { Bibliotecario, Libro, Estante, Biblioteca, Administrador } from '../types';
import { authApi, getErrorMessage, getErrorDetails } from '../services/api';

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
  addLibro: (libro: Omit<Libro, 'id'>) => void;
  removeLibro: (id: number) => void;
  updateLibro: (id: number, updates: Partial<Libro>) => void;
  setLibroLoading: (loading: boolean) => void;
  setLibroError: (error: string | null) => void;
  getLibroById: (id: number) => Libro | undefined;
  // Estante CRUD actions
  addEstante: (estante: Omit<Estante, 'id'>) => void;
  removeEstante: (id: number) => void;
  updateEstante: (id: number, updates: Partial<Estante>) => void;
  setEstanteLoading: (loading: boolean) => void;
  setEstanteError: (error: string | null) => void;
  getEstanteById: (id: number) => Estante | undefined;
  // Biblioteca CRUD actions
  addBiblioteca: (biblioteca: Omit<Biblioteca, 'id'>) => void;
  removeBiblioteca: (id: number) => void;
  updateBiblioteca: (id: number, updates: Partial<Biblioteca>) => void;
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
  libros: [
    { 
      id: 1, 
      titulo: 'El Quijote de la Mancha', 
      autor: 'Miguel de Cervantes', 
      editorial: 'Editorial Planeta', 
      estante: 'A24',
      isbn: '978-84-08-07282-4',
      descripcion: 'Una obra maestra de la literatura universal que narra las aventuras de Alonso Quixano, un hidalgo que enloquece leyendo libros de caballerías y decide convertirse en caballero andante bajo el nombre de Don Quijote de la Mancha.'
    },
    { 
      id: 2, 
      titulo: 'Cien años de soledad', 
      autor: 'Gabriel García Márquez', 
      editorial: 'Editorial Sudamericana', 
      estante: 'B15',
      isbn: '978-950-07-2677-5',
      descripcion: 'La historia multigeneracional de la familia Buendía en el pueblo ficticio de Macondo. Una obra cumbre del realismo mágico que explora temas de soledad, amor, poder y el destino cíclico de América Latina.'
    },
    { 
      id: 3, 
      titulo: 'La Odisea', 
      autor: 'Homero', 
      editorial: 'Editorial Gredos', 
      estante: 'C08',
      isbn: '978-84-249-1009-8'
    },
    { 
      id: 4, 
      titulo: 'Rayuela', 
      autor: 'Julio Cortázar', 
      editorial: 'Editorial Alfaguara', 
      estante: 'D12',
      isbn: '978-84-204-7680-3'
    },
    { 
      id: 5, 
      titulo: 'Pedro Páramo', 
      autor: 'Juan Rulfo', 
      editorial: 'Editorial RM', 
      estante: 'E05',
      isbn: '978-968-16-6963-7'
    },
    {
      id: 6,
      titulo: 'El Amor en los Tiempos del Cólera',
      autor: 'Gabriel García Márquez',
      editorial: 'Editorial Sudamericana',
      estante: 'B16',
      isbn: '978-950-07-2678-2'
    },
    {
      id: 7,
      titulo: 'La Casa de los Espíritus',
      autor: 'Isabel Allende',
      editorial: 'Editorial Plaza & Janés',
      estante: 'F03'
    },
    {
      id: 8,
      titulo: 'Ficciones',
      autor: 'Jorge Luis Borges',
      editorial: 'Editorial Emecé',
      estante: 'G11',
      isbn: '978-950-04-0041-2'
    },
    {
      id: 9,
      titulo: 'El Túnel',
      autor: 'Ernesto Sabato',
      editorial: 'Editorial Seix Barral',
      estante: 'H07'
    },
    {
      id: 10,
      titulo: 'Como Agua para Chocolate',
      autor: 'Laura Esquivel',
      editorial: 'Editorial Planeta',
      estante: 'I19',
      isbn: '978-84-08-00234-2'
    }
  ],
  libroLoading: false,
  libroError: null,
  // Estantes state
  estantes: [
    { id: 1, nombre: 'A24', ubicacion: 'A24', fila: '2', columna: '4', cantidadLibros: 32, espaciosDisponibles: 3, etiquetas: ['Literatura', 'Clásicos'] },
    { id: 2, nombre: 'B15', ubicacion: 'B15', fila: '1', columna: '5', cantidadLibros: 28, espaciosDisponibles: 7, etiquetas: ['Ficción'] },
    { id: 3, nombre: 'Sector-C-08', ubicacion: 'Sector-C-08', fila: '3', columna: '8', cantidadLibros: 30, espaciosDisponibles: 5, etiquetas: ['Historia'] },
    { id: 4, nombre: 'Planta-2-D12', ubicacion: 'Planta-2-D12', fila: '1', columna: '2', cantidadLibros: 25, espaciosDisponibles: 10, etiquetas: ['Literatura'] },
    { id: 5, nombre: 'E05', ubicacion: 'E05', fila: '2', columna: '5', cantidadLibros: 35, espaciosDisponibles: 0, etiquetas: ['Ciencia'] },
    { id: 6, nombre: 'Sala-Principal-F03', ubicacion: 'Sala-Principal-F03', fila: '4', columna: '3', cantidadLibros: 22, espaciosDisponibles: 13, etiquetas: ['Arte'] },
    { id: 7, nombre: 'G11', ubicacion: 'G11', fila: '1', columna: '1', cantidadLibros: 29, espaciosDisponibles: 6, etiquetas: ['Filosofía'] },
    { id: 8, nombre: 'Biblioteca-H07', ubicacion: 'Biblioteca-H07', fila: '3', columna: '7', cantidadLibros: 31, espaciosDisponibles: 4, etiquetas: ['Psicología'] },
    { id: 9, nombre: 'I19', ubicacion: 'I19', fila: '1', columna: '9', cantidadLibros: 27, espaciosDisponibles: 8, etiquetas: ['Cocina', 'Lifestyle'] },
    { id: 10, nombre: 'Segundo-Piso-J26', ubicacion: 'Segundo-Piso-J26', fila: '2', columna: '6', cantidadLibros: 33, espaciosDisponibles: 2, etiquetas: ['Biografías'] },
  ],
  estanteLoading: false,
  estanteError: null,
  // Bibliotecas state
  bibliotecas: [
    { 
      id: 1, 
      nombre: 'Biblioteca de la Universidad Tecnológica A', 
      direccion: 'Av. ABC, Col. DHD #1177', 
      estado: 'activa',
      telefono: '+52 555 123 4567',
      email: 'biblioteca@uta.edu.mx',
      administrador: 'Dr. Ana González'
    },
    { 
      id: 2, 
      nombre: 'Biblioteca Central Municipal', 
      direccion: 'Calle Principal #456, Centro', 
      estado: 'activa',
      telefono: '+52 555 234 5678',
      email: 'central@biblioteca.municipal.mx',
      administrador: 'Lic. Miguel Torres'
    },
    { 
      id: 3, 
      nombre: 'Biblioteca Instituto Tecnológico Superior', 
      direccion: 'Blvd. Tecnológico Km 2.5', 
      estado: 'mantenimiento',
      telefono: '+52 555 345 6789',
      email: 'biblioteca@its.edu.mx',
      administrador: 'Ing. Carmen López'
    },
    { 
      id: 4, 
      nombre: 'Biblioteca Comunitaria Norte', 
      direccion: 'Av. Norte #789, Col. Residencial', 
      estado: 'activa',
      telefono: '+52 555 456 7890',
      email: 'norte@biblioteca.com.mx',
      administrador: 'Mtro. Roberto Martínez'
    },
    { 
      id: 5, 
      nombre: 'Biblioteca Preparatoria Federal', 
      direccion: 'Calle Educación #321, Zona Escolar', 
      estado: 'inactiva',
      telefono: '+52 555 567 8901',
      email: 'prepa@biblioteca.fed.mx',
      administrador: 'Dra. Patricia Hernández'
    }
  ],
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
  addLibro: (libro) => {
    set((state) => ({
      libros: [...state.libros, { ...libro, id: Date.now() }],
    }));
    // Show success notification
    get().showSuccessNotification(
      'Libro agregado',
      `El libro "${libro.titulo}" ha sido agregado exitosamente`
    );
  },
  removeLibro: (id) => {
    const libro = get().libros.find(l => l.id === id);
    set((state) => ({
      libros: state.libros.filter((l) => l.id !== id),
    }));
    // Show success notification
    if (libro) {
      get().showSuccessNotification(
        'Libro eliminado',
        `El libro "${libro.titulo}" ha sido eliminado exitosamente`
      );
    }
  },
  updateLibro: (id, updates) => {
    const libro = get().libros.find(l => l.id === id);
    set((state) => ({
      libros: state.libros.map((l) =>
        l.id === id ? { ...l, ...updates } : l
      ),
    }));
    // Show success notification
    if (libro) {
      get().showSuccessNotification(
        'Libro actualizado',
        `El libro "${updates.titulo || libro.titulo}" ha sido actualizado exitosamente`
      );
    }
  },
  setLibroLoading: (libroLoading) => set({ libroLoading }),
  setLibroError: (libroError) => set({ libroError }),
  getLibroById: (id) => {
    return get().libros.find(l => l.id === id);
  },
  // Estante CRUD actions
  addEstante: (newEstante) => {
    set(state => ({
      estantes: [...state.estantes, { ...newEstante, id: Math.max(0, ...state.estantes.map(e => e.id)) + 1 }]
    }));
    // Show success notification
    get().showSuccessNotification(
      'Estante agregado',
      `El estante ${newEstante.nombre || 'nuevo'} ha sido agregado exitosamente`
    );
  },
  removeEstante: (id) => {
    const estante = get().estantes.find(e => e.id === id);
    set(state => ({
      estantes: state.estantes.filter(estante => estante.id !== id)
    }));
    // Show success notification
    if (estante) {
      get().showSuccessNotification(
        'Estante eliminado',
        `El estante ${estante.nombre} ha sido eliminado exitosamente`
      );
    }
  },
  updateEstante: (id, updates) => {
    const estante = get().estantes.find(e => e.id === id);
    set(state => ({
      estantes: state.estantes.map(estante => 
        estante.id === id ? { ...estante, ...updates } : estante
      )
    }));
    // Show success notification
    if (estante) {
      get().showSuccessNotification(
        'Estante actualizado',
        `El estante ${updates.nombre || estante.nombre} ha sido actualizado exitosamente`
      );
    }
  },
  setEstanteLoading: (estanteLoading) => set({ estanteLoading }),
  setEstanteError: (estanteError) => set({ estanteError }),
  getEstanteById: (id) => {
    return get().estantes.find(e => e.id === id);
  },
  // Biblioteca CRUD actions
  addBiblioteca: (newBiblioteca) => {
    set((state) => ({
      bibliotecas: [...state.bibliotecas, { ...newBiblioteca, id: Math.max(0, ...state.bibliotecas.map(b => b.id)) + 1 }]
    }));
    // Show success notification
    get().showSuccessNotification(
      'Biblioteca registrada',
      `La biblioteca "${newBiblioteca.nombre}" ha sido registrada exitosamente.`
    );
  },
  removeBiblioteca: (id) => {
    const biblioteca = get().getBibliotecaById(id);
    set((state) => ({
      bibliotecas: state.bibliotecas.filter(biblioteca => biblioteca.id !== id)
    }));
    // Show success notification
    get().showSuccessNotification(
      'Biblioteca eliminada',
      `La biblioteca "${biblioteca?.nombre || 'Desconocida'}" ha sido eliminada exitosamente.`
    );
  },
  updateBiblioteca: (id, updates) => {
    set((state) => ({
      bibliotecas: state.bibliotecas.map(biblioteca => 
        biblioteca.id === id ? { ...biblioteca, ...updates } : biblioteca
      )
    }));
    // Show success notification
    get().showSuccessNotification(
      'Biblioteca actualizada',
      'La biblioteca ha sido actualizada exitosamente.'
    );
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
