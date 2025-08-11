import React from 'react';
import {
  Dialog,
  Box,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Close,
} from '@mui/icons-material';

export type NotificationType = 'success' | 'error';

export interface NotificationData {
  type: NotificationType;
  title: string;
  message: string;
  details?: Record<string, string>; // For field-specific errors
  buttonText?: string;
  showCloseButton?: boolean;
}

interface NotificationDialogProps {
  open: boolean;
  notification: NotificationData | null;
  onClose: () => void;
  onAction?: () => void;
}

const getNotificationConfig = (type: NotificationType) => {
  const configs = {
    success: {
      icon: CheckCircle,
      iconColor: '#fff9ec',
      backgroundColor: '#2F5233',
      buttonColor: '#8E9775',
      buttonTextColor: '#fff9ec',
    },
    error: {
      icon: Error,
      iconColor: '#ffffff',
      backgroundColor: '#453726',
      buttonColor: '#A47149',
      buttonTextColor: '#ffffff',
    },
  };

  return configs[type];
};

const NotificationDialog: React.FC<NotificationDialogProps> = ({
  open,
  notification,
  onClose,
  onAction,
}) => {
  if (!notification) return null;

  const config = getNotificationConfig(notification.type);
  const IconComponent = config.icon;

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          overflow: 'visible',
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
      }}
    >
      <Box
        sx={{
          backgroundColor: config.backgroundColor,
          borderRadius: '28px',
          maxWidth: 560,
          minWidth: 280,
          width: 329,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Close button (optional) */}
        {notification.showCloseButton && (
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: config.iconColor,
              zIndex: 1,
            }}
          >
            <Close />
          </IconButton>
        )}

        {/* Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 3,
            gap: 2,
          }}
        >
          {/* Icon */}
          <IconComponent
            sx={{
              fontSize: 24,
              color: config.iconColor,
            }}
          />

          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'League Spartan', sans-serif",
              fontWeight: 500,
              fontSize: '24px',
              color: config.iconColor,
              textAlign: 'center',
              lineHeight: '32px',
            }}
          >
            {notification.title}
          </Typography>

          {/* Message */}
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'League Spartan', sans-serif",
              fontWeight: 400,
              fontSize: '16px',
              color: config.iconColor,
              textAlign: 'center',
              lineHeight: '20px',
              letterSpacing: '0.25px',
            }}
          >
            {notification.message}
          </Typography>

          {/* Field-specific errors (if any) */}
          {notification.details && Object.keys(notification.details).length > 0 && (
            <Box sx={{ width: '100%', mt: 1 }}>
              {Object.entries(notification.details).map(([field, error]) => (
                <Typography
                  key={field}
                  variant="caption"
                  sx={{
                    fontFamily: "'League Spartan', sans-serif",
                    fontWeight: 400,
                    fontSize: '14px',
                    color: config.iconColor,
                    display: 'block',
                    textAlign: 'center',
                    lineHeight: '18px',
                    opacity: 0.8,
                  }}
                >
                  <strong>{field}:</strong> {Array.isArray(error) ? error.join(', ') : String(error)}
                </Typography>
              ))}
            </Box>
          )}
        </Box>

        {/* Action Button */}
        <Box
          sx={{
            backgroundColor: config.buttonColor,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 1.5,
          }}
        >
          <Button
            onClick={handleAction}
            sx={{
              fontFamily: "'League Spartan', sans-serif",
              fontWeight: 600,
              fontSize: '20px',
              color: config.buttonTextColor,
              textTransform: 'none',
              letterSpacing: '0.1px',
              lineHeight: '20px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '100px',
              px: 2,
              py: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {notification.buttonText || 'Aceptar'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default NotificationDialog;
