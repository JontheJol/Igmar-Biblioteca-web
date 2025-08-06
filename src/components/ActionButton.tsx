import { Box, Typography } from '@mui/material';
import React from 'react';

interface ActionButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  icon,
  onClick,
  variant = 'primary'
}) => {
  const backgroundColor = variant === 'primary' ? '#2F5233' : '#A47149';
  const hoverColor = variant === 'primary' ? '#234026' : '#8B5E3C';

  return (
    <Box
      onClick={onClick}
      sx={{
        background: backgroundColor,
        boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        borderRadius: { xs: 1.5, sm: 2 },
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'inline-flex',
        cursor: 'pointer',
        flexShrink: 0,
        minWidth: { xs: '180px', sm: '140px', md: '160px' },
        width: { xs: '100%', sm: 'auto', md: 'auto' },
        maxWidth: { xs: '220px', sm: 'none', md: 'none' },
        '&:hover': {
          background: hoverColor,
          transform: 'translateY(-1px)',
          boxShadow: '0px 2px 6px 2px rgba(0, 0, 0, 0.2)',
        },
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <Box
        sx={{
          height: { xs: 40, sm: 40, md: 44 },
          padding: { 
            xs: '10px 16px', 
            sm: '10px 16px', 
            md: '12px 20px' 
          },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: { xs: '8px', sm: '8px', md: '10px' },
          width: '100%'
        }}
      >
        <Typography
          sx={{
            color: '#FFF9EC',
            fontSize: { xs: 15, sm: 15, md: 16 },
            fontFamily: 'League Spartan',
            fontWeight: 500,
            lineHeight: '20px',
            letterSpacing: 0.1,
            whiteSpace: 'nowrap'
          }}
        >
          {label}
        </Typography>
        {icon}
      </Box>
    </Box>
  );
};

export default ActionButton;
