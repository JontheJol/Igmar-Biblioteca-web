import { useTheme, useMediaQuery } from '@mui/material';

/**
 * Hook personalizado para manejar breakpoints de forma responsiva
 * Proporciona helpers para diferentes tamaños de pantalla
 */
export const useResponsive = () => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600px - 900px
  const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // >= 900px
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('lg')); // >= 1200px
  const isExtraLarge = useMediaQuery(theme.breakpoints.up('xl')); // >= 1536px
  
  // Helpers específicos
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md')); // < 900px
  const isTabletOrDesktop = useMediaQuery(theme.breakpoints.up('sm')); // >= 600px
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isExtraLarge,
    isMobileOrTablet,
    isTabletOrDesktop,
    // Valores específicos para diferentes tamaños
    cardGap: isMobile ? '12px' : isTablet ? '16px' : '20px',
    containerPadding: isMobile ? 2 : isTablet ? 3 : 4,
    titleSize: isMobile ? '24px' : isTablet ? '32px' : isDesktop ? '48px' : '56px',
    subtitleSize: isMobile ? '16px' : isTablet ? '18px' : '20px',
  };
};

export default useResponsive;
