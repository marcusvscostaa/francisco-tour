import { useState, useEffect } from "react"

export default function StatusEstorno(props){
    const [statusReserva, setStatusReserva] = useState('Pago')

    useEffect(()=>{
        if(props.status){          
            if(props.status === 'Pago'){
                setStatusReserva({status: 'Pago', className: "fas fa-check-circle text-success"})
            }else if(props.status === 'Cancelado'){
                setStatusReserva({status: 'Cancelado', className: "fas fa-ban text-danger"})
            }            
        }
    },[props.updateCount])
    const handleChange = (e)=> {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({status: e.target.value, idEstorno: props.id})
        };
        fetch('http://192.168.0.105:8800/mudarStatusEstorno', requestOptions)
        .then(response => {
            props.setUpdateCount(true)
            console.log(response)
            })   
        if(e.target.value === 'Pago'){
            setStatusReserva({status: e.target.value, className: "fas fa-check-circle text-success"})
        }else if(e.target.value === 'Cancelado'){
            setStatusReserva({status: e.target.value, className: "fas fa-ban text-danger"})
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