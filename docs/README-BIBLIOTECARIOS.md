# Sección de Bibliotecarios

Esta sección permite administrar a los bibliotecarios del sistema. Implementa un diseño basado en Figma con las siguientes características:

## Funcionalidades

### 1. Lista de Bibliotecarios
- Vista principal que muestra todos los bibliotecarios registrados
- Diseño de cards responsivo siguiendo el diseño de Figma
- Cada card muestra:
  - Avatar con inicial del nombre si no hay imagen
  - Nombre completo
  - Correo electrónico
  - Número de teléfono
  - Botón de editar

### 2. Agregar Bibliotecario
- Formulario para registrar nuevos bibliotecarios
- Validaciones con Yup:
  - Nombre: Solo letras, mínimo 2 caracteres
  - Correo: Formato válido de email
  - Teléfono: 10 dígitos numéricos
- Notificaciones de éxito/error

### 3. Editar Bibliotecario
- Formulario pre-llenado con datos existentes
- Mismas validaciones que agregar
- Actualización en tiempo real del store

## Componentes

### `Bibliotecarios.tsx` (Página principal)
- Lista de bibliotecarios
- Botón "Nuevo bibliotecario" 
- Navegación a formularios de edición
- Layout responsivo

### `BibliotecarioCard.tsx` (Componente de tarjeta)
- Card individual para cada bibliotecario
- Diseño fiel al mockup de Figma
- Colores: #fef7ff (fondo), #a47149 (botón editar)
- Hover effects

### `BibliotecarioForm.tsx` (Formulario)
- Formulario reutilizable para agregar/editar
- Integración con react-hook-form
- Validación con esquema Yup
- Estilos coherentes con el diseño

### `AgregarBibliotecario.tsx` (Página agregar)
- Wrapper para el formulario en modo "agregar"
- Navegación automática después del guardado

### `EditarBibliotecario.tsx` (Página editar)
- Wrapper para el formulario en modo "editar"
- Manejo de ID de parámetro de URL
- Validación de existencia del bibliotecario

## Store Integration

### Estado del Store
```typescript
interface AppState {
  bibliotecarios: Bibliotecario[];
  bibliotecarioLoading: boolean;
  bibliotecarioError: string | null;
}
```

### Acciones disponibles
- `addBibliotecario(data)` - Agregar nuevo bibliotecario
- `updateBibliotecario(id, data)` - Actualizar bibliotecario existente
- `removeBibliotecario(id)` - Eliminar bibliotecario
- `setBibliotecarioLoading(loading)` - Cambiar estado de carga
- `setBibliotecarioError(error)` - Establecer error

## Rutas

```typescript
/bibliotecarios                    // Lista principal
/bibliotecarios/agregar           // Formulario agregar
/bibliotecarios/editar/:id        // Formulario editar
```

## Validaciones

El esquema de validación `bibliotecarioSchema` incluye:
- **Nombre**: Patrón `NOMBRE_APELLIDO` (letras, acentos, espacios)
- **Correo**: Patrón `CORREO` (formato email válido)
- **Teléfono**: Patrón `CELULAR` (10 dígitos)

## Permisos

- Requiere rol de Administrador (nivel 3) o superior
- Protegido con `RoleProtectedRoute`

## Diseño

Los componentes siguen fielmente el diseño de Figma:
- Tipografía: League Spartan, Rowdies
- Colores del tema: #fff9ec (fondo), #453726 (texto), #2f5233 (botones)
- Layout responsivo para móvil, tablet y desktop
- Shadows y border-radius según especificaciones

## Notificaciones

Integración completa con el sistema de notificaciones:
- Éxito al agregar/editar/eliminar
- Errores de validación
- Estados de carga durante operaciones

## Próximas mejoras

- Paginación para listas grandes
- Filtros y búsqueda
- Eliminación de bibliotecarios
- Importación masiva
- Foto de perfil personalizada
