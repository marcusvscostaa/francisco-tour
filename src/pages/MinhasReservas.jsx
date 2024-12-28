import Sidebar from "../components/Sidebar";
import TabelaReservas from "../components/TabelaReservas"
export default function MinhasReservas(){
    return(
        <div id="wrapper">
        <Sidebar 
        painel="nav-item" 
        reservas="nav-item active"  
        agendaReserva="nav-item" 
        reservasShow="collapse show" 
        novaReserva="collapse-item" 
        minhaReserva="collapse-item active"
        comissoes="collapse-item" 
        tabelaCliente="nav-item"
        nomePagina="Minhas Reservas"
        componente={<TabelaReservas />}/>
        
        </div>
    )
}