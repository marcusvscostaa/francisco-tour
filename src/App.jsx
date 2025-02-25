import logo from './logo.svg';
import './App.css';
import './components/Sidebar';
import './sb-admin-2.css';
import './calenda.css'
import LogoutModal from './components/LogoutModal';
import Painel from './pages/Painel';
import { BrowserRouter as Router, Route,  Routes } from 'react-router-dom';
import NovaReserva from './pages/NovaReserva';
import AgendaReservas from './pages/AgendaReservas';
import MinhasReservas from './pages/MinhasReservas';
import Comissoes from './pages/Comissoes';
import TabelaCliente from './pages/TabelaClientes';
import PaginaNaoEncontrada from './pages/PaginaNaoEncontrada';
import Financeiro from './pages/Financeiro';
import Configuracoes from './pages/Configuracoes';
import Login from './pages/Login';
import AuthService from './AuthService';
import { useEffect } from 'react';
import Usuarios from './pages/Usuarios';
const user = AuthService.getCurrentUser()&&AuthService.getCurrentUser().auth;
function App() {
  useEffect(() => {
    console.log(AuthService.getCurrentUser())
  },[])

  return (
    <Router>
        <Routes>
          <Route path='*' element={user ?<PaginaNaoEncontrada/>:<Login />} />
          <Route path="/" element={user ?<Painel />:<Login />} />
          <Route path="financeiro" element={user ? <Financeiro /> :<Login />} />
          <Route path="novaReserva" element={ user ?<NovaReserva /> :<Login />}/>
          <Route path="agendaReservas" element={user ? <AgendaReservas /> :<Login/>}/>
          <Route path="minhasReservas" element={user ? <MinhasReservas /> :<Login/>}/>
          <Route path="comissoes" element={user ? <Comissoes /> :<Login/>}/>
          <Route path="tabelaCliente" element={user ? <TabelaCliente/> :<Login/>}/>
          <Route path="Configuracoes" element={user ? <Configuracoes/> :<Login/>}/>
          <Route path="usuarios" element={user ? <Usuarios/> :<Login/>}/>
        </Routes>
    </Router>


  );
}

export default App;
