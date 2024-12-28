import { use, useEffect, useState } from "react"
import TourPag from "./TourPag"
import { uid } from 'uid/secure';
const idPagamento = uid().toString();

export default function ModalPagamento(props){
    const [show, setShow] = useState(false)
    const [showAddPag, setShowAddPag] = useState(false)
    const [imagemUpload, setImagemUpload] = useState(false);
    const [dadosPagForm, setDadosPagForm] = useState({id_reserva: props.id});
    
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
                    {props.pagamento.valorPago?
                    <>
                    <table className="table table-sm table-bordered " style={{pointerEvents: 'none'}}>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Valor Total</th>
                            <th>Valor Pago</th>
                            <th>Valor Restante</th>
                            <th>Comentário</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{props.pagamento.dataPagamento.substr(0, 10).split('-').reverse().join('/')}</td>
                            <td>R$: {props.valorTotal.toFixed(2).replace(".", ",")}</td>
                            <td>R$: {props.pagamento.valorPago.toFixed(2).replace(".", ",")}</td>
                            <td>R$: {(props.valorTotal - props.pagamento.valorPago).toFixed(2).replace(".", ",")}</td>
                            <td>{props.pagamento.comentario}</td>
                        </tr>
                    </tbody>
                    </table>
                    <h5>Comprovante</h5>
                    <div>
                    <a style={show === false?{cursor: "zoom-in"}:{cursor: "zoom-out"}} onClick={ () => show === true?setShow(false):setShow(true)}>
                    <img className="img-fluid img-thumbnail rounded" style={show === false?{width: '300px'}:{width: '100%'}} src={`http://127.0.0.1:8800/imagem/${props.pagamento.idPagamento}`}/>
                    </a>
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