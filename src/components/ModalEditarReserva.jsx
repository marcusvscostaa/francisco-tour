import { useEffect, useState } from "react";
import ModalAlert from "./ModalAlert";

export default function ModalEditarReserva(props) {
    const [modalStatus, setModalStatus] = useState([]);
    const [modalSpinner, setModalSpinner] = useState(false);
    const [dadosReserva, setDadosReserva] = useState({
        dataReserva: (props.dadosReserva.dataReserva).substr(0, 10),
        endereco: props.dadosReserva.endereco,
        hotel: props.dadosReserva.hotel,
        quarto: props.dadosReserva.quarto,
        zona: props.dadosReserva.zona,
        comentario: props.dadosReserva.comentario

    })

    useEffect(() => {
        console.log(props.dadosReserva);
    })

    const handleChange = (e) => {
        e.preventDefault();
        const name = e.target.name
        const value = e.target.value

        const newFormFields = { ...dadosReserva ,[name]: value}
        setDadosReserva(newFormFields)
    }

    const handerEdit = (e) => {
        e.preventDefault();
        
        const editReserva = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosReserva)
        }
        fetch(`http://localhost:8800/reserva/${props.idR}`, editReserva).then(response => {
            console.log(response);  
            if (!response.ok) {
                setModalStatus(prevArray => [...prevArray,  {id:4, mostrar: true, status: false, message: "Erro de Conexão com API", titulo: "Tour"}])
                setModalSpinner(true)
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))
                    setModalSpinner(false)
                },2000)
                throw new Error('Network response was not ok');
            }
            return response.json();
            }).then(data => {
                if(data){
                    console.log(data);
                    setModalStatus(prevArray => [...prevArray,  {id:4, mostrar:true, status: true, message: "Sucesso ao Editar Tour", titulo: "Tour"}])
                    setModalSpinner(true)
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))
                        setModalSpinner(false)
                        props.setUpdateCount(true)
                        document.getElementById(`reservaEditar${props.idR}`).click()
                    },2000)
                }
            })
            .catch(e => {
            setModalStatus(prevArray => [...prevArray, {id:4, mostrar:true, status: false, message: "Erro ao Editar Tour: " + e, titulo: "Tour"}])
            setModalSpinner(true)
            setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))
                setModalSpinner(false)
            },2000)})



    }

    return (
        <div className="modal fade" tabindex="-1" id={`reservaEditar${props.idR}`} data-backdrop="static" data-keyboard="false" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <ModalAlert dados={modalStatus} />

            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content bg-light text-dark" role="alert">
                    <div className='modal-header'>
                        <h5 className="alert-heading"><i className="fas fa-exclamation-triangle text-warning"></i> Editar Reserva {props.idtour}</h5>
                        <button className="close" id={`CloseEditarTour${props.idtour}`} type="button" data-dismiss="modal" aria-label="Close">
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
                                    <option selected>Zona...</option>
                                    <option value="Centro">Centro</option>
                                    <option value="Bairro">Bairro</option>
                                    <option value="Sul">Sul</option>
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