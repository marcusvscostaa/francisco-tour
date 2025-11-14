import { useEffect, useState } from "react";
import TourForm from "./TourForm";
import ModalAlert from "./ModalAlert";
import optionForm from "./lista.json"
import { createTour} from "../FranciscoTourService";
import { notification } from 'antd';


export default function ModalAdicionarTour(props){
    const [calculoTotal, setcalculoTotal] = useState([
    {id: '1', id_reserva: props.id, data:'', destino: '', tour: "", numeroAdultos: 0, valorAdulto: 0, numeroCriancas: 0, valorCriancas: 0 } ]);
    const [modalStatus, setModalStatus] = useState([]);
    const [modalSpinner, setModalSpinner] = useState(false);
    const [options, setOptions] = useState("");

    useEffect(()=>{
        setOptions(optionForm)    
    },[])

    const closeModal = () => {
         const closeButton = document.getElementById(`modalX${props.id}`);
         if (closeButton) {
             closeButton.click();
             props.setUpdateCount(prev => prev + 1);
         }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setModalSpinner(true);
        setModalStatus([]);
        
        const tourData = { ...calculoTotal[0] };
        delete tourData.id; 
        
        try {
            const response = await createTour(tourData);
            
            if (response && (response.status === 201 || response.status === 200)) {
                notification.success({
                    message: 'Tour Salvo!',
                    description: `O novo tour foi registrado com sucesso para a reserva ${props.id}.`,
                    placement: 'topRight',
                });

                closeModal();
                
            } else {
                const errorData = (response && response.json) ? await response.json() : {};
                notification.error({
                    message: 'Erro ao Salvar Tour',
                    description: errorData.mensagem || errorData.message || 'Falha ao processar a requisição.',
                    placement: 'topRight',
                });
            }
            
        } catch (error) {
            notification.error({
                message: 'Erro de Conexão',
                description: 'Não foi possível se comunicar com o servidor. Tente novamente.',
                placement: 'topRight',
            });
            
        } finally {
            setModalSpinner(false);
        }
    }
    
    return(
        <div className="modal fade text-dark" id={`modalT${props.id}`} data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <ModalAlert dados={modalStatus} />
        <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="modalLabel">Adicionar Tour {props.id}</h5>
                    <button id={`modalX${props.id}`} className="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <TourForm
                            options={options}
                            numbTour={'1'} 
                            atualizarValor={setcalculoTotal}
                            key={'1'}
                            id_reserva = {props.id}
                            calculoTotal= {calculoTotal} />
                             <div className="col-md-12 d-flex">
                                <button type="submit" className="ml-auto btn btn-primary" >Salvar Tour</button>
                            </div>
                    </form>                   
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