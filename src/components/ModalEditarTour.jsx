import { useEffect, useState, useCallback } from "react";
import ModalAlert from "./ModalAlert";
import TourForm from "./TourForm";
import optionForm from "./lista.json"
import { editarTour } from '../FranciscoTourService';

export default function ModalEditarTour(props){
    const [modalStatus, setModalStatus] = useState([]);
    const [modalSpinner, setModalSpinner] = useState(false);
    const [options, setOptions] = useState(null);

    const getInitialTourData = (dados) => ({
        id: '1',
        data: (dados?.data || '').substr(0, 10),
        destino: dados?.destino || '',
        tour: dados?.tour || '',
        numeroAdultos: dados?.quantidadeAdultos || 0,
        valorAdulto: dados?.valorAdulto || 0,
        numeroCriancas: dados?.quantidadeCriancas || 0,
        valorCriancas: dados?.valorCrianca || 0
    });
    const [tourData, setTourData] = useState(() => [getInitialTourData(props.dados)]);

    useEffect(() => {
        setTourData(() => [getInitialTourData(props.dados)]);
    }, [props.dados]);

    useEffect(() => {
        setOptions(optionForm)
    },[]);

    const handleTourFormUpdate = useCallback((newFormData) => {
        setTourData(newFormData);
    }, []);

    const handerEdit = async (e) => {
        e.preventDefault();
        setModalSpinner(true);
        let success = false;
        
        try {

            const tourDataToSend = tourData[0];

            if (!tourDataToSend) {
                throw new Error('Dados do Tour não encontrados no formulário.');
            }
            delete tourDataToSend.id;
            const response = await editarTour(props.idtour, tourDataToSend);

            if (response.data) {
                setModalStatus(prevArray => [...prevArray, { id: 3, mostrar: true, status: true, message: "Sucesso ao Salvar Tour", titulo: "Tour" }]);
                success = true;
            } else {
                throw new Error('Erro de Conexão com banco de dados');
            }

        } catch (error) {
            console.error("Erro na edição do tour:", error);
            const errorMessage = error.message || "Erro desconhecido ao Salvar Tour";
            setModalStatus(prevArray => [...prevArray, { id: 3, mostrar: true, status: false, message: errorMessage, titulo: "Tour" }]);
        } finally {
            setTimeout(() => {
                setModalStatus([]);
                setModalSpinner(false);
                
                if (success) {
                    props.setUpdateCount(prevCount => prevCount + 1); 
                    
                    if (window.$) {
                        window.$(`#editarTour${props.idtour}`).modal('hide');
                    } else if (document.getElementById(`CloseEditarTour${props.idtour}`)) {
                         document.getElementById(`CloseEditarTour${props.idtour}`).click();
                    }
                }
            }, 3000);
        }
    };

    return (
        <div className="modal fade" tabindex="-1" id={`editarTour${props.idtour}`} data-backdrop="static" data-keyboard="false"  role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
            <ModalAlert dados={modalStatus} />
            
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content bg-light text-dark" role="alert">
                    <div className='modal-header'>
                        <h5 className="alert-heading"><i className="fas fa-exclamation-triangle text-warning"></i> Editar o Tour {props.idtour}</h5>
                        <button className="close" id={`CloseEditarTour${props.idtour}`} type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <form onSubmit={handerEdit}>
                    <div className="modal-body">
                        <TourForm 
                            atualizarValor={setTourData}
                            numbTour="1"
                            id_reserva ={props.dados?.id_reserva || 'ppp'}
                            options={options}
                            calculoTotal={tourData}/>
                    </div>
                    <div className="modal-footer mb-0">
                        <button type="submit" className="btn btn-warning"><i className="fas fa-edit"></i> Editar Tour</button>
                    </div>
                    </form>
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