import * as yup from 'yup';
import { 
  REGEX_PATTERNS, 
  REGEX_ERROR_MESSAGES,
  SELECT_OPTIONS 
} from './regex';

/**
 * Esquemas de validación Yup usando las expresiones regulares centralizadas
 */

// Esquemas base para campos individuales
export const baseSchemas = {
  // Nombres y apellidos
  nombreApellido: yup
    .string()
    .required('Este campo es requerido')
    .matches(REGEX_PATTERNS.NOMBRE_APELLIDO, REGEX_ERROR_MESSAGES.NOMBRE_APELLIDO),

  // Correo electrónico
  correo: yup
    .string()
    .required('El correo electrónico es requerido')
    .matches(REGEX_PATTERNS.CORREO, REGEX_ERROR_MESSAGES.CORREO),

  // Celular
  celular: yup
    .string()
    .required('El celular es requerido')
    .matches(REGEX_PATTERNS.CELULAR, REGEX_ERROR_MESSAGES.CELULAR),

  // Género
  genero: yup
    .string()
    .required('El género es requerido')
    .oneOf([...SELECT_OPTIONS.GENEROS], REGEX_ERROR_MESSAGES.GENERO),

  // Contraseña
  contrasena: yup
    .string()
    .required('La contraseña es requerida')
    .matches(REGEX_PATTERNS.CONTRASENA, REGEX_ERROR_MESSAGES.CONTRASENA),

  // 2FA
  twoFA: yup
    .string()
    .matches(REGEX_PATTERNS.TWO_FA, REGEX_ERROR_MESSAGES.TWO_FA),

  // CURP
  curp: yup
    .string()
    .required('El CURP es requerido')
    .matches(REGEX_PATTERNS.CURP, REGEX_ERROR_MESSAGES.CURP),

  // RFC
  rfc: yup
    .string()
    .required('El RFC es requerido')
    .matches(REGEX_PATTERNS.RFC, REGEX_ERROR_MESSAGES.RFC),

  // Estado de libros
  estadoLibros: yup
    .string()
    .required('El estado es requerido')
    .oneOf([...SELECT_OPTIONS.ESTADOS_LIBROS], REGEX_ERROR_MESSAGES.ESTADO_LIBROS),

  // Estado de préstamos
  estadoPrestamos: yup
    .string()
    .required('El estado es requerido')
    .oneOf([...SELECT_OPTIONS.ESTADOS_PRESTAMOS], REGEX_ERROR_MESSAGES.ESTADO_PRESTAMOS),

  // Fila
  fila: yup
    .string()
    .required('La fila es requerida')
    .matches(REGEX_PATTERNS.FILA, REGEX_ERROR_MESSAGES.FILA),

  // Columna
  columna: yup
    .string()
    .required('La columna es requerida')
    .matches(REGEX_PATTERNS.COLUMNA, REGEX_ERROR_MESSAGES.COLUMNA),

  // Estante
  estante: yup
    .string()
    .required('El estante es requerido'),

  // Etiqueta
  etiqueta: yup
    .string()
    .required('La etiqueta es requerida'),

  // Fecha
  fecha: yup
    .string()
    .required('La fecha es requerida')
    .matches(REGEX_PATTERNS.FECHA, REGEX_ERROR_MESSAGES.FECHA),

  // Nombre de libro/editorial/autor
  nombreLibro: yup
    .string()
    .required('Este campo es requerido')
    .matches(REGEX_PATTERNS.NOMBRE_LIBRO, REGEX_ERROR_MESSAGES.NOMBRE_LIBRO),

  // Ubicación
  ubicacion: yup
    .string()
    .required('La ubicación es requerida')
    .matches(REGEX_PATTERNS.UBICACION, REGEX_ERROR_MESSAGES.UBICACION),
};

/**
 * Esquemas compuestos para formularios específicos
 */

// Esquema para registro de usuario
export const registroUsuarioSchema = yup.object({
  firstName: baseSchemas.nombreApellido,
  lastName: baseSchemas.nombreApellido,
  email: baseSchemas.correo,
  phone: baseSchemas.celular,
  curp: baseSchemas.curp,
  rfc: baseSchemas.rfc,
  password: baseSchemas.contrasena,
  confirmPassword: yup
    .string()
    .required('Confirma tu contraseña')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
});

// Esquema para login
export const loginSchema = yup.object({
  email: baseSchemas.correo,
  password: yup.string().required('La contraseña es requerida'),
});

// Esquema para perfil de usuario
export const perfilUsuarioSchema = yup.object({
  firstName: baseSchemas.nombreApellido,
  lastName: baseSchemas.nombreApellido,
  email: baseSchemas.correo,
  phone: baseSchemas.celular,
  genero: baseSchemas.genero,
  curp: baseSchemas.curp,
  rfc: baseSchemas.rfc,
});

