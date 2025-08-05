import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import LibroForm from '../components/LibroForm';

interface PosicionLibroData {
  estante: string;
  etiqueta: string;
  fila: string;
  columna: string;
}

const EditarLibro: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getLibroById, 
    updateLibro, 
    libroLoading, 
    libroError 
  } = useAppStore();

  const libro = id ? getLibroById(parseInt(id)) : undefined;

  useEffect(() => {
    if (id && !libro) {
      // Si no se encuentra el libro, redirigir a la lista
      navigate('/libros');
    }
  }, [id, libro, navigate]);

  const handleSubmit = (data: PosicionLibroData) => {
    if (id && libro) {
      // Solo actualizamos los campos de posición
      updateLibro(parseInt(id), {
        estante: data.estante,
        fila: data.fila,
        columna: data.columna,
        ubicacion: `${data.estante}-${data.fila}-${data.columna}` // Generar ubicación combinada
      });
      navigate('/libros');
    }
  };

  if (!id || !libro) {
    return null; // O un componente de loading/error
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
