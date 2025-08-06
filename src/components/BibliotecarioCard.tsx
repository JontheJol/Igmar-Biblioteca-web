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
        padding: { xs: '16px', sm: '16px 20px', md: '20px 24px' },
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: { xs: '12px', sm: '16px', md: '20px' },
        height: 'auto',
        minHeight: { xs: '80px', sm: '100px', md: '120px' },
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        width: '100%',
        maxWidth: { xs: '100%', sm: '750px', md: '818px' },
        margin: '0 auto',
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
          width: { xs: 48, sm: 56, md: 64 },
          height: { xs: 48, sm: 56, md: 64 },
          backgroundColor: '#ece6f0',
          borderRadius: '8px',
          flexShrink: 0,
          fontSize: { xs: '18px', sm: '20px', md: '22px' },
          color: '#8b5e3c',
          fontFamily: 'League Spartan',
          fontWeight: 500,
          '& .MuiAvatar-img': {
            borderRadius: '8px'
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
          overflow: 'hidden'
        }}
      >
        <Typography
          sx={{
            fontFamily: 'League Spartan',
            fontWeight: 500,
            fontSize: { xs: '16px', sm: '18px', md: '20px' },
            color: '#000000',
            letterSpacing: '0.1px',
            lineHeight: 1.2,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {bibliotecario.nombre}
        </Typography>
        
        <Typography
          sx={{
            fontFamily: 'League Spartan',
            fontWeight: 400,
            fontSize: { xs: '13px', sm: '14px', md: '15px' },
            color: '#4b453d',
            letterSpacing: '0.1px',
            lineHeight: 1.2,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {bibliotecario.correo}
        </Typography>
        
        <Typography
          sx={{
            fontFamily: 'League Spartan',
            fontWeight: 400,
            fontSize: { xs: '13px', sm: '14px', md: '15px' },
            color: '#8d8d8d',
            letterSpacing: '0.1px',
            lineHeight: 1.2,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
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
          height: { xs: '36px', sm: '40px', md: '44px' },
          minWidth: { xs: '80px', sm: '90px', md: '100px' },
          boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
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
            fontSize: { xs: '13px', sm: '14px', md: '15px' },
            letterSpacing: '0.1px',
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
