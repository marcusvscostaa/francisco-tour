import logo from './logo.svg';
import './App.css';
import './components/Sidebar';

import Sidebar from './components/Sidebar';
import LogoutModal from './components/LogoutModal';
import { useEffect } from 'react';

function App() {

  return (
    <>
  <div id="wrapper">
    <Sidebar 
    painel="nav-item active" 
    agendaReserva="nav-item" 
    reservas="nav-item"  
    reservasShow="collapse"
    novaReserva="collapse-item"
    minhaReserva="collapse-item"
    comissoes="collapse-item" 
    tabelaCliente="nav-item"
    nomePagina="Painel"/>
  </div>
    <a className="scroll-to-top rounded" href="#page-top">
        <i class="fas fa-angle-up"></i>
    </a>
  <LogoutModal />
  </>
  );
}

export default App;
