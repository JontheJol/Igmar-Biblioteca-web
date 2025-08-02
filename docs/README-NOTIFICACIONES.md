# Sistema de Notificaciones Reutilizable

Este sistema proporciona una solución completa para mostrar notificaciones modales basadas en el diseño de Figma, perfecta para manejar respuestas de API y notificaciones personalizadas.

## Componentes

### 1. `NotificationDialog`
Componente modal reutilizable que muestra notificaciones con diferentes tipos y estilos.

### 2. `useNotification` Hook
Hook personalizado que maneja el estado y la lógica de las notificaciones.

## Tipos de Notificaciones

- **Success**: Verde (#453726) - Para operaciones exitosas
- **Error**: Rojo (#d32f2f) - Para errores y validaciones
- **Warning**: Naranja (#ff9800) - Para conflictos y advertencias
- **Info**: Azul (#2196f3) - Para información general

## Uso Básico

### 1. Importar el hook y el componente

```tsx
import { useNotification } from '../hooks/useNotification';
import NotificationDialog from '../components/NotificationDialog';
```

### 2. Usar el hook en tu componente

```tsx
const MyComponent: React.FC = () => {
  const {
    notification,
    isNotificationOpen,
    showSuccessNotification,
    showErrorNotification,
    showWarningNotification,
    showInfoNotification,
    handleApiResponse,
    closeNotification,
  } = useNotification();

  // ... resto del componente
};
```

### 3. Agregar el componente NotificationDialog al JSX

```tsx
return (
  <>
    {/* Tu contenido aquí */}
    
    <NotificationDialog
      open={isNotificationOpen}
      notification={notification}
      onClose={closeNotification}
    />
  </>
);
```

## Métodos Disponibles

### Notificaciones Manuales

```tsx
// Notificación de éxito
showSuccessNotification('Título', 'Mensaje', 'Botón personalizado');

// Notificación de error (con detalles opcionales)
showErrorNotification('Error', 'Mensaje', {
  email: 'Formato inválido',
  telefono: 'Requerido'
});

// Notificación de advertencia
showWarningNotification('Advertencia', 'Mensaje');

// Notificación informativa
showInfoNotification('Info', 'Mensaje');
```

### Manejo Automático de Respuestas API

```tsx
const response = {
  status: "Registro exitoso",
  msg: "Usuario registrado exitosamente",
  data: { id: 123, name: "Juan" }
};

// Maneja automáticamente el tipo de notificación según la respuesta
handleApiResponse(response, 'Título personalizado para éxito');
```

## Tipos de Respuestas API Soportadas

### Respuesta Exitosa
```json
{
  "status": "Registro exitoso", // o cualquier string que contenga "exitoso", "éxito", "success"
  "msg": "Operación completada",
  "data": { /* datos opcionales */ }
}
```

### Respuesta de Conflicto
```json
{
  "status": "Conflicto al registrar", // o cualquier string que contenga "Conflicto", "conflict"
  "msg": "BLT_01 - Ya existe un registro",
  "data": null
}
```

### Error de Validación
```json
{
  "status": "Error en los datos", // o cualquier string que contenga "Error en los datos", "validation"
  "msg": "Datos inválidos",
  "data": {
    "email": "Este campo es obligatorio",
    "telefono": "Formato incorrecto"
  }
}
```

## Ejemplo Completo

```tsx
import React, { useState } from 'react';
import { useNotification } from '../hooks/useNotification';
import NotificationDialog from '../components/NotificationDialog';

const MyForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const {
    notification,
    isNotificationOpen,
    handleApiResponse,
    closeNotification,
  } = useNotification();

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      // Maneja automáticamente la respuesta
      handleApiResponse(data, 'Usuario creado');
      
    } catch (error) {
      showErrorNotification('Error', 'No se pudo conectar al servidor');
    }
  };

  return (
    <>
      {/* Tu formulario aquí */}
      
      <NotificationDialog
        open={isNotificationOpen}
        notification={notification}
        onClose={closeNotification}
      />
    </>
  );
};
```

## Características

- **Diseño consistente**: Basado en el diseño de Figma
- **Tipado completo**: TypeScript para mejor experiencia de desarrollo
- **Reutilizable**: Un solo sistema para toda la aplicación
- **Automático**: Detecta el tipo de respuesta API automáticamente
- **Personalizable**: Títulos, mensajes y botones personalizables
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Animaciones**: Transiciones suaves al mostrar/ocultar

## Integración con el Store

El sistema se puede integrar fácilmente con Zustand u otros stores:

```tsx
// En tu store
interface AppState {
  // ... otros estados
  showNotification: (type: string, message: string) => void;
}

// En tu componente
const { showNotification } = useAppStore();
const { handleApiResponse } = useNotification();

// Combinar ambos
const handleApiCall = async () => {
  const response = await apiCall();
  handleApiResponse(response);
  showNotification('api_call_completed', 'Operación finalizada');
};
```
