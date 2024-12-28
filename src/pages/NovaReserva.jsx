import Formulario from "../components/Formulario";
import Sidebar from "../components/Sidebar";
import ModalAlert from "../components/ModalAlert";
import LogoutModal from "../components/LogoutModal";


export default function NovaReserva(){
    return(
        <>
        <div id="wrapper">
        <Sidebar 
        painel="nav-item" 
        agendaReserva="nav-item" 
        reservas="nav-item active"  
        reservasShow="collapse show" 
        novaReserva="collapse-item active"
        minhaReserva="collapse-item"
        comissoes="collapse-item" 
        tabelaCliente="nav-item"
        nomePagina="Nova Reserva" 
        componente={<Formulario />}/>
        </div>
        <a className="scroll-to-top rounded" href="#page-top">
            <i class="fas fa-angle-up"></i>
        </a>
        <LogoutModal />
        </>
    )
}