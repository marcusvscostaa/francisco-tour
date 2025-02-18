import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import NovaReserva from './pages/NovaReserva';
import AgendaReservas from './pages/AgendaReservas';
import MinhasReservas from './pages/MinhasReservas';
import Comissoes from './pages/Comissoes';
import TabelaCliente from './pages/TabelaClientes';
import PaginaNaoEncontrada from './pages/PaginaNaoEncontrada';
import Financeiro from './pages/Financeiro';
import Configuracoes from './pages/Configuracoes';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <Routes>
        <Route path='*' element={<PaginaNaoEncontrada />} />
        <Route path="/" element={<App />} />
        <Route path="financeiro" element={<Financeiro />} />
        <Route path="novaReserva" element={<NovaReserva />}/>
        <Route path="agendaReservas" element={<AgendaReservas />}/>
        <Route path="minhasReservas" element={<MinhasReservas />}/>
        <Route path="comissoes" element={<Comissoes />}/>
        <Route path="tabelaCliente" element={<TabelaCliente />}/>
        <Route path="Configuracoes" element={<Configuracoes />}/>
      </Routes>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
