import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoutes";
import NovaReserva from '../pages/NovaReserva';
import AgendaReservas from '../pages/AgendaReservas';
import MinhasReservas from '../pages/MinhasReservas';
import Comissoes from '../pages/Comissoes';
import TabelaCliente from '../pages/TabelaClientes';
import PaginaNaoEncontrada from '../pages/PaginaNaoEncontrada';
import Financeiro from '../pages/Financeiro';
import Configuracoes from '../pages/Configuracoes';
import Login from '../pages/Login';
import Painel from '../pages/Painel';
import Usuarios from '../pages/Usuarios';
import { useEffect } from "react";


export const AppRouter = (props) => {
  useEffect(() => {
    console.log("Funciona");
  },[])
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Painel />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/novaReserva" element={<NovaReserva />}/>
        <Route path="/agendaReservas" element={<AgendaReservas />}/>
        <Route path="/minhasReservas" element={<MinhasReservas />}/>
        <Route path="/comissoes" element={<Comissoes />}/>
        <Route path="/tabelaCliente" element={<TabelaCliente />}/>
        <Route path="/usuarios" element={<Usuarios />}/>



       {/*  <Route path="/" element={<PrivateRoute user={props.user} />}>
          <Route path="/" element={<Painel />} />
        </Route>
        <Route path='*' element={<PrivateRoute user={props.user} />}>
        </Route>
        <Route path="/financeiro" element={<PrivateRoute user={props.user} />} >
            <Route path="/financeiro" element={<Financeiro />} />
        </Route>
        <Route path="/novaReserva" element={<PrivateRoute user={props.user}/>}>
            <Route path="/novaReserva" element={<NovaReserva />}/>
        </Route>
        <Route path="/agendaReservas" element={<PrivateRoute user={props.user}/>}>
            <Route path="/agendaReservas" element={<AgendaReservas />}/>
        </Route>
        <Route path="/minhasReservas" element={<PrivateRoute user={props.user} />}>
            <Route path="/minhasReservas" element={<MinhasReservas />}/>
        </Route>
        <Route path="/comissoes" element={<PrivateRoute user={props.user} />}>
            <Route path="/comissoes" element={<Comissoes />}/>
        </Route>
        <Route path="/tabelaCliente" element={<PrivateRoute user={props.user} />}>
            <Route path="/tabelaCliente" element={<TabelaCliente />}/>
        </Route>
        <Route path="/usuarios" element={<PrivateRoute user={props.user} />}>
            <Route path="/usuarios" element={<Usuarios />}/>
        </Route> */}
      </Routes>
    </Router>
  );
};