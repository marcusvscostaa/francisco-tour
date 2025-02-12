import { useEffect, useState } from "react";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import TourPag from "./TourPag";
import { uid } from 'uid/secure';
import ModalAlert from "./ModalAlert";
import ModalComentario from "./ModalComentario";
import StatusEstorno from "./StatusEstorno";

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

    useEffect(()=>{
        console.log(props.estorno)
    },[])
    
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
            fetch('http://192.168.0.105:8800/estorno', reqEstorno).then(response => {
                if (!response.ok) {
                    setModalStatus(prevArray => [...prevArray,  {id:4, mostrar: true, status: false, message: "Erro de Conexão com banco de dados", titulo: "Pagamento"}])
                    setModalSpinner(true)
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))
                        setModalSpinner(false)
                    },2000)
                    throw new Error('Network response was not ok');
                }
                return response.json();
                }).then(data => {
                    if(data){
                        setModalStatus(prevArray => [...prevArray,  {id:4, mostrar:true, status: true, message: "Sucesso ao Salvar Pagamento", titulo: "Pagamento"}])
                        setModalSpinner(true)
                        setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))
                            setModalSpinner(false)
                            setModalAddEstorno(false)
                            //props.setUpdateCount(true)
                        },2000)
                    }
                })
                .catch(e => {
                setModalStatus(prevArray => [...prevArray, {id:4, mostrar:true, status: false, message: "Erro ao Salvar Pagamento: " + e, titulo: "Pagamento"}])
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
                                            <td>R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                            <td>
                                                <a type="button" className="btn btn-sm btn-light" target="_blank" href={`http://192.168.0.105:8800/imagemEstorno/${item.idEstorno}`}>
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
                                                <StatusEstorno status={item.status} id={item.idEstorno}/>
                                            </td>
                                            <td>
                                                <button type="button" className="btn btn-sm mr-2 btn-warning" onClick={() => setShowEditPag({status: true, id: item.idEstorno})} disabled={showEditPag.status || addEstorno}><i className="fas fa-edit	"></i></button>
                                                <button type="button" data-toggle="modal" data-target={`#deletePag${item.idEstorno}`} className="btn btn-sm btn-danger"><i className="fa fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                )
                            })}


                            </table>

                        : "Não Há Estorno Registrado"}
                        {!addEstorno&&!showEditPag.status &&
                        <div className="d-flex">
                            <button type="button" className="btn btn-primary btn-sm ml-auto" onClick={() => setModalAddEstorno(true)}>Adicionar Estorno</button>
                        </div>}
                        {addEstorno&&
                        <form onSubmit={handleSubmit}>
                            <TourPag title='Adicionar'
                            type={'Estorno'}
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
                        <form>
                            <TourPag title='Editar'
                            type={'Estorno'}
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