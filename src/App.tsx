import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import ConditionalLayout from './components/ConditionalLayout';
import NotificationDialog from './components/NotificationDialog';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import AddUser from './pages/AddUser';
import EditUser from './pages/EditUser';
import Estantes from './pages/Estantes';
import Libros from './pages/Libros';
import HomeRouter from './pages/HomeRouter';
import Login from './pages/Login';
import Register from './pages/Register';
import Users from './pages/Users';
import EmailConfirmation from './pages/EmailConfirmation';
import ValidationExample from './pages/ValidationExample';
import AdminSettings from './pages/AdminSettings';
import Bibliotecarios from './pages/Bibliotecarios';
import AgregarBibliotecario from './pages/AgregarBibliotecario';
import EditarBibliotecario from './pages/EditarBibliotecario';
import { useAppStore } from './store/appStore';

const theme = createTheme({
  palette: {
    primary: {
      main: '#453726', // From Figma design
    },
    secondary: {
      main: '#2e5131', // BookSmart green
    },
    background: {
      default: '#fff9ec', // Figma background color
    },
  },
  typography: {
    fontFamily: '"League Spartan", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          margin: 0,
          padding: 0,
          height: '100%',
          // Mejoras para móviles
          WebkitTapHighlightColor: 'transparent',
          WebkitTextSizeAdjust: '100%',
        },
        body: {
          margin: 0,
          padding: 0,
          height: '100%',
          // Desactivar zoom en inputs en iOS
          '@media (max-width: 600px)': {
            fontSize: '16px',
          }
        },
        '#root': {
          margin: 0,
          padding: 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
        // Mejoras para scroll en móviles
        '*': {
          WebkitOverflowScrolling: 'touch',
        },
        // Botones y elementos interactivos más grandes en móviles
        '@media (max-width: 600px)': {
          button: {
            minHeight: '44px',
            minWidth: '44px',
          },
        },
      },
    },
    // Configuraciones globales para componentes MUI
    MuiButton: {
      styleOverrides: {
        root: {
          // Asegurar que los botones sean accesibles en móviles
          '@media (max-width: 600px)': {
            minHeight: '44px',
            fontSize: '14px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          // Inputs más grandes en móviles para mejor usabilidad
          '@media (max-width: 600px)': {
            '& .MuiInputBase-input': {
              fontSize: '16px', // Previene zoom en iOS
              padding: '12px 14px',
            },
          },
        },
      },
    },
  },
});

function App() {
  const { notification, showNotification, hideNotification } = useAppStore();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppLayout>
          <ConditionalLayout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/email-confirmation" element={<EmailConfirmation />} />
              <Route path="/validation-example" element={<ValidationExample />} />
              
              {/* Public authenticated routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <HomeRouter />
                </ProtectedRoute>
              } />
              
              {/* Admin and Super Admin routes */}
              <Route path="/users" element={
                <ProtectedRoute>
                  <RoleProtectedRoute requiredRole={3}>
                    <Users />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              } />
              <Route path="/add-user" element={
                <ProtectedRoute>
                  <RoleProtectedRoute requiredRole={3}>
                    <AddUser />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              } />
              <Route path="/edit-user/:id" element={
                <ProtectedRoute>
                  <RoleProtectedRoute requiredRole={3}>
                    <EditUser />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              } />
              
              {/* Super Admin only routes */}
              <Route path="/admin-settings" element={
                <ProtectedRoute>
                  <RoleProtectedRoute requireSuperAdmin={true}>
                    <AdminSettings />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              } />
              
              <Route path="/estantes" element={
                  <Estantes />
              } />
              
              <Route path="/libros" element={
                <ProtectedRoute>
                  <RoleProtectedRoute requiredRole={3}>
                    <Libros />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              } />
              
              {/* Bibliotecarios routes - Admin access required */}
              <Route path="/bibliotecarios" element={
                <ProtectedRoute>
                  <RoleProtectedRoute requiredRole={3}>
                    <Bibliotecarios />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              } />
              <Route path="/bibliotecarios/agregar" element={
                <ProtectedRoute>
                  <RoleProtectedRoute requiredRole={3}>
                    <AgregarBibliotecario />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              } />
              <Route path="/bibliotecarios/editar/:id" element={
                <ProtectedRoute>
                  <RoleProtectedRoute requiredRole={3}>
                    <EditarBibliotecario />
                  </RoleProtectedRoute>
                </ProtectedRoute>
              } />
            </Routes>
          </ConditionalLayout>
          
          {/* Global Notification Dialog */}
          <NotificationDialog
            open={showNotification}
            notification={notification}
            onClose={hideNotification}
          />
        </AppLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
