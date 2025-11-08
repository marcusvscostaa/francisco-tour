import { BrowserRouter as Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoutes.jsx"; 
import NovaReserva from './pages/NovaReserva';
import AgendaReservas from './pages/AgendaReservas';
import MinhasReservas from './pages/MinhasReservas';
import Comissoes from './pages/Comissoes';
import TabelaCliente from './pages/TabelaClientes';
import PaginaNaoEncontrada from './pages/PaginaNaoEncontrada';
import Financeiro from './pages/Financeiro';
import Configuracoes from './pages/Configuracoes';
import Login from './pages/Login';
import Painel from './pages/Painel';
import Usuarios from './pages/Usuarios';
import { PublicRoute } from "./components/PublicRoute.jsx";
import { RoleBasedRoute } from "./components/RoleBasedRoute.jsx";

export const AppRouter = () => {
  return (
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Painel />} />
          <Route path="/novaReserva" element={<NovaReserva />}/>
          <Route path="/agendaReservas" element={<AgendaReservas />}/>
          <Route path="/minhasReservas" element={<MinhasReservas />}/>
          <Route path="/comissoes" element={<Comissoes />}/>
          <Route path="/tabelaCliente" element={<TabelaCliente />}/>
          <Route path="*" element={<PaginaNaoEncontrada />} />
        </Route>

        {/* Rotas de Nível ADMIN (Usam o RoleBasedRoute) */}
        <Route element={<RoleBasedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Route>

      </Routes>  );
};