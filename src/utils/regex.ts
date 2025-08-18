/**
 * Expresiones regulares centralizadas para validación de datos
 */

// Expresiones regulares
export const REGEX_PATTERNS = {
  // Nombres y apellidos
  NOMBRE_APELLIDO: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ ]{1,49}$/,
  
  // Correo electrónico
  CORREO: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  // Celular (10 dígitos)
  CELULAR: /^\d{10}$/,
  
  // Género
  GENERO: /^(Masculino|Femenino)$/,
  
  // Contraseña (mínimo 8 caracteres, una mayúscula, un número y un carácter especial)
  CONTRASENA: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#?&])[A-Za-z\d@$!%#?&]{8,}$/,
  
  // 2FA (código de 8 caracteres: minúscula, mayúscula, dígito y carácter especial)
  TWO_FA: /^.{1,8}$/,
  
  // CURP mexicana
  CURP: /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]\d$/,
  
  // RFC mexicano
  RFC: /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/,
  
  // Estado de libros
  ESTADO_LIBROS: /^(Disponible|No disponible|Prestado)$/,
  
  // Estado de préstamos
  ESTADO_PRESTAMOS: /^(Activo|Entregado|Atrasado|Perdido)$/,
  
  // Fila (números del 1 al 99)
  FILA: /^([1-9]|[1-9][0-9])$/,
  
  // Columna (números del 1 al 99)
  COLUMNA: /^([1-9]|[1-9][0-9])$/,
  
  // Fecha (formato YYYY-MM-DD)
  FECHA: /^\d{4}-\d{2}-\d{2}$/,
  
  // Nombre de libro/editorial/autor
  NOMBRE_LIBRO: /^[\wÁÉÍÓÚáéíóúÑñ\s.,\-']{1,100}$/,
  
  // Ubicación
  UBICACION: /^[\wÁÉÍÓÚáéíóúÑñ\s.,#\-\d]{1,100}$/,
} as const;

// Mensajes de error descriptivos
export const REGEX_ERROR_MESSAGES = {
  NOMBRE_APELLIDO: 'Debe iniciar con mayúscula, solo letras y espacios. Máximo 50 caracteres.',
  CORREO: 'Ingrese un formato de correo electrónico válido.',
  CELULAR: 'Debe contener exactamente 10 dígitos numéricos.',
  GENERO: 'Solo se acepta "Masculino" o "Femenino".',
  CONTRASENA: 'Mínimo 8 caracteres, al menos una mayúscula, un número y un carácter especial (@$!%#?&).',
  TWO_FA: 'Código de 8 caracteres: debe incluir minúscula, mayúscula, número y carácter especial ($@$!%*?&).',
  CURP: 'Formato de CURP inválido. Debe seguir el formato oficial mexicano.',
  RFC: 'Formato de RFC inválido. Debe incluir homoclave.',
  ESTADO_LIBROS: 'Solo se acepta: Disponible, No disponible o Prestado.',
  ESTADO_PRESTAMOS: 'Solo se acepta: Activo, Entregado, Atrasado o Perdido.',
  FILA: 'Solo se permiten números enteros del 1 al 99.',
  COLUMNA: 'Solo se permiten números enteros del 1 al 99.',
  FECHA: 'Formato de fecha debe ser YYYY-MM-DD.',
  NOMBRE_LIBRO: 'Letras, números, espacios y signos básicos. Máximo 100 caracteres.',
  UBICACION: 'Formato de dirección inválido. Máximo 100 caracteres.',
} as const;

// Tipos para TypeScript
export type RegexPatternKey = keyof typeof REGEX_PATTERNS;
export type RegexErrorKey = keyof typeof REGEX_ERROR_MESSAGES;

/**
 * Función utilitaria para validar un valor contra una expresión regular
 * @param value - Valor a validar
 * @param pattern - Clave del patrón a usar
 * @returns true si es válido, false si no
 */
export const validatePattern = (value: string, pattern: RegexPatternKey): boolean => {
  if (!value || typeof value !== 'string') return false;
  return REGEX_PATTERNS[pattern].test(value);
};

/**
 * Función para obtener mensaje de error para un patrón específico
 * @param pattern - Clave del patrón
 * @returns Mensaje de error descriptivo
 */
export const getErrorMessage = (pattern: RegexErrorKey): string => {
  return REGEX_ERROR_MESSAGES[pattern];
};

/**
 * Función para validar y obtener error si hay
 * @param value - Valor a validar
 * @param pattern - Clave del patrón a usar
 * @returns null si es válido, mensaje de error si no
 */
export const validateWithError = (value: string, pattern: RegexPatternKey): string | null => {
  if (validatePattern(value, pattern)) {
    return null;
  }
  return getErrorMessage(pattern);
};

/**
 * Validadores específicos para casos comunes
 */
export const validators = {
  // Validador de nombre completo (nombre + apellido)
  nombreCompleto: (nombre: string, apellido: string) => ({
    nombre: validateWithError(nombre, 'NOMBRE_APELLIDO'),
    apellido: validateWithError(apellido, 'NOMBRE_APELLIDO'),
  }),
  
  // Validador de credenciales de usuario
  credenciales: (email: string, password: string) => ({
    email: validateWithError(email, 'CORREO'),
    password: validateWithError(password, 'CONTRASENA'),
  }),
  
  // Validador de documentos mexicanos
  documentosMx: (curp: string, rfc: string) => ({
    curp: validateWithError(curp, 'CURP'),
    rfc: validateWithError(rfc, 'RFC'),
  }),
  
  // Validador de ubicación de libro
  ubicacionLibro: (fila: string, columna: string) => ({
    fila: validateWithError(fila, 'FILA'),
    columna: validateWithError(columna, 'COLUMNA'),
  }),
  
  // Validador de información de libro
  infoLibro: (titulo: string, autor: string, editorial: string) => ({
    titulo: validateWithError(titulo, 'NOMBRE_LIBRO'),
    autor: validateWithError(autor, 'NOMBRE_LIBRO'),
    editorial: validateWithError(editorial, 'NOMBRE_LIBRO'),
  }),
};

/**
 * Constantes para opciones de select/dropdown
 */
export const SELECT_OPTIONS = {
  GENEROS: ['Masculino', 'Femenino'] as const,
  ESTADOS_LIBROS: ['Disponible', 'No disponible', 'Prestado'] as const,
  ESTADOS_PRESTAMOS: ['Activo', 'Entregado', 'Atrasado', 'Perdido'] as const,
  ESTADOS_BIBLIOTECARIOS: ['Activo', 'Inactivo'] as const,
  COLUMNAS: Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)), // A-Z
} as const;

/**
 * Función utilitaria para formatear texto según el patrón esperado
 */
export const formatters = {
  // Formatea nombre/apellido: primera letra mayúscula
  nombreApellido: (text: string): string => {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },
  
  // Formatea CURP a mayúsculas
  curp: (text: string): string => text.toUpperCase(),
  
  // Formatea RFC a mayúsculas
  rfc: (text: string): string => text.toUpperCase(),
  
  // Formatea columna a mayúscula
  columna: (text: string): string => text.toUpperCase().charAt(0),
  
  // Formatea celular (solo números)
  celular: (text: string): string => text.replace(/\D/g, '').slice(0, 10),
  
  // Formatea fecha a formato YYYY-MM-DD
  fecha: (date: Date): string => {
    return date.toISOString().split('T')[0];
  },
};

export default {
  REGEX_PATTERNS,
  REGEX_ERROR_MESSAGES,
  validatePattern,
  getErrorMessage,
  validateWithError,
  validators,
  SELECT_OPTIONS,
  formatters,
};
