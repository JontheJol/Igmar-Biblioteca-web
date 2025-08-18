# Sistema de Edición de Etiquetas para Estantes

## Descripción
El sistema permite a los administradores editar las etiquetas de las secciones de los estantes de manera visual e intuitiva. Las etiquetas se almacenan como secciones en la base de datos y se sincronizan automáticamente.

## Funcionalidades Principales

### 1. Visualización Dinámica del Estante
- El estante se renderiza en tiempo real basado en las filas y columnas configuradas
- Los espacios pueden mostrar coordenadas (1-1, 1-2, etc.) o etiquetas personalizadas
- Switch para alternar entre modo coordenadas y modo etiquetas

### 2. Edición de Etiquetas

#### Modo Individual
- Click en cualquier espacio del estante para editar su etiqueta
- Dialog modal para ingresar la nueva etiqueta
- Validación y guardado automático

#### Modo Selección Múltiple
- Seleccionar múltiples espacios del estante
- Asignar la misma etiqueta a todos los espacios seleccionados
- Visual feedback con colores diferentes para espacios seleccionados

### 3. Gestión de Etiquetas
- Lista de etiquetas únicas disponibles en el estante
- Opción de agregar nuevas etiquetas
- Eliminar etiquetas existentes
- Chip components para visualización elegante

## Integración con la API

### Endpoints Utilizados
```typescript
// Cargar secciones de un estante
GET /api/business/secciones/{estante_id}

// Actualizar una sección
PUT /api/business/seccion/{seccion_id}
```

### Flujo de Datos
1. **Carga inicial**: Se obtienen las secciones existentes del estante desde la API
2. **Mapeo visual**: Las secciones se mapean a posiciones en el grid visual
3. **Edición**: Los cambios se guardan inmediatamente en la base de datos
4. **Sincronización**: El estado local se actualiza automáticamente

## Permisos y Seguridad
- Solo usuarios con rol 3 (Administrador) o superior pueden editar secciones
- Verificación de permisos antes de cada operación
- Fallback a datos locales si no hay permisos suficientes
- Mensajes informativos para usuarios sin permisos

## Componentes Clave

### EstanteVisual
- Genera grid dinámico basado en filas y columnas
- Maneja clicks y selecciones
- Aplica estilos condicionales según el estado

### DialogEtiqueta
- Modal para edición de etiquetas individuales
- Validación de input
- Botones de cancelar y guardar

### GestionEtiquetas
- Panel lateral con chips de etiquetas existentes
- Botón para agregar nuevas etiquetas
- Modo selección múltiple

## Uso en el Código

### Importaciones necesarias
```tsx
import { useAppStore } from '../store/appStore';
import { businessApi } from '../services/businessApi';
```

### Estado requerido
```tsx
const [mostrarEtiquetas, setMostrarEtiquetas] = useState(false);
const [etiquetas, setEtiquetas] = useState<string[]>([]);
const [dialogAbierto, setDialogAbierto] = useState(false);
const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');
const [espaciosSeleccionados, setEspaciosSeleccionados] = useState<number[]>([]);
const [modoSeleccionMultiple, setModoSeleccionMultiple] = useState(false);
```

### Funciones del store utilizadas
```tsx
const { 
  loadSecciones, 
  updateSeccion, 
  secciones, 
  currentUser 
} = useAppStore();
```

## Ejemplos de Uso

### Cargar etiquetas desde secciones
```tsx
const cargarEtiquetas = async () => {
  if (!currentUser || currentUser.roleId < 3) {
    console.warn('Usuario sin permisos');
    return;
  }
  
  await loadSecciones(estanteId);
  
  // Mapear secciones a array de etiquetas
  const etiquetasArray = new Array(totalEspacios).fill('');
  secciones.forEach(seccion => {
    if (seccion.estante_id === estanteId && seccion.etiqueta) {
      const index = (seccion.fila - 1) * columnas + (seccion.columna - 1);
      if (index >= 0 && index < totalEspacios) {
        etiquetasArray[index] = seccion.etiqueta;
      }
    }
  });
  
  setEtiquetas(etiquetasArray);
};
```

### Guardar etiquetas como secciones
```tsx
const guardarEtiquetas = async () => {
  for (let i = 0; i < etiquetas.length; i++) {
    const etiqueta = etiquetas[i];
    
    if (!etiqueta || !etiqueta.trim()) continue;
    
    const fila = Math.floor(i / columnas) + 1;
    const columna = (i % columnas) + 1;
    
    const seccionExistente = secciones.find(s => 
      s.estante_id === estanteId && s.fila === fila && s.columna === columna
    );
    
    if (seccionExistente) {
      await updateSeccion(seccionExistente.id, {
        etiqueta: etiqueta.trim(),
        fila,
        columna
      });
    }
  }
};
```

## Estilos y UX

### Colores del sistema
- **Modo coordenadas**: Fondo morado (`#B8A9C9`)
- **Modo etiquetas**: Fondo beige (`#E1C5AB`)  
- **Seleccionado**: Verde oscuro (`#2f5232`)
- **Hover**: Efectos de escala y color

### Responsive Design
- Grid adaptativo según el dispositivo
- Tamaños de fuente escalables
- Espaciado proporcional

## Manejo de Errores
- Try-catch en todas las operaciones async
- Logs informativos en consola
- Fallback a datos locales
- Notificaciones al usuario via store

## Optimizaciones
- Debounce en búsquedas y filtros
- Lazy loading de secciones
- Memoización de cálculos costosos
- Estados de carga granulares

## Testing
- Tests unitarios para funciones de mapeo
- Tests de integración con la API
- Tests de interacción del usuario
- Mocks para permisos y roles

## Consideraciones de Performance
- Límite máximo de 1000 espacios por estante
- Batch updates para múltiples secciones
- Cancelación de requests obsoletos
- Estado local para UX fluida
