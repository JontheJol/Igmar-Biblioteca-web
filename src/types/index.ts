export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

export interface UserFormData {
  name: string;
  email: string;
  age: number;
}

export interface Bibliotecario {
  id: number;
  nombre: string;
  correo: string;
  numeroTelefono: string;
  avatar?: string;
}

export interface BibliotecarioFormData {
  nombre: string;
  correo: string;
  numeroTelefono: string;
}

export interface Administrador {
  id: string;
  nombre: string;
  correo: string;
  biblioteca?: string;
  telefono?: string;
  fechaCreacion?: string;
}

export interface AdministradorFormData {
  nombre: string;
  correo: string;
  biblioteca?: string;
  telefono?: string;
}

export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  editorial: string;
  estante: string;
  isbn?: string;
  fechaPublicacion?: string;
  estado?: string;
  fila?: string;
  columna?: string;
  ubicacion?: string;
  imagen?: string;
  descripcion?: string;
}

export interface LibroFormData {
  titulo: string;
  autor: string;
  editorial: string;
  estante: string;
  isbn?: string;
  fechaPublicacion?: string;
}

export interface Estante {
  id: number;
  nombre: string;
  ubicacion: string;
  fila: string;
  columna: string;
  cantidadLibros: number;
  espaciosDisponibles: number;
  etiquetas?: string[];
}

export interface Biblioteca {
  id: number;
  nombre: string;
  direccion: string;
  estado: 'activa' | 'inactiva' | 'mantenimiento';
  telefono?: string;
  email?: string;
  fechaCreacion?: string;
  administrador?: string;
}

export interface BibliotecaFormData {
  nombre: string;
  direccion: string;
  estado: 'activa' | 'inactiva' | 'mantenimiento';
  telefono?: string;
  email?: string;
  administrador?: string;
}

export interface RouteParams {
  id?: string;
}
