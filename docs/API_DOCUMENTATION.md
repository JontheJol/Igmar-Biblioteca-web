# 📚 BookSmart API Business - Documentación para Desarrolladores

## 🚀 Información General

**Base URL:** `http://localhost:3333/api/business`
**Tecnología:** AdonisJS 5 + TypeScript + MySQL
**Autenticación:** JWT Bearer Token

## 🔑 Autenticación y Roles

### Sistema de Roles
- **Role 2:** Bibliotecario - Gestiona préstamos y usuarios de biblioteca
- **Role 3:** Administrador de Biblioteca - Gestiona biblioteca, estantes, libros y secciones
- **Role 4:** Super Administrador - Acceso completo al sistema

### Headers Requeridos
```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Obtener Token JWT
El token se obtiene desde la API de autenticación principal. El token debe incluir:
- `id`: ID del usuario
- `rolId`: ID del rol del usuario
- `nombre`: Nombre del usuario
- `correo`: Email del usuario

---

## 📖 Endpoints de la API

### 🏥 Health Check

#### GET /
Verifica que la API esté funcionando.

**Respuesta:**
```json
{
  "hello": "world"
}
```

---

### 🏛️ Bibliotecas

#### POST /biblioteca
**Rol requerido:** 3 (Administrador de Biblioteca)
**Descripción:** Crea una nueva biblioteca

**Body:**
```json
{
  "nombre": "Biblioteca Central",
  "direccion": "Av. Principal 123",
  "telefono": "+1234567890",
  "email": "biblioteca@example.com",
  "horarioApertura": "08:00",
  "horarioCierre": "18:00"
}
```

**Respuesta exitosa (201):**
```json
{
  "status": "Biblioteca creada",
  "msg": "La biblioteca se ha registrado correctamente",
  "data": {
    "id": 1,
    "nombre": "Biblioteca Central",
    "direccion": "Av. Principal 123",
    "telefono": "+1234567890",
    "email": "biblioteca@example.com",
    "horarioApertura": "08:00",
    "horarioCierre": "18:00",
    "estado": 1
  }
}
```

#### GET /bibliotecas
**Rol requerido:** 4 (Super Administrador)
**Descripción:** Lista todas las bibliotecas

**Query params opcionales:**
- `estado`: 1 (activa) o 0 (inactiva)

**Respuesta:**
```json
{
  "status": "Lista de bibliotecas",
  "msg": "Bibliotecas obtenidas correctamente",
  "data": [
    {
      "id": 1,
      "nombre": "Biblioteca Central",
      "direccion": "Av. Principal 123",
      "estado": 1
    }
  ]
}
```

#### GET /biblioteca/:id
**Rol requerido:** 4 (Super Administrador)
**Descripción:** Obtiene una biblioteca específica

#### PUT /biblioteca/:id
**Rol requerido:** 4 (Super Administrador)
**Descripción:** Actualiza una biblioteca

#### DELETE /biblioteca/:id
**Rol requerido:** 4 (Super Administrador)
**Descripción:** Elimina (soft delete) una biblioteca

#### GET /bibliotecas/usuario/:usuario_id
**Rol requerido:** Usuario autenticado
**Descripción:** Obtiene bibliotecas asociadas a un usuario

---

### 📚 Estantes

#### POST /estante
**Rol requerido:** 3 (Administrador de Biblioteca)
**Descripción:** Crea un nuevo estante

**Body:**
```json
{
  "etiqueta": "EST-001",
  "biblioteca_id": 1,
  "capacidad": 100,
  "ubicacion": "Planta baja, sector A"
}
```

#### GET /estantes
**Rol requerido:** 3 (Administrador de Biblioteca)
**Descripción:** Lista estantes

**Query params opcionales:**
- `biblioteca_id`: Filtrar por biblioteca

#### GET /estante/:id
**Rol requerido:** 3 (Administrador de Biblioteca)

#### PUT /estante/:id
**Rol requerido:** 3 (Administrador de Biblioteca)

#### DELETE /estante/:id
**Rol requerido:** 3 (Administrador de Biblioteca)

---

### 📋 Secciones

#### GET /secciones/:id
**Rol requerido:** 3 (Administrador de Biblioteca)
**Descripción:** Lista secciones de un estante

#### PUT /seccion/:id
**Rol requerido:** Usuario autenticado
**Descripción:** Actualiza una sección

---

### 📖 Libros

#### POST /libro
**Rol requerido:** 3 (Administrador de Biblioteca)
**Descripción:** Crea un libro y su primera instancia en biblioteca

**Body:**
```json
{
  "titulo": "El Quijote",
  "autor": "Miguel de Cervantes",
  "isbn": "978-84-376-0494-7",
  "genero": "Novela",
  "fecha_publicacion": "1605-01-16",
  "numero_paginas": 863,
  "editorial": "Editorial Planeta",
  "biblioteca_id": 1,
  "cantidad_disponible": 3,
  "ubicacion_fisica": "EST-001-SEC-A"
}
```

**Respuesta exitosa:**
```json
{
  "status": "Libro registrado",
  "code": "LBR_00",
  "msg": "Libro registrado correctamente en la biblioteca",
  "data": {
    "libro": {
      "id": 1,
      "titulo": "El Quijote",
      "autor": "Miguel de Cervantes",
      "isbn": "978-84-376-0494-7"
    },
    "biblioteca_instancia": {
      "id": 1,
      "biblioteca_id": 1,
      "cantidad_disponible": 3,
      "ubicacion_fisica": "EST-001-SEC-A"
    }
  }
}
```

#### POST /libro/estante
**Rol requerido:** 3 (Administrador de Biblioteca)
**Descripción:** Asigna un libro existente a una sección de estante

**Body:**
```json
{
  "libro_id": 1,
  "biblioteca_id": 1,
  "seccion_estante_id": 5,
  "cantidad_disponible": 2
}
```

#### GET /libros
**Rol requerido:** Usuario autenticado
**Descripción:** Lista libros

**Query params opcionales:**
- `biblioteca_id`: Filtrar por biblioteca
- `estado`: 1 (disponible) o 0 (no disponible)

#### GET /libro/:id
**Rol requerido:** Usuario autenticado

#### GET /libro/isbn?isbn=VALUE
**Rol requerido:** Usuario autenticado
**Descripción:** Busca libros por ISBN

#### GET /libro/nombre?nombre=VALUE
**Rol requerido:** Usuario autenticado
**Descripción:** Busca libros por nombre

#### PUT /libro/:id
**Rol requerido:** 3 (Administrador de Biblioteca)

#### DELETE /libro/:id
**Rol requerido:** 3 (Administrador de Biblioteca)

---

### 👥 Usuario-Biblioteca

#### POST /usuario-biblioteca
**Rol requerido:** 2 (Bibliotecario)
**Descripción:** Asocia un usuario a una biblioteca

**Body:**
```json
{
  "usuario_id": 123,
  "biblioteca_id": 1
}
```

**Respuesta exitosa:**
```json
{
  "status": "Usuario asociado",
  "msg": "Usuario registrado en la biblioteca correctamente",
  "data": {
    "usuario_biblioteca": {
      "id": 1,
      "usuario_id": 123,
      "biblioteca_id": 1
    },
    "biometric_status": {
      "foto_registrada": false,
      "huella_registrada": false,
      "tarjeta_registrada": false,
      "registro_completo": false
    },
    "next_steps": [
      "Registrar tarjeta RFID usando /registrar-rfid",
      "Registrar huella dactilar usando /detectar-huella",
      "Registrar rostro usando /registrar-rostro"
    ]
  }
}
```

#### DELETE /usuario-biblioteca/:id
**Rol requerido:** 2 (Bibliotecario)

#### GET /verificar-registro-completo/:usuario_id
**Rol requerido:** 2 (Bibliotecario)
**Descripción:** Verifica si el usuario tiene todos los datos biométricos

**Respuesta (registro completo):**
```json
{
  "status": "Registro completo",
  "msg": "El usuario tiene todos los datos biométricos registrados",
  "data": {
    "usuario_id": 123,
    "usuario_nombre": "Juan",
    "usuario_apellido": "Pérez",
    "biblioteca_nombre": "Biblioteca Central",
    "biometric_status": {
      "foto_registrada": true,
      "huella_registrada": true,
      "tarjeta_registrada": true,
      "registro_completo": true
    },
    "codigo_tarjeta": "ABC123",
    "ready_for_use": true
  }
}
```

#### POST /buscar-usuario-email
**Rol requerido:** 2 (Bibliotecario)
**Descripción:** Busca usuario por email para registro en biblioteca

**Body:**
```json
{
  "email": "usuario@example.com",
  "biblioteca_id": 1
}
```

---

### 🤖 Biométricos

#### POST /registrar-rfid
**Rol requerido:** 2 (Bibliotecario)
**Descripción:** Registra tarjeta RFID para un usuario

**Body:**
```json
{
  "usuario_id": 123,
  "codigo_tarjeta": "ABC123DEF"
}
```

#### POST /verificar-rfid
**Rol requerido:** 2 (Bibliotecario)
**Descripción:** Verifica tarjeta RFID

**Body:**
```json
{
  "codigo_tarjeta": "ABC123DEF"
}
```

#### POST /detectar-huella
**Rol requerido:** 2 (Bibliotecario)
**Descripción:** Registra huella dactilar para un usuario

**Body:**
```json
{
  "usuario_id": 123
}
```

#### POST /verificar-huella
**Rol requerido:** 2 (Bibliotecario)
**Descripción:** Verifica huella dactilar para préstamos

#### POST /registrar-rostro
**Rol requerido:** 2 (Bibliotecario)
**Descripción:** Registra rostro usando reconocimiento facial

**Body:**
```json
{
  "usuario_id": 123
}
```

---

### 📋 Préstamos

#### POST /prestamo
**Rol requerido:** 2 (Bibliotecario)
**Descripción:** Crea un nuevo préstamo

**Body:**
```json
{
  "usuario_id": 123,
  "libro_biblioteca_id": 1,
  "fecha_prestamo": "2024-01-15",
  "fecha_devolucion_esperada": "2024-01-29"
}
```

#### GET /prestamos
**Rol requerido:** Usuario autenticado
**Descripción:** Lista préstamos del usuario

#### GET /prestamo/:id
**Rol requerido:** Usuario autenticado

#### PUT /prestamo/:id
**Rol requerido:** 2 (Bibliotecario)
**Descripción:** Actualiza préstamo (ej: devolver libro)

#### GET /prestamos/biblioteca/:bibliotecaId
**Rol requerido:** Usuario autenticado
**Descripción:** Lista préstamos de una biblioteca específica

---

## 🚨 Códigos de Error Comunes

### Autenticación (401)
```json
{
  "status": "No autorizado",
  "msg": "Token JWT inválido o expirado",
  "data": null
}
```

### Autorización (403)
```json
{
  "status": "Acceso denegado",
  "msg": "Rol requerido: 3. Tu rol: 2",
  "data": null
}
```

### Validación (422)
```json
{
  "status": "Error en los datos",
  "msg": "El formato de los datos proporcionados es incorrecto",
  "data": {
    "nombre": ["El campo nombre es obligatorio"],
    "email": ["El email debe tener un formato válido"]
  }
}
```

### Recurso no encontrado (404)
```json
{
  "status": "Recurso no encontrado",
  "msg": "La biblioteca solicitada no existe",
  "data": null
}
```

### Error del servidor (500)
```json
{
  "status": "Error del servidor",
  "msg": "Ocurrió un error. Por favor, inténtelo de nuevo más tarde.",
  "data": null
}
```

---

## 🔄 Flujo de Trabajo Recomendado

### 1. Registro de Usuario en Biblioteca
1. **POST** `/usuario-biblioteca` - Asociar usuario a biblioteca
2. **POST** `/registrar-rfid` - Registrar tarjeta RFID
3. **POST** `/detectar-huella` - Registrar huella dactilar
4. **POST** `/registrar-rostro` - Registrar rostro
5. **GET** `/verificar-registro-completo/:usuario_id` - Verificar completitud

### 2. Gestión de Libros
1. **POST** `/biblioteca` - Crear biblioteca (si no existe)
2. **POST** `/estante` - Crear estantes
3. **POST** `/libro` - Registrar libros
4. **POST** `/libro/estante` - Asignar libros a secciones

### 3. Proceso de Préstamo
1. **POST** `/verificar-rfid` o `/verificar-huella` - Identificar usuario
2. **GET** `/libros?biblioteca_id=X` - Buscar libros disponibles
3. **POST** `/prestamo` - Crear préstamo
4. **PUT** `/prestamo/:id` - Procesar devolución

---

## 🛠️ Herramientas de Desarrollo

### Ejecutar la API
```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start

