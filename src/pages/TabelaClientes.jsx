import Sidebar from "../components/Sidebar";
import Tabela from "../components/Tabela"
import LogoutModal from "../components/LogoutModal"
export default function TabelaCliente(){
    return(
        <>
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
        configuracoes="collapse-item"  
        tabelaCliente="nav-item active"
        usuarios="nav-item"
        nomePagina="Tabela de Clientes" 
        componente={<Tabela/>}/>
        </div>
        <a className="scroll-to-top rounded" href="#page-top">
            <i className="fas fa-angle-up"></i>
        </a>
        <LogoutModal />
        </>
    )
}