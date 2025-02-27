import { useState } from "react";
import ModalAlert from "./ModalAlert";

export default function ModalDeleteEstorno(props){
    const [modalStatus, setModalStatus] = useState([]);
    const [modalSpinner, setModalSpinner] = useState(false);    
   
    const handerDelete = async () => {
        const requestOps = {
            method: 'DELETE',
            headers:{ 
                'Content-Type': 'application/json',
                "authorization": JSON.parse(localStorage.getItem('user')).token},
        };
        await fetch(`${process.env.REACT_APP_BASE_URL}/estorno/${props.idEstorno}`, requestOps)
        .then(response => {
            if(response.status === 200) {
                setModalStatus(prevArray => [...prevArray,  {id:3, mostrar:true, status: true, message: "Sucesso Excluir Estorno" , titulo: "Estorno"}])
                setModalSpinner(true)
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))
                    setModalSpinner(false)
                    props.setUpdateCount(true)
                    document.getElementById(`deleteEstorno${props.idEstorno}`).click()                    
                },2000)
            }
            if (!response.ok) {
                setModalStatus(prevArray => [...prevArray,  {id:3, mostrar:true, status: false, message: "Erro de Conexão com banco de dados" , titulo: "Estorno"}])
                setModalSpinner(true)
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))
                    setModalSpinner(false)
                },2000)
                throw new Error('Network response was not ok');
            }
            return response.json();
          }).catch(e => {
            setModalStatus(prevArray => [...prevArray, {id:3, mostrar:true, status: false, message: "Erro ao Excluir Estorno: " + e , titulo: "Estorno"}])
            setModalSpinner(true)
            setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))
                setModalSpinner(false)
            },2000)})
    
    }

    return (
        <div className="modal fade" tabindex="-1" id={`deleteEstorno${props.idEstorno}`}>
            <ModalAlert dados={modalStatus} />
            
            <div className="modal-dialog modal-dialog-centered ">
                <div className="modal-content bg-light text-dark" role="alert">
                    <div className='modal-header'>
                    <h5 className="alert-heading"><i className="fas fa-exclamation-triangle text-warning"></i> Excluir o {props.title} {props.idEstorno}</h5>
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