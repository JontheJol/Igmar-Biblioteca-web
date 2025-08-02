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

export interface RouteParams {
  id?: string;
}
