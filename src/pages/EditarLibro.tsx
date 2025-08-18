import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import LibroForm from '../components/LibroForm';
import { type PosicionLibroFormData } from '../utils/validation';
import { type Libro } from '../types';

const EditarLibro: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getLibroById, 
    assignLibroToEstante, 
    libroLoading, 
    libroError 
  } = useAppStore();

  const [libro, setLibro] = useState<Libro | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLibro = async () => {
      if (id) {
        setLoading(true);
        try {
          const libroData = await getLibroById(parseInt(id));
          setLibro(libroData);
          if (!libroData) {
            // Si no se encuentra el libro, redirigir a la lista
            navigate('/libros');
          }
        } catch (error) {
          console.error('Error al cargar libro:', error);
          navigate('/libros');
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/libros');
      }
    };

    loadLibro();
  }, [id, getLibroById, navigate]);

  const handleSubmit = async (data: PosicionLibroFormData) => {
    if (id && libro) {
      try {
        // Actualizar la posición del libro usando la nueva función
        await assignLibroToEstante({
          libro_id: parseInt(id),
          estante: data.estante,
          etiqueta: data.etiqueta,
          fila: data.fila,
          columna: data.columna
        });
        navigate('/libros');
      } catch (error) {
        console.error('Error al actualizar posición del libro:', error);
        // El error se maneja automáticamente en el store
      }
    }
  };

  if (loading || libroLoading) {
    return <div>Cargando...</div>; // O un componente de loading más elaborado
  }

  if (!id || !libro) {
    return null; // Ya se redirige en el useEffect
  }

  return (
    <LibroForm
      onSubmit={handleSubmit}
      initialData={libro}
      loading={libroLoading}
      error={libroError}
      isEditing={true}
    />
  );
};

export default EditarLibro;
