import { useState } from "react";
import ModalAlert from "./ModalAlert";

export default function ModalDeleteTour(props){
    const [modalStatus, setModalStatus] = useState([]);

    const handerDelete = async (e) => {
        e.preventDefault();
        const requestOps = {
            method: 'DELETE'
        };
        await fetch(`http://localhost:8800/tour/${props.idTour}`, requestOps)
        .then(response => {
            if(response.status === 200) {
                setModalStatus(prevArray => [...prevArray,  {id:3, mostrar:true, status: true, message: "Sucesso Excluir Pagamento" , titulo: "Pagamento"}])
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))
                    window.location.reload();
                },5000)
            }
            if (!response.ok) {
                setModalStatus(prevArray => [...prevArray,  {id:3, mostrar:true, status: false, message: "Erro de Conexão com banco de dados" , titulo: "Pagamento"}])
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))},5000)
                throw new Error('Network response was not ok');
            }
            return response.json();
          }).catch(e => {
            setModalStatus(prevArray => [...prevArray, {id:3, mostrar:true, status: false, message: "Erro ao Excluir Pagamento: " + e , titulo: "Pagamento"}])
            setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))},5000)})
    
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
                </div>
            </div>
        </div>
    )
}