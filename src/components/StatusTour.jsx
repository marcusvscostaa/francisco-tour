import { useState, useEffect } from "react"
import axios from "axios";
const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        "authorization": localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'
      }
  });

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
            instance.post('/mudarStatusTour', JSON.stringify({status: 'Confirmado', idtour: props.id}))
            .catch(err => console.error(err))   
        }    
    },[props.updateCount])

    const handleChange = (e)=> {
        instance.post('/mudarStatusTour', JSON.stringify({status: e.target.value, idtour: props.id}))
        .catch(err => console.error(err))  
        
        if(e.target.value === 'Confirmado'){
            setStatusReserva({status: e.target.value, className: "fas fa-check-circle text-success"})
            props.setUpdateCount(true)
        }else if(e.target.value === 'Cancelado'){
            setStatusReserva({status: e.target.value, className: "fas fa-ban text-danger"})
            props.setUpdateCount(true)
        }
    }
            
    return (
    <div className="dropdown">
        <a type="button" data-toggle="dropdown" aria-expanded="false" >
            <i title={statusReserva.status} className={statusReserva.className}></i>
        </a>
        <div style={{ minWidth: "40px" }} className="dropdown-menu dropdown-menu-right">
            <button className="dropdown-item" value="Confirmado" onClick={handleChange} disabled={props.disabledButton}><i className="fas fa-check-circle text-success"></i> Confirmado</button>
            <button className="dropdown-item" value="Cancelado" onClick={handleChange} disabled={props.disabledButton}><i className="fas fa-ban text-danger"></i> Cancelado</button>
        </div>
    </div>
    )
}