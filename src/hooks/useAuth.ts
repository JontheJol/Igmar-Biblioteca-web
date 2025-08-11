import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { authApi } from '../services/api';

/**
 * Hook para inicializar la autenticación al cargar la aplicación
 * Verifica si hay un token válido y obtiene información del usuario
 */
export const useAuthInitialization = () => {
  const { setAuthLoading, setAuthError, currentUser } = useAppStore();

  useEffect(() => {
    const initializeAuth = async () => {
      // Solo verificar si no hay usuario actual y hay token en localStorage
      if (!currentUser && authApi.isAuthenticated()) {
        setAuthLoading(true);
        setAuthError(null);

        try {
          // Verificar si el token es válido obteniendo información del usuario
          const isValid = await authApi.validateToken();
          
          if (isValid) {
            // Si el token es válido, obtener información del usuario
            const userInfo = await authApi.getUserInfo();
            
            // Determinar el rol basado en la respuesta de la API
            const roleId = userInfo.rol === 'SuperAdmin' ? 4 : 3;
            const roleName = userInfo.rol === 'SuperAdmin' ? 'Super Administrador' : 'Administrador';
            
            useAppStore.setState({
              isAuthenticated: true,
              currentUser: {
                id: userInfo.id,
                name: `${userInfo.nombre} ${userInfo.apellido}`,
                email: userInfo.correo,
                roleId,
                roleName,
                bibliotecaId: userInfo.bibliotecaId,
              },
              authLoading: false,
              authError: null,
            });
          }
        } catch (error) {
          // Token inválido o error de red
          console.log('Token inválido o error de verificación:', error);
          setAuthError(null); // No mostrar error en carga inicial
        } finally {
          setAuthLoading(false);
        }
      }
    };

    initializeAuth();
  }, [currentUser, setAuthLoading, setAuthError]);
};

/**
 * Hook para manejar la renovación automática de tokens
 */
export const useTokenRefresh = () => {
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      if (authApi.isAuthenticated()) {
        try {
          await authApi.refreshToken();
        } catch (error) {
          console.log('Error al renovar token:', error);
          // El token será removido automáticamente por validateToken
          useAppStore.getState().logout();
        }
      }
    }, 15 * 60 * 1000); // Renovar cada 15 minutos

    return () => clearInterval(refreshInterval);
  }, []);
};
