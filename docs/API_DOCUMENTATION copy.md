# Booksmart API Business - Documentación para Desarrolladores

## Información General

- **Base URL**: `https://tu-dominio.com/api/business`
- **Autenticación**: JWT Bearer Token
- **Formato de respuesta**: JSON

### Headers requeridos
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Códigos de Estado HTTP

- `200` - OK: Operación exitosa
- `201` - Created: Recurso creado exitosamente
- `400` - Bad Request: Error en los datos de entrada
- `401` - Unauthorized: No autorizado
- `403` - Forbidden: Sin permisos suficientes
- `404` - Not Found: Recurso no encontrado
- `409` - Conflict: Conflicto con el estado actual
- `422` - Unprocessable Entity: Error de validación
- `500` - Internal Server Error: Error del servidor

## Estructura de Respuesta Estándar

```json
{
  "status": "string",
  "msg": "string",
  "data": object | array | null
}
```

## Roles de Usuario

- **Rol 1**: Super Admin
- **Rol 2**: Bibliotecario
- **Rol 3**: Administrador de Biblioteca
- **Rol 4**: Usuario General

---

## 1. BIBLIOTECAS

### 1.1 Crear Biblioteca
**POST** `/biblioteca`
- **Permisos**: Rol 3 (Administrador de Biblioteca)

**Request Body:**
```json
{
  "nombre": "string (requerido)",
  "ubicacion": "string (opcional)",
  "estado": "Pendiente | Autorizado | No autorizado | Desactivado",
  "admin_id": "number (opcional)"
}
```

**Respuestas:**

**201 - Éxito:**
```json
{
  "status": "Registro exitoso",
  "msg": "Biblioteca registrada exitosamente",
  "data": {
    "id": 1,
    "nombre": "Biblioteca Central",
    "ubicacion": "Centro de la ciudad"
  }
}
```

**403 - Sin permisos:**
```json
{
  "status": "Acción no permitida",
  "msg": "BLT_05 - Sin autorización para crear bibliotecas",
  "data": null
}
```

**409 - Conflicto:**
```json
{
  "status": "Conflicto al registrar biblioteca",
  "msg": "BLT_01 - Ya existe una biblioteca con esos datos",
  "data": null
}
```

**422 - Error de validación:**
```json
{
  "status": "Error en los datos",
  "msg": "BLT_02 - El formato de los datos proporcionados es incorrecto",
  "data": {
    "errors": [
      {
        "field": "nombre",
        "rule": "required",
        "message": "El nombre es requerido"
      }
    ]
  }
}
```

### 1.2 Listar Bibliotecas
**GET** `/bibliotecas`
- **Permisos**: Rol 4 (Usuario General)

**Query Parameters:**
- `estado` (opcional): Filtrar por estado

**200 - Éxito:**
```json
{
  "status": "Datos regresados exitosamente",
  "msg": "Bibliotecas regresadas exitosamente",
  "data": [
    {
      "id": 1,
      "nombre": "Biblioteca Central",
      "ubicacion": "Centro de la ciudad"
    }
  ]
}
```

### 1.3 Ver Biblioteca Específica
**GET** `/biblioteca/:id`
- **Permisos**: Rol 4 (Usuario General)

**200 - Éxito:**
```json
{
  "status": "Datos regresados exitosamente",
  "msg": "Biblioteca encontrada",
  "data": {
    "id": 1,
    "nombre": "Biblioteca Central",
    "ubicacion": "Centro de la ciudad",
    "estado": "Autorizado"
  }
}
```

### 1.4 Bibliotecas por Usuario
**GET** `/bibliotecas/usuario/:usuario_id`
- **Permisos**: Autenticado

**200 - Éxito:**
```json
{
  "status": "Datos regresados exitosamente",
  "msg": "Bibliotecas del usuario obtenidas",
  "data": [
    {
      "id": 1,
      "nombre": "Biblioteca Central",
      "ubicacion": "Centro de la ciudad"
    }
  ]
}
```

### 1.5 Actualizar Biblioteca
**PUT** `/biblioteca/:id`
- **Permisos**: Rol 4 (Usuario General)

**Request Body:**
```json
{
  "nombre": "string (opcional)",
  "ubicacion": "string (opcional)",
  "estado": "string (opcional)"
}
```

### 1.6 Eliminar Biblioteca
**DELETE** `/biblioteca/:id`
- **Permisos**: Rol 4 (Usuario General)

---

## 2. ESTANTES

### 2.1 Crear Estante
**POST** `/estante`
- **Permisos**: Rol 3 (Administrador de Biblioteca)

**Request Body:**
```json
{
  "nombre": "string",
  "biblioteca_id": "number",
  "capacidad": "number (opcional)"
}
```

