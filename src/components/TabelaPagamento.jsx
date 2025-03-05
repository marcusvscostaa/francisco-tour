import { useState, useEffect } from "react"
import ModalComentario from "./ModalComentario";
import axios from "axios";
const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        "authorization": localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'
      }
  });

export default function TabalaPagamento(props){
    const [statusReserva, setStatusReserva] = useState('')


    useEffect(()=>{
        if(props.pag.status){          
            if(props.pag.status === 'Pago'){
                setStatusReserva({status: 'Pago', className: "fas fa-check-circle text-success"})
            }else if(props.pag.status === 'Cancelado'){
                setStatusReserva({status: 'Cancelado', className: "fas fa-ban text-danger"})
            }            
        }   
    },[props.updateCount])

    const handleChange = (e)=> {
        e.preventDefault();

        instance.post('/mudarStatusPagamento', JSON.stringify({status: e.target.value, idPagamento: props.pag.idPagamento}))
        .catch(err => console.error(err))
        props.setUpdateCount(true)

        if(e.target.value === 'Pago'){
            setStatusReserva({status: e.target.value, className: "fas fa-check-circle text-success"})
            
        }else if(e.target.value === 'Cancelado'){
            setStatusReserva({status: e.target.value, className: "fas fa-ban text-danger"})
        }
    }
    return(
        <>
            <td>{props.pag.idPagamento}</td>
            <td>{props.pag.dataPagamento.substr(0, 10).split('-').reverse().join('/')}</td>
            <td>R$: {props.pag.valorPago.toFixed(2).replace(".", ",")}</td>
            <td>
                <a type="button" className="btn btn-sm btn-light" data-trigger="hover" data-toggle="modal" data-target={`#comentario${props.pag.idPagamento}`} title="Comentário">
                    <i className="fas fa-comment-alt"></i>
                        &nbsp; Ver
                </a>
                <ModalComentario title={'Comentário Pagamento'} id={props.pag.idPagamento} comentario={props.pag.comentario}/>                
            </td>
            <td>
                <a type="button" className="btn btn-sm btn-light" target="_blank" href={`${process.env.REACT_APP_BASE_URL}/imagem/${props.pag.idPagamento}/${localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'}`}>
                    <i className="fas fa-image	"></i>
                    &nbsp; Ver
                </a>
            </td>
            <td>
                <div className="dropdown">
                
                <a type="button" data-toggle="dropdown" aria-expanded="false">
                <i title={statusReserva.status} className={statusReserva.className}></i>
                </a>
                <div style={{minWidth: "40px"}} className="dropdown-menu dropdown-menu-right">
                    <button className="dropdown-item" value="Pago" onClick={handleChange} disabled={props.disabledButton}><i className="fas fa-check-circle text-success"></i> Pago</button>
                    <button className="dropdown-item" value="Cancelado"  onClick={handleChange} disabled={props.disabledButton}><i className="fas fa-ban text-danger"></i> Cancelado</button>
                </div>
                </div>                    
            </td>

        </>
    )
}