# 🔐 Implementación de API de Autenticación - BookSmart Admin

## 📋 Resumen de la Implementación

Se ha implementado la integración completa con la API de autenticación de BookSmart para administradores y super administradores, siguiendo la documentación del archivo `ADMIN_SUPERADMIN_ROUTES_GUIDE.md`.

## 🚀 Características Implementadas

### ✅ **Servicio de API** (`src/services/api.ts`)
- Cliente HTTP configurado para `https://auth.book-smart.me`
- Manejo automático de tokens JWT
- Tipos TypeScript para todas las respuestas de la API
- Manejo centralizado de errores
- Funciones para todos los endpoints necesarios

### ✅ **Store Actualizado** (`src/store/appStore.ts`)
- Integración completa con la API real
- Manejo de autenticación 2FA
- Estado temporal para el proceso de verificación
- Notificaciones automáticas de éxito/error
- Limpieza automática de tokens en logout

### ✅ **Hooks de Autenticación** (`src/hooks/useAuth.ts`)
- Inicialización automática de autenticación al cargar la app
- Validación automática de tokens existentes
- Renovación automática de tokens cada 15 minutos
- Recuperación de información del usuario logueado

### ✅ **Componentes Actualizados**
- **LoginForm**: Uso de validaciones centralizadas
- **VerifyTwoFA**: Integración con API real para códigos 2FA
- **Register**: Proceso de registro para administradores

### ✅ **Configuración de Entorno**
- Variables de entorno para configurar la URL de la API
- Configuración de desarrollo y producción

## 🔧 Configuración

### 1. **Variables de Entorno**

Asegúrate de que el archivo `.env` tenga la configuración correcta:

```env
# Configuración de la API de Booksmart Auth
VITE_API_URL=https://auth.book-smart.me

# Para desarrollo local, cambia a:
# VITE_API_URL=http://localhost:3333

# Configuración de la aplicación
VITE_APP_NAME=BookSmart Admin
VITE_APP_VERSION=1.0.0

# Configuración de debug (solo para desarrollo)
VITE_DEBUG_MODE=false
VITE_SHOW_2FA_DEBUG=false
```

### 2. **Configuración de CORS**

La API debe permitir requests desde tu dominio frontend. Asegúrate de que la API tenga configurado CORS correctamente.

## 📱 Flujo de Autenticación Implementado

### 1. **Login de Administrador/Super Admin**
```
Usuario ingresa credenciales → API valida → Envía código 2FA por email → Usuario ingresa código → Autenticación completa
```

### 2. **Proceso 2FA**
- El código debe tener exactamente 8 caracteres alfanuméricos
- Se envía automáticamente por email
- Validación en tiempo real del formato

### 3. **Gestión de Sesión**
- Tokens JWT guardados automáticamente en localStorage
- Renovación automática cada 15 minutos
- Logout limpia tokens tanto local como en servidor

## 🎯 Endpoints Utilizados

### **Autenticación**
- `POST /auth/login` - Login inicial
- `POST /auth/verify` - Verificación 2FA
- `POST /api/auth/logout` - Cerrar sesión

### **Registro**
- `POST /api/auth/admin/register` - Registro de administradores
- `POST /bibliotecario/register` - Registro de bibliotecarios

### **Información de Usuario**
- `GET /api/auth/userinfo` - Información del usuario autenticado
- `POST /api/auth/refresh` - Renovar token

## 🔍 Manejo de Errores

### **Códigos de Error Manejados**
- `AUTH_01` - Credenciales inválidas
- `AUTH_02` - Correo electrónico no encontrado
- `VER_04` - Código 2FA incorrecto o expirado
- `REG_03` - Correo ya registrado
- `ERR_500` - Error interno del servidor

### **Notificaciones Automáticas**
- Éxito: Login completado, 2FA verificado, registro exitoso
- Error: Credenciales incorrectas, código 2FA inválido, errores de registro

## 🧪 Testing

### **Credenciales de Prueba**
Según la documentación, deberías usar:
- **Admin**: `admin@booksmart.com` / `Admin123!`
- **Super Admin**: `superadmin@booksmart.com` / `SuperAdmin123!`

