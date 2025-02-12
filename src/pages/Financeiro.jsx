import PainelFinanceiro from "../components/PainelFinanceiro";
import Sidebar from "../components/Sidebar";

export default function Financeiro(){
    return(
        <div id="wrapper">
        <Sidebar 
        painel="nav-item"
        financeiro="nav-item active"
        reservas="nav-item"  
        agendaReserva="nav-item" 
        reservasShow="collapse" 
        novaReserva="collapse-item" 
        minhaReserva="collapse-item"
        comissoes="collapse-item" 
        tabelaCliente="nav-item"
        nomePagina="Financeiro"
        componente={<PainelFinanceiro />}
        />
        </div>
    )
}