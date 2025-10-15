import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Este componente é a 'guarda de rota'
export const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  console.log(isAuthenticated, loading)
  
  // Se ainda estiver carregando (chegando o token), não renderiza nada
  if (loading) {
    return <div>Carregando...</div>; // Ou um spinner/tela de splash
  }

  // 1. Verifica se está autenticado
  if (!isAuthenticated) {
    // 2. Se NÃO estiver, redireciona para o login
    // 'replace' garante que o usuário não possa voltar à página protegida pelo botão 'voltar'
    return <Navigate to="/login" replace />;
  }

  // 3. Se estiver, renderiza o componente aninhado (definido no AppRouter)
  return <Outlet />;
};