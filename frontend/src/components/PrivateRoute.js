import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser?.role !== requiredRole) {
    // Doesn't have the required role, redirect to home page
    return <Navigate to="/" replace />;
  }

  // Authenticated and has the required role
  return children;
};

export default PrivateRoute; 