import { useState, useCallback } from 'react';
import type { NotificationData } from '../components/NotificationDialog';

interface ApiResponse {
  status: string;
  msg: string;
  data?: any;
}

interface UseNotificationReturn {
  notification: NotificationData | null;
  isNotificationOpen: boolean;
  showNotification: (notification: NotificationData) => void;
  showSuccessNotification: (title: string, message: string, buttonText?: string) => void;
  showErrorNotification: (title: string, message: string, details?: Record<string, string>) => void;
  handleApiResponse: (response: ApiResponse, successTitle?: string) => void;
  closeNotification: () => void;
}

export const useNotification = (): UseNotificationReturn => {
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const showNotification = useCallback((notificationData: NotificationData) => {
    setNotification(notificationData);
    setIsNotificationOpen(true);
  }, []);

  const closeNotification = useCallback(() => {
    setIsNotificationOpen(false);
    // Clear notification after animation
    setTimeout(() => setNotification(null), 300);
  }, []);

  const showSuccessNotification = useCallback((
    title: string,
    message: string,
    buttonText: string = 'Aceptar'
  ) => {
    showNotification({
      type: 'success',
      title,
      message,
      buttonText,
    });
  }, [showNotification]);

  const showErrorNotification = useCallback((
    title: string,
    message: string,
    details?: Record<string, string>
  ) => {
    showNotification({
      type: 'error',
      title,
      message,
      details,
      showCloseButton: true,
    });
  }, [showNotification]);

  // Handle API responses automatically
  const handleApiResponse = useCallback((
    response: ApiResponse,
    successTitle: string = 'Operación exitosa'
  ) => {
    const { status, msg, data } = response;

    // Success responses
    if (status.includes('exitoso') || status.includes('éxito') || status.includes('success')) {
      showSuccessNotification(successTitle, msg);
      return;
    }

    // Conflict responses (business logic errors) - Usar error en lugar de warning
    if (status.includes('Conflicto') || status.includes('conflict')) {
      showErrorNotification('Conflicto', msg);
      return;
    }

    // Data validation errors
    if (status.includes('Error en los datos') || status.includes('validation')) {
      const fieldErrors = data && typeof data === 'object' ? data : undefined;
      showErrorNotification('Error en los datos', msg, fieldErrors);
      return;
    }

    // Generic errors
    showErrorNotification('Error', msg || 'Ha ocurrido un error inesperado');
  }, [showSuccessNotification, showErrorNotification]);

  return {
    notification,
    isNotificationOpen,
    showNotification,
    showSuccessNotification,
    showErrorNotification,
    handleApiResponse,
    closeNotification,
  };
};