### 2.2 Listar Estantes
**GET** `/estantes`
- **Permisos**: Rol 3 (Administrador de Biblioteca)

### 2.3 Ver Estante Específico
**GET** `/estante/:id`
- **Permisos**: Rol 3 (Administrador de Biblioteca)

### 2.4 Actualizar Estante
**PUT** `/estante/:id`
- **Permisos**: Rol 3 (Administrador de Biblioteca)

### 2.5 Eliminar Estante
**DELETE** `/estante/:id`
- **Permisos**: Rol 3 (Administrador de Biblioteca)

---

## 3. SECCIONES

### 3.1 Listar Secciones de Estante
**GET** `/secciones/:id`
- **Permisos**: Rol 3 (Administrador de Biblioteca)

**Query Parameters:**
- `estante_id` (requerido): ID del estante para filtrar las secciones

**200 - Éxito:**
```json
{
  "status": "Datos regresados exitosamente",
  "msg": "Lista de secciones regresado exitosamente",
  "data": [
    {
      "id": 1,
      "estante_id": 1,
      "etiqueta": "I-G2",
      "columna": 1,
      "fila": 2
    },
    {
      "id": 2,
      "estante_id": 1,
      "etiqueta": "I-G3",
      "columna": 1,
      "fila": 3
    }
  ]
}
```

**404 - Estante no encontrado:**
```json
{
  "status": "Recurso no encontrado",
  "code": "SECC_04",
  "msg": "El estante especificado no fue encontrado.",
  "data": null
}
```

**422 - Error de validación:**
```json
{
  "status": "Error en los datos",
  "code": "SECC_03",
  "msg": "El formato de los datos proporcionados es incorrecto",
  "data": {
    "errors": [
      {
        "field": "estante_id",
        "rule": "required",
        "message": "El campo estante_id es obligatorio para filtrar secciones"
      }
    ]
  }
}
```

### 3.2 Actualizar Sección
**PUT** `/seccion/:id`
- **Permisos**: Autenticado

**Request Body:**
```json
{
  "estante_id": "number (opcional)",
  "etiqueta": "string (opcional, 1-50 caracteres, formato alfanumérico con guiones)",
  "columna": "number (opcional, rango 1-100)",
  "fila": "number (opcional, rango 1-100)"
}
```

**200 - Éxito:**
```json
{
  "status": "Actualizacion exitosa",
  "msg": "Seccion fue actualizada exitosamente",
  "data": null
}
```

**400 - ID inválido:**
```json
{
  "status": "Error en los datos",
  "code": "SECC_03",
  "msg": "El formato del ID proporcionado es incorrecto.",
  "data": null
}
```

**404 - Sección no encontrada:**
```json
{
  "status": "Recurso no encontrado",
  "code": "SECC_04",
  "msg": "Sección no encontrada",
  "data": null
}
```

**422 - Error de validación:**
```json
{
  "status": "Error en los datos",
  "code": "SECC_03",
  "msg": "El formato de los datos proporcionados es incorrecto",
  "data": {
    "errors": [
      {
        "field": "etiqueta",
        "rule": "regex",
        "message": "El formato de la etiqueta no es válido"
      }
    ]
  }
}
```

---

## 4. LIBROS

### 4.1 Crear Libro
**POST** `/libro`
- **Permisos**: Rol 3 (Administrador de Biblioteca)

**Request Body:**
```json
{
  "nombre": "string",
  "autor": "string",
  "descripcion": "string (opcional)",
  "isbn": "string",
  "biblioteca_id": "number",
  "cantidad": "number (opcional, default: 1)"
}
```

**201 - Éxito:**
```json
{
  "status": "Registro exitoso",
  "msg": "Libro creado exitosamente",
  "data": {
    "id": 1,
    "nombre": "El Quijote",
    "autor": "Miguel de Cervantes",
    "isbn": "978-84-376-0494-7"
  }
}
```

### 4.2 Asignar Libro a Estante
**POST** `/libro/estante`
- **Permisos**: Rol 3 (Administrador de Biblioteca)

**Request Body:**
```json
{
  "libro_biblioteca_id": "number",
  "seccion_estante_id": "number"
}
```

### 4.3 Listar Libros
**GET** `/libros`
- **Permisos**: Autenticado

**Query Parameters:**
- `biblioteca_id` (opcional): Filtrar por biblioteca
- `page` (opcional): Página
- `limit` (opcional): Límite por página

**200 - Éxito:**
```json
{
  "status": "Datos regresados exitosamente",
  "msg": "Libros obtenidos",
  "data": [
    {
      "id": 1,
      "nombre": "El Quijote",
      "autor": "Miguel de Cervantes",
      "isbn": "978-84-376-0494-7",
      "disponible": true,
      "cantidad_total": 5,
      "cantidad_disponible": 3
    }
  ]
}
```

