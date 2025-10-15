import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; 
import { AppRouter } from './AppRouter';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import './components/Sidebar';
import './sb-admin-2.css';
import './calenda.css'

function App() {
  return (
    <Router> 
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </Router>
  );
}

export default App;