### **Código 2FA de Desarrollo**
En desarrollo, el código 2FA aparece en los logs del servidor o usa el código de desarrollo: `Dev123!`

## 📚 Validaciones Implementadas

### **Formato de Email**
- Validación con regex estándar
- Mensajes de error descriptivos

### **Contraseña**
- Mínimo 8 caracteres
- Al menos 1 mayúscula, 1 minúscula, 1 número

### **Código 2FA**
- Exactamente 8 caracteres
- Debe incluir: minúscula, mayúscula, número y carácter especial ($@$!%*?&)
- Formato ejemplo: `Ab1$Cd2!`

### **CURP y RFC**
- Validación con patrones mexicanos estándar
- Requeridos para registro de administradores

## 🚨 Seguridad

### **Tokens JWT**
- Almacenados en localStorage (considera httpOnly cookies para producción)
- Renovación automática antes de expiración
- Limpieza automática en logout/error

### **Autenticación 2FA**
- Obligatoria para administradores y super administradores
- Códigos de un solo uso
- Expiración automática

### **Validación de Roles**
- Verificación tanto en frontend como backend
- Rutas protegidas por rol
- Redirección automática según permisos

## 🔄 Estados de Carga

### **Indicadores Visuales**
- Loading spinners en botones durante requests
- Deshabilitación de formularios durante envío
- Feedback inmediato en todas las acciones

### **Manejo de Estados**
- `authLoading` - Estado de carga de autenticación
- `authError` - Errores de autenticación
- `isAuthenticated` - Estado de autenticación
- `currentUser` - Información del usuario actual
- `tempAuthData` - Datos temporales durante 2FA

## 📋 Checklist de Verificación

### ✅ **Implementación Completa**
- [ ] Login con email/password funciona
- [ ] Redirección a 2FA cuando es requerido
- [ ] Verificación de código 2FA funciona
- [ ] Registro de administradores funciona
- [ ] Logout limpia sesión correctamente
- [ ] Renovación automática de tokens
- [ ] Validación de permisos por rol
- [ ] Manejo de errores de red
- [ ] Notificaciones de éxito/error
- [ ] Persistencia de sesión al recargar página

### 🔧 **Configuración de Producción**
- [ ] Variable VITE_API_URL configurada
- [ ] CORS configurado en la API
- [ ] HTTPS habilitado
- [ ] Logs de error configurados
- [ ] Monitoreo de API implementado

## 🆘 Solución de Problemas

### **Error de CORS**
```
Access to fetch at 'https://auth.book-smart.me' from origin 'http://localhost:5173' has been blocked by CORS policy
```
**Solución**: Contactar al equipo de backend para agregar tu dominio a la configuración CORS.

### **Token Expirado**
```
401 Unauthorized
```
**Solución**: El sistema renueva automáticamente. Si persiste, hacer logout/login.

### **Código 2FA Inválido**
```
VER_04: Código incorrecto o expirado
```
**Solución**: Verificar email, usar código de 8 caracteres exactos.

### **Error de Red**
```
NETWORK_ERROR: Error de conexión con el servidor
```
**Solución**: Verificar conexión a internet y estado de la API.

## 📞 Soporte

### **Documentación Adicional**
- `ADMIN_SUPERADMIN_ROUTES_GUIDE.md` - Guía completa de la API
- `src/services/api.ts` - Código del cliente API
- `src/store/appStore.ts` - Lógica de estado de autenticación

### **Contacto**
Para problemas con la API de backend, contactar al equipo de desarrollo de la API BookSmart Auth.

---

## 🎉 **¡Implementación Completada!**

La integración con la API de autenticación está completamente implementada y lista para usar. El sistema maneja automáticamente:

- ✅ Login con 2FA para administradores
- ✅ Registro de nuevos administradores
- ✅ Gestión de sesiones y tokens
- ✅ Validaciones y manejo de errores
- ✅ Notificaciones de usuario
- ✅ Persistencia de sesión

**Next Steps**: Probar en el entorno de desarrollo y luego desplegar a producción con la configuración correcta de variables de entorno.
