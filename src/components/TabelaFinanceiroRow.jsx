import { useEffect, useState, useMemo} from "react";
import ModalEstorno from "./ModalEstorno";



export default function TabelaFinanceiroRow(props){
   
    const dadosTour = useMemo(() => {
        return (props.tour).filter((tourR) => tourR.status === 'Confirmado').filter((tourR) => tourR.id_reserva === props.dados.idR);
    }, [props.tour, props.dados.idR]);
    
    const valorTotal = useMemo(() => {
        return dadosTour.reduce((sum, element)=> sum + (element.quantidadeAdultos*element.valorAdulto) + (element.quantidadeCriancas * element.valorCrianca), 0);
    }, [dadosTour]);

    const pagamento = useMemo(() => {
        return props.pagamentoreservas?.filter((item) => (item.id_reserva === props.dados.idR)).reduce((sum, element)=> sum + element.valorPago, 0) || 0;
    }, [props.pagamentoreservas, props.dados.idR]);

    const calculoEstorno = useMemo(() => {
        return props.estorno.filter((item) => item.status === "Pago").reduce((sum, item) => sum + item.valor, 0);
    }, [props.estorno]);

    const saldoDevido = pagamento - valorTotal;

    const dataISO = props.dados.dataReserva.substr(0, 10); 
    const dataFormatadaBr = dataISO.split('-').reverse().join('/');
    const nomeCompleto = props.dados.nome;
    const partesDoNome = nomeCompleto ? nomeCompleto.trim().split(/\s+/) : []; 


    const nomeExibido = useMemo(() => {
        const nomeCompleto = props.dados.nome;
        const partesDoNome = nomeCompleto ? nomeCompleto.trim().split(/\s+/) : [];

        if (partesDoNome.length === 1) {
            return partesDoNome[0];
        } 
        if (partesDoNome.length > 1) {
            const primeiroNome = partesDoNome[0];
            const ultimoSobrenome = partesDoNome[partesDoNome.length - 1]; 
            return `${primeiroNome} ${ultimoSobrenome}`;
        }
        return ''; // Retorna string vazia se o nome for vazio ou inválido
    }, [props.dados.nome])



    return(
        <tr>
            <td className="text-left">{props.dados.idR}</td>
            <td className="text-left">{nomeExibido}</td>
            <td data-order={dataISO} className="text-left">{dataFormatadaBr}</td>
            <td className="text-left">{`R$ ${props.formatarMoeda(valorTotal)}`}</td>
            <td className="text-left text-success">{`+${props.formatarMoeda(pagamento)}`}</td>
            <td className={`text-left ${saldoDevido < 0 && "text-danger"}`}>
                {saldoDevido < 0 
                    ? `-${props.formatarMoeda(Math.abs(saldoDevido))}`
                    : '0,00'
                }
            </td>
            <td className={`text-left ${saldoDevido > 0 && "text-danger"}`}>
                {saldoDevido > 0 
                    ? props.formatarMoeda(saldoDevido)
                    : '0,00'}
            </td>           
            <td>{
                saldoDevido > 0?
                <a title="Ver Pagamento" data-toggle="modal" className="cpointer" data-target={`#estorno${props.dados.idR}`}>
                    { calculoEstorno === 0 && <span title='Adicionar Estorno'className="badge badge-pill badge-danger">Não Devolvido</span>}
                    { calculoEstorno < saldoDevido && calculoEstorno > 0 &&<span title='Adicionar Estorno'className="badge badge-pill badge-warning">Incompleto</span>}
                    { calculoEstorno === saldoDevido && props.estorno.length > 0 &&<span title='Ver Estorno'className="badge badge-pill badge-success">Devolvido</span>}
                    { calculoEstorno > saldoDevido &&<span title='Ver Estorno'className="badge badge-pill badge-info">Valor Acima</span>}
                </a>
                :'Sem Estorno'
                
            }<ModalEstorno valorTotal={pagamento - valorTotal} updateCount={props.updateCount} setUpdateCount={props.setUpdateCount} estorno={props.estorno} idR={props.dados.idR} formatarMoeda={props.formatarMoeda}/>

            </td>
        </tr>
    )
}