### 4.4 Ver Libro Específico
**GET** `/libro/:id`
- **Permisos**: Autenticado

### 4.5 Buscar por ISBN (Catálogo General)
**GET** `/libro/isbn`
- **Permisos**: Autenticado

**Query Parameters:**
- `isbn`: ISBN del libro

**200 - Éxito:**
```json
{
  "status": "Búsqueda exitosa",
  "msg": "Libro encontrado",
  "data": {
    "id": 1,
    "nombre": "El Quijote",
    "autor": "Miguel de Cervantes",
    "isbn": "978-84-376-0494-7",
    "descripcion": "..."
  }
}
```

### 4.6 Buscar por ISBN en Biblioteca
**GET** `/libro/isbn/biblioteca`
- **Permisos**: Autenticado

**Query Parameters:**
- `isbn`: ISBN del libro
- `biblioteca_id`: ID de la biblioteca

### 4.7 Buscar por Nombre
**GET** `/libro/nombre`
- **Permisos**: Autenticado

**Query Parameters:**
- `nombre`: Nombre del libro
- `biblioteca_id` (opcional): ID de la biblioteca

### 4.8 Actualizar Libro
**PUT** `/libro/:id`
- **Permisos**: Rol 3 (Administrador de Biblioteca)

### 4.9 Eliminar Libro
**DELETE** `/libro/:id`
- **Permisos**: Rol 3 (Administrador de Biblioteca)

---

## 5. USUARIO-BIBLIOTECA

### 5.1 Registrar Usuario en Biblioteca
**POST** `/usuario-biblioteca`
- **Permisos**: Rol 2 (Bibliotecario)

**Request Body:**
```json
{
  "usuario_id": "number",
  "biblioteca_id": "number"
}
```

### 5.2 Eliminar Usuario de Biblioteca
**DELETE** `/usuario-biblioteca/:id`
- **Permisos**: Rol 2 (Bibliotecario)

### 5.3 Verificar Registro Completo
**GET** `/verificar-registro-completo/:usuario_id`
- **Permisos**: Rol 2 (Bibliotecario)

**200 - Éxito:**
```json
{
  "status": "Verificación exitosa",
  "msg": "Usuario verificado",
  "data": {
    "usuario_id": 1,
    "registro_completo": true,
    "huella_registrada": true,
    "rostro_registrado": true,
    "rfid_registrado": true
  }
}
```

