import { use, useEffect, useState } from "react"
import ReactDOM from 'react-dom';
import TourPag from "./TourPag"
import { uid } from 'uid/secure';
import ModalComprovanre from "./ModalComprovante";
import ModalAlert from "./ModalAlert";
import ModalDelete from "./ModalDelete";
import ModalComentario from "./ModalComentario";
import TabalaPagamento from "./TabelaPagamento";
const idPagamento = uid().toString();

export default function ModalPagamento(props){
    const [showAddPag, setShowAddPag] = useState(false)
    const [showEditPag, setShowEditPag] = useState({status: false})
    const [imagemUpload, setImagemUpload] = useState(false);
    const [dadosPagForm, setDadosPagForm] = useState({id_reserva: props.id});
    const dadosPag = props.pagamento.filter((item) => item.id_reserva === props.id);
    const [modalStatus, setModalStatus] = useState([]);
    const [modalSpinner, setModalSpinner] = useState(false);
    const [statusReserva, setStatusReserva] = useState('Pago')
    const [options, setOptions] = useState("");

    const scriptHtml = `<script type="text/javascript">
     { $(document).ready(() => {
        $('[data-toggle="popover"]').popover();
      })
        }
    </script>`
    useEffect(()=>{
        fetch("http://192.168.0.105:8800/opcoesForm", {
            method: "GET",
            headers:{ 
                'Content-Type': 'application/json',
                "authorization": JSON.parse(localStorage.getItem('user')).token}
        })
            .then((response) => response.json())
            .then((data) => {
                setOptions(data);
                console.log(options)
                //console.log(data);
            })
            .catch((error) => console.log(error));


        console.log(options)
        console.log(dadosPag)
        console.log(props.pagamento)
    },[props.updateCount])
    

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
            if(imagemUpload){formData.append("comprovante", imagemUpload)}
            if(dadosPagForm.id_reserva){formData.append("id_reserva", dadosPagForm.id_reserva);}
            if(dadosPagForm.dataPagamento){formData.append("dataPagamento", dadosPagForm.dataPagamento);}
            if(dadosPagForm.formaPagamento){formData.append("formaPagamento", dadosPagForm.formaPagamento);}
            if(dadosPagForm.valorPago){formData.append("valorPago", dadosPagForm.valorPago);}
            if(dadosPagForm.valorRestante){formData.append("valorRestante", dadosPagForm.valorRestante);}
            if(dadosPagForm.comentario){formData.append("comentario", dadosPagForm.comentario);}
            if(idPagamento){formData.append("idPagamento", idPagamento);}
            formData.append("status", "Pago");
        

            const reqPagReserva = {
                method: 'POST',
                headers:{ 
                    'Content-Type': 'application/json',
                    "authorization": JSON.parse(localStorage.getItem('user')).token},
                body: formData
            }
            fetch('http://192.168.0.105:8800/reservaPagamento', reqPagReserva).then(response => {
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
                            setShowAddPag(false)
                            setDadosPagForm({id_reserva: props.id})
                            props.setUpdateCount(true)
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


    const handerEdit = (e) => {
        e.preventDefault();
        const formData = new FormData();
            if(imagemUpload){formData.append("comprovante", imagemUpload)}
            if(dadosPagForm.dataPagamento){formData.append("dataPagamento", dadosPagForm.dataPagamento);}
            if(dadosPagForm.formaPagamento){formData.append("formaPagamento", dadosPagForm.formaPagamento);}
            if(dadosPagForm.valorPago){formData.append("valorPago", dadosPagForm.valorPago);}
            if(dadosPagForm.comentario){formData.append("comentario", dadosPagForm.comentario);}
            console.log(dadosPagForm)

            const reqPagReserva = {
                method: 'PUT',
                headers:{ 
                    'Content-Type': 'application/json',
                    "authorization": JSON.parse(localStorage.getItem('user')).token},
                body: formData
            }
            fetch(`http://192.168.0.105:8800/reservaPagamento/${showEditPag.id}`, reqPagReserva).then(response => {
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
                    console.log(data);
                    if(data){
                        setModalStatus(prevArray => [...prevArray,  {id:4, mostrar:true, status: true, message: "Sucesso ao Editar Pagamento", titulo: "Pagamento"}])
                        setModalSpinner(true)
                        setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))
                            setModalSpinner(false)
                            props.setUpdateCount(true)
                            setShowEditPag({status: false})
                            setImagemUpload(false)   
                        },2000)
                    }
                })
                .catch(e => {
                    setModalStatus(prevArray => [...prevArray, {id:4, mostrar:true, status: false, message: "Erro ao Editar Pagamento: " + e, titulo: "Pagamento"}])
                    setModalSpinner(true)
                    setTimeout(()=>{setModalStatus(modalStatus.filter((data)=> data.id !== 4))
                        setModalSpinner(false)
                    },2000)})

    }


    return(        
    <div className="modal fade text-dark" id={`modal${props.id}`} data-backdrop="static" data-keyboard="false" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
        <ModalAlert dados={modalStatus} />
        <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="modalLabel">Dados Pagamento</h5>
                    <button className="close" type="button" onClick={() => setShowEditPag({status: false})} data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="modal-body">
                    {dadosPag.length !== 0?
                    <>
                    <div className="table-responsive">
                    <table className="table table-sm table-bordered ">
                    <thead>
                        <tr>
                            <th>ID Pagamento</th>
                            <th>Data</th>
                            <th>Valor Pago</th>
                            <th>Comentário</th>
                            <th>Comprovante</th>
                            <th>Status</th>
                            <th>Opções</th>
                        </tr>
                    </thead>
                    <tbody>
                    {dadosPag&&dadosPag.map( (pag) =>
                    <tr>
                        <TabalaPagamento updateCount={props.updateCount} disabledButton={props.disabledButton} setUpdateCount={props.setUpdateCount} pag={pag} />
                        <td>
                            <button type="button" className="btn btn-sm mr-2 btn-warning" onClick={() => setShowEditPag({status: true, id: pag.idPagamento})} disabled={showEditPag.status || showAddPag} ><i className="fas fa-edit	"></i></button>
                            <button type="button" data-toggle="modal" data-target={`#deletePag${pag.idPagamento}`} className="btn btn-sm btn-danger"><i className="fa fa-trash"></i></button>
                            <ModalDelete title="Pagamento" setUpdateCount={props.setUpdateCount} idPag={pag.idPagamento}/>
                        </td>
                    </tr>
                        )}
                    </tbody>
                    </table>
                    </div>
                    <div  className="row ">
                    <div className=" border rounded mb-3 ml-auto col-4 mr-3">
                        <div className=" mb-4">
                                <div className="">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                                            Valor Total
                                            <span>R$ {(props.valorTotal).toFixed(2).replace(".", ",")}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                            Valor Pago
                                            <span>R$ {dadosPag.filter((item) => item.status === "Pago").reduce((sum, item) =>sum + item.valorPago,0).toFixed(2).replace(".", ",")}</span>
                                        </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                                            <div>
                                                <strong>Valor Restante</strong>                                            
                                            </div>
                                        <span><strong>R$ {(props.valorTotal - dadosPag.filter((item) => item.status === "Pago").reduce((sum, item) =>sum + item.valorPago,0)).toFixed(2).replace(".", ",")}</strong></span>
                                        </li>
                                    </ul>
                            </div>
                        </div>
                    </div>
                    </div>
                    </>
                    :<p>Não há dados de pagamento</p> }
                    {!showAddPag && !(showEditPag.status) && 
                        <div className="d-flex" >
                            <button className="ml-auto btn btn-primary" onClick={() => {setShowAddPag(true) 
                                setDadosPagForm({id_reserva: props.id})}}>
                                Adicionar Pagamento
                            </button>
                        </div>}
                    {showAddPag&& 
                    <form onSubmit={handleSubmit}>
                        <TourPag title='Adicionar'
                        options={options}
                        namePago={'Pago'} 
                        removerPag={setShowAddPag} 
                        type={"Pagamento"} 
                        devido={'Devido'}  
                        valorTotal = {(props.valorTotal - dadosPag.filter((item) => item.status === "Pago").reduce((sum, item) =>sum + item.valorPago,0))}
                        dadosPagForm={dadosPagForm} 
                        setImagemUpload={setImagemUpload} 
                        setDadosPagForm = {setDadosPagForm}/>
                        
                        <div className="d-flex" >
                            <button className="ml-auto btn btn-primary" type="submit">
                                Enviar
                            </button>
                        </div>
                    </form> }    
                    {showEditPag.status&& 
                    <form onSubmit={handerEdit}>
                        <TourPag 
                            title='Editar'
                            namePago={'Pago'} 
                            options={options}
                            removerPag={setShowEditPag} 
                            type={"Pagamento"} 
                            devido={'Devido'} 
                            editPag={showEditPag.status} 
                            idPag={showEditPag.id} 
                            dados={dadosPag.filter((pag) => pag.idPagamento === showEditPag.id)} 
                            valorTotal = {(props.valorTotal - dadosPag.filter((item) => item.status === "Pago").reduce((sum, item) =>sum + item.valorPago,0) + dadosPag.filter((pag) => pag.idPagamento === showEditPag.id)[0].valorPago)} 
                            dadosPagForm={dadosPagForm} 
                            setImagemUpload={setImagemUpload} 
                            setDadosPagForm = {setDadosPagForm}/>
                        <div className="d-flex" >
                            <button className="ml-auto btn btn-primary" type="submit">
                                Enviar
                            </button>
                        </div>
                    </form> }
                </div>
                {modalSpinner&&<div className="position-absolute w-100 h-100 d-flex" style={{backgroundColor: 'rgba(0, 0, 0, .2)'}}> 
                        <div className="spinner-border text-secondary m-auto" style={{width: '3rem', height: '3rem'}} role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>}  
            </div>
        </div>
    </div>)
}