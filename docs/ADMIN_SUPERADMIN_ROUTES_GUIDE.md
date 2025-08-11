# 🔐 Guía de Rutas para Administradores y Super Administradores
## Booksmart Auth API - Documentación para Desarrolladores Web
URL de la api en linea :https://auth.book-smart.me/
---

## 📋 **Tabla de Contenidos**
1. [Resumen del Sistema](#resumen-del-sistema)
2. [Tipos de Usuario](#tipos-de-usuario)
3. [Rutas de Autenticación](#rutas-de-autenticación)
4. [Rutas de Registro](#rutas-de-registro)
5. [Sistema de Roles](#sistema-de-roles)
6. [Flujos de Autenticación 2FA](#flujos-de-autenticación-2fa)
7. [Rutas Protegidas](#rutas-protegidas)
8. [Gestión de Tokens](#gestión-de-tokens)
9. [Códigos de Error](#códigos-de-error)
10. [Implementación Frontend](#implementación-frontend)
11. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🎯 **Resumen del Sistema**

La API de Booksmart Auth maneja cuatro tipos de usuarios con diferentes niveles de acceso:

| Rol | Descripción | 2FA Requerido | Rutas Especiales |
|-----|-------------|---------------|------------------|
| **Lector** | Usuario básico | ❌ No | `/auth/usuario/register` |
| **Bibliotecario** | Personal de biblioteca | ✅ Sí | `/bibliotecario/register` |
| **Administrador** | Administrador de biblioteca | ✅ Sí | `/api/auth/admin/register` |
| **SuperAdmin** | Administrador del sistema | ✅ Sí | Solo por seeders |

---

## 👥 **Tipos de Usuario**

### 🔵 **Lector (Rol ID: 1)**
- **Permisos**: Acceso básico a funciones de lectura
- **Login**: Directo sin 2FA
- **Registro**: Público con verificación de email
- **Vinculación**: Debe estar vinculado a una biblioteca

### 🟡 **Bibliotecario (Rol ID: 2)**  
- **Permisos**: Gestión de biblioteca asignada
- **Login**: Requiere código 2FA por email
- **Registro**: Requiere información de biblioteca
- **Vinculación**: Asociado a biblioteca específica

### 🟠 **Administrador (Rol ID: 3)**
- **Permisos**: Administración completa de biblioteca
- **Login**: Requiere código 2FA por email
- **Registro**: Requiere CURP y RFC válidos
- **Vinculación**: Puede gestionar múltiples bibliotecas

### 🔴 **SuperAdmin (Rol ID: 4)**
- **Permisos**: Acceso total al sistema
- **Login**: Requiere código 2FA por email
- **Registro**: Solo por seeders de base de datos
- **Vinculación**: Sin restricciones de biblioteca

---

## 🔑 **Rutas de Autenticación**

### **POST `/auth/login`** o **POST `/api/auth/login`**
**Descripción**: Login universal para todos los tipos de usuario

#### Request:
```json
{
  "correo": "usuario@ejemplo.com",
  "contraseña": "Password123!"
}
```

#### Response para Lector (Login Directo):
```json
{
  "status": "Login exitoso",
  "msg": "Autenticación completada correctamente",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "bearer",
    "expires_at": "2025-08-06T17:30:00.000Z",
    "user": {
      "id": 456,
      "nombre": "María",
      "rol": "Lector",
      "correo": "lector@example.com",
      "bibliotecaId": 1
    },
    "requires_2fa": false
  }
}
```

#### Response para Admin/SuperAdmin (2FA Requerido):
```json
{
  "status": "2FA requerido",
  "msg": "Código de verificación enviado a tu correo electrónico",
  "data": {
    "requires_2fa": true,
    "temp_token": "temp_abc123def456",
    "user_id": 123,
    "user": {
      "id": 123,
      "nombre": "Juan",
      "rol": "Administrador",
      "bibliotecaId": 1
    },
    "email_sent": true,
    "codigo_2fa_debug": "ABCD1234" // Solo en desarrollo
  }
}
```

### **POST `/auth/verify`** o **POST `/api/auth/verify`**
**Descripción**: Verificación del código 2FA para Admin/SuperAdmin

#### Request:
```json
{
  "2fa": "ABCD1234",
  "user_id": 123
}
```

#### Response:
```json
{
  "status": "Código valido",
  "msg": "2FA verificado correctamente",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "bearer",
    "expires_at": "2025-08-06T17:30:00.000Z",
    "user": {
      "id": 123,
      "nombre": "Juan",
      "rol": "Administrador",
      "correo": "admin@example.com"
    }
  }
}
```

---

## 📝 **Rutas de Registro**

### **POST `/api/auth/admin/register`**
**Descripción**: Registro de nuevos administradores

#### Request:
```json
{
  "nombre": "Carlos",
  "apellido": "Rodriguez",
  "correo": "carlos.admin@biblioteca.com",
  "contraseña": "AdminPass123!",
  "curp": "RORC850315HDFRRL01",
  "rfc": "RORC850315ABC"
}
```

#### Response:
```json
{
  "status": "Datos obtenidos",
  "msg": "Administrador registrado correctamente. Se ha enviado un email de verificación.",
  "data": {
    "usuario_id": 17,
    "nombre": "Carlos",
    "correo": "carlos.admin@biblioteca.com",
    "email_sent": true,
    "email_token": "A1B2C3D4E5F6G7H8"
  }
}
```

### **POST `/bibliotecario/register`**
**Descripción**: Registro de nuevos bibliotecarios

#### Request:
```json
{
  "nombre": "Ana",
  "apellido": "Martinez",
  "correo": "ana.bibliotecario@biblioteca.com",
  "contraseña": "BiblioPass123!",
  "Celular": "5551234567",
  "curp": "MARA890420MDFRNR01",
  "rfc": "MARA890420XYZ",
  "Biblioteca_id": 1
}
```

#### Response:
```json
{
  "status": "Datos recibidos",
  "msg": "Bibliotecario registrado correctamente",
  "data": {
    "usuario_id": 18,
    "nombre": "Ana",
    "correo": "ana.bibliotecario@biblioteca.com"
  }
}
```

---

## 🏷️ **Sistema de Roles**

### **Configuración de Roles en el Backend**

```typescript
// Roles que NO requieren 2FA
const rolesWithout2FA = ['Lector']

// Roles que SÍ requieren 2FA
const rolesWith2FA = ['Bibliotecario', 'Administrador', 'SuperAdmin']

// Roles permitidos para login
const allowedRoles = ['Bibliotecario', 'Lector', 'Administrador', 'SuperAdmin']
```

### **IDs de Roles en Base de Datos**
```sql
-- Tabla: roles
1 | Lector
2 | Bibliotecario  
3 | Administrador
4 | SuperAdmin
```

---

## 🔐 **Flujos de Autenticación 2FA**

### **Flujo para Lector (Sin 2FA)**
```
1. POST /auth/login
   ↓
2. Validar credenciales
   ↓
3. Generar JWT inmediatamente
   ↓
4. Retornar token con requires_2fa: false
```

### **Flujo para Admin/SuperAdmin (Con 2FA)**
```
1. POST /auth/login
   ↓
2. Validar credenciales
   ↓
3. Generar código 2FA de 8 dígitos
   ↓
4. Enviar código por email
   ↓
5. Retornar temp_token con requires_2fa: true
   ↓
6. POST /auth/verify con código 2FA
   ↓
7. Validar código
   ↓
8. Generar JWT definitivo
   ↓
9. Retornar token final
```

---

## 🛡️ **Rutas Protegidas**

### **Middleware de Autenticación**
```javascript
// Agregar header en todas las peticiones protegidas
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### **GET `/api/auth/userinfo`**
**Descripción**: Obtener información del usuario autenticado
**Middleware**: `auth:api`

#### Response:
```json
{
  "status": "Usuario obtenido",
  "msg": "Información del usuario recuperada correctamente",
  "data": {
    "id": 123,
    "nombre": "Juan",
    "apellido": "López",
    "correo": "juan.admin@biblioteca.com",
    "rol": "Administrador",
    "bibliotecaId": 1,
    "activo": true
  }
}
```

---

## 🎫 **Gestión de Tokens**

### **POST `/api/auth/refresh`**
**Descripción**: Renovar token JWT

#### Request:
```json
{
  "refresh_token": "refresh_token_aqui"
}
```

### **POST `/api/auth/logout`**
**Descripción**: Cerrar sesión y revocar token

#### Response:
```json
{
  "status": "Logout exitoso",
  "msg": "Sesión cerrada correctamente",
  "data": {
    "user_id": 123,
    "logged_out_at": "2025-08-09T10:30:00.000Z",
    "session_duration": "calculado_en_produccion"
  }
}
```

### **Rutas de Validación para Microservicios**
- **POST `/api/auth/validate`** - Validar token JWT
- **GET `/api/auth/introspect`** - Información del token
- **POST `/api/auth/token/check`** - Verificar estado del token
- **POST `/api/auth/token/revoke`** - Revocar token específico

---

## ⚠️ **Códigos de Error**

### **Autenticación**
| Código | Descripción | HTTP Status |
|--------|-------------|-------------|
| `AUTH_01` | Credenciales inválidas | 401 |
| `AUTH_02` | Correo electrónico no encontrado | 404 |
| `AUTH_03` | Datos con formato inválido | 422 |

### **Registro**
| Código | Descripción | HTTP Status |
|--------|-------------|-------------|
| `REG_01` | Registro exitoso | 201 |
| `REG_02` | Formato de datos incorrecto | 422 |
| `REG_03` | Correo ya registrado | 409 |

### **Verificación 2FA**
| Código | Descripción | HTTP Status |
|--------|-------------|-------------|
| `VER_04` | Código incorrecto o expirado | 401 |
| `VER_05` | Formato de código incorrecto | 401 |
| `VER_07` | Falta user_id | 400 |

### **Generales**
| Código | Descripción | HTTP Status |
|--------|-------------|-------------|
| `ERR_500` | Error interno del servidor | 500 |

---

## 💻 **Implementación Frontend**

### **1. Configuración Base**
```javascript
const API_BASE_URL = 'http://localhost:3333';

const apiClient = {
  async post(endpoint, data, token = null) {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    
    return response.json();
  }
};
```

### **2. Función de Login**
```javascript
async function login(correo, contraseña) {
  try {
    const response = await apiClient.post('/auth/login', {
      correo,
      contraseña
    });
    
    if (response.data.requires_2fa) {
      // Mostrar formulario 2FA
      return {
        step: '2fa_required',
        tempToken: response.data.temp_token,
        userId: response.data.user_id,
        user: response.data.user
      };
    } else {
      // Login completado - guardar token
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
      
      return {
        step: 'completed',
        token: response.data.token,
        user: response.data.user
      };
    }
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}
```

### **3. Función de Verificación 2FA**
```javascript
async function verify2FA(code, userId) {
  try {
    const response = await apiClient.post('/auth/verify', {
      '2fa': code,
      user_id: userId
    });
    
    if (response.status === 'Código valido') {
      // Guardar token definitivo
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
      
      return {
        success: true,
        token: response.data.token,
        user: response.data.user
      };
    }
    
    return { success: false, message: response.msg };
  } catch (error) {
    console.error('Error en 2FA:', error);
    throw error;
  }
}
```

### **4. Componente de Login React/Vue**
```javascript
// Ejemplo React
function LoginComponent() {
  const [step, setStep] = useState('login'); // 'login', '2fa', 'completed'
  const [formData, setFormData] = useState({
    correo: '',
    contraseña: '',
    code2fa: ''
  });
  const [tempData, setTempData] = useState(null);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const result = await login(formData.correo, formData.contraseña);
      
      if (result.step === '2fa_required') {
        setStep('2fa');
        setTempData(result);
      } else {
        setStep('completed');
        // Redirigir a dashboard
        window.location.href = '/dashboard';
      }
    } catch (error) {
      alert('Error en login: ' + error.message);
    }
  };
  
  const handle2FA = async (e) => {
    e.preventDefault();
    
    try {
      const result = await verify2FA(formData.code2fa, tempData.userId);
      
      if (result.success) {
        setStep('completed');
        window.location.href = '/dashboard';
      } else {
        alert('Código incorrecto: ' + result.message);
      }
    } catch (error) {
      alert('Error en 2FA: ' + error.message);
    }
  };
  
  if (step === 'login') {
    return (
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Correo electrónico"
          value={formData.correo}
          onChange={(e) => setFormData({...formData, correo: e.target.value})}
          required 
        />
        <input 
          type="password" 
          placeholder="Contraseña"
          value={formData.contraseña}
          onChange={(e) => setFormData({...formData, contraseña: e.target.value})}
          required 
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
    );
  }
  
  if (step === '2fa') {
    return (
      <form onSubmit={handle2FA}>
        <h3>Verificación 2FA</h3>
        <p>Hemos enviado un código de 8 dígitos a tu correo electrónico</p>
        <input 
          type="text" 
          placeholder="Código de verificación"
          value={formData.code2fa}
          onChange={(e) => setFormData({...formData, code2fa: e.target.value})}
          maxLength={8}
          required 
        />
        <button type="submit">Verificar Código</button>
      </form>
    );
  }
  
  return <div>Login completado, redirigiendo...</div>;
}
```

### **5. Interceptor para Requests Autenticados**
```javascript
// Interceptor automático para agregar token
function setupAuthInterceptor() {
  const originalFetch = window.fetch;
  
  window.fetch = function(url, options = {}) {
    const token = localStorage.getItem('auth_token');
    
    if (token && url.includes('/api/')) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    
    return originalFetch(url, options);
  };
}

// Llamar al cargar la app
setupAuthInterceptor();
```

---

## 🧪 **Ejemplos de Uso**

### **Ejemplo 1: Login de Administrador**
```bash
# 1. Login inicial
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "admin@booksmart.com", 
    "contraseña": "Admin123!"
  }'

# Response: 202 con requires_2fa: true y user_id

# 2. Verificar código 2FA (check email)
curl -X POST http://localhost:3333/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "2fa": "ABCD1234",
    "user_id": 15
  }'

# Response: 200 con token JWT final
```

### **Ejemplo 2: Login de Lector**
```bash
# Login directo sin 2FA
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "lector@biblioteca.com",
    "contraseña": "Lector123!"
  }'

# Response: 200 con token JWT inmediato
```

### **Ejemplo 3: Registro de Admin**
```bash
curl -X POST http://localhost:3333/api/auth/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Carlos",
    "apellido": "Rodriguez",
    "correo": "carlos@biblioteca.com",
    "contraseña": "AdminPass123!",
    "curp": "RORC850315HDFRRL01",
    "rfc": "RORC850315ABC"
  }'
```

### **Ejemplo 4: Acceso a Ruta Protegida**
```bash
curl -X GET http://localhost:3333/api/auth/userinfo \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🔧 **Consideraciones de Desarrollo**

### **Validaciones Frontend**
```javascript
// Validación de formatos antes de enviar
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password) => {
  // Al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(password);
};

const validateCURP = (curp) => {
  return /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$/.test(curp);
};
```

### **Manejo de Errores**
```javascript
function handleApiError(error, response) {
  switch(response.status) {
    case 401:
      // Redirigir a login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
      break;
    case 403:
      alert('No tienes permisos para realizar esta acción');
      break;
    case 422:
      // Mostrar errores de validación
      showValidationErrors(response.data);
      break;
    case 500:
      alert('Error del servidor. Inténtalo más tarde.');
      break;
    default:
      alert('Error inesperado: ' + response.msg);
  }
}
```

### **Estados de Sesión**
```javascript
const SessionManager = {
  isLoggedIn() {
    return localStorage.getItem('auth_token') !== null;
  },
  
  getUser() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },
  
  getUserRole() {
    const user = this.getUser();
    return user ? user.rol : null;
  },
  
  isAdmin() {
    const role = this.getUserRole();
    return ['Administrador', 'SuperAdmin'].includes(role);
  },
  
  requiresAdmin() {
    if (!this.isAdmin()) {
      alert('Acceso denegado: Se requieren permisos de administrador');
      return false;
    }
    return true;
  },
  
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.href = '/login';
  }
};
```

---

## 🚀 **Deploy y Producción**

### **Variables de Entorno**
```bash
# Configuración recomendada para producción
NODE_ENV=production
APP_KEY=tu_clave_secreta_muy_segura
JWT_PRIVATE_KEY=tu_clave_privada_jwt
JWT_PUBLIC_KEY=tu_clave_publica_jwt

# Email (requerido para 2FA)
MAIL_MAILER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password
```

### **Headers CORS**
```javascript
// En producción, configurar CORS específicamente
const corsOptions = {
  origin: ['https://tu-frontend.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

---

## 📞 **Soporte y Contacto**

### **Documentación Adicional**
- `ENDPOINTS_STATUS_FINAL.md` - Estado de todos los endpoints
- `2FA_SELECTIVE_BY_ROLES_GUIDE.md` - Guía detallada de 2FA
- `ADMIN_REGISTER_FIXED.md` - Resolución de problemas de registro

### **Testing**
- Usar archivos en `/testing/` para probar endpoints
- Verificar códigos 2FA en desarrollo en logs del servidor
- Validar tokens JWT en [jwt.io](https://jwt.io)

---

## ✅ **Checklist de Implementación**

### **Frontend**
- [ ] Implementar formulario de login dual (email/password + 2FA)
- [ ] Manejar estados: login → 2FA → dashboard
- [ ] Implementar interceptor de requests autenticados
- [ ] Validar formatos de datos antes de enviar
- [ ] Implementar manejo de errores por código
- [ ] Agregar logout en header/menú
- [ ] Implementar rutas protegidas por rol
- [ ] Mostrar información de usuario logueado

### **Seguridad**
- [ ] Validar tokens en rutas protegidas
- [ ] Implementar refresh de tokens
- [ ] Manejar expiración de sesión
- [ ] Limpiar localStorage en logout
- [ ] Validar permisos por rol antes de acciones
- [ ] Implementar rate limiting en login
- [ ] Logs de accesos y intentos fallidos

### **UX/UI**
- [ ] Indicador visual del rol del usuario
- [ ] Breadcrumbs según permisos
- [ ] Mensajes de error descriptivos
- [ ] Loading states en login y 2FA
- [ ] Feedback visual para códigos 2FA
- [ ] Responsive design para móviles
- [ ] Temas según tipo de usuario

---

**🎉 ¡Tu sistema de autenticación está listo para usar!**

Esta documentación cubre todos los aspectos necesarios para implementar el manejo de rutas para administradores y super administradores en tu aplicación web. El sistema es robusto, seguro y escalable.
