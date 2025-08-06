import '@fontsource/league-spartan/400.css';
import '@fontsource/league-spartan/500.css';
import '@fontsource/rowdies/400.css';
import { Box, Typography } from '@mui/material';
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actionButton?: React.ReactNode;
  children?: React.ReactNode; // Para filtros y controles adicionales
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actionButton,
  children
}) => {
  return (
    <Box
      sx={{
        padding: { xs: '16px 8px', sm: '20px 12px', md: '24px 16px' },
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        maxWidth: { lg: '1200px', xl: '1400px' },
        margin: '0 auto',
        boxSizing: 'border-box'
      }}
    >
      {/* Título */}
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '28px', sm: '40px', md: '56px' },
          fontWeight: 400,
          color: '#453726',
          fontFamily: 'Rowdies, sans-serif',
          marginBottom: { xs: '12px', sm: '16px', md: '20px' },
          width: '100%',
          maxWidth: '100%',
          lineHeight: { xs: '32px', sm: '44px', md: '60px' },
          letterSpacing: '0.1px',
          wordWrap: 'break-word',
          overflow: 'hidden',
          textAlign: { xs: 'center', md: 'left' }
        }}
      >
        {title}
      </Typography>

      {/* Contenedor para Subtítulo y Botón */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: { xs: 'center', md: 'space-between' },
          alignItems: { xs: 'center', md: 'center' },
          width: '100%',
          marginBottom: { xs: '8px', sm: '10px', md: '12px' },
          gap: { xs: 2, md: 0 }
        }}
      >
        {/* Subtítulo */}
        <Typography
          variant="subtitle1"
          sx={{
            fontSize: { xs: '16px', sm: '18px', md: '20px' },
            color: '#4B453D',
            fontWeight: 400,
            fontFamily: 'League Spartan, sans-serif',
            lineHeight: { xs: '22px', sm: '24px', md: '26px' },
            letterSpacing: '0.1px',
            wordWrap: 'break-word',
            overflow: 'hidden',
            textAlign: { xs: 'center', md: 'left' },
            flex: 1
          }}
        >
          {subtitle}
        </Typography>

        {/* Botón de acción (si se proporciona) */}
        {actionButton}
      </Box>

      {/* Línea divisoria */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '100%',
          height: 0,
          borderTop: '3px solid #3A332A',
          marginBottom: { xs: '8px', sm: '10px' },
          boxSizing: 'border-box'
        }}
      />

      {/* Controles adicionales (filtros, búsqueda, etc.) */}
      {children}
    </Box>
  );
};

export default PageHeader;
