# Sistema de Notificaciones Automáticas

## Descripción

El sistema de notificaciones automáticas muestra popups en cualquier request que se realice en la aplicación. Las notificaciones se clasifican en dos tipos:

- **Success** (códigos 200): Para operaciones exitosas - estilo verde
- **Error** (códigos != 200): Para cualquier error - estilo marrón

## Uso Automático desde el Store

Las siguientes funciones del store ya muestran notificaciones automáticamente:

### Autenticación
```typescript
// Login
await login(email, password); // ✅ Muestra notificación automática

// Registro
await register(userData); // ✅ Muestra notificación automática

// Confirmación de email
await confirmEmail(email); // ✅ Muestra notificación automática
```

### CRUD de Usuarios
```typescript
// Agregar usuario
addUser(userData); // ✅ Muestra notificación automática

// Actualizar usuario
updateUser(id, updates); // ✅ Muestra notificación automática

// Eliminar usuario
removeUser(id); // ✅ Muestra notificación automática
```

## Uso Manual con Hook

Para casos específicos donde necesites control manual:

```typescript
import { useAutoNotification } from '../hooks/useAutoNotification';

const MyComponent = () => {
  const { notifySuccess, notifyError, withAutoNotification } = useAutoNotification();

  // Notificación manual de éxito
  const handleSuccess = () => {
    notifySuccess('Operación exitosa', 'Los datos se guardaron correctamente');
  };

  // Notificación manual de error
  const handleError = () => {
    notifyError(
      'Error en la operación',
      'No se pudo procesar la solicitud',
      { campo: 'Detalle del error' } // Opcional
    );
  };

  // Wrapper automático para funciones async
  const handleAsyncOperation = async () => {
    await withAutoNotification(
      async () => {
        // Tu operación async aquí
        const result = await fetch('/api/data');
        if (!result.ok) throw new Error('Error en la petición');
        return result.json();
      },
      'Datos cargados', // Título éxito
      'Los datos se cargaron correctamente', // Mensaje éxito
      'Error al cargar datos' // Título error
    );
  };

  return (
    // Tu componente...
  );
};
```

## Uso Directo del Store

También puedes acceder directamente a las funciones del store:

```typescript
import { useAppStore } from '../store/appStore';

const MyComponent = () => {
  const { 
    showSuccessNotification, 
    showErrorNotification, 
    hideNotification 
  } = useAppStore();

  const handleOperation = () => {
    // Simular código de respuesta
    const statusCode = 200; // o cualquier otro código

    if (statusCode === 200) {
      showSuccessNotification(
        'Operación exitosa',
        'Todo salió bien'
      );
    } else {
      showErrorNotification(
        'Error en la operación',
        \`Error \${statusCode}: Algo salió mal\`,
        { campo: 'Detalle específico' } // Opcional
      );
    }
  };

  return (
    // Tu componente...
  );
};
```

## Características del Sistema

### ✅ Automático
- Se activa automáticamente en todas las operaciones del store
- No necesitas llamar manualmente las notificaciones en operaciones CRUD básicas

### ✅ Flexible
- Puedes usar notificaciones manuales cuando sea necesario
- Soporta detalles de errores específicos por campo

### ✅ Consistente
- Diseño uniforme: verde para éxito, marrón para errores
- Funciona globalmente en toda la aplicación

### ✅ No Intrusivo
- Los componentes existentes siguen funcionando sin cambios
- El sistema se ejecuta en segundo plano

## Estructura del Popup

```typescript
interface NotificationData {
  type: 'success' | 'error';
  title: string;
  message: string;
  details?: Record<string, string>; // Para errores específicos por campo
  buttonText?: string; // Por defecto "Aceptar"
  showCloseButton?: boolean;
}
```

## Ejemplos de Uso

### Código 200 (Éxito)
```typescript
// Se muestra automáticamente popup verde con:
// ✅ Ícono de CheckCircle
// ✅ Fondo verde (#2F5233)
// ✅ Botón de acción verde (#8E9775)
```

### Códigos de Error (400, 404, 500, etc.)
```typescript
// Se muestra automáticamente popup marrón con:
// ❌ Ícono de Error
// ❌ Fondo marrón (#453726)
// ❌ Botón de acción marrón (#A47149)
// ❌ Opcionalmente detalles de errores específicos
```

El sistema está completamente integrado y funcionando. ¡Todas las operaciones ya muestran notificaciones automáticamente!
