import { useEffect, useState, useRef, useCallback } from "react";
import ModalAlert from "./ModalAlert";
import optionForm from "./lista.json";
import { editarReserva } from '../FranciscoTourService';

export default function ModalEditarReserva(props) {
    const modalRef = useRef(null);
    const MODAL_ID = `reservaEditar${props.idR}`;

    const [modalStatus, setModalStatus] = useState([]);
    const [modalSpinner, setModalSpinner] = useState(false);
    const [options, setOptions] = useState(null);
    const [dadosReserva, setDadosReserva] = useState({
        dataReserva: (props.dadosReserva.dataReserva || '').substr(0, 10),
        endereco: props.dadosReserva.endereco || '',
        hotel: props.dadosReserva.hotel || '',
        quarto: props.dadosReserva.quarto || '',
        zona: props.dadosReserva.zona || '',
        comentario: props.dadosReserva.comentario || ''
    });

    useEffect(() => {
        setDadosReserva({
            dataReserva: (props.dadosReserva.dataReserva || '').substr(0, 10),
            endereco: props.dadosReserva.endereco || '',
            hotel: props.dadosReserva.hotel || '',
            quarto: props.dadosReserva.quarto || '',
            zona: props.dadosReserva.zona || '',
            comentario: props.dadosReserva.comentario || ''
        });
    }, [props.dadosReserva]);

    useEffect(() => {
        setOptions(optionForm)
    },[])

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setDadosReserva(prevDados => ({
            ...prevDados,
            [name]: value
        }));
    }, []);

    const handerEdit = async (e) => {
        e.preventDefault();
        setModalSpinner(true);
        let success = false;
        
        try {
            const response = await editarReserva(props.idR, dadosReserva);
            if (response.data) {
                setModalStatus(prevArray => [...prevArray, {id: 3, mostrar: true, status: true, message: "Sucesso ao Salvar Reserva", titulo: "Reserva"}]);
                success = true;
            } else {
                throw new Error('Erro de Conexão com banco de dados');
            }

        } catch (error) {
            console.error("Erro na edição da reserva:", error);
            const errorMessage = error.message || "Erro desconhecido ao Salvar Reserva";
            setModalStatus(prevArray => [...prevArray, {id: 3, mostrar: true, status: false, message: errorMessage, titulo: "Reserva"}]);
        } finally {
            setTimeout(() => {
                setModalStatus([]);
                setModalSpinner(false);
                
                if (success) {
                    props.setUpdateCount(prevCount => prevCount + 1); 
                    if (window.$ && window.$(`#${MODAL_ID}`)) {
                        window.$(`#${MODAL_ID}`).modal('hide');
                    } else if (document.getElementById(MODAL_ID)) {
                        document.getElementById(MODAL_ID).querySelector('[data-dismiss="modal"]').click();
                    }
                }
            }, 3000);
        }
    };

    return (
        <div className="modal fade" tabindex="-1" id={`reservaEditar${props.idR}`} data-backdrop="static" data-keyboard="false" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <ModalAlert dados={modalStatus} />

            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content bg-light text-dark" role="alert">
                    <div className='modal-header'>
                        <h5 className="alert-heading"><i className="fas fa-exclamation-triangle text-warning"></i> Editar Reserva {props.idR}</h5>
                        <button className="close" id={`CloseEditarTour${props.idR}`} type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form className="row g-3 needs-validation">
                            <div className="col-md-2 mb-3">
                                <label for="inputDate" className="form-label">Data</label>
                                <input type="date" name="dataReserva" value={dadosReserva.dataReserva} onChange={handleChange} className="form-control form-control-sm" id="inputDate" required />
                            </div>
                            <div className="col-md-5 mb-3">
                                <label for="inputEndereco" className="form-label">Endereço</label>
                                <input type="text" value={dadosReserva.endereco} onChange={handleChange} className="form-control form-control-sm" name="endereco" id="inpuEndereco" required />
                            </div>
                            <div className="col-md-2 mb-3">
                                <label for="inputHotel" className="form-label">Hotel</label>
                                <input type="text" value={dadosReserva.hotel} onChange={handleChange} className="form-control form-control-sm" name="hotel" id="inputHotel" />
                            </div>
                            <div className="col-md-2 mb-3">
                                <label for="inputQuarto" className="form-label">Nº Quarto</label>
                                <input type="number" value={dadosReserva.quarto} onChange={handleChange} className="form-control form-control-sm" name="quarto" id="inputQuarto" />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label" for="zona">Zona</label>
                                <select value={dadosReserva.zona} onChange={handleChange} className="form-control form-control-sm" name="zona" id="zona" >
                                {options&& options.zona.map((item) => {
                                    return <option value={item}>{item}</option>
                                })}
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label for="validationTextarea">Comentário da Reserva</label>
                                <textarea value={dadosReserva.comentario} name="comentario" onChange={handleChange} className="form-control" id="validationTextarea" placeholder="Escreva um comentário..." ></textarea>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer mb-0">
                        <button type="button" className="btn btn-warning" onClick={handerEdit} ><i className="fas fa-edit"></i> Editar Reserva</button>
                    </div>
                    {modalSpinner && <div className="position-absolute w-100 h-100 d-flex" style={{ backgroundColor: 'rgba(0, 0, 0, .2)' }}>
                        <div className="spinner-border text-secondary m-auto" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>}
                </div>
            </div>

        </div>)
}