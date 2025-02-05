import PainelPrincipal from "../components/PainelPrincipal"
import Sidebar from "../components/Sidebar"

export default function Painel(){
    return(
    <div id="wrapper">
        <Sidebar 
        painel="nav-item active" 
        agendaReserva="nav-item" 
        reservas="nav-item"  
        reservasShow="collapse"
        novaReserva="collapse-item"
        minhaReserva="collapse-item"
        comissoes="collapse-item" 
        tabelaCliente="nav-item"
        nomePagina="Painel"
        componente={<PainelPrincipal />}/>
      </div>
    )
}