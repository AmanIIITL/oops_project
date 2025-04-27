import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Pages
import Landing from './pages/Landing';
import CustomerSignup from './pages/CustomerSignup';
import CustomerLogin from './pages/CustomerLogin';
import AdminLogin from './pages/AdminLogin';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

// Components
import PrivateRoute from './components/PrivateRoute';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signup" element={<CustomerSignup />} />
              <Route path="/login" element={<CustomerLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              
              <Route 
                path="/dashboard/*" 
                element={
                  <PrivateRoute requiredRole="ROLE_CUSTOMER">
                    <CustomerDashboard />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/admin/dashboard/*" 
                element={
                  <PrivateRoute requiredRole="ROLE_ADMIN">
                    <AdminDashboard />
                  </PrivateRoute>
                } 
              />
              
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 