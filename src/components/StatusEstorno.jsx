import { useState, useEffect } from "react"
import axios from "axios";
import {editStatusEstorno} from "../FranciscoTourService";

const calcularStatusUI = (status) => {
    if (status === 'Pago') {
        return { status: 'Pago', className: "fas fa-check-circle text-success" };
    } else if (status === 'Cancelado') {
        return { status: 'Cancelado', className: "fas fa-ban text-danger" };
    }
    return { status: 'Desconhecido', className: "fas fa-question-circle text-secondary" };
};

export default function StatusEstorno(props){
    const [statusReserva, setStatusReserva] = useState(() => calcularStatusUI(props.status));
    
    useEffect(() => {
        setStatusReserva(calcularStatusUI(props.status));
    }, [props.status]);

    const handleChange = async (e) => {
        e.preventDefault();
        const novoStatus = e.target.value;
        
        try {
            await editStatusEstorno(props.id, {status: novoStatus});            
            props.setUpdateCount(true);             
            setStatusReserva(calcularStatusUI(novoStatus));

        } catch (err) {
            console.error("Erro ao atualizar status do estorno:", err);
        }
    }
    return (
    <div className="dropdown">
        <a type="button" data-toggle="dropdown" aria-expanded="false" >
            <i title={statusReserva.status} className={statusReserva.className}></i>
        </a>
        <div style={{ minWidth: "40px" }} className="dropdown-menu dropdown-menu-right">
            <button className="dropdown-item" value="Pago" onClick={handleChange} disabled={props.disabledButton}><i className="fas fa-check-circle text-success"></i> Pago</button>
            <button className="dropdown-item" value="Cancelado" onClick={handleChange} disabled={props.disabledButton}><i className="fas fa-ban text-danger"></i> Cancelado</button>
        </div>
    </div>
    )
}