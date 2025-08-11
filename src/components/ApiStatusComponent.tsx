/**
 * Componente para mostrar el estado de conectividad con las APIs
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Alert,
  AlertTitle,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { businessApi } from '../services/businessApi';
import { authApi } from '../services/api';

interface ConnectionStatus {
  service: string;
  status: 'connected' | 'error' | 'checking';
  message: string;
  details?: string;
}

export const ApiStatusComponent: React.FC = () => {
  const [statuses, setStatuses] = useState<ConnectionStatus[]>([
    { service: 'API Auth', status: 'checking', message: 'Verificando...' },
    { service: 'API Business', status: 'checking', message: 'Verificando...' },
  ]);
  const [expanded, setExpanded] = useState(false);

  const checkApiStatus = async () => {
    setStatuses(prev => prev.map(s => ({ ...s, status: 'checking' as const, message: 'Verificando...' })));

    // Verificar API Auth
    try {
      if (authApi.isAuthenticated()) {
        await authApi.getUserInfo();
        setStatuses(prev => prev.map(s => 
          s.service === 'API Auth' 
            ? { ...s, status: 'connected', message: 'Conectado y autenticado' }
            : s
        ));
      } else {
        setStatuses(prev => prev.map(s => 
          s.service === 'API Auth' 
            ? { ...s, status: 'error', message: 'No autenticado' }
            : s
        ));
      }
    } catch (error) {
      setStatuses(prev => prev.map(s => 
        s.service === 'API Auth' 
          ? { ...s, status: 'error', message: 'Error de conexión', details: String(error) }
          : s
      ));
    }

    // Verificar API Business
    try {
      await businessApi.healthCheck();
      setStatuses(prev => prev.map(s => 
        s.service === 'API Business' 
          ? { ...s, status: 'connected', message: 'Conectado correctamente' }
          : s
      ));
    } catch (error) {
      setStatuses(prev => prev.map(s => 
        s.service === 'API Business' 
          ? { 
              ...s, 
              status: 'error', 
              message: 'Error de conexión o CORS', 
              details: `${error}. Verifica que el servidor esté ejecutándose en el puerto correcto.`
            }
          : s
      ));
    }
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  const getStatusIcon = (status: ConnectionStatus['status']) => {
    switch (status) {
      case 'connected':
        return <CheckIcon sx={{ color: 'success.main' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
      case 'checking':
      default:
        return <WarningIcon sx={{ color: 'warning.main' }} />;
    }
  };

  const getStatusColor = (status: ConnectionStatus['status']) => {
    switch (status) {
      case 'connected':
        return 'success';
      case 'error':
        return 'error';
      case 'checking':
      default:
        return 'warning';
    }
  };

  const hasErrors = statuses.some(s => s.status === 'error');
  const allConnected = statuses.every(s => s.status === 'connected');

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Estado de Conectividad APIs
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              size="small"
              startIcon={<RefreshIcon />}
              onClick={checkApiStatus}
              variant="outlined"
            >
              Verificar
            </Button>
            <IconButton
              onClick={() => setExpanded(!expanded)}
              size="small"
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Resumen de estado */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {statuses.map((status) => (
            <Chip
              key={status.service}
              icon={getStatusIcon(status.status)}
              label={`${status.service}: ${status.message}`}
              color={getStatusColor(status.status)}
              variant="outlined"
              size="small"
            />
          ))}
        </Box>

        {/* Alertas */}
        {hasErrors && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Problemas de Conectividad</AlertTitle>
            Hay problemas con una o más APIs. Esto puede afectar la funcionalidad de la aplicación.
          </Alert>
        )}

        {allConnected && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <AlertTitle>Todo Conectado</AlertTitle>
            Todas las APIs están funcionando correctamente.
          </Alert>
        )}

        {/* Detalles expandibles */}
        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Configuración de URLs:
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              • API Auth: {import.meta.env.VITE_API_URL}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              • API Business: {import.meta.env.VITE_BUSINESS_API_URL}
            </Typography>

            {statuses.some(s => s.details) && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>
                  Detalles de Errores:
                </Typography>
                {statuses.filter(s => s.details).map((status) => (
                  <Alert key={status.service} severity="info" sx={{ mt: 1 }}>
                    <strong>{status.service}:</strong> {status.details}
                  </Alert>
                ))}
              </>
            )}

            <Alert severity="info" sx={{ mt: 2 }}>
              <AlertTitle>Solución para errores de CORS</AlertTitle>
              <Typography variant="body2">
                Si ves errores de CORS, verifica que:
              </Typography>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>El servidor API Business esté ejecutándose</li>
                <li>La configuración de proxy en vite.config.ts esté correcta</li>
                <li>Las URLs en .env estén configuradas para usar el proxy local</li>
              </ul>
            </Alert>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};
