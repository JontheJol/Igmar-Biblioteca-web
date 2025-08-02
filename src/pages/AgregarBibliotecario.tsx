import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import BibliotecarioForm from '../components/BibliotecarioForm';
import type { BibliotecarioFormData } from '../utils/validation';

const AgregarBibliotecario: React.FC = () => {
  const navigate = useNavigate();
  const { addBibliotecario, bibliotecarioLoading, bibliotecarioError } = useAppStore();

  const handleSubmit = (data: BibliotecarioFormData) => {
    addBibliotecario(data);
    // Navigate back to the bibliotecarios list after successful addition
    navigate('/bibliotecarios');
  };

  return (
    <BibliotecarioForm
      title="Agregar Bibliotecario"
      onSubmit={handleSubmit}
      error={bibliotecarioError}
      loading={bibliotecarioLoading}
    />
  );
};

export default AgregarBibliotecario;
