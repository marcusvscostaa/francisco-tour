import { useState, useEffect } from "react"

export default function StatusTour(props){
            const [statusReserva, setStatusReserva] = useState('Confirmado')
    
            useEffect(()=>{
                if(props.status){          
                    if(props.status === 'Confirmado'){
                        setStatusReserva({status: 'Confirmado', className: "fas fa-check-circle text-success"})
                    }else if(props.status === 'Cancelado'){
                        setStatusReserva({status: 'Cancelado', className: "fas fa-ban text-danger"})
                    }            
                }else{
                    setStatusReserva({status: 'Confirmado', className: "fas fa-check-circle text-success"})
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({status: 'Confirmado', idtour: props.id})
                    };
                    fetch('http://localhost:8800/mudarStatusTour', requestOptions)
                    .then(response => {
                        console.log(response)
                    })   
                }    
            },[])
    
            const handleChange = (e)=> {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({status: e.target.value, idtour: props.id})
                };
                fetch('http://localhost:8800/mudarStatusTour', requestOptions)
                .then(response => {
                    console.log(response)
                  })   
                if(e.target.value === 'Confirmado'){
                    setStatusReserva({status: e.target.value, className: "fas fa-check-circle text-success"})
                    window.location.reload(false);
                }else if(e.target.value === 'Cancelado'){
                    setStatusReserva({status: e.target.value, className: "fas fa-ban text-danger"})
                    window.location.reload(false);
                }
            }
            
    return (
    <div className="dropdown">
        <a type="button" data-toggle="dropdown" aria-expanded="false">
            <i title={statusReserva.status} className={statusReserva.className}></i>
        </a>
        <div style={{ minWidth: "40px" }} className="dropdown-menu dropdown-menu-right">
            <button className="dropdown-item" value="Confirmado" onClick={handleChange}><i className="fas fa-check-circle text-success"></i> Confirmado</button>
            <button className="dropdown-item" value="Cancelado" onClick={handleChange}><i className="fas fa-ban text-danger"></i> Cancelado</button>
        </div>
    </div>
    )
}