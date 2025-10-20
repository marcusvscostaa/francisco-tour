import AgendaReserva from "../components/AgendaReserva";
import Sidebar from "../components/Sidebar";
import TabelaComissoes from "../components/TabelaComissoes";
export default function Comissoes(){
    return(
        <div id="wrapper">
        <Sidebar 
        painel="nav-item"
        financeiro="nav-item" 
        reservas="nav-item active"  
        agendaReserva="nav-item" 
        reservasShow="collapse show" 
        novaReserva="collapse-item" 
        minhaReserva="collapse-item"
        comissoes="collapse-item active"
        configuracoes="nav-item"  
        tabelaCliente="nav-item"
        usuarios="nav-item"
        componente={<TabelaComissoes />}
        nomePagina="Comissões"/>
        </div>
    )
}