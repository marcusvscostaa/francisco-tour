import { useState, useEffect, useCallback } from "react";
import { editarStatusTours } from '../FranciscoTourService';

export default function StatusTour(props){
    const getInitialStatus = (status) => {
        if (status === 'Confirmado') return { status: 'Confirmado', className: "fas fa-check-circle text-success" };
        if (status === 'Cancelado') return { status: 'Cancelado', className: "fas fa-ban text-danger" };
        return { status: 'Confirmado', className: "fas fa-check-circle text-success" };
    };
    const [statusLocal, setStatusLocal] = useState(() => getInitialStatus(props.status));

    useEffect(() => {
        setStatusLocal(getInitialStatus(props.status));

        if (!props.status && props.updateCount === 0) {
            editarStatusTours({status: 'Confirmado', idtour: props.id})
            .catch(err => console.error("Erro ao inicializar status do Tour:", err));
        }
        
    }, [props.status, props.id, props.updateCount]);

    const handleChange = useCallback(async (e) => {
        const newStatusValue = e.target.value;
          
        try {
            await editarStatusTours({status: newStatusValue, idtour: props.id});
            props.setUpdateCount(); 

        } catch (err) {
            console.error("Erro ao atualizar status do Tour:", err);
        }
    }, [props.id, props.setUpdateCount]);
            
    return (
    <div className="dropdown">
        <a type="button" data-toggle="dropdown" aria-expanded="false" >
            <i title={statusLocal.status} className={statusLocal.className}></i>        </a>
        <div style={{ minWidth: "40px" }} className="dropdown-menu dropdown-menu-right">
            <button className="dropdown-item" value="Confirmado" onClick={handleChange} disabled={props.disabledButton}><i className="fas fa-check-circle text-success"></i> Confirmado</button>
            <button className="dropdown-item" value="Cancelado" onClick={handleChange} disabled={props.disabledButton}><i className="fas fa-ban text-danger"></i> Cancelado</button>
        </div>
    </div>
    )
}