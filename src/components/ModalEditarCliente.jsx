import { useEffect, useState } from "react";
import ModalAlert from "./ModalAlert";
import optionForm from "./lista.json"
import axios from "axios";
const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
      }
  });


export default function ModalEditarCliente(props){
    const [modalStatus, setModalStatus] = useState([]);
    const [modalSpinner, setModalSpinner] = useState(false);
    const [formCliente, setformCliente] = useState(
        {
            nome: props.dados.nome,
            telefone: props.dados.telefone,
            email: props.dados.email,
            paisOrigem: props.dados.paisOrigem,
            idioma: props.dados.idioma
        }    
    );
    const [dadosReserva, setDadosReserva] = useState()
    const [options, setOptions] = useState("");

    useEffect(() => {
        setOptions(optionForm)
    },[])

    const handleChange = (e) => {
        e.preventDefault();
        const name = e.target.name
        const value = e.target.value

        const newFormFields = { ...formCliente ,[name]: value}
        setformCliente(newFormFields)
    }

    const handerEdit = (e) => {
        e.preventDefault();

        instance.put(`/cliente/${props.id}`, JSON.stringify(formCliente))
        .then((response) => {
            console.log(response)
            if (response.data) {
                setModalStatus(prevArray => [...prevArray,  {id:3, mostrar:true, status: true, message: "Sucesso ao Salvar Cliente" , titulo: "Cliente"}])
                setModalSpinner(true)
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))
                                setModalSpinner(false)
                                props.setUpdateCount(true)
                                document.getElementById(`CloseEditarCliente${props.id}`).click()
                },3000)
            }else{
                setModalStatus(prevArray => [...prevArray,  {id:3, mostrar:true, status: false, message: "Erro de Conexão com banco de dados" , titulo: "Cliente"}])
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))},3000)
                throw new Error('Network response was not ok');
            }
        }).catch(e => {
            setModalStatus(prevArray => [...prevArray, {id:3, mostrar:true, status: false, message: "Erro ao Salvar Cliente: " + e , titulo: "Cliente"}])
            setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 3))},3000)})
        
        }
    return(
    <div className="modal fade" tabindex="-1" id={`clienteEditar${props.id}`} data-backdrop="static" data-keyboard="false" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <ModalAlert dados={modalStatus} />

        <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content bg-light text-dark" role="alert">
                <div className='modal-header'>
                    <h5 className="alert-heading"><i className="fas fa-exclamation-triangle text-warning"></i> Editar Cliente {props.dados.nome}</h5>
                    <button className="close" id={`CloseEditarCliente${props.id}`} type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="modal-body">
                    <form className="row g-3 needs-validation">
                        <div className="col-md-5 mb-3">
                            <label for="validationCustom01" className="form-label" >Nome Completo</label>
                            <input type="text" value={formCliente.nome} className="form-control form-control-sm" name="nome" id="validationCustom01" onChange={handleChange} required />
                        </div>
                        <div className="col-md-2 mb-3">
                            <label for="inputTelefone" className="form-label">Telefone</label>
                            <input type="tel" value={formCliente.telefone} className="form-control form-control-sm" name="telefone" id="validationCustom02" onChange={handleChange} required />
                        </div>
                        <div className="col-md-5 mb-3">
                            <label for="inputEmail" className="form-label aria-describedby">Email</label>
                            <input type="email" value={formCliente.email} className="form-control form-control-sm" name="email" id="inputEmail" onChange={handleChange} required />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label" for="paisOrigem">Pais de Origem</label>
                            <select value={formCliente.paisOrigem} className="form-control form-control-sm" name="paisOrigem" id="paisOrigem" onChange={handleChange}>
                                {options&& options.paisOrigem.map((item) => {
                                        return <option value={item}>{item}</option>
                                    })}
                            </select>
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label" for="idioma">Idioma</label>
                            <select value={formCliente.idioma} className="form-control form-control-sm" name="idioma" id="idioma" onChange={handleChange} required>
                                {options&& options.idioma.map((item) => {
                                        return <option value={item}>{item}</option>
                                    })}
                            </select>
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

    </div>
    )
}