import { useEffect, useState } from "react";
import ModalEstorno from "./ModalEstorno";

export default function TabelaFinanceiroRow(props){
    const [pagamento, setPagamento] = useState(false);
    const [statusReserva, setStatusReserva] = useState('')
    
    const pagamentoreservas = (props.pagamentoreservas);
    const dadosTour =(props.tour).filter((tourR) => tourR.status === 'Confirmado').filter((tourR) => tourR.id_reserva === props.dados.idR)
    const valorTotal = dadosTour.reduce((sum, element)=> sum + (element.quantidadeAdultos*element.valorAdulto) + (element.quantidadeCriancas * element.valorCrianca), 0);
    const calculoEstorno = (props.estorno.filter((item) => item.status === "Pago").reduce((sum, item) =>sum + item.valor,0));

    useEffect(()=>{
        if(props.dados.status){          
            if(props.dados.status === 'Confirmado'){
                setStatusReserva({status: 'Confirmado', className: "fas fa-check-circle text-success"})
            }else if(props.dados.status === 'Cancelado'){
                setStatusReserva({status: 'Cancelado', className: "fas fa-ban text-danger"})
            }            
        }
        if(pagamentoreservas){
            setPagamento(pagamentoreservas.filter((item) => (item.id_reserva === props.dados.idR)).reduce((sum, element)=> sum + element.valorPago, 0))
         
         }

    },[props.updateCount])

    return(
        <tr>
            <td className="text-left">{props.dados.idR}</td>
            <td className="text-left">{nomeExibido}</td>
            <td data-order={dataISO} className="text-left">{dataFormatadaBr}</td>
            <td className="text-left">{`R$ ${props.formatarMoeda(valorTotal)}`}</td>
            <td className="text-left text-success">{`+${props.formatarMoeda(pagamento)}`}</td>
            <td className={`text-left ${(pagamento - valorTotal) < 0 && "text-danger"}`}>
                {(pagamento - valorTotal) < 0 
                    ? `-${props.formatarMoeda(Math.abs(pagamento - valorTotal))}`
                    : '0,00'
                }
            </td>
            <td className={`text-left ${saldoDevido < 0 && "text-danger"}`}>
            <td className={`text-left ${saldoDevido > 0 && "text-danger"}`}>
                {saldoDevido > 0 
                    ? props.formatarMoeda(saldoDevido)
                    : '0,00'
                }
            </td>
            </td>        
            <td>{
                (pagamento - valorTotal) > 0?
                <a title="Ver Pagamento" data-toggle="modal" className="cpointer" data-target={`#estorno${props.dados.idR}`}>
                    { calculoEstorno === 0 && <span title='Adicionar Estorno'className="badge badge-pill badge-danger">Não Devolvido</span>}
                    { calculoEstorno < (pagamento -valorTotal) && calculoEstorno > 0 &&<span title='Adicionar Estorno'className="badge badge-pill badge-warning">Incompleto</span>}
                    { calculoEstorno === (pagamento -valorTotal) && props.estorno.length > 0 &&<span title='Ver Estorno'className="badge badge-pill badge-success">Devolvido</span>}
                    { calculoEstorno > (pagamento -valorTotal) &&<span title='Ver Estorno'className="badge badge-pill badge-info">Valor Acima</span>}
                </a>
                :'Sem Estorno'
                
            }<ModalEstorno valorTotal={pagamento - valorTotal} updateCount={props.updateCount} setUpdateCount={props.setUpdateCount} estorno={props.estorno} idR={props.dados.idR} />

            </td>
        </tr>
    )
}