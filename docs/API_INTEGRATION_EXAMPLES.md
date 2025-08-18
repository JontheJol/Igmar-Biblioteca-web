# Booksmart API - Ejemplos de Integración Frontend

## Configuración Inicial

### Configuración de Axios (JavaScript)

```javascript
// config/api.js
import axios from 'axios';

const API_BASE_URL = 'https://tu-dominio.com/api/business';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## Ejemplos de Servicios

### 1. Servicio de Bibliotecas

```javascript
// services/bibliotecaService.js
import api from '../config/api';

export const bibliotecaService = {
  // Crear biblioteca
  async crear(datos) {
    try {
      const response = await api.post('/biblioteca', datos);
      return {
        success: true,
        data: response.data.data,
        message: response.data.msg
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || 'Error al crear biblioteca',
        details: error.response?.data?.data
      };
    }
  },

  // Listar bibliotecas
  async listar(filtros = {}) {
    try {
      const params = new URLSearchParams();
      if (filtros.estado) params.append('estado', filtros.estado);
      
      const response = await api.get(`/bibliotecas?${params}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.msg
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || 'Error al obtener bibliotecas'
      };
    }
  },

  // Obtener biblioteca por ID
  async obtenerPorId(id) {
    try {
      const response = await api.get(`/biblioteca/${id}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.msg
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || 'Error al obtener biblioteca'
      };
    }
  },

  // Actualizar biblioteca
  async actualizar(id, datos) {
    try {
      const response = await api.put(`/biblioteca/${id}`, datos);
      return {
        success: true,
        data: response.data.data,
        message: response.data.msg
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || 'Error al actualizar biblioteca',
        details: error.response?.data?.data
      };
    }
  },

  // Eliminar biblioteca
  async eliminar(id) {
    try {
      const response = await api.delete(`/biblioteca/${id}`);
      return {
        success: true,
        message: response.data.msg
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || 'Error al eliminar biblioteca'
      };
    }
  }
};
```

### 2. Servicio de Libros

```javascript
// services/libroService.js
import api from '../config/api';

