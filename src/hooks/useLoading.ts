import { useState } from 'react';

export interface UseLoadingReturn {
  /** Estado de loading */
  loading: boolean;
  /** Mensaje actual */
  message: string;
  /** Iniciar loading con mensaje opcional */
  startLoading: (message?: string) => void;
  /** Parar loading */
  stopLoading: () => void;
  /** Actualizar solo el mensaje */
  setMessage: (message: string) => void;
}

export const useLoading = (initialMessage: string = 'Cargando...'): UseLoadingReturn => {
  const [loading, setLoading] = useState(false);
  const [message, setMessageState] = useState(initialMessage);

  const startLoading = (newMessage?: string) => {
    if (newMessage) {
      setMessageState(newMessage);
    }
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const setMessage = (newMessage: string) => {
    setMessageState(newMessage);
  };

  return {
    loading,
    message,
    startLoading,
    stopLoading,
    setMessage
  };
};
