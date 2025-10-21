import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Carregando autenticação...</div>; 
  }
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};