import LogoutModal from "../components/LogoutModal";
import PainelUsuario from "../components/PainelUsuarios";
import Sidebar from "../components/Sidebar";

export default function Usuarios(){
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
        tabelaCliente="nav-item"
        usuarios="nav-item active"
        nomePagina="Usuários" 
        componente={<PainelUsuario />}/>
        </div>
        <a className="scroll-to-top rounded" href="#page-top">
            <i className="fas fa-angle-up"></i>
        </a>
        <LogoutModal />
        </>
    )
}