// Esquema para libro
export const libroSchema = yup.object({
  titulo: baseSchemas.nombreLibro,
  autor: baseSchemas.nombreLibro,
  editorial: baseSchemas.nombreLibro,
  isbn: yup.string().required('El ISBN es requerido'),
  fechaPublicacion: baseSchemas.fecha,
  estado: baseSchemas.estadoLibros,
  estante: baseSchemas.estante,
  fila: baseSchemas.fila,
  columna: baseSchemas.columna,
  ubicacion: baseSchemas.ubicacion.optional(),
});

// Esquema específico para posición de libro
export const posicionLibroSchema = yup.object({
  estante: baseSchemas.estante,
  etiqueta: baseSchemas.etiqueta,
  fila: baseSchemas.fila,
  columna: baseSchemas.columna,
});

// Esquema para préstamo
export const prestamoSchema = yup.object({
  usuarioId: yup.string().required('El usuario es requerido'),
  libroId: yup.string().required('El libro es requerido'),
  fechaPrestamo: baseSchemas.fecha,
  fechaDevolucion: baseSchemas.fecha,
  estado: baseSchemas.estadoPrestamos,
  observaciones: yup.string().max(500, 'Las observaciones no pueden exceder 500 caracteres'),
});

// Esquema para cambio de contraseña
export const cambioContrasenaSchema = yup.object({
  contrasenaActual: yup.string().required('La contraseña actual es requerida'),
  nuevaContrasena: baseSchemas.contrasena,
  confirmarContrasena: yup
    .string()
    .required('Confirma tu nueva contraseña')
    .oneOf([yup.ref('nuevaContrasena')], 'Las contraseñas no coinciden'),
});

// Esquema para configuración 2FA
export const configuracion2FASchema = yup.object({
  claveSecreta: baseSchemas.twoFA,
  codigoVerificacion: yup
    .string()
    .required('El código de verificación es requerido')
    .matches(/^\d{6}$/, 'El código debe tener 6 dígitos'),
});

// Esquema para estante
export const estanteSchema = yup.object({
  ubicacion: baseSchemas.ubicacion,
  fila: baseSchemas.fila,
  columna: baseSchemas.columna,
});

// Esquema para bibliotecarios
export const bibliotecarioSchema = yup.object({
  nombre: baseSchemas.nombreApellido,
  correo: baseSchemas.correo,
  numeroTelefono: baseSchemas.celular,
});

/**
 * Tipos TypeScript derivados de los esquemas
 */
export type RegistroUsuarioFormData = yup.InferType<typeof registroUsuarioSchema>;
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type PerfilUsuarioFormData = yup.InferType<typeof perfilUsuarioSchema>;
export type LibroFormData = yup.InferType<typeof libroSchema>;
export type PosicionLibroFormData = yup.InferType<typeof posicionLibroSchema>;
export type PrestamoFormData = yup.InferType<typeof prestamoSchema>;
export type CambioContrasenaFormData = yup.InferType<typeof cambioContrasenaSchema>;
export type Configuracion2FAFormData = yup.InferType<typeof configuracion2FASchema>;
export type BibliotecarioFormData = yup.InferType<typeof bibliotecarioSchema>;
export type EstanteFormData = yup.InferType<typeof estanteSchema>;

/**
 * Validadores síncronos para validación en tiempo real
 */
export const syncValidators = {
  // Validación de nombre/apellido mientras escribe
  validateNombreApellido: (value: string): string | null => {
    try {
      baseSchemas.nombreApellido.validateSync(value);
      return null;
    } catch (error) {
      return (error as yup.ValidationError).message;
    }
  },

  // Validación de correo mientras escribe
  validateCorreo: (value: string): string | null => {
    try {
      baseSchemas.correo.validateSync(value);
      return null;
    } catch (error) {
      return (error as yup.ValidationError).message;
    }
  },

  // Validación de celular mientras escribe
  validateCelular: (value: string): string | null => {
    try {
      baseSchemas.celular.validateSync(value);
      return null;
    } catch (error) {
      return (error as yup.ValidationError).message;
    }
  },

  // Validación de CURP mientras escribe
  validateCURP: (value: string): string | null => {
    try {
      baseSchemas.curp.validateSync(value);
      return null;
    } catch (error) {
      return (error as yup.ValidationError).message;
    }
  },

  // Validación de RFC mientras escribe
  validateRFC: (value: string): string | null => {
    try {
      baseSchemas.rfc.validateSync(value);
      return null;
    } catch (error) {
      return (error as yup.ValidationError).message;
    }
  },

  // Validación de contraseña mientras escribe
  validateContrasena: (value: string): string | null => {
    try {
      baseSchemas.contrasena.validateSync(value);
      return null;
    } catch (error) {
      return (error as yup.ValidationError).message;
    }
  },
};

export default {
  baseSchemas,
  registroUsuarioSchema,
  loginSchema,
  perfilUsuarioSchema,
  libroSchema,
  posicionLibroSchema,
  prestamoSchema,
  cambioContrasenaSchema,
  configuracion2FASchema,
  estanteSchema,
  syncValidators,
};
