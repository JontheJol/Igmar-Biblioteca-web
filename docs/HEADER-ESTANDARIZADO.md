# Guía de Uso de Componentes de Header Estandarizados

## Componentes Creados

### 1. PageHeader
Un componente reutilizable que estandariza la sección superior de todas las páginas principales.

**Props:**
- `title`: string - El título principal de la página
- `subtitle`: string - El subtítulo descriptivo
- `actionButton?`: React.ReactNode - Botón opcional (como "Añadir", "Nuevo", etc.)
- `children?`: React.ReactNode - Controles adicionales como filtros, búsqueda, etc.

### 2. ActionButton
Un componente reutilizable para botones de acción con diseño consistente.

**Props:**
- `label`: string - El texto del botón
- `icon`: React.ReactNode - El ícono a mostrar
- `onClick`: () => void - Función a ejecutar al hacer clic
- `variant?`: 'primary' | 'secondary' - Estilo del botón (por defecto: 'primary')

## Estructura Estandarizada

Todas las páginas principales ahora siguen esta estructura consistente:

```tsx
<Box sx={{ backgroundColor: '#fff9ec', ... }}>
  <PageHeader
    title="Título de la Página"
    subtitle="Descripción de la página"
    actionButton={
      <ActionButton
        label="Texto del Botón"
        icon={<IconoComponente />}
        onClick={handleFuncion}
      />
    }
  >
    {/* Controles adicionales como filtros, búsqueda, etc. */}
    <Box sx={{ display: 'flex', gap: 2, ... }}>
      <TextField placeholder="Buscar..." />
      <Select>...</Select>
    </Box>
  </PageHeader>
  
  {/* Contenido principal de la página */}
  <Box sx={{ ... }}>
    {/* Lista, grid, tabla, etc. */}
  </Box>
</Box>
```

## Diseño Estandarizado

### Elementos Incluidos en PageHeader:
1. **Título principal** - Fuente Rowdies, responsive
2. **Subtítulo descriptivo** - Fuente League Spartan
3. **Botón de acción opcional** - Estilizado consistentemente
4. **Línea divisoria café** (#3A332A) - 3px de grosor
5. **Controles adicionales** - Área flexible para filtros, búsqueda, etc.

### Colores y Estilos:
- **Fondo**: #fff9ec
- **Título**: #453726 (Rowdies)
- **Subtítulo**: #4B453D (League Spartan)
- **Línea divisoria**: #3A332A
- **Botón primario**: #2F5233 (hover: #234026)
- **Botón secundario**: #A47149 (hover: #8B5E3C)

## Páginas Refactorizadas

Las siguientes páginas ya implementan este patrón estandarizado:

1. **Estantes.tsx** - Con búsqueda y filtros
2. **Libros.tsx** - Con búsqueda y selector de filtros
3. **Bibliotecarios.tsx** - Diseño simple
4. **Users.tsx** - Diseño simple

## Ventajas del Nuevo Sistema

1. **Consistencia Visual**: Todas las páginas tienen el mismo look & feel
2. **Mantenibilidad**: Cambios de diseño se aplican automáticamente
3. **Reutilización**: Fácil implementación en nuevas páginas
4. **Responsive**: Funciona correctamente en todos los dispositivos
5. **Escalabilidad**: Fácil agregar nuevas funcionalidades

## Cómo Implementar en Nuevas Páginas

```tsx
import PageHeader from '../components/PageHeader';
import ActionButton from '../components/ActionButton';
import MiIcono from '../assets/miIcono';

const MiPagina: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: '#fff9ec', ... }}>
      <PageHeader
        title="Mi Página"
        subtitle="Descripción de mi página"
        actionButton={
          <ActionButton
            label="Mi Acción"
            icon={<MiIcono />}
            onClick={() => console.log('clicked')}
          />
        }
      >
        {/* Filtros opcionales */}
      </PageHeader>
      
      {/* Tu contenido aquí */}
    </Box>
  );
};
```

Este sistema garantiza que todas las páginas principales mantengan el diseño consistente desde el título hasta la línea café, tal como se solicitó.
