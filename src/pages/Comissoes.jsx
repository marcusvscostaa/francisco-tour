import Sidebar from "../components/Sidebar";
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
        configuracoes="collapse-item"  
        tabelaCliente="nav-item"
        nomePagina="Comissões"/>
        </div>
    )
}