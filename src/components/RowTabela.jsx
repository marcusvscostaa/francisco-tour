import { Fragment, useEffect, useState, useRef } from "react";
import DT from 'datatables.net-dt';
import RowTabelaChild from "./RowTabelaChild";
import $ from "jquery";
import ReactDOM from 'react-dom';
import ModalAlert from "./ModalAlert";
import ModalPagamento from "./ModalPagamento";



export default function RowTabela(props){
    const [collapseTable, setCollapseTable] = useState(false);
    const [pagamento, setPagamento] = useState({valorPago: false});
    const pagamentoreservas = (props.pagamentoreservas);
    const dadosTour =(props.tour).filter((tourR) => tourR.id_reserva === props.reserva.idR)
    const valorTotal = dadosTour.reduce((sum, element)=> sum + element.valorTotal, 0);
    console.log(pagamentoreservas.valorPago)
    const myRef = useRef(null);
    const scriptHtml = `<script type="text/javascript">
     { $(document).ready(() => {
        $('[data-toggle="popover"]').popover();
      })
        }
    </script>`
    useEffect(()=>{
        console.log(props.pagamentoreservas)
        {document.getElementById("demoPropv").innerHTML = scriptHtml}
        if(pagamentoreservas){
            pagamentoreservas.map((item) => { item.id_reserva === props.reserva.idR&&setPagamento(item);})
            
        }
        console.log(props.tour)
        console.log(pagamento)
    },[])

    return (
        <Fragment>
            <tr id={props.reserva.idR}>
            
                <td><i className="fas fa-user-alt"></i> {props.reserva.nome}</td>
                <td><i className="fas fa-calendar-alt"></i> {props.reserva.dataReserva.substr(0, 10).split('-').reverse().join('/')}</td>
                
                <td><a className="cpointer" data-toggle="collapse" data-target={"linha"+props.index}
                onClick={
                    (e) =>{
                        
                        if(collapseTable === false)
                        {
                            const myElement = document.getElementById(props.reserva.idR);
                            const newHTML = `<tr id=${props.reserva.idR+'x'}></tr>`;
                            myElement.insertAdjacentHTML('afterend', newHTML);
                            setCollapseTable(true);
                        }else{
                            setCollapseTable(false)
                        }
                    }
                }><i className={collapseTable?"fas fa-arrow-alt-circle-down	":"fas fa-arrow-alt-circle-right"}></i> Ver</a> {props.reserva.tour}
                        {/* collapseTable && <RowTabelaChild dadosTour={dadosTour} collapseTable={collapseTable} idcollapseTable={idcollapseTable}/> */}    
                </td>
                <td><a title="Ver Pagamento" data-toggle="modal" className="cpointer" data-target={`#modal${props.reserva.idR}`}>
               
                    <i className="fas fa-money-bill-wave mr-2"></i>Ver &nbsp;
                    {valorTotal > pagamento.valorPago && pagamento.valorPago > 0 && <span class="badge badge-pill badge-warning">Pendente</span>}
                    {valorTotal <= pagamento.valorPago && <span class="badge badge-pill badge-success">Pago</span>}
                    {pagamento.valorPago === 0 || pagamento.valorPago == ''&& <span class="badge badge-pill badge-danger">Não Pago</span>}
                    </a>
                    <ModalPagamento id={props.reserva.idR} pagamento={pagamento} valorTotal={valorTotal}/>
                    </td>
                <td className="text-left"><i className="fas fa-phone"></i> {props.reserva.telefone}</td>
                <td>R$: {valorTotal.toFixed(2).replace(".", ",")}</td>
                <td>
                    <a type="button" class="btn btn-sm btn-light" data-trigger="hover" data-toggle="popover" title="Comentário" data-content={props.reserva.comentario}>
                    <i className="fas fa-comment-alt"></i>
                        &nbsp; Ver
                    </a>
                <div id='demoPropv'></div>
                </td>
                <td><span class="badge badge-pill badge-danger">Cancelado</span></td>
                <td>
                    <button type="button" class="btn btn-sm mr-2 btn-warning"><i className="fas fa-edit	"></i></button>
                    <button type="button" class="btn btn-sm btn-danger"><i className="fa fa-trash"></i></button>
                </td>
            </tr>
                {collapseTable && <RowTabelaChild idcollapseTable={props.reserva.idR+'x'} dadosTour={dadosTour} nomeCliente={props.reserva.nome}/>}
    </Fragment>
    )
}