export const libroService = {
  // Crear libro
  async crear(datos) {
    try {
      const response = await api.post('/libro', datos);
      return {
        success: true,
        data: response.data.data,
        message: response.data.msg
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || 'Error al crear libro',
        details: error.response?.data?.data
      };
    }
  },

  // Listar libros
  async listar(filtros = {}) {
    try {
      const params = new URLSearchParams();
      if (filtros.biblioteca_id) params.append('biblioteca_id', filtros.biblioteca_id);
      if (filtros.page) params.append('page', filtros.page);
      if (filtros.limit) params.append('limit', filtros.limit);
      
      const response = await api.get(`/libros?${params}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.msg
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || 'Error al obtener libros'
      };
    }
  },

  // Buscar por ISBN
  async buscarPorIsbn(isbn, bibliotecaId = null) {
    try {
      const endpoint = bibliotecaId ? '/libro/isbn/biblioteca' : '/libro/isbn';
      const params = new URLSearchParams({ isbn });
      if (bibliotecaId) params.append('biblioteca_id', bibliotecaId);
      
      const response = await api.get(`${endpoint}?${params}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.msg
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || 'Libro no encontrado'
      };
    }
  },

  // Buscar por nombre
  async buscarPorNombre(nombre, bibliotecaId = null) {
    try {
      const params = new URLSearchParams({ nombre });
      if (bibliotecaId) params.append('biblioteca_id', bibliotecaId);
      
      const response = await api.get(`/libro/nombre?${params}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.msg
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || 'Error en la búsqueda'
      };
    }
  }
};
```

### 3. Servicio de Préstamos

```javascript
// services/prestamoService.js
import api from '../config/api';

export const prestamoService = {
  // Crear préstamo
  async crear(datos) {
    try {
      const response = await api.post('/prestamo', datos);
      return {
        success: true,
        data: response.data.data,
        message: response.data.msg
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || 'Error al crear préstamo',
        details: error.response?.data?.data
      };
    }
  },

  // Listar préstamos
  async listar(filtros = {}) {
    try {
      const params = new URLSearchParams();
      if (filtros.usuario_id) params.append('usuario_id', filtros.usuario_id);
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.biblioteca_id) params.append('biblioteca_id', filtros.biblioteca_id);
      
      const response = await api.get(`/prestamos?${params}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.msg
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || 'Error al obtener préstamos'
      };
    }
  },

  // Devolver libro
  async devolver(prestamoId) {
    try {
      const fechaDevolucion = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const response = await api.put(`/prestamo/${prestamoId}`, {
        fecha_devolucion_real: fechaDevolucion,
        estado: 'Devuelto'
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.msg
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || 'Error al devolver libro'
      };
    }
  }
};
```

### 4. Servicio de Secciones

```javascript
// services/seccionService.js
import api from '../config/api';

export const seccionService = {
  // Listar secciones por estante
  async listarPorEstante(estanteId) {
    try {
      const params = new URLSearchParams({ estante_id: estanteId });
      
      const response = await api.get(`/secciones/${estanteId}?${params}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.msg
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || 'Error al obtener secciones'
      };
    }
  },

  // Actualizar sección
  async actualizar(seccionId, datos) {
    try {
      const response = await api.put(`/seccion/${seccionId}`, datos);
      return {
        success: true,
        data: response.data.data,
        message: response.data.msg
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || 'Error al actualizar sección',
        details: error.response?.data?.data
      };
    }
  }
};
```

### 5. Servicio de Biométricos

```javascript
### 5. Servicio de Biométricos

```javascript
// services/biometricoService.js
import api from '../config/api';

export const biometricoService = {
  // Verificar RFID
  async verificarRfid(rfidCode) {
    try {
      const response = await api.post('/verificar-rfid', {
        rfid_code: rfidCode
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.msg
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || 'RFID no válido'
      };
    }
  },

  // Registrar RFID
  async registrarRfid(usuarioId, rfidCode) {
    try {
      const response = await api.post('/registrar-rfid', {
        usuario_id: usuarioId,
        rfid_code: rfidCode
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.msg
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || 'Error al registrar RFID'
      };
    }
  },

  // Verificar huella
  async verificarHuella(huellaData, usuarioId = null) {
    try {
      const payload = { huella_data: huellaData };
      if (usuarioId) payload.usuario_id = usuarioId;
      
      const response = await api.post('/verificar-huella', payload);
      return {
        success: true,
        data: response.data.data,
        message: response.data.msg
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || 'Huella no reconocida'
      };
    }
  }
};
```
```

## Ejemplos de Componentes React

### 1. Componente Lista de Bibliotecas

```jsx
// components/BibliotecasList.jsx
import React, { useState, useEffect } from 'react';
import { bibliotecaService } from '../services/bibliotecaService';

const BibliotecasList = () => {
  const [bibliotecas, setBibliotecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => {
    cargarBibliotecas();
  }, [filtroEstado]);

  const cargarBibliotecas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await bibliotecaService.listar({ estado: filtroEstado });
      
      if (result.success) {
        setBibliotecas(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error inesperado al cargar bibliotecas');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta biblioteca?')) {
      const result = await bibliotecaService.eliminar(id);
      
      if (result.success) {
        alert(result.message);
        cargarBibliotecas(); // Recargar lista
      } else {
        alert(result.error);
      }
    }
  };

  if (loading) return <div>Cargando bibliotecas...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="bibliotecas-list">
      <h2>Bibliotecas</h2>
      
      <div className="filtros">
        <select 
          value={filtroEstado} 
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Autorizado">Autorizado</option>
          <option value="No autorizado">No autorizado</option>
          <option value="Desactivado">Desactivado</option>
        </select>
      </div>

      <div className="biblioteca-grid">
        {bibliotecas.map((biblioteca) => (
          <div key={biblioteca.id} className="biblioteca-card">
            <h3>{biblioteca.nombre}</h3>
            <p>Ubicación: {biblioteca.ubicacion || 'No especificada'}</p>
            <div className="acciones">
              <button onClick={() => handleEliminar(biblioteca.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {bibliotecas.length === 0 && (
        <p>No se encontraron bibliotecas.</p>
      )}
    </div>
  );
};

export default BibliotecasList;
```

### 3. Componente Gestión de Secciones

```jsx
// components/SeccionesList.jsx
import React, { useState, useEffect } from 'react';
import { seccionService } from '../services/seccionService';

const SeccionesList = ({ estanteId }) => {
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    etiqueta: '',
    columna: '',
    fila: ''
  });

  useEffect(() => {
    if (estanteId) {
      cargarSecciones();
    }
  }, [estanteId]);

  const cargarSecciones = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await seccionService.listarPorEstante(estanteId);
      
      if (result.success) {
        setSecciones(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error inesperado al cargar secciones');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (seccion) => {
    setEditando(seccion.id);
    setFormData({
      etiqueta: seccion.etiqueta || '',
      columna: seccion.columna || '',
      fila: seccion.fila || ''
    });
  };

  const handleCancelar = () => {
    setEditando(null);
    setFormData({
      etiqueta: '',
      columna: '',
      fila: ''
    });
  };

  const handleGuardar = async (seccionId) => {
    try {
      // Filtrar campos vacíos
      const datosActualizacion = {};
      if (formData.etiqueta.trim()) datosActualizacion.etiqueta = formData.etiqueta.trim();
      if (formData.columna) datosActualizacion.columna = parseInt(formData.columna);
      if (formData.fila) datosActualizacion.fila = parseInt(formData.fila);

      const result = await seccionService.actualizar(seccionId, datosActualizacion);
      
      if (result.success) {
        alert(result.message);
        setEditando(null);
        cargarSecciones(); // Recargar lista
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert('Error inesperado al actualizar sección');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) return <div>Cargando secciones...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="secciones-list">
      <h3>Secciones del Estante</h3>
      
      {secciones.length === 0 ? (
        <p>No se encontraron secciones para este estante.</p>
      ) : (
        <div className="secciones-grid">
          {secciones.map((seccion) => (
            <div key={seccion.id} className="seccion-card">
              {editando === seccion.id ? (
                <div className="seccion-form">
                  <div className="form-group">
                    <label>Etiqueta:</label>
                    <input
                      type="text"
                      value={formData.etiqueta}
                      onChange={(e) => handleInputChange('etiqueta', e.target.value)}
                      placeholder="Ej: I-G2"
                      maxLength="50"
                    />
                  </div>
                  <div className="form-group">
                    <label>Columna:</label>
                    <input
                      type="number"
                      value={formData.columna}
                      onChange={(e) => handleInputChange('columna', e.target.value)}
                      min="1"
                      max="100"
                    />
                  </div>
                  <div className="form-group">
                    <label>Fila:</label>
                    <input
                      type="number"
                      value={formData.fila}
                      onChange={(e) => handleInputChange('fila', e.target.value)}
                      min="1"
                      max="100"
                    />
                  </div>
                  <div className="acciones">
                    <button onClick={() => handleGuardar(seccion.id)}>
                      Guardar
                    </button>
                    <button onClick={handleCancelar}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="seccion-info">
                  <h4>Sección {seccion.id}</h4>
                  <p><strong>Etiqueta:</strong> {seccion.etiqueta || 'Sin etiqueta'}</p>
                  <p><strong>Posición:</strong> Columna {seccion.columna}, Fila {seccion.fila}</p>
                  <div className="acciones">
                    <button onClick={() => handleEditar(seccion)}>
                      Editar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeccionesList;
```

### 4. Componente Búsqueda de Libros

```jsx
### 4. Componente Búsqueda de Libros

```jsx
// components/BusquedaLibros.jsx
import React, { useState } from 'react';
import { libroService } from '../services/libroService';

const BusquedaLibros = ({ bibliotecaId }) => {
  const [tipoBusqueda, setTipoBusqueda] = useState('isbn');
  const [termino, setTermino] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBuscar = async (e) => {
    e.preventDefault();
    
    if (!termino.trim()) {
      setError('Por favor ingrese un término de búsqueda');
      return;
    }

    setLoading(true);
    setError(null);
    setResultados([]);

    try {
      let result;
      
      if (tipoBusqueda === 'isbn') {
        result = await libroService.buscarPorIsbn(termino, bibliotecaId);
      } else {
        result = await libroService.buscarPorNombre(termino, bibliotecaId);
      }

      if (result.success) {
        setResultados(Array.isArray(result.data) ? result.data : [result.data]);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error inesperado en la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="busqueda-libros">
      <h3>Buscar Libros</h3>
      
      <form onSubmit={handleBuscar}>
        <div className="busqueda-controls">
          <select 
            value={tipoBusqueda} 
            onChange={(e) => setTipoBusqueda(e.target.value)}
          >
            <option value="isbn">Por ISBN</option>
            <option value="nombre">Por Nombre</option>
          </select>
          
          <input
            type="text"
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            placeholder={tipoBusqueda === 'isbn' ? 'Ingrese ISBN' : 'Ingrese nombre del libro'}
          />
          
          <button type="submit" disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>

      {error && <div className="error">{error}</div>}

      {resultados.length > 0 && (
        <div className="resultados">
          <h4>Resultados:</h4>
          {resultados.map((libro, index) => (
            <div key={libro.id || index} className="libro-resultado">
              <h5>{libro.nombre}</h5>
              <p>Autor: {libro.autor}</p>
              <p>ISBN: {libro.isbn}</p>
              {libro.cantidad_disponible !== undefined && (
                <p>Disponibles: {libro.cantidad_disponible}/{libro.cantidad_total}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusquedaLibros;
```
```

### 3. Hook personalizado para manejo de API

```javascript
// hooks/useApi.js
import { useState, useCallback } from 'react';

export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(...args);
      
      if (result.success) {
        setData(result.data);
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorMessage = 'Error inesperado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
};

// Uso del hook
// const { data, loading, error, execute } = useApi(bibliotecaService.listar);
```

### 4. Utilidad para manejo de formularios

```javascript
// utils/formHandler.js
export const handleFormSubmit = async (apiCall, formData, options = {}) => {
  const {
    onSuccess = () => {},
    onError = () => {},
    resetForm = () => {},
    showSuccessMessage = true,
    showErrorMessage = true
  } = options;

  try {
    const result = await apiCall(formData);
    
    if (result.success) {
      if (showSuccessMessage) {
        alert(result.message || 'Operación exitosa');
      }
      resetForm();
      onSuccess(result);
    } else {
      if (showErrorMessage) {
        alert(result.error || 'Error en la operación');
      }
      onError(result);
    }
    
    return result;
  } catch (error) {
    const errorMessage = 'Error inesperado';
    if (showErrorMessage) {
      alert(errorMessage);
    }
    onError({ success: false, error: errorMessage });
    return { success: false, error: errorMessage };
  }
};
```

## Ejemplos de Validación Frontend

```javascript
// utils/validators.js
export const validators = {
  required: (value) => {
    return value && value.trim() !== '' ? null : 'Este campo es requerido';
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Email inválido';
  },

  isbn: (value) => {
    const isbnRegex = /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/;
    return isbnRegex.test(value) ? null : 'ISBN inválido';
  },

  // Validador específico para etiquetas de sección
  etiquetaSeccion: (value) => {
    if (!value) return null; // Campo opcional
    const etiquetaRegex = /^[A-Za-z0-9\-\s]{1,50}$/;
    return etiquetaRegex.test(value) ? null : 'Formato de etiqueta inválido (solo letras, números, guiones y espacios)';
  },

  // Validador para columnas y filas
  posicionEstante: (value) => {
    if (!value) return null; // Campo opcional
    const num = parseInt(value);
    return (num >= 1 && num <= 100) ? null : 'La posición debe estar entre 1 y 100';
  },

  minLength: (min) => (value) => {
    return value && value.length >= min ? null : `Debe tener al menos ${min} caracteres`;
  },

  maxLength: (max) => (value) => {
    return !value || value.length <= max ? null : `No puede exceder ${max} caracteres`;
  },

  positiveNumber: (value) => {
    const num = Number(value);
    return num > 0 ? null : 'Debe ser un número positivo';
  },

  unsignedInteger: (value) => {
    const num = parseInt(value);
    return (num >= 0 && Number.isInteger(num)) ? null : 'Debe ser un número entero no negativo';
  }
};

// Función para validar formulario completo
export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = formData[field];
    
    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // Solo mostrar el primer error por campo
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Reglas específicas para validar secciones
export const seccionValidationRules = {
  etiqueta: [validators.etiquetaSeccion, validators.maxLength(50)],
  columna: [validators.positiveNumber, validators.posicionEstante],
  fila: [validators.positiveNumber, validators.posicionEstante],
  estante_id: [validators.required, validators.positiveNumber]
};

// Ejemplo de uso para validación de sección
export const validateSeccionForm = (formData) => {
  return validateForm(formData, {
    etiqueta: [validators.etiquetaSeccion, validators.maxLength(50)],
    columna: [validators.posicionEstante],
    fila: [validators.posicionEstante]
  });
};
```

Este conjunto de documentación y ejemplos debería proporcionar al desarrollador web todo lo necesario para integrar correctamente con tu API de Booksmart. Los archivos incluyen:

1. **API_DOCUMENTATION.md**: Documentación completa de todos los endpoints
2. **API_ERROR_EXAMPLES.md**: Ejemplos detallados de respuestas de error
3. **API_INTEGRATION_EXAMPLES.md**: Ejemplos prácticos de código para frontend

¿Te gustaría que agregue algún ejemplo específico adicional o que modifique alguna parte de la documentación?
