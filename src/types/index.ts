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

export interface RouteParams {
  id?: string;
}
