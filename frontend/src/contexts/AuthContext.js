import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
  });

  // Check if user is already logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Verify token validity
          const decoded = jwt_decode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            // Token has expired
            logout();
          } else {
            // Token is valid
            setAuthState({
              isAuthenticated: true,
              user: {
                username: decoded.sub,
                role: decoded.role
              },
              loading: false,
              error: null
            });
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          logout();
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null
        });
      }
    };
    
    checkAuth();
  }, []);

  // Register a new customer
  const registerCustomer = async (mobileNumber, password) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await api.post('/api/auth/customer/signup', {
        mobileNumber,
        password
      });
      
      const { accessToken, userId, role } = response.data.data;
      
      // Save token to localStorage
      localStorage.setItem('token', accessToken);
      
      setAuthState({
        isAuthenticated: true,
        user: {
          username: mobileNumber,
          role: role
        },
        loading: false,
        error: null
      });
      
      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.error || 'Registration failed'
      }));
      return false;
    }
  };

  // Login a customer
  const loginCustomer = async (mobileNumber, password) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await api.post('/api/auth/customer/login', {
        username: mobileNumber,
        password
      });
      
      const { accessToken, userId, role } = response.data.data;
      
      // Save token to localStorage
      localStorage.setItem('token', accessToken);
      
      setAuthState({
        isAuthenticated: true,
        user: {
          username: mobileNumber,
          role: role
        },
        loading: false,
        error: null
      });
      
      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.error || 'Login failed'
      }));
      return false;
    }
  };

  // Login an admin
  const loginAdmin = async (username, password) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await api.post('/api/auth/admin/login', {
        username,
        password
      });
      
      const { accessToken, role } = response.data.data;
      
      // Save token to localStorage
      localStorage.setItem('token', accessToken);
      
      setAuthState({
        isAuthenticated: true,
        user: {
          username,
          role
        },
        loading: false,
        error: null
      });
      
      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.error || 'Admin login failed'
      }));
      return false;
    }
  };

  // Logout the user
  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    });
  };

  // Value to be provided by the context
  const authContextValue = {
    authState,
    registerCustomer,
    loginCustomer,
    loginAdmin,
    logout
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}; 