import { useEffect, useState } from "react";
import { Table, Card } from 'antd';
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
    const dataSource = dadoMensal
        ? dadoMensal.filter(item => item.status === "Pago")
        : [];
    const columns = [
        {
            title: 'ID Pagamento',
            dataIndex: 'idPagamento',
            key: 'idPagamento',
        },
        {
            title: 'Nome',
            dataIndex: 'nome',
            key: 'nome',
        },
        {
            title: 'Data',
            dataIndex: 'dataPagamento',
            key: 'dataPagamento',
            // Usamos a função render para formatar a data como você fez no HTML
            render: (dataPagamento) => dataPagamento.substr(0, 10).split('-').reverse().join('/'),
            // Define o método de ordenação
            sorter: (a, b) => {
                const dateA = new Date(a.dataPagamento.substr(0, 10));
                const dateB = new Date(b.dataPagamento.substr(0, 10));
                return dateA - dateB; // Ordem crescente (A-B). Para decrescente: dateB - dateA
            },
            defaultSortOrder: 'descend', // Aplica a ordenação decrescente por padrão (mais recente primeiro)
        },
        {
            title: 'Pago',
            dataIndex: 'valorPago',
            key: 'valorPago',
            // Função render para formatar como R$ e aplicar a classe de sucesso
            render: (valorPago) => (
            <span className="text-success">
                R$ {valorPago.toFixed(2).replace(".", ",")}
            </span>
            ),
            align: 'right',
        },
        {
            title: 'Porcentagem',
            dataIndex: 'comissaoPorcentagem', // Esta chave não existe no dado, é um valor fixo
            key: 'porcentagem',
            // Renderiza a variável 'porcentagem'
            render: () => `${porcentagem}%`,
            align: 'right',
        },
        {
            title: 'Comissão',
            dataIndex: 'valorComissao', // Esta chave não existe no dado
            key: 'comissao',
            // Calcula e formata o valor da comissão
            render: (text, record) => { // 'record' é o objeto de dados inteiro (dado)
            const valorComissao = record.valorPago * porcentagem / 100;
            return (
                <span className="text-success">
                R$ {valorComissao.toFixed(2).replace(".", ",")}
                </span>
            );
            },
            align: 'right',
            sorter: (a, b) => (a.valorPago * porcentagem) - (b.valorPago * porcentagem),
        },
    ];
    
    return(
    <>
    {dadoAno&&dadoAtual&&dadoMensal?
    <>
        <div class="row">
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-success border border-secondary h-100 py-2">
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
                <div class="card border-left-success border border-secondary h-100 py-2">
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
        <div className="d-block d-md-flex mt-4 ">
            <h5 className="font-weight-bold mb-2 text-dark">Comissões {`${months[month]}/${year}`}</h5>
            <div class="d-block d-md-flex mb-md-2 ml-auto my-auto">
                <p className="mb-2 pr-2 my-md-auto">Porcentagem:</p> 
                <input type="number" min="0" max="100" className="mr-2 form-control form-control-sm mb-2 my-md-auto" 
                value={porcentagem}
                onChange={(e) =>{ e.target.value <= 100 && setPorcentagem(e.target.value);
                                    e.target.value <= -1 && setPorcentagem(0);}
                }/>
                <input class="form-control form-control-sm mb-4 my-md-auto" value={year+'-'+(month+1).toString().padStart(2, '0')} type="month" onChange={(e) =>{ setYear(e.target.value.substr(0, 4));
                                                                                                                    setMonth((e.target.value.substr(5,6 )-1));
                                                                                                                    setUpdateData(true);}}/>
            </div>          
        </div>
        <div className="table-responsive card border border-secondary mb-5">
            <Table
                dataSource={dataSource} 
                columns={columns}
                bordered={true} 
                size="small"
                rowKey="idPagamento" 
                pagination={false} 
            />
        </div>
        </>: <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>}
    </>
    )
}