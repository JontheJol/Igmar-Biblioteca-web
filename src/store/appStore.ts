import { create } from 'zustand';
import type { NotificationData } from '../components/NotificationDialog';
import type { Bibliotecario, Libro } from '../types';

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
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  confirmEmail: (email: string) => Promise<void>;
  logout: () => void;
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
