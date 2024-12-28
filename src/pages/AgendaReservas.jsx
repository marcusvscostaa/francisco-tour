import { use, useEffect } from "react";
import ModalAlert from "../components/ModalAlert";
import Sidebar from "../components/Sidebar";
import $ from "jquery";
export default function AgendaReservas(){

    return(
        <div id="wrapper">
        <Sidebar 
        painel="nav-item" 
        reservas="nav-item"  
        agendaReserva="nav-item active" 
        reservasShow="collapse" 
        novaReserva="collapse-item" 
        minhaReserva="collapse-item"
        comissoes="collapse-item" 
        tabelaCliente="nav-item"
        nomePagina="Agenda de Reservas"/>
        </div>
    )
}