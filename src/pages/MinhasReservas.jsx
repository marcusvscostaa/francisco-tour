import Sidebar from "../components/Sidebar";
import TabelaReservas from "../components/tabelaReservas/TabelaReservas"
export default function MinhasReservas(){
    return(
        <div id="wrapper">
        <Sidebar 
        painel="nav-item"
        financeiro="nav-item" 
        reservas="nav-item active"  
        agendaReserva="nav-item" 
        reservasShow="collapse show" 
        novaReserva="collapse-item" 
        minhaReserva="collapse-item active"
        comissoes="collapse-item"
        configuracoes="nav-item"  
        tabelaCliente="nav-item"
        usuarios="nav-item"
        nomePagina="Minhas Reservas"
        componente={<TabelaReservas />}/>
        
        </div>
    )
}