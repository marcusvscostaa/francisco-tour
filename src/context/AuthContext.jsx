import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../AuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
        const loadUserFromStorage = async () => {
            const authData = AuthService.getCurrentUser(); 
            if (authData && authData.token) {
                const isValid = await AuthService.validateToken(authData.token);               
                if (isValid) {
                    setUser(authData.user); 
                } else {
                    AuthService.logout();
                }
            }
            
            setLoading(false); 
        };

        loadUserFromStorage();
  }, []);

  const login = async (username, password) => {
    setError(null);
    try {
        await AuthService.login(username, password); 
        
        const authData = AuthService.getCurrentUser();

        if (authData && authData.token) {
          const isValid = await AuthService.validateToken();           
          if (isValid) { 
              setUser(authData.user);
              return true;
          }
        }
        return false; 
    } catch (error) {
        console.error("Erro no login do contexto:", error);
        console.log(error);
        AuthService.logout(); 
        setUser(null);

        let errorMessage = "Erro desconhecido. Tente novamente.";
        if (error.response) {
            errorMessage = error.response.data?.message || `Falha no login: ${error.response.statusText}`;
        } 
        else if (error.request) {
            console.log(error.request);
            errorMessage = "O servidor não está respondendo. Verifique sua conexão ou tente mais tarde.";
        } 
        else {
            errorMessage = `Ocorreu um erro ao configurar a requisição: ${error.message}`;
        }

        setError(errorMessage);
        return false;
    }
  };

    const logout = () => {
        AuthService.logout();
        setUser(null); 
        navigate('/login');
    };


  const value = {
    user,
    isAuthenticated: !!user, 
    login,
    logout,
    loading,
    error,
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};