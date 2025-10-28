import Formulario from "../components/Formulario";
import Sidebar from "../components/Sidebar";
import LogoutModal from "../components/LogoutModal";


export default function NovaReserva(){
    return(
        <>
        <div id="wrapper">
        <Sidebar 
        painel="nav-item"
        financeiro="nav-item" 
        agendaReserva="nav-item" 
        reservas="nav-item active"  
        reservasShow="collapse show" 
        novaReserva="collapse-item active"
        minhaReserva="collapse-item"
        comissoes="collapse-item"
        configuracoes="nav-item"  
        tabelaCliente="nav-item"
        usuarios="nav-item"
        nomePagina="Nova Reserva" 
        componente={<Formulario idCliente={{status: false}} title="Dados Cliente"/>}/>
        </div>
        <a className="scroll-to-top rounded" href="#page-top">
            <i className="fas fa-angle-up"></i>
        </a>
        <LogoutModal />
        </>
    )
}