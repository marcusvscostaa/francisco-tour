import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PublicRoute = () => {
  // Pega os estados que refletem o resultado da validação do token
  const { isAuthenticated, loading } = useAuth();
  
  // 1. ESPERA A VALIDAÇÃO DO TOKEN TERMINAR
  if (loading) {
    return <div>Carregando autenticação...</div>; 
  }

  // 2. SE O TOKEN É VÁLIDO (isAuthenticated é true), REDIRECIONA PARA O PAINEL.
  if (isAuthenticated) {
    // 🟢 Se já está autenticado, não deve ver a tela de login.
    return <Navigate to="/" replace />;
  }

  // 3. SE O TOKEN É INVÁLIDO OU NÃO EXISTE (isAuthenticated é false), PERMITE VER O LOGIN.
  // 🟢 Renderiza o componente aninhado, que é o <Login />.
  return <Outlet />;
};