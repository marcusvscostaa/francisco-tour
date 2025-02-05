import logo from './logo.svg';
import './App.css';
import './components/Sidebar';

import Sidebar from './components/Sidebar';
import LogoutModal from './components/LogoutModal';
import { useEffect } from 'react';
import Painel from './pages/Painel';

function App() {

  return (
    <>
    <Painel />
    <a className="scroll-to-top rounded" href="#page-top">
        <i className="fas fa-angle-up"></i>
    </a>
  <LogoutModal />
  </>
  );
}

export default App;