# Testing
npm test
```

### Variables de Entorno Necesarias
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_DATABASE=booksmart_business

JWT_SECRET=tu_jwt_secret
APP_KEY=tu_app_key

# APIs externas para biométricos
FACIAL_API_URL=http://tu-api-facial.com
FINGERPRINT_API_URL=http://tu-api-huella.com
```

### Estructura de Base de Datos
- **usuarios** - Información de usuarios
- **roles** - Roles del sistema
- **bibliotecas** - Información de bibliotecas
- **estantes** - Estantes de las bibliotecas
- **seccion_estantes** - Secciones de los estantes
- **libros** - Catálogo de libros
- **libro_bibliotecas** - Instancias de libros en bibliotecas
- **usuario_bibliotecas** - Asociaciones usuario-biblioteca
- **datos_adicionales** - Datos biométricos de usuarios
- **prestamos** - Registro de préstamos

---

## 📞 Soporte

Si tienes dudas sobre la implementación:

1. Revisa este documento primero
2. Consulta el código fuente en los controladores (`app/Controllers/Http/`)
3. Verifica los validadores (`app/Validators/`) para formatos de datos
4. Revisa los modelos (`app/Models/`) para estructura de datos
5. Consulta las rutas en `start/routes.ts`

**Contacto del equipo de desarrollo:** [Información de contacto]

---

*Última actualización: Agosto 2025*
