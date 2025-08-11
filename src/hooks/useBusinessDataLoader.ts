/**
 * Hook para cargar datos iniciales desde la API Business
 * Se ejecuta automáticamente cuando el usuario se autentica
 */

import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';

export const useBusinessDataLoader = () => {
  const {
    isAuthenticated,
    currentUser,
    loadBibliotecas,
    loadEstantes,
    loadLibros,
    bibliotecaLoading,
    estanteLoading,
    libroLoading,
  } = useAppStore();

  // Cargar datos cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadInitialData();
    }
  }, [isAuthenticated, currentUser?.id]);

  const loadInitialData = async () => {
    console.log('🔄 Iniciando carga de datos de negocio...');
    
    try {
      // Cargar bibliotecas primero
      console.log('📚 Cargando bibliotecas...');
      await loadBibliotecas();
      console.log('✅ Bibliotecas cargadas exitosamente');
      
      // Si el usuario tiene una biblioteca asignada, cargar sus estantes y libros
      if (currentUser?.bibliotecaId) {
        console.log(`🏢 Cargando datos para biblioteca ${currentUser.bibliotecaId}...`);
        await Promise.allSettled([
          loadEstantes(currentUser.bibliotecaId),
          loadLibros(currentUser.bibliotecaId),
        ]);
      } else {
        // Si es super admin sin biblioteca específica, cargar todos los datos
        console.log('👑 Super admin - cargando todos los datos...');
        await Promise.allSettled([
          loadEstantes(),
          loadLibros(),
        ]);
      }
      console.log('✅ Carga inicial completada');
    } catch (error) {
      console.error('❌ Error loading initial business data:', error);
      // No re-lanzar el error para evitar romper la aplicación
      // Los errores específicos se manejan en cada acción del store
    }
  };

  const refreshData = async () => {
    await loadInitialData();
  };

  const refreshBibliotecaData = async (bibliotecaId?: number) => {
    try {
      const targetBibliotecaId = bibliotecaId || currentUser?.bibliotecaId;
      if (targetBibliotecaId) {
        await Promise.all([
          loadEstantes(targetBibliotecaId),
          loadLibros(targetBibliotecaId),
        ]);
      }
    } catch (error) {
      console.error('Error refreshing biblioteca data:', error);
    }
  };

  return {
    isLoading: bibliotecaLoading || estanteLoading || libroLoading,
    refreshData,
    refreshBibliotecaData,
  };
};
