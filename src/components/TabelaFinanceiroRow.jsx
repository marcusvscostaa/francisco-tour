import { useEffect, useState } from "react";
import ModalEstorno from "./ModalEstorno";

export default function TabelaFinanceiroRow(props){
    const [pagamento, setPagamento] = useState(false);
    const [statusReserva, setStatusReserva] = useState('')
    
    const pagamentoreservas = (props.pagamentoreservas);
    const dadosTour =(props.tour).filter((tourR) => tourR.status === 'Confirmado').filter((tourR) => tourR.id_reserva === props.dados.idR)
    const valorTotal = dadosTour.reduce((sum, element)=> sum + (element.quantidadeAdultos*element.valorAdulto) + (element.quantidadeCriancas * element.valorCrianca), 0);

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
    },[])

    return(
        <tr>
            <td className="text-left">{props.dados.idR}</td>
            <td className="text-left">{props.dados.nome}</td>
            <td className="text-left">{props.dados.dataReserva.substr(0, 10).split('-').reverse().join('/')}</td>
            <td className="text-left">{`R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</td>
            <td class="text-success">{`+${pagamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</td>
            <td class={`text-left ${(pagamento - valorTotal) !== 0 && (pagamento - valorTotal) < 0&&"text-danger"}`}>{`${(pagamento - valorTotal) < 0?(pagamento - valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 }):'0,00'}`}</td>
            <td class={`text-left ${(pagamento - valorTotal) !== 0 && (pagamento - valorTotal) > 0&&"text-danger"}`}>{(pagamento - valorTotal) > 0?(pagamento - valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 }):'0,00'}</td>
            <td>{
                (pagamento - valorTotal) > 0?
                <a title="Ver Pagamento" data-toggle="modal" className="cpointer" data-target={`#estorno${props.dados.idR}`}>
                    <span title='Adicionar Estorno'className="badge badge-pill badge-danger">Não Devolvido</span>
                </a>
                :'Sem Estorno'
            }</td>
            <ModalEstorno valorTotal={pagamento - valorTotal} estorno={props.estorno} idR={props.dados.idR} />
        </tr>
    )
}