### 5.4 Buscar Usuario por Email
**POST** `/buscar-usuario-email`
- **Permisos**: Rol 2 (Bibliotecario)

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com"
}
```

### 5.5 Registrar Rostro
**POST** `/registrar-rostro`
- **Permisos**: Rol 2 (Bibliotecario)

**Request Body:**
```json
{
  "usuario_id": "number",
  "foto_base64": "string"
}
```

---

## 6. BIOMÉTRICOS

### 6.1 Registrar RFID
**POST** `/registrar-rfid`
- **Permisos**: Rol 2 (Bibliotecario)

**Request Body:**
```json
{
  "usuario_id": "number",
  "rfid_code": "string"
}
```

### 6.2 Verificar RFID
**POST** `/verificar-rfid`
- **Permisos**: Rol 2 (Bibliotecario)

**Request Body:**
```json
{
  "rfid_code": "string"
}
```

**200 - Éxito:**
```json
{
  "status": "Verificación exitosa",
  "msg": "RFID válido",
  "data": {
    "usuario_id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com"
  }
}
```

### 6.3 Verificar Huella
**POST** `/verificar-huella`
- **Permisos**: Rol 2 (Bibliotecario)

**Request Body:**
```json
{
  "huella_data": "string",
  "usuario_id": "number (opcional)"
}
```

### 6.4 Detectar/Registrar Huella
**POST** `/detectar-huella`
- **Permisos**: Rol 2 (Bibliotecario)

**Request Body:**
```json
{
  "usuario_id": "number",
  "huella_data": "string"
}
```

---

## 7. PRÉSTAMOS

### 7.1 Crear Préstamo
**POST** `/prestamo`
- **Permisos**: Rol 2 (Bibliotecario)

**Request Body:**
```json
{
  "usuario_id": "number",
  "libro_biblioteca_id": "number",
  "fecha_prestamo": "YYYY-MM-DD",
  "fecha_devolucion_esperada": "YYYY-MM-DD",
  "observaciones": "string (opcional)"
}
```

**201 - Éxito:**
```json
{
  "status": "Préstamo exitoso",
  "msg": "Préstamo creado exitosamente",
  "data": {
    "id": 1,
    "usuario_id": 1,
    "libro_biblioteca_id": 1,
    "fecha_prestamo": "2024-01-15",
    "fecha_devolucion_esperada": "2024-01-29",
    "estado": "Activo"
  }
}
```

### 7.2 Listar Préstamos
**GET** `/prestamos`
- **Permisos**: Autenticado

**Query Parameters:**
- `usuario_id` (opcional): Filtrar por usuario
- `estado` (opcional): Filtrar por estado
- `biblioteca_id` (opcional): Filtrar por biblioteca

**200 - Éxito:**
```json
{
  "status": "Datos regresados exitosamente",
  "msg": "Préstamos obtenidos",
  "data": [
    {
      "id": 1,
      "usuario": {
        "id": 1,
        "nombre": "Juan Pérez"
      },
      "libro": {
        "id": 1,
        "nombre": "El Quijote",
        "autor": "Miguel de Cervantes"
      },
      "fecha_prestamo": "2024-01-15",
      "fecha_devolucion_esperada": "2024-01-29",
      "fecha_devolucion_real": null,
      "estado": "Activo"
    }
  ]
}
```

### 7.3 Ver Préstamo Específico
**GET** `/prestamo/:id`
- **Permisos**: Autenticado

### 7.4 Actualizar Préstamo
**PUT** `/prestamo/:id`
- **Permisos**: Rol 2 (Bibliotecario)

**Request Body:**
```json
{
  "fecha_devolucion_real": "YYYY-MM-DD (opcional)",
  "estado": "Activo | Devuelto | Vencido",
  "observaciones": "string (opcional)"
}
```

### 7.5 Préstamos por Biblioteca
**GET** `/prestamos/biblioteca/:bibliotecaId/:usuarioId`
- **Permisos**: Autenticado

---

## 8. CÓDIGOS DE ERROR COMUNES

### Bibliotecas
- `BLT_01`: Ya existe una biblioteca con esos datos
- `BLT_02`: Formato de datos incorrecto
- `BLT_03`: Sin autorización para acceder
- `BLT_05`: Sin autorización para crear bibliotecas

### Secciones
- `SECC_01`: El campo "estante_id" es obligatorio para filtrar secciones
- `SECC_02`: Sin autorización para realizar la acción
- `SECC_03`: El formato de los datos proporcionados es incorrecto
- `SECC_04`: Recurso no encontrado (estante o sección)

### Libros
- `LBR_01`: Sin autorización para realizar la acción
- `LBR_02`: Formato de datos incorrecto
- `LBR_03`: Libro no encontrado
- `LBR_04`: ISBN ya existe en la biblioteca

### Préstamos
- `PRS_01`: Usuario no autorizado
- `PRS_02`: Libro no disponible
- `PRS_03`: Usuario tiene préstamos vencidos
- `PRS_04`: Límite de préstamos excedido

### Biométricos
- `BIO_01`: RFID no encontrado
- `BIO_02`: Huella no reconocida
- `BIO_03`: Error en el registro biométrico

### Generales
- `ERR_500`: Error interno del servidor
- `AUTH_01`: Token inválido o expirado
- `AUTH_02`: Sin permisos suficientes

---

## 9. EJEMPLOS DE USO

### Flujo Completo de Préstamo

1. **Verificar usuario por RFID**:
```bash
POST /api/business/verificar-rfid
{
  "rfid_code": "ABC123XYZ"
}
```

2. **Buscar libro por ISBN**:
```bash
GET /api/business/libro/isbn/biblioteca?isbn=978-84-376-0494-7&biblioteca_id=1
```

3. **Crear préstamo**:
```bash
POST /api/business/prestamo
{
  "usuario_id": 1,
  "libro_biblioteca_id": 1,
  "fecha_prestamo": "2024-01-15",
  "fecha_devolucion_esperada": "2024-01-29"
}
```

### Registro de Usuario en Biblioteca

1. **Buscar usuario por email**:
```bash
POST /api/business/buscar-usuario-email
{
  "email": "usuario@ejemplo.com"
}
```

2. **Registrar en biblioteca**:
```bash
POST /api/business/usuario-biblioteca
{
  "usuario_id": 1,
  "biblioteca_id": 1
}
```

3. **Registrar biométricos**:
```bash
POST /api/business/registrar-rfid
{
  "usuario_id": 1,
  "rfid_code": "ABC123XYZ"
}
```

---

## 10. NOTAS IMPORTANTES

1. **Autenticación**: Todas las rutas (excepto health check) requieren autenticación JWT
2. **Roles**: Cada endpoint especifica los roles mínimos requeridos
3. **Validación**: Los datos se validan según los esquemas definidos
4. **Transacciones**: Las operaciones críticas usan transacciones de base de datos
5. **CORS**: Configurado para permitir requests desde el frontend
6. **Rate Limiting**: Implementar según necesidades de producción

Para más información técnica, consultar el código fuente de los controladores y validadores.
