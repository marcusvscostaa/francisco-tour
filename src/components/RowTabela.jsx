import { Fragment, useEffect, useState, useRef } from "react";
import RowTabelaChild from "./RowTabelaChild";
import ModalPagamento from "./ModalPagamento";
import ModalComentario from "./ModalComentario";
import ModalDeleteReserva from "./ModalDeleteReserva";
import ModalEditarReserva from "./ModalEditarReserva";
import axios from "axios";
const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        "authorization": localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'
        }
});



export default function RowTabela(props){
    const [collapseTable, setCollapseTable] = useState(false);
    const [pagamento, setPagamento] = useState(false);
    const [updateCount, setUpdateCount] = useState(false)
    const pagamentoreservas = (props.pagamentoreservas);
    const dadosTour =(props.tour).filter((tourR) => tourR.id_reserva === props.reserva.idR)
    const valorTotal = dadosTour.filter((tourR) => tourR.status === 'Confirmado').reduce((sum, element)=> sum + (element.quantidadeAdultos*element.valorAdulto) + (element.quantidadeCriancas * element.valorCrianca), 0);
    const [statusReserva, setStatusReserva] = useState('Confirmado')
    const[disabledButton, setDisabledButton] = useState(false)

    useEffect(()=>{
        if(props.reserva.status){          
            if(props.reserva.status === 'Confirmado'){
                setStatusReserva({status: 'Confirmado', className: "fas fa-check-circle text-success"})
                setDisabledButton(false)
            }else if(props.reserva.status === 'Pendente'){
                setStatusReserva({status: 'Pendente', className: "fas fa-exclamation-triangle text-warning"})
            }else if(props.reserva.status === 'Cancelado'){
                setDisabledButton(true)
                setStatusReserva({status: 'Cancelado', className: "fas fa-ban text-danger"})
            }            
        }else{
            setStatusReserva({status: 'Confirmado', className: "fas fa-check-circle text-success"})
            
            instance.put('/mudarStatus', JSON.stringify({status: 'Confirmado', idR: props.reserva.idR}))
            .catch(err => {console.log(err)})

        }
        if(pagamentoreservas){
           setPagamento(pagamentoreservas.filter((item) => (item.id_reserva === props.reserva.idR)).filter((item) => item.status === "Pago").reduce((sum, element)=> sum + element.valorPago, 0))
        
        }
        setUpdateCount(false)
    },[props.updateCount])

    const handleChange = (e)=> {
        instance.put('/mudarStatus', JSON.stringify({status: e.target.value, idR: props.reserva.idR}))
        .catch(err => {console.log(err)})
   
        if(e.target.value === 'Confirmado'){
            setDisabledButton(false)
            setStatusReserva({status: e.target.value, className: "fas fa-check-circle text-success"})
            dadosTour.map(item => {
                instance.post('/mudarStatusTour', JSON.stringify({status:'Confirmado', idtour: item.idtour}))
                .catch(err => {console.log(err)})  
            })
            pagamentoreservas.map(item => {
                if(item.id_reserva === props.reserva.idR) {
                    instance.post('/mudarStatusPagamento', JSON.stringify({status: 'Pago', idPagamento: item.idPagamento}))
                    .catch(err => {console.log(err)})  
                    props.setUpdateCount(true)
                }
            })
        }else if(e.target.value === 'Pendente'){
            setStatusReserva({status: e.target.value, className: "fas fa-exclamation-triangle text-warning"})
        }else if(e.target.value === 'Cancelado'){
            setDisabledButton(true)
            setStatusReserva({status: e.target.value, className: "fas fa-ban text-danger"})
            dadosTour.map(item => {
                instance.post('/mudarStatusTour', JSON.stringify({status:'Cancelado', idtour: item.idtour}))
                .catch(err => {console.log(err)})  
                props.setUpdateCount(true)
            })
            pagamentoreservas.map(item => {
                if(item.id_reserva === props.reserva.idR) {
                    instance.post('/mudarStatusPagamento', JSON.stringify({status: 'Cancelado', idPagamento: item.idPagamento}))
                    .catch(err => {console.log(err)}) 
                    props.setUpdateCount(true)   
                }
            })   
        }
    }


    return (
        <Fragment>
            <tr id={props.reserva.idR}>
            
                <td><i className="fas fa-user-alt"></i> {props.reserva.nome}</td>
                <td><i className="fas fa-calendar-alt"></i> {props.reserva.dataReserva.substr(0, 10).split('-').reverse().join('/')}</td>
                
                <td><a className="cpointer" data-toggle="collapse" data-target={"linha"+props.index}
                onClick={
                    (e) =>{
                        
                        if(collapseTable === false)
                        {
                            const myElement = document.getElementById(props.reserva.idR);
                            const newHTML = `<tr id=${props.reserva.idR+'x'}></tr>`;
                            myElement.insertAdjacentHTML('afterend', newHTML);
                            setCollapseTable(true);
                        }else{
                            setCollapseTable(false)
                        }
                    }
                }><i className={collapseTable?"fas fa-arrow-alt-circle-down	":"fas fa-arrow-alt-circle-right"}></i> Ver</a> {props.reserva.tour}
                        {/* collapseTable && <RowTabelaChild dadosTour={dadosTour} collapseTable={collapseTable} idcollapseTable={idcollapseTable}/> */}    
                </td>
                <td><a title="Ver Pagamento" data-toggle="modal" className="cpointer" data-target={`#modal${props.reserva.idR}`}>
                    {valorTotal > pagamento && pagamento > 0 && <span className="badge badge-pill badge-warning">Pendente</span>}
                    {valorTotal <= pagamento && <span className="badge badge-pill badge-success">Pago</span>}
                    {pagamento == 0 && valorTotal != 0 && <span className="badge badge-pill badge-danger">Não Pago</span>}
                    </a>
                    <ModalPagamento id={props.reserva.idR} disabledButton={disabledButton} pagamento={pagamentoreservas} updateCount={props.updateCount} valorTotal={valorTotal} setUpdateCount={props.setUpdateCount}/>
                    </td>
                <td className="text-left"><a href={`https://api.whatsapp.com/send?phone=${props.reserva.telefone}`} title="Abrir Whatsapp" target="_blank" rel="noopener noreferrer"><i className="fas fa-phone"></i> {props.reserva.telefone}</a></td>
                <td>R$: {valorTotal.toFixed(2).replace(".", ",")}</td>
                <td>
                    <a type="button" className="btn btn-sm btn-light" data-trigger="hover" data-toggle="modal" data-target={`#comentario${props.reserva.idR}`} title="Comentário">
                    <i className="fas fa-comment-alt"></i>
                        &nbsp; Ver
                    </a>
                    <ModalComentario title={'Comentário Reserva'} id={props.reserva.idR} comentario={props.reserva.comentario}/>
                </td>
                <td>
                    <div className="dropdown">
                    
                    <a type="button" data-toggle="dropdown" aria-expanded="false">
                    <i title={statusReserva.status} className={statusReserva.className}></i>
                    </a>
                    <div style={{minWidth: "40px"}} className="dropdown-menu dropdown-menu-right">
                        <button className="dropdown-item" value="Confirmado" onClick={handleChange}><i className="fas fa-check-circle text-success"></i> Confirmado</button>
                        <button className="dropdown-item" value="Cancelado"  onClick={handleChange}><i className="fas fa-ban text-danger"></i> Cancelado</button>
                    </div>
                    </div>                    
                </td>
                <td>
                    <button type="button" title="Editar" className="btn btn-sm mr-2 btn-warning" data-toggle='modal' data-target={`#reservaEditar${props.reserva.idR}`}><i className="fas fa-edit"></i></button>
                    <ModalEditarReserva dadosReserva={props.reserva} setUpdateCount={props.setUpdateCount} idR={props.reserva.idR}/>
                    <button type="button" title="Deletar" data-toggle='modal' data-target={`#reservaDelete${props.reserva.idR}`}className="btn btn-sm btn-danger"><i className="fa fa-trash"></i></button>
                    <ModalDeleteReserva idR = {props.reserva.idR} setUpdateCount={props.setUpdateCount}/>
                </td>
            </tr>
                {collapseTable && <RowTabelaChild idcollapseTable={props.reserva.idR+'x'} disabledButton={disabledButton} dadosTour={dadosTour} updateCount={props.updateCount} reserva={props.reserva} setUpdateCount={props.setUpdateCount}/>}
        </Fragment>
    )
}