import { use, useEffect, useState } from "react"

export default function ModalAlert(props){
        const [show, setShow] = useState(false)
    return (        
    <div className="modal fade text-dark" id={`modal${props.id}`} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
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
                            <td>R$: {props.pagamento.valorRestante.toFixed(2).replace(".", ",")}</td>
                            <td>{props.pagamento.comentario}</td>
                        </tr>
                    </tbody>
                    </table>
                    <h5>Comprovante</h5>
                    <div>
                    <a style={show === false?{cursor: "zoom-in"}:{cursor: "zoom-out"}} onClick={ () => show === true?setShow(false):setShow(true)}>
                    <img className="img-fluid img-thumbnail rounded" style={show === false?{width: '300px'}:{width: '100%'}} src={`http://127.0.0.1:8800/imagem/${props.id}`}/>
                    </a>
                    </div>
                    </>
                    :<p>Não há dados de pagamento</p> }
                </div>
               
            </div>
        </div>
    </div>)
}