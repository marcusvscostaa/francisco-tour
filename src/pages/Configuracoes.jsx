import ConfiguracoesCard from "../components/ConfiguracoesCard";
import Sidebar from "../components/Sidebar";
export default function Configuracoes(){
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
        comissoes="collapse-item" 
        configuracoes="collapse-item active" 
        tabelaCliente="nav-item"
        nomePagina="Configurações"
        componente={<ConfiguracoesCard />}/>
        </div>
    )
}