import { useState } from "react";
import ModalAlert from "./ModalAlert";

export default function ModalDeleteTour(props){
    const [modalStatus, setModalStatus] = useState([]);
    const [modalSpinner, setModalSpinner] = useState(false);

    const handerDelete = async (e) => {
        e.preventDefault();
        const requestOps = {
            method: 'DELETE',
            headers:{ 
                'Content-Type': 'application/json',
                "authorization": localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'}
        };
        await fetch(`${process.env.REACT_APP_BASE_URL}/tour/${props.idTour}`, requestOps)
        .then(response => {

            if (!response.ok) {
                    setModalStatus(prevArray => [...prevArray,  {id:3, mostrar:true, status: false, message: "Erro de Conexão com banco de dados" , titulo: "Pagamento"}])
                    setModalSpinner(true)
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))
                    setModalSpinner(false)
                },2000)
                throw new Error('Network response was not ok');
            }
            return response.json();
          }).then(data =>{
            if(data){
                    setModalStatus(prevArray => [...prevArray,  {id:3, mostrar:true, status: true, message: "Sucesso Excluir Pagamento" , titulo: "Pagamento"}])
                    setModalSpinner(true)
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))
                    setModalSpinner(false)
                    props.setUpdateCount(true)
                    document.getElementById(`tourDelete${props.idTour}`).click()
                },2000)
            }
          }).catch(e => {
                setModalStatus(prevArray => [...prevArray, {id:3, mostrar:true, status: false, message: "Erro ao Excluir Pagamento: " + e , titulo: "Pagamento"}])
                setModalSpinner(true)
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))
                setModalSpinner(false)
            },2000)})
    
    }

    return(
        <div className="modal fade" tabindex="-1" id={`tourDelete${props.idTour}`}>
            <ModalAlert dados={modalStatus} />
            
            <div className="modal-dialog modal-dialog-centered ">
                <div className="modal-content bg-light text-dark" role="alert">
                    <div className='modal-header'>
                    <h5 className="alert-heading"><i className="fas fa-exclamation-triangle text-warning"></i> Excluir o {props.title} {props.idTour}</h5>
                    </div>
                    <div className="modal-footer mb-0">
                        <p className="mr-auto">Clique fora do card para fechar</p>
                        <button type="button" className="btn btn-danger" onClick={handerDelete} ><i className="fa fa-trash"></i> Sim</button>
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