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
        backgroundColor: '#ffffff',
        borderRadius: { xs: '12px', sm: '16px', md: '18px' },
        padding: { 
          xs: '12px', 
          sm: '16px', 
          md: '20px',
          lg: '22px'
        },
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' }, // Vertical en móvil, horizontal en pantallas grandes
        alignItems: 'center',
        gap: { xs: '8px', sm: '16px', md: '20px' },
        height: 'fit-content',
        minHeight: { 
          xs: '160px', 
          sm: '120px', 
          md: '130px',
          lg: '140px'
        },
        width: '100%',
        maxWidth: '100%', // Aprovecha todo el ancho disponible
        margin: '0 auto',
        boxSizing: 'border-box',
        overflow: 'hidden',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          width: { 
            xs: 48, 
            sm: 52, 
            md: 60,
            lg: 68 
          },
          height: { 
            xs: 48, 
            sm: 52, 
            md: 60,
            lg: 68 
          },
          backgroundColor: '#f5eff7',
          borderRadius: { xs: '6px', sm: '7px', md: '8px' },
          flexShrink: 0,
          fontSize: { xs: '18px', sm: '20px', md: '22px' },
          color: '#8b5e3c',
          fontFamily: 'League Spartan',
          fontWeight: 500,
          '& .MuiAvatar-img': {
            borderRadius: { xs: '6px', sm: '7px', md: '8px' }
          }
        }}
        src={bibliotecario.avatar}
      >
        {bibliotecario.nombre.charAt(0).toUpperCase()}
      </Avatar>

      {/* Information */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: { xs: '4px', sm: '6px', md: '8px' },
          minWidth: 0,
          overflow: 'hidden',
          textAlign: { xs: 'center', sm: 'left' }, // Centrado en móvil, izquierda en desktop
          width: { xs: '100%', sm: 'auto' }
        }}
      >
        <Typography
          sx={{
            fontFamily: 'League Spartan',
            fontWeight: 500,
            fontSize: { xs: '14px', sm: '16px', md: '18px' },
            color: '#000000',
            letterSpacing: '0.1px',
            lineHeight: 1.2,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: { xs: 'normal', sm: 'nowrap' } // Normal en móvil para permitir wrapping
          }}
        >
          {bibliotecario.nombre}
        </Typography>
        
        <Typography
          sx={{
            fontFamily: 'League Spartan',
            fontWeight: 400,
            fontSize: { xs: '12px', sm: '13px', md: '14px' },
            color: '#666666',
            letterSpacing: '0.1px',
            lineHeight: 1.2,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: { xs: 'normal', sm: 'nowrap' } // Normal en móvil para permitir wrapping
          }}
        >
          {bibliotecario.correo}
        </Typography>
        
        <Typography
          sx={{
            fontFamily: 'League Spartan',
            fontWeight: 400,
            fontSize: { xs: '12px', sm: '13px', md: '14px' },
            color: '#888888',
            letterSpacing: '0.1px',
            lineHeight: 1.2,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: { xs: 'normal', sm: 'nowrap' } // Normal en móvil para permitir wrapping
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
          borderRadius: { xs: '6px', sm: '7px', md: '8px' },
          height: { xs: '32px', sm: '32px', md: '32px' },
          width: { xs: '100%', sm: 'auto' }, // Ancho completo en móvil
          minWidth: { xs: '80px', sm: '85px', md: '92px' },
          maxWidth: { xs: 'none', sm: 'none' }, // Sin restricción de ancho máximo
          boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          flexShrink: 0,
          padding: '0 8px',
          transition: 'background-color 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: '#8b5e3c',
          }
        }}
      >
        <Typography
          sx={{
            fontFamily: 'League Spartan',
            fontWeight: 500,
            fontSize: { xs: '12px', sm: '13px', md: '15px' },
            letterSpacing: '0.1px',
            color: '#fff9ec',
            whiteSpace: 'nowrap'
          }}
        >
          Editar
        </Typography>
        <Edit width={14} height={14} color="#fff9ec" />
      </Box>
    </Card>
  );
};

export default BibliotecarioCard;
