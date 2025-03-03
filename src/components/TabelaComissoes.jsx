import { useEffect, useState } from "react";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import {getPagamentoReservaAnual, getPagamentoReservaValorMes, getPagamentoReservaMensal} from "../FranciscoTourService";
const date = new Date();
const currentYear = date.getFullYear();

DataTable.use(DT);
export default function TabelaComissoes(){        
    const [porcentagem, setPorcentagem] = useState(10)
    const [anoSelecionado, setAnoSelecionadol] = useState(currentYear)
    const [dadoAtual, setDadoAtual] = useState('')
    const [dadoMensal, setDadoMensal] = useState('')
    const [dadoAno, setDadoAno] = useState('')
    const [updateData, setUpdateData] = useState(false)
    const [year, setYear] = useState(date.getFullYear(currentYear));
    const [month, setMonth] = useState(date.getMonth());
    const months = [
        'Janeiro',
         'Fevereiro',
         'Março',
         'Abril',
         'Maio',
         'Junho',
         'Julho',
         'Agosto',
         'Setembro',
         'Outubro',
         'Novembro',
         'Dezembro'
     ];
     


    useEffect(()=>{
        setTimeout(() => {
            getPagamentoReservaAnual(anoSelecionado).then(
                data => {
                    if(data.fatal || data.code){
                        setDadoAtual(false);
                    }else{
                        setDadoAtual(data)
                    }    
                }
            ).catch((error) => console.log(error));
        },"300")
        setTimeout(() => {
            getPagamentoReservaValorMes(year).then(
                data => {
                    setDadoAno(data)
                }
            ).catch((error) => console.log(error));
        },"600")
        setTimeout(() => {
            getPagamentoReservaMensal(month, year).then(
                data => {
                    setDadoMensal(data)
                }
            ).catch((error) => console.log(error));
        },"900")

            setUpdateData(false)
    },[updateData])
    
    return(
    <>
    {dadoAno&&dadoAtual&&dadoMensal?
    <>
        <div class="row">
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-success shadow h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bolder text-success text-uppercase mb-1 ">                                   
                                    <p className="m-auto pr-2">Comissões {`${months[month]}/${year}`}</p>
                                    </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">R$ {dadoMensal&&(dadoMensal.filter((item) => item.status === "Pago").reduce((sum, item) => sum + item.valorPago, 0) * porcentagem/100).toFixed(2).replace(".", ",")}</div>
                            </div>
                            <div class="col-auto">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-success shadow h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                    Comissões ({year})</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">R$ {(dadoAno&&dadoAno.valorTotal *(porcentagem/100)).toFixed(2).replace(".", ",")}</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Comissões {`${months[month]}/${year}`}</h6>
                <div class="d-flex text-center">
                    <p className="m-auto pr-2">Porcentagem:</p> <input type="number" min="0" max="100" className="mr-2 form-control form-control-sm" 
                    value={porcentagem}
                    onChange={(e) =>{ e.target.value <= 100 && setPorcentagem(e.target.value);
                                      e.target.value <= -1 && setPorcentagem(0);}
                    }/>
                    <input class="form-control form-control-sm" value={year+'-'+(month+1).toString().padStart(2, '0')} type="month" onChange={(e) =>{ setYear(e.target.value.substr(0, 4));
                                                                                                                     setMonth((e.target.value.substr(5,6 )-1));
                                                                                                                     setUpdateData(true);}}/>
                </div>

            </div>
            <div className="card-body">
                {dadoMensal&&<table
                            className="table table-sm table-hover mr-0 mt-3 w-100 "
                            cellspacing="0"
                            width="100%"
                            id="dataTable">
                                 <thead>
                                <tr>
                                    <th className="text-left">ID Pagamento</th>
                                    <th className="text-left">Nome</th>
                                    <th className="text-left">Data</th>
                                    <th className="text-left">Pago</th>
                                    <th className="text-left">Porcentagem</th>
                                    <th className="text-left">Comissão</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dadoMensal&&dadoMensal.filter((item) => item.status === "Pago").map((dado) => {
                                    return(
                                        <tr className="text-left">
                                            <td>{dado.idPagamento}</td>
                                            <td>{dado.nome}</td>
                                            <td>{dado.dataPagamento.substr(0, 10).split('-').reverse().join('/')}</td>
                                            <td className="text-success">R$ {dado.valorPago.toFixed(2).replace(".", ",")}</td>
                                            <td>{porcentagem}%</td>
                                            <td className="text-success">R$ {(dado.valorPago*porcentagem/100).toFixed(2).replace(".", ",")}</td>
                                        </tr>
                                    )}
                                )}
                            </tbody>
                </table>}
            </div> 
        </div>
        </>: <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>}
    </>
    )
}