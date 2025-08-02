# React TypeScript App

Una aplicación completa de React con TypeScript que usa las siguientes tecnologias

📚 **[Ver documentación completa en /docs](docs/README.md)**

## 🚀 Tecnologías Utilizadas

- **React 18** - Biblioteca principal para construir interfaces de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Material-UI (MUI)** - Framework de componentes de UI siguiendo Material Design
- **Zustand** - Gestión de estado ligera y moderna
- **React Hook Form** - Manejo eficiente de formularios
- **Yup** - Validación de esquemas para JavaScript
- **Material React Table** - Tabla de datos avanzada con funcionalidades completas
- **React Router DOM** - Enrutamiento declarativo para React
- **Vite** - Herramienta de construcción rápida

## 📦 Instalación

```bash
npm install
```

## 🔧 Scripts Disponibles

```bash
# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar la construcción
npm run preview

# Linting
npm run lint
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navigation.tsx   # Barra de navegación
│   ├── UserForm.tsx     # Formulario de usuarios
│   └── UsersTable.tsx   # Tabla de usuarios
├── pages/              # Páginas principales
├── store/              # Gestión de estado
│   └── appStore.ts     # Store principal con Zustand
├── types/              # Definiciones de tipos
│   └── index.ts        # Tipos principales
├── hooks/              # Hooks personalizados
└── App.tsx             # Componente principal
```

## 🎯 Funcionalidades

- **Gestión de Usuarios**: Crear, leer, actualizar y eliminar usuarios
- **Validación de Formularios**: Validación completa con Yup y React Hook Form
- **Tabla Interactiva**: Tabla de datos con filtros, ordenamiento y paginación
- **Estado Global**: Gestión de estado con Zustand
- **Navegación**: Enrutamiento con React Router DOM
- **Diseño Responsivo**: Interfaz adaptable con Material-UI
- **TypeScript**: Tipado estático para mejor desarrollo

## 🛠️ Desarrollo

La aplicación está configurada con:

- **Hot Module Replacement (HMR)** para desarrollo rápido
- **ESLint** para calidad de código
- **TypeScript** para tipado estático
- **Material-UI** para componentes consistentes

## 📱 Páginas Principales

1. **Inicio** (`/`) - Dashboard con estadísticas
2. **Usuarios** (`/users`) - Lista de usuarios con tabla interactiva
3. **Agregar Usuario** (`/add-user`) - Formulario para crear usuarios
4. **Editar Usuario** (`/edit-user/:id`) - Formulario para editar usuarios

## 🎨 Tema

La aplicación usa un tema personalizado de Material-UI con:
- Color primario: `#1976d2` (Azul)
- Color secundario: `#dc004e` (Rojo)

## 🔍 Validaciones

Los formularios incluyen validaciones para:
- Nombre: Mínimo 2 caracteres
- Email: Formato de email válido
- Edad: Entre 18 y 100 años
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
