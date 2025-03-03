import { useEffect, useState } from "react";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import TourPag from "./TourPag";
import { uid } from 'uid/secure';
import ModalAlert from "./ModalAlert";
import ModalComentario from "./ModalComentario";
import StatusEstorno from "./StatusEstorno";
import ModalDeleteEstorno from "./ModalDeleteEstorno";
import optionForm from "./lista.json"
import axios from "axios";
const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
      }
  });


DataTable.use(DT);
const idEstorno =  uid().toString();

export default function ModalEstorno(props){
    const [modalSpinner, setModalSpinner] = useState(false);
    const [modalStatus, setModalStatus] = useState([]);
    const [addEstorno, setModalAddEstorno] = useState(false);
    const [editarEstorno, setEditarEstorno] = useState(false);
    const [imagemUpload, setImagemUpload] = useState(false);
    const [dadosPagForm, setDadosPagForm] = useState({id_reserva: props.idR});
    const [showEditPag, setShowEditPag] = useState({status: false})
    const [options, setOptions] = useState("");


    useEffect(()=>{
        setOptions(optionForm)
    },[props.updateCount])
    
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
            if(imagemUpload){formData.append("comprovante", imagemUpload)}
            if(dadosPagForm.id_reserva){formData.append("id_reserva", dadosPagForm.id_reserva);}
            if(dadosPagForm.dataPagamento){formData.append("data", dadosPagForm.dataPagamento);}
            if(dadosPagForm.formaPagamento){formData.append("formaEstorno", dadosPagForm.formaPagamento);}
            if(dadosPagForm.valorPago){formData.append("valor", dadosPagForm.valorPago);}
            if(dadosPagForm.comentario){formData.append("comentario", dadosPagForm.comentario);}
            if(idEstorno){formData.append("idEstorno", idEstorno);}
            formData.append("status", "Pago");

            const reqEstorno = {
                method: 'POST',
                body: formData
            }
            fetch(`${process.env.REACT_APP_BASE_URL}/estorno/${localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'}`, reqEstorno).then(response => {
                if (!response.ok) {
                    setModalStatus(prevArray => [...prevArray,  {id:4, mostrar: true, status: false, message: "Erro de Conexão com banco de dados", titulo: "Estorno"}])
                    setModalSpinner(true)
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))
                        setModalSpinner(false)
                    },2000)
                    throw new Error('Network response was not ok');
                }
                return response.json();
                }).then(data => {
                    if(data){
                        setModalStatus(prevArray => [...prevArray,  {id:4, mostrar:true, status: true, message: "Sucesso ao Salvar Estorno", titulo: "Estorno"}])
                        setModalSpinner(true)
                        setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))
                            setModalSpinner(false)
                            setModalAddEstorno(false)
                            props.setUpdateCount(true)
                        },2000)
                    }
                })
                .catch(e => {
                setModalStatus(prevArray => [...prevArray, {id:4, mostrar:true, status: false, message: "Erro ao Salvar Estorno: " + e, titulo: "Estorno"}])
                setModalSpinner(true)
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))
                    setModalSpinner(false)
                },2000)})
    }

    const handleEdit = (e) => {
        e.preventDefault();

        const formData = new FormData();
            if(imagemUpload){formData.append("comprovante", imagemUpload)}
            if(dadosPagForm.dataPagamento){formData.append("data", dadosPagForm.dataPagamento);}
            if(dadosPagForm.formaPagamento){formData.append("formaEstorno", dadosPagForm.formaPagamento);}
            if(dadosPagForm.valorPago){formData.append("valor", dadosPagForm.valorPago);}
            if(dadosPagForm.comentario){formData.append("comentario", dadosPagForm.comentario);}
            formData.append("status", "Pago");

            const reqEstorno = {
                method: 'PUT',
                body: formData,
            }
            fetch(`${process.env.REACT_APP_BASE_URL}/estorno/${showEditPag.id}/${localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'}`, reqEstorno).then(response => {
                if (!response.ok) {
                    setModalStatus(prevArray => [...prevArray,  {id:4, mostrar: true, status: false, message: "Erro de Conexão com banco de dados", titulo: "Estorno"}])
                    setModalSpinner(true)
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))
                        setModalSpinner(false)
                    },2000)
                    throw new Error('Network response was not ok');
                }
                return response.json();
                }).then(data => {
                    if(data){
                        setModalStatus(prevArray => [...prevArray,  {id:4, mostrar:true, status: true, message: "Sucesso ao Salvar Estorno", titulo: "Estorno"}])
                        setModalSpinner(true)
                        setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))
                            setModalSpinner(false)
                            setModalAddEstorno(false)
                            props.setUpdateCount(true)
                            setShowEditPag(false)
                        },2000)
                    }
                })
                .catch(e => {
                setModalStatus(prevArray => [...prevArray, {id:4, mostrar:true, status: false, message: "Erro ao Salvar Estorno: " + e, titulo: "Estorno"}])
                setModalSpinner(true)
                setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))
                    setModalSpinner(false)
                },2000)})
    }

    return (
        <div className="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" id={`estorno${props.idR}`}>
            <ModalAlert dados={modalStatus} />
            <div className="modal-dialog modal-xl">
                <div className="modal-content bg-light text-dark" role="alert">
                    <div className='modal-header'>
                        <h5 className="alert-heading"><i className="fas fa-exclamation-triangle text-warning"></i> Estorno Reserva {props.idR} </h5>
                        <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {props.estorno.length !== 0?
                        <>
                        <div className="table-responsive">
                            <table className="table table-sm table-hover mr-0 mt-3 w-100 ">
                                <thead>
                                <tr>
                                    <th className="text-left">ID</th>
                                    <th className="text-left">Data</th>
                                    <th className="text-left">Forma</th>
                                    <th className="text-left">Devolvido</th>
                                    <th className="text-left">Comprovante</th>
                                    <th className="text-left">Comentário</th>
                                    <th className="text-left">Status</th>
                                    <th className="text-left">Configurações</th>
                                </tr>
                            </thead>
                            {props.estorno.map(item => {
                                return (
                                    <tbody>
                                        <tr>
                                            <td>{item.idEstorno}</td>
                                            <td>{item.data.substr(0, 10).split('-').reverse().join('/')}</td>
                                            <td>{item.formaEstorno}</td>
                                            <td>R$ {item.valor.toFixed(2).replace(".", ",")}</td>
                                            <td>
                                                <a type="button" className="btn btn-sm btn-light" target="_blank" href={`${process.env.REACT_APP_BASE_URL}/imagemEstorno/${item.idEstorno}/${localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'}`}>
                                                    <i className="fas fa-image	"></i>
                                                    &nbsp; Ver
                                                </a>
                                            </td>
                                            <td>
                                                <a type="button" className="btn btn-sm btn-light" data-trigger="hover" data-toggle="modal" data-target={`#comentario${item.idEstorno}`} title="Comentário">
                                                <i className="fas fa-comment-alt"></i>
                                                    &nbsp; Ver
                                                </a>
                                                <ModalComentario title={'Comentário Estorno'} id={item.idEstorno} comentario={item.comentario}/>
                                            </td>
                                            <td>
                                                <StatusEstorno updateCount={props.updateCount} setUpdateCount={props.setUpdateCount} status={item.status} id={item.idEstorno}/>
                                            </td>
                                            <td>
                                                <button type="button" className="btn btn-sm mr-2 btn-warning" onClick={() => setShowEditPag({status: true, id: item.idEstorno})} disabled={showEditPag.status || addEstorno}><i className="fas fa-edit	"></i></button>
                                                <button type="button" data-toggle="modal" data-target={`#deleteEstorno${item.idEstorno}`} className="btn btn-sm btn-danger"><i className="fa fa-trash"></i></button>
                                                <ModalDeleteEstorno setUpdateCount={props.setUpdateCount} idEstorno = {item.idEstorno} title ={'Estorno'}/>
                                            </td>
                                        </tr>
                                    </tbody>
                                )
                            })}


                            </table>
                        </div>
                        <div  className="row ">
                        <div className=" border rounded mb-3 ml-auto col-4 mr-3">
                            <div className=" mb-4">
                                    <div className="">
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                                                Estorno Total
                                                <span>R$ {(props.valorTotal).toFixed(2).replace(".", ",")}</span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                                Valor Devolvido
                                                <span>R$ {props.estorno.filter((item) => item.status === "Pago").reduce((sum, item) =>sum + item.valor,0).toFixed(2).replace(".", ",")}</span>
                                            </li>
                                                <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                                                <div>
                                                    <strong>Estorno Restante</strong>                                            
                                                </div>
                                            <span><strong>R$ {(props.valorTotal - props.estorno.filter((item) => item.status === "Pago").reduce((sum, item) =>sum + item.valor,0)).toFixed(2).replace(".", ",")}</strong></span>
                                            </li>
                                        </ul>
                                </div>
                            </div>
                        </div>
                        </div>
                        </>
                        : "Não Há Estorno Registrado"}
                        {!addEstorno&&!showEditPag.status &&
                        <div className="d-flex">
                            <button type="button" className="btn btn-primary btn-sm ml-auto" onClick={() => {setModalAddEstorno(true)
                                setDadosPagForm({id_reserva: props.idR})
                            }}>Adicionar Estorno</button>
                        </div>}
                        {addEstorno&&
                        <form onSubmit={handleSubmit}>
                            <TourPag title='Adicionar'
                            type={'Estorno'}
                            options={options}
                            devido={'Estorno'}
                            namePago={'Devolvido'} 
                            valorTotal = {props.valorTotal}
                            removerPag ={setModalAddEstorno}
                            dadosPagForm= {dadosPagForm}
                            setImagemUpload={setImagemUpload} 
                            setDadosPagForm = {setDadosPagForm}/>
                            
                            <div className="d-flex" >
                                <button className="ml-auto btn btn-primary" type="submit">
                                    Adicionar
                                </button>
                            </div>
                        </form>}
                        {showEditPag.status&&
                        <form onSubmit={handleEdit}>
                            <TourPag title='Editar'
                            type={'Estorno'}
                            options={options}
                            devido={'Estorno'}
                            namePago={'Devolvido'}
                            editPag={showEditPag.status} 
                            idPag={showEditPag.id}
                            dados={props.estorno.filter((pag) => pag.idEstorno === showEditPag.id).map((item)=>{
                                return({id_reserva: item.id_reserva,
                                        idPagamento: item.idEstorno,
                                        dataPagamento: item.data,
                                        formaPagamento: item.formaEstorno,
                                        valorPago: item.valor,
                                        comentario: item.comentario,
                                        status: item.status
                                })
                            })}   
                            valorTotal = {props.valorTotal}
                            removerPag ={setShowEditPag}
                            dadosPagForm= {dadosPagForm}
                            setImagemUpload={setImagemUpload} 
                            setDadosPagForm = {setDadosPagForm}/>
                            
                            <div className="d-flex" >
                                <button className="ml-auto btn btn-primary" type="submit">
                                    Editar
                                </button>
                            </div>
                        </form>}
                    </div>
                    {modalSpinner&&<div className="position-absolute w-100 h-100 d-flex" style={{backgroundColor: 'rgba(0, 0, 0, .2)'}}> 
                        <div className="spinner-border text-secondary m-auto" style={{width: '3rem', height: '3rem'}} role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>} 
                </div>
            </div>
        </div>
)
}