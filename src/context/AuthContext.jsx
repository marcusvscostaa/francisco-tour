import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../AuthService';

const AuthContext = createContext();

const fakeLogin = (email, password) => {
  if (email === "teste@app.com" && password === "123456") {
    return { token: "fake-jwt-token-12345", user: { nome: "Usuário Teste", email } };
  }
  return null; 
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
        const loadUserFromStorage = () => {
            const authData = AuthService.getCurrentUser(); 
            
            if (authData && authData.token) {
                setUser(authData.user); 
            }
            
            setLoading(false); 
        };

        loadUserFromStorage();
  }, []);

  const login = async (username, password) => {
    const result = fakeLogin(username, password);

    try {
        await AuthService.login(username, password); 
        
        const authData = AuthService.getCurrentUser();

        if (authData && authData.token) {
            setUser(authData.user); 
            return true;
        }
        return false; 
    } catch (error) {
        console.error("Erro no login do contexto:", error);
        AuthService.logout(); 
        setUser(null);
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