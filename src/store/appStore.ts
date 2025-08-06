import { create } from 'zustand';
import type { NotificationData } from '../components/NotificationDialog';
import type { Bibliotecario, Libro, Estante } from '../types';

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
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  roleId: number; // 3 = Administrador, 4 = Super Administrador
  roleName: string;
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
  // Bibliotecarios state
  bibliotecarios: Bibliotecario[];
  bibliotecarioLoading: boolean;
  bibliotecarioError: string | null;
  // Libros state
  libros: Libro[];
  libroLoading: boolean;
  libroError: string | null;
  // Estantes state
  estantes: Estante[];
  estanteLoading: boolean;
  estanteError: string | null;
  // Auth state
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  authLoading: boolean;
  authError: string | null;
  // Notification state
  notification: NotificationData | null;
  showNotification: boolean;
  // User CRUD actions
  addUser: (user: Omit<User, 'id'>) => void;
  removeUser: (id: number) => void;
  updateUser: (id: number, updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
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
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  confirmEmail: (email: string) => Promise<void>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  setAuthLoading: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;
  // Notification actions
  showSuccessNotification: (title: string, message: string, buttonText?: string) => void;
  showErrorNotification: (title: string, message: string, details?: Record<string, string>, buttonText?: string) => void;
  hideNotification: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  users: [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', age: 30 },
    { id: 2, name: 'María García', email: 'maria@example.com', age: 25 },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com', age: 35 },
  ],
  loading: false,
  error: null,
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
    { id: 1, nombre: 'A24', ubicacion: 'Sector A', fila: '2', columna: '4', cantidadLibros: 32, espaciosDisponibles: 3, etiquetas: ['Literatura', 'Clásicos'] },
    { id: 2, nombre: 'B15', ubicacion: 'Sector B', fila: '1', columna: '5', cantidadLibros: 28, espaciosDisponibles: 7, etiquetas: ['Ficción'] },
    { id: 3, nombre: 'C08', ubicacion: 'Sector C', fila: '0', columna: '8', cantidadLibros: 30, espaciosDisponibles: 5, etiquetas: ['Historia'] },
    { id: 4, nombre: 'D12', ubicacion: 'Sector D', fila: '1', columna: '2', cantidadLibros: 25, espaciosDisponibles: 10, etiquetas: ['Literatura'] },
    { id: 5, nombre: 'E05', ubicacion: 'Sector E', fila: '0', columna: '5', cantidadLibros: 35, espaciosDisponibles: 0, etiquetas: ['Ciencia'] },
    { id: 6, nombre: 'F03', ubicacion: 'Sector F', fila: '0', columna: '3', cantidadLibros: 22, espaciosDisponibles: 13, etiquetas: ['Arte'] },
    { id: 7, nombre: 'G11', ubicacion: 'Sector G', fila: '1', columna: '1', cantidadLibros: 29, espaciosDisponibles: 6, etiquetas: ['Filosofía'] },
    { id: 8, nombre: 'H07', ubicacion: 'Sector H', fila: '0', columna: '7', cantidadLibros: 31, espaciosDisponibles: 4, etiquetas: ['Psicología'] },
    { id: 9, nombre: 'I19', ubicacion: 'Sector I', fila: '1', columna: '9', cantidadLibros: 27, espaciosDisponibles: 8, etiquetas: ['Cocina', 'Lifestyle'] },
    { id: 10, nombre: 'J26', ubicacion: 'Sector J', fila: '2', columna: '6', cantidadLibros: 33, espaciosDisponibles: 2, etiquetas: ['Biografías'] },
  ],
  estanteLoading: false,
  estanteError: null,
  // Auth state
  isAuthenticated: false,
  currentUser: null,
  authLoading: false,
  authError: null,
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
  // Auth actions
  login: async (email: string, password: string) => {
    set({ authLoading: true, authError: null });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo authentication with different roles
    let userRole: { roleId: number; roleName: string } | null = null;
    
    if (email === 'admin@booksmart.com' && password === 'password') {
      userRole = { roleId: ROLES.ADMIN, roleName: ROLE_NAMES[3] };
    } else if (email === 'superadmin@booksmart.com' && password === 'password') {
      userRole = { roleId: ROLES.SUPER_ADMIN, roleName: ROLE_NAMES[4] };
    }
    
    if (userRole) {
      set({
        isAuthenticated: true,
        currentUser: {
          id: 1,
          name: userRole.roleName,
          email: email,
          roleId: userRole.roleId,
          roleName: userRole.roleName,
        },
        authLoading: false,
        authError: null,
      });
      // Show success notification
      get().showSuccessNotification(
        'Inicio de sesión exitoso',
        `¡Bienvenido de vuelta, ${userRole.roleName}!`
      );
    } else {
      set({
        authLoading: false,
        authError: 'Credenciales incorrectas. Usa admin@booksmart.com o superadmin@booksmart.com con password',
      });
      // Show error notification
      get().showErrorNotification(
        'Error de autenticación',
        'Credenciales incorrectas',
        { 
          admin: 'admin@booksmart.com / password',
          superadmin: 'superadmin@booksmart.com / password'
        }
      );
    }
  },
  register: async (data: RegisterData) => {
    console.log('🏪 Store: register called with data:', data);
    set({ authLoading: true, authError: null });
    
    // Simulate API call
    console.log('⏳ Store: Simulating API call...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if email already exists (simple validation)
    const existingUser = get().users.find(user => user.email === data.email);
    if (existingUser) {
      console.log('❌ Store: Email already exists');
      set({
        authLoading: false,
        authError: 'Este correo electrónico ya está registrado',
      });
      // Show error notification
      get().showErrorNotification(
        'Error en el registro',
        'Este correo electrónico ya está registrado',
        { email: 'Ya existe una cuenta con este correo' }
      );
      throw new Error('Este correo electrónico ya está registrado');
    }
    
    // Create new user but DON'T authenticate yet
    // User needs to confirm email first
    const newUser = {
      id: Date.now(),
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      age: 25, // Default age for demo
    };
    
    console.log('✅ Store: User created successfully:', newUser);
    
    // Add to users list but keep user NOT authenticated
    set((state) => ({
      users: [...state.users, newUser],
      authLoading: false,
      authError: null,
      // Don't set isAuthenticated: true here
      // User will be authenticated after email confirmation
    }));
    
    // Show success notification
    get().showSuccessNotification(
      'Registro exitoso',
      'Tu cuenta ha sido creada. Revisa tu correo para confirmar tu email.',
      'Continuar'
    );
    
    console.log('✅ Store: Registration completed successfully');
    // Success - will trigger navigation to email confirmation
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
  logout: () => 
    set({
      isAuthenticated: false,
      currentUser: null,
      authError: null,
    }),
  changePassword: async (currentPassword: string, newPassword: string) => {
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
