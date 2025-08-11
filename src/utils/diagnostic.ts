/**
 * Utilidad para diagnosticar problemas de conectividad con la API
 */

import { authApi } from '../services/api';

export const diagnosticAPI = {
  /**
   * Prueba básica de conectividad
   */
  async testConnection() {
    console.log('🔍 Iniciando diagnóstico de API...');
    
    try {
      // Test 1: Verificar si la URL base está configurada
      console.log('📋 URL de API configurada:', import.meta.env.VITE_API_URL || 'No configurada');
      
      // Test 2: Probar connectivity básica
      const response = await fetch('https://auth.book-smart.me/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: 'test@test.com',
          contraseña: 'test123'
        })
      });
      
      const data = await response.json();
      console.log('✅ Conectividad con API: OK');
      console.log('📊 Respuesta de prueba:', data);
      
      return {
        success: true,
        message: 'API accesible',
        details: data
      };
      
    } catch (error) {
      console.error('❌ Error de conectividad:', error);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return {
          success: false,
          message: 'Error de CORS o conectividad',
          details: 'La API está bloqueada por CORS o no es accesible desde este dominio'
        };
      }
      
      return {
        success: false,
        message: 'Error desconocido',
        details: error instanceof Error ? error.message : String(error)
      };
    }
  },

  /**
   * Prueba de login con credenciales de desarrollo
   */
  async testLogin() {
    console.log('🔐 Probando login...');
    
    const credentials = [
      { email: 'admin@booksmart.com', password: 'Admin123!' },
      { email: 'superadmin@booksmart.com', password: 'SuperAdmin123!' },
    ];

    const endpoints = [
      '/auth/login',      // Endpoint para bibliotecarios
      '/api/auth/login',  // Endpoint para administradores (según documentación)
    ];
    
    for (const endpoint of endpoints) {
      console.log(`🌐 Probando endpoint: ${endpoint}`);
      
      for (const cred of credentials) {
        try {
          console.log(`🧪 Probando: ${cred.email} / ${cred.password} en ${endpoint}`);
          
          // Hacer request directo para probar diferentes endpoints
          const response = await fetch(`https://auth.book-smart.me${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              correo: cred.email,
              contraseña: cred.password
            })
          });
          
          const data = await response.json();
          
          if (response.ok) {
            console.log(`✅ Login exitoso en ${endpoint} con:`, cred.email);
            console.log('📊 Resultado:', data);
            return { success: true, data, credentials: cred, endpoint };
          } else {
            console.log(`❌ Falló ${cred.email} en ${endpoint}:`, data.msg);
          }
          
        } catch (error) {
          console.log(`❌ Error de red en ${endpoint}:`, error);
        }
      }
    }
    
    return { success: false, message: 'Todas las combinaciones fallaron' };
  },

  /**
   * Información del entorno
   */
  getEnvironmentInfo() {
    return {
      apiUrl: import.meta.env.VITE_API_URL,
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
      userAgent: navigator.userAgent,
      location: window.location.origin,
      newTwoFAFormat: 'Código 2FA debe ser 8 caracteres con: minúscula, mayúscula, número y carácter especial ($@$!%*?&)',
      devCode: 'Dev123! (para desarrollo)'
    };
  }
};

// Función de conveniencia para usar en la consola del navegador
(window as any).diagnosticAPI = diagnosticAPI;
