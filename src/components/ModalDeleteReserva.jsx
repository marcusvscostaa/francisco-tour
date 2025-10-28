import { useState } from "react";
import ModalAlert from "./ModalAlert";

export default function(props) {
    const [modalStatus, setModalStatus] = useState([]);
    const [modalSpinner, setModalSpinner] = useState(false);

    
    const handerDelete = async () => {
        const deletePagReserva = {
            method: 'DELETE',
            headers:{ 
                'Content-Type': 'application/json',
                "authorization": localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'}            
        };

        await fetch(`${process.env.REACT_APP_BASE_URL}/pagamento/${props.idR}`, deletePagReserva)
        .then(response => {
            if (!response.ok) {
                setModalStatus(prevArray => [...prevArray,  {id:1, mostrar:true, status: false, message: "Erro de Conexão com banco de dados" , titulo: "Pagamento"}])
                setModalSpinner(true)
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 1))
                    setModalSpinner(false)
                },2000)
                throw new Error('Network response was not ok');
            }
            return response.json();
          }).then(data=>{
            if(data) {
                setModalStatus(prevArray => [...prevArray,  {id:1, mostrar:true, status: true, message: "Sucesso Excluir Pagamento" , titulo: "Pagamento"}])
                setModalSpinner(true)
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 1))
                    setModalSpinner(false)
                },2000)
            }
          }).catch(e => {
            setModalStatus(prevArray => [...prevArray, {id:1, mostrar:true, status: false, message: "Erro ao Excluir Pagamento: " + e , titulo: "Pagamento"}])
            setModalSpinner(true)
            setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 1))
                setModalSpinner(false)
            },2000)})
        
            const deleteTour = {
            method: 'DELETE',
            headers:{ 
                'Content-Type': 'application/json',
                "authorization": localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'}
            };

        await fetch(`${process.env.REACT_APP_BASE_URL}/reservatour/${props.idR}`, deleteTour)
        .then(response => {
            if (!response.ok) {
                setModalStatus(prevArray => [...prevArray,  {id:2, mostrar:true, status: false, message: "Erro de Conexão com banco de dados" , titulo: "Tour"}])
                setModalSpinner(true)
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 2))
                    setModalSpinner(false)
                },2000)
                throw new Error('Network response was not ok');
            }
            return response.json();
          }).then(data => {
            if(data) {
                setModalStatus(prevArray => [...prevArray,  {id:2, mostrar:true, status: true, message: "Sucesso Excluir Tour" , titulo: "Tour"}])
                setModalSpinner(true)
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 2))
                    setModalSpinner(false)
                },2000)
            }
          }).catch(e => {
            setModalStatus(prevArray => [...prevArray, {id:2, mostrar:true, status: false, message: "Erro ao Excluir Tour: " + e , titulo: "Tour"}])
            setModalSpinner(true)
            setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 2))
                setModalSpinner(false)
            },2000)})
        
        const deleteReserva = {
            method: 'DELETE',
            headers:{ 
                'Content-Type': 'application/json',
                "authorization": localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'}
        };

        await fetch(`${process.env.REACT_APP_BASE_URL}/reserva/${props.idR}`, deleteReserva)
        .then(response => {
            if (!response.ok) {
                setModalStatus(prevArray => [...prevArray,  {id:3, mostrar:true, status: false, message: "Erro de Conexão com banco de dados" , titulo: "Reserva"}])
                setModalSpinner(true)
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))
                    setModalSpinner(false)
                },2000)
                throw new Error('Network response was not ok');
            }
            return response.json();
          }).then(data=>{
            if(data) {
                setModalStatus(prevArray => [...prevArray,  {id:3, mostrar:true, status: true, message: "Sucesso Excluir Reserva" , titulo: "Reserva"}])
                setModalSpinner(true)
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))
                    setModalSpinner(false)
                    //window.location.reload();
                    props.setUpdateCount(true)
                    document.getElementById(`reservaDelete${props.idR}`).click()                    
                },2000)
            }
          }).catch(e => {
            setModalStatus(prevArray => [...prevArray, {id:3, mostrar:true, status: false, message: "Erro ao Excluir Reserva: " + e , titulo: "Reserva"}])
            setModalSpinner(true)
            setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))
                setModalSpinner(false)
            },2000)})
    
    }
    return(
        <div className="modal fade" tabindex="-1" id={`reservaDelete${props.idR}`}>
            <ModalAlert dados={modalStatus} />
            
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content bg-light text-dark " role="alert">
                    <div className='modal-header'>
                    <h5 className="alert-heading"><i className="fas fa-exclamation-triangle text-warning"></i> Excluir a Reserva {props.idR}</h5>
                    <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                   </div>
                    <div className="modal-footer mb-0">
                        <p style={{fontSize: '1.2rem'}} class="font-weight-normal">Todos os dados da Reserva serão <span class="badge badge-danger text-monospace" >excluídos permanentemente</span>, 
                            inclusive <span class="badge badge-danger text-monospace">pagamento e tour</span> relacionados à reserva. 
                            Caso deseje cancelar a reserva sem perder os dados, você pode mudar o status da reserva.</p>
                        <button type="button" className="btn btn-danger" onClick={handerDelete} ><i className="fa fa-trash"></i> Sim</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Não</button>
                    </div>
                    {modalSpinner&&<div className="position-absolute w-100 h-100 d-flex" style={{backgroundColor: 'rgba(0, 0, 0, .2)'}}> 
                        <div className="spinner-border text-secondary m-auto" style={{width: '3rem', height: '3rem'}} role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>}  
                </div>
            </div>
        </div>
    )
}