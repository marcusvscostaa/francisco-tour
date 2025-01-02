import { use, useEffect, useState } from "react"
import ReactDOM from 'react-dom';
import TourPag from "./TourPag"
import { uid } from 'uid/secure';
import ModalComprovanre from "./ModalComprovante";
const idPagamento = uid().toString();

export default function ModalPagamento(props){
    const [show, setShow] = useState(false)
    const [showAddPag, setShowAddPag] = useState(false)
    const [imagemUpload, setImagemUpload] = useState(false);
    const [dadosPagForm, setDadosPagForm] = useState({id_reserva: props.id});
    const [dadosPag, setDadosPag] = useState(props.pagamento.filter((item) => item.id_reserva === props.id));

    const scriptHtml = `<script type="text/javascript">
     { $(document).ready(() => {
        $('[data-toggle="popover"]').popover();
      })
        }
    </script>`
    useEffect(()=>{
        console.log(props.pagamento.valorPago)       
    },[])
    

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
        

            const reqPagReserva = {
                method: 'POST',
                body: formData
            }
            fetch('http://localhost:8800/reservaPagamento', reqPagReserva)
            .then( response => console.log(response.json()))
    }

    return (        
    <div className="modal fade text-dark" id={`modal${props.id}`} data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
        <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="modalLabel">Dados Pagamento</h5>
                    <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="modal-body">
                    {props.pagamento?
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
                            <th>Opções</th>
                        </tr>
                    </thead>
                    <tbody>
                    {dadosPag&&dadosPag.map( (pag) =>
                        <tr>
                            <td>{pag.idPagamento}</td>
                            <td>{pag.dataPagamento.substr(0, 10).split('-').reverse().join('/')}</td>
                            <td>R$: {pag.valorPago.toFixed(2).replace(".", ",")}</td>
                            <td>
                                <a type="button" class="btn btn-sm btn-light" data-trigger="hover" data-toggle="popover" title="Comentário" data-content={pag.comentario}>
                                    <i className="fas fa-comment-alt"></i>
                                        &nbsp; Ver
                                </a>
                                <div id='demoPropv'></div>
                            </td>
                            <td>
                                <a type="button" class="btn btn-sm btn-light" target="_blank" href={`http://127.0.0.1:8800/imagem/${pag.idPagamento}`}>
                                    <i className="fas fa-image	"></i>
                                    &nbsp; Ver
                                </a>
                            </td>
                            <td>
                                <button type="button" class="btn btn-sm mr-2 btn-warning"><i className="fas fa-edit	"></i></button>
                                <button type="button" class="btn btn-sm btn-danger"><i className="fa fa-trash"></i></button>
                            </td>
                        </tr>
                        )}
                    </tbody>
                    </table>
                    </div>
                    <div  class="row ">
                    <div className=" border rounded mb-3 ml-auto col-4 mr-3">
                        <div class=" mb-4">
                                <div class="">
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                                            Valor Total
                                            <span>R$ {(props.valorTotal).toFixed(2).replace(".", ",")}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                                            Valor Pago
                                            <span>R$ {dadosPag.reduce((sum, item) =>sum + item.valorPago,0).toFixed(2).replace(".", ",")}</span>
                                        </li>
                                            <li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                                            <div>
                                                <strong>Valor Restante</strong>                                            
                                            </div>
                                        <span><strong>R$ {(props.valorTotal - dadosPag.reduce((sum, item) =>sum + item.valorPago,0)).toFixed(2).replace(".", ",")}</strong></span>
                                        </li>
                                    </ul>
                            </div>
                        </div>
                    </div>
                    </div>
                    </>
                    :<p>Não há dados de pagamento</p> }
                    {!showAddPag && 
                        <div className="d-flex" >
                            <button className="ml-auto btn btn-primary" onClick={() => setShowAddPag(true)}>
                                Adicionar Pagamento
                            </button>
                        </div>}
                    {showAddPag&& 
                    <form onSubmit={handleSubmit}>
                        <TourPag  valorTotal = {props.valorTotal} dadosPagForm={dadosPagForm} setImagemUpload={setImagemUpload} setDadosPagForm = {setDadosPagForm}/>
                        <div className="d-flex" >
                            <button className="ml-auto btn btn-primary" type="submit">
                                Enviar
                            </button>
                        </div>
                    </form> }    
                </div>
            </div>
        </div>
    </div>)
}