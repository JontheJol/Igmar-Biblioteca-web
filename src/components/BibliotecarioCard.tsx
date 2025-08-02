import '@fontsource/league-spartan/400.css';
import '@fontsource/league-spartan/500.css';
import {
  Box,
  Card,
  Typography,
  Avatar
} from '@mui/material';
import React from 'react';
import { Edit } from 'iconoir-react';
import type { Bibliotecario } from '../types';

interface BibliotecarioCardProps {
  bibliotecario: Bibliotecario;
  onEdit: (id: number) => void;
}

const BibliotecarioCard: React.FC<BibliotecarioCardProps> = ({
  bibliotecario,
  onEdit
}) => {
  return (
    <Card
      sx={{
        backgroundColor: '#fef7ff',
        borderRadius: '10px',
        padding: { xs: '8px 12px', sm: '12px 16px', md: '16px 20px' },
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'center', sm: 'center' },
        gap: { xs: '8px', sm: '12px', md: '16px' },
        height: { xs: 'auto', sm: '120px', md: '143px' },
        minHeight: { xs: '140px', sm: 'auto' },
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        width: '100%',
        maxWidth: { xs: '100%', sm: '750px', md: '818px' }, // Ancho consistente
        margin: '0 auto', // Centrado dentro del contenedor
        border: 'none',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#faf4ff',
          transform: 'translateY(-1px)',
          boxShadow: '0px 6px 8px 0px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          width: { xs: 56, sm: 60, md: 68 },
          height: { xs: 56, sm: 60, md: 68 },
          backgroundColor: '#ece6f0',
          borderRadius: '8px',
          flexShrink: 0,
          fontSize: { xs: '20px', sm: '22px', md: '24px' },
          color: '#8b5e3c',
          fontFamily: 'League Spartan',
          fontWeight: 500,
          '& .MuiAvatar-img': {
            borderRadius: '8px'
          }
        }}
        src={bibliotecario.avatar}
      >
        {/* Show first letter of name if no avatar */}
        {bibliotecario.nombre.charAt(0).toUpperCase()}
      </Avatar>

      {/* Information */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: { xs: '2px', sm: '3px', md: '4px' },
          minWidth: 0,
          height: '100%',
          paddingY: { xs: '4px', sm: '8px', md: '12px' },
          textAlign: { xs: 'center', sm: 'left' },
          width: { xs: '100%', sm: 'auto' }
        }}
      >
        <Typography
          sx={{
            fontFamily: 'League Spartan',
            fontWeight: 400,
            fontSize: { xs: '16px', sm: '18px', md: '20px' },
            color: '#000000',
            letterSpacing: '0.1px',
            lineHeight: '20px',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}
        >
          {bibliotecario.nombre}
        </Typography>
        
        <Typography
          sx={{
            fontFamily: 'League Spartan',
            fontWeight: 400,
            fontSize: { xs: '12px', sm: '14px', md: '15px' },
            color: '#4b453d',
            letterSpacing: '0.1px',
            lineHeight: '20px',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}
        >
          {bibliotecario.correo}
        </Typography>
        
        <Typography
          sx={{
            fontFamily: 'League Spartan',
            fontWeight: 400,
            fontSize: { xs: '12px', sm: '14px', md: '15px' },
            color: '#8d8d8d',
            letterSpacing: '0.1px',
            lineHeight: '20px',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}
        >
          {bibliotecario.numeroTelefono}
        </Typography>
      </Box>

      {/* Edit Button */}
      <Box
        onClick={() => onEdit(bibliotecario.id)}
        sx={{
          backgroundColor: '#a47149',
          color: '#ffffff',
          borderRadius: '8px',
          height: { xs: '32px', sm: '30px', md: '30px' },
          minWidth: { xs: '100px', sm: '80px', md: '92px' },
          width: { xs: '100%', sm: 'auto' },
          maxWidth: { xs: '200px', sm: 'none' },
          boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          flexShrink: 0,
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: '#8b5e3c',
            transform: 'scale(1.02)'
          },
          '&:active': {
            transform: 'scale(0.98)'
          }
        }}
      >
        <Typography
          sx={{
            fontFamily: 'League Spartan',
            fontWeight: 500,
            fontSize: { xs: '12px', sm: '13px', md: '15px' },
            letterSpacing: '0.1px',
            lineHeight: '20px',
            color: '#fff9ec'
          }}
        >
          Editar
        </Typography>
        <Edit width={16} height={16} color="#fff9ec" />
      </Box>
    </Card>
  );
};

export default BibliotecarioCard;
