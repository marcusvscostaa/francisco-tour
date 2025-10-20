import ConfiguracoesCard from "../components/tourCadastro/ConfiguracoesCard";
import Sidebar from "../components/Sidebar";
export default function Configuracoes(){
    return(
        <div id="wrapper">
        <Sidebar 
        painel="nav-item"
        financeiro="nav-item" 
        reservas="nav-item"  
        agendaReserva="nav-item" 
        reservasShow="collapse" 
        novaReserva="collapse-item" 
        minhaReserva="collapse-item"
        comissoes="collapse-item" 
        configuracoes="nav-item active" 
        tabelaCliente="nav-item"
        nomePagina="Configurações"
        usuarios="nav-item"
        componente={<ConfiguracoesCard />}/>
        </div>
    )
}