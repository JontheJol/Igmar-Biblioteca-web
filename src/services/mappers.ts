/**
 * Mappers para convertir entre tipos de la API Business y tipos del frontend
 * Mantiene compatibilidad con el store existente
 */

import type { Libro, Estante, Biblioteca } from '../types';
import type { 
  LibroResponse, 
  EstanteResponse, 
  BibliotecaResponse 
} from './businessApiUpdated';

// Tipo temporal para los datos reales que llegan de la API de libros
type LibroResponseReal = {
  libro_biblioteca_id: number;
  nombre: string;
  autor: string;
  isbn: string;
  editorial?: string;
  descripcion?: string;
}

// Mappers para Libros
export const libroResponseToLibro = (apiResponse: any): Libro => ({
  id: apiResponse.libro_biblioteca_id || apiResponse.id, // Usar libro_biblioteca_id como ID principal
  titulo: apiResponse.nombre,
  autor: apiResponse.autor,
  editorial: apiResponse.editorial || 'Sin especificar', // Usar editorial de la API o valor por defecto
  estante: '', // Campo que no existe en la API, se debe obtener de la ubicación
  isbn: apiResponse.isbn,
  descripcion: apiResponse.descripcion || '',
  fechaPublicacion: '', // Campo que no existe en la API
  ubicacion: '', // Campo que no existe en la API, se debe construir
  estado: 'Disponible', // Campo que no existe en la API, usar valor por defecto
  fila: '', // Campo que no existe en la API
  columna: '', // Campo que no existe en la API
});

export const libroToApiRequest = (libro: Omit<Libro, 'id'>, bibliotecaId: number) => ({
  nombre: libro.titulo,
  autor: libro.autor,
  isbn: libro.isbn || '',
  descripcion: libro.descripcion || undefined,
  biblioteca_id: bibliotecaId,
  cantidad: 1, // Valor por defecto
});

// Mappers para Estantes
export const estanteResponseToEstante = (apiResponse: EstanteResponse): Estante => ({
  id: apiResponse.id,
  nombre: apiResponse.etiqueta || apiResponse.nombre || `Estante ${apiResponse.id}`, // Usar etiqueta como nombre
  ubicacion: `Biblioteca ${apiResponse.biblioteca_id}`, // Generar ubicación basada en biblioteca_id
  fila: apiResponse.cant_filas ? apiResponse.cant_filas.toString() : '0', // Convertir a string simple
  columna: apiResponse.cant_columnas ? apiResponse.cant_columnas.toString() : '0', // Convertir a string simple
  cantidadLibros: 0, // Campo que no existe en la API, usar valor por defecto
  espaciosDisponibles: (apiResponse.cant_filas || 0) * (apiResponse.cant_columnas || 0), // Calcular espacios totales
});

export const estanteToApiRequest = (estante: Omit<Estante, 'id'>, bibliotecaId: number) => ({
  etiqueta: estante.nombre, // Mapear nombre a etiqueta
  biblioteca_id: bibliotecaId,
  cant_columnas: parseInt(estante.columna) || 5, // Convertir string a número
  cant_filas: parseInt(estante.fila) || 4, // Convertir string a número
});

// Mappers para Bibliotecas - mapear estados de API a estados del frontend
const mapEstadoAPIToFrontend = (estadoAPI: string): 'activa' | 'inactiva' | 'mantenimiento' => {
  switch (estadoAPI) {
    case 'Autorizado':
      return 'activa';
    case 'No autorizado':
    case 'Desactivado':
      return 'inactiva';
    case 'Pendiente':
    default:
      return 'mantenimiento';
  }
};

const mapEstadoFrontendToAPI = (estadoFrontend: string): 'Pendiente' | 'Autorizado' | 'No autorizado' | 'Desactivado' => {
  switch (estadoFrontend) {
    case 'activa':
      return 'Autorizado';
    case 'inactiva':
      return 'No autorizado';
    case 'mantenimiento':
    default:
      return 'Pendiente';
  }
};

export const bibliotecaResponseToBiblioteca = (apiResponse: BibliotecaResponse): Biblioteca => ({
  id: apiResponse.id,
  nombre: apiResponse.nombre,
  direccion: apiResponse.ubicacion || '', // Mapear ubicacion a direccion
  estado: mapEstadoAPIToFrontend(apiResponse.estado),
  administrador: '', // Campo que no existe en la API, usar valor por defecto
});

export const bibliotecaToApiRequest = (biblioteca: Omit<Biblioteca, 'id'>) => ({
  nombre: biblioteca.nombre,
  ubicacion: biblioteca.direccion || undefined, // Mapear direccion a ubicacion
  estado: mapEstadoFrontendToAPI(biblioteca.estado),
});

// Objeto con todos los mappers para fácil importación
export const mappers = {
  libroResponseToLibro,
  libroToApiRequest,
  estanteResponseToEstante,
  estanteToApiRequest,
  bibliotecaResponseToBiblioteca,
  bibliotecaToApiRequest,
};
