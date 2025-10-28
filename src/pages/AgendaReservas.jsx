import Sidebar from "../components/Sidebar";
import AgendaReserva from "../components/AgendaReserva";

export default function AgendaReservas(){

    return(
        <div id="wrapper">
        <Sidebar 
        painel="nav-item"
        financeiro="nav-item" 
        reservas="nav-item"  
        agendaReserva="nav-item active" 
        reservasShow="collapse" 
        novaReserva="collapse-item" 
        minhaReserva="collapse-item"
        comissoes="collapse-item" 
        configuracoes="nav-item" 
        tabelaCliente="nav-item"
        usuarios="nav-item"
        nomePagina="Agenda de Reservas"
        componente={<AgendaReserva />}/>
        </div>
    )
}