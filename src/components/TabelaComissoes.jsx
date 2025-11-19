import { useEffect, useState, useCallback, useMemo } from "react";
import { Table, DatePicker,Select } from 'antd'; 
import {getComissoes, getTotalComissoesAno, getTotalComissoesMes, getUsuarios} from "../FranciscoTourService";
import { useAuth } from '../context/AuthContext.jsx'; 
import {exportToXLSX} from '../exportToXLSX.js'

const { Option } = Select;

const date = new Date();
const currentYear = date.getFullYear();

export default function TabelaComissoes(){        
    const { userRole } = useAuth();
    const [porcentagem, setPorcentagem] = useState(10)
    const [anoSelecionado, setAnoSelecionadol] = useState(currentYear)
    const [dadoMes, setDadoMes] = useState('')
    const [dados, setDados] = useState('')
    const [dadoAno, setDadoAno] = useState('')
    const [updateData, setUpdateData] = useState(false)
    const [year, setYear] = useState(date.getFullYear(currentYear));
    const [month, setMonth] = useState(date.getMonth());
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [dataInicio, setDataInicio] = useState(null);
    const [dataFim, setDataFim] = useState(null);
    const [filtroBusca, setFiltroBusca] = useState('');
    const [loading, setLoading] = useState(true);
    const [vendedorSelecionado, setVendedorSelecionado] = useState(null);
    const [listaVendedores, setListaVendedores] = useState([]);
    
    const isAdmin = userRole === "ADMIN";
   
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

     const fetchComissoes = useCallback(async () => {
        try {
           
            const dados = await getComissoes();
            const dadoAno = await getTotalComissoesAno(year, vendedorSelecionado);
            const dadoMes = await getTotalComissoesMes(month, year, vendedorSelecionado);
            const dataUsuarios = isAdmin ? await getUsuarios() : Promise.resolve([]) ;

            if (Array.isArray(dados)) {
                    const processedReservas = dados.map(r => {
                        const partesDoNome = r.cliente ? r.cliente.trim().split(/\s+/) : [];
                        const nomeExibido = partesDoNome.length > 1 
                            ? `${partesDoNome[0]} ${partesDoNome[partesDoNome.length - 1]}`
                            : r.cliente;
                        return { ...r, nomeExibido };
                    });
                    setDados(processedReservas);
                } else { setDados([]); }
            setDadoAno(dadoAno);
            setDadoMes(dadoMes);
            setListaVendedores(dataUsuarios)
                  
        } catch (error) {
            console.error("Erro ao carregar comissões:", error);
            setDados([]);
            setDadoAno([]);
            setDadoMes([])
        }finally{
            setLoading(false)
        }
    }, [vendedorSelecionado]);   


    useEffect(()=>{
        fetchComissoes();
    },[updateData, vendedorSelecionado])

    const comissoeFiltradas = useMemo(() => {
        let filtrado = dados;
        
        if (vendedorSelecionado && isAdmin) {
            filtrado = filtrado.filter(reserva => 
                reserva.vendedor && reserva.vendedor.toUpperCase() === vendedorSelecionado.toUpperCase()
            );
        }

        if (dataInicio && dataFim) {
            const inicioTimestamp = new Date(dataInicio).getTime();

            const dataFimObj = new Date(dataFim);
            dataFimObj.setDate(dataFimObj.getDate() + 1); 
            const fimTimestamp = dataFimObj.getTime() - 1; 

            filtrado = filtrado.filter(comissao => {
                const dataComissaoTimestamp = new Date(comissao.dataPagamento).getTime(); 
                return dataComissaoTimestamp >= inicioTimestamp && dataComissaoTimestamp <= fimTimestamp;
            });
        }

        
        return filtrado;
    }, [dados, vendedorSelecionado, dataInicio, dataFim, filtroBusca]);

    const dataSource = dados
        ? dados.filter(item => item.status === "Pago")
        : [];

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const handleSingleDateChange = (date, type) => {
        if (type === 'start') {
            setDataInicio(date);
        } else {
            setDataFim(date);
        }
    };

    const handleDateRangeChange = (dates) => {
        if (dates && dates.length === 2) {
            setDataInicio(dates[0]);
            setDataFim(dates[1]);
            
        } else {
            setDataInicio(null);
            setDataFim(null);
        }
    };

    const handleClearFilters = () => {
        setVendedorSelecionado(null);
        setDataInicio(null);
        setDataFim(null);
        setFiltroBusca(null);
    };

    const handleExportXLSX = () => {
        const dadosParaExportar = comissoeFiltradas;         
        if (dadosParaExportar.length === 0) {
            alert("Nenhum dado para exportar.");
            return;
        }
        const vendedor = vendedorSelecionado;
        const datas = dataInicio&&dataFim?`${new Date(dataInicio).toLocaleDateString()}_${new Date(dataFim).toLocaleDateString()}`:'todos_dados';
        const fileName = `Comissoes${vendedor&&'-'+vendedor}_${datas}.xlsx`;
        
        exportToXLSX(dadosParaExportar, fileName);
    };

    const columns = [
        {
            title: 'ID Reserva',
            dataIndex: 'idReserva',
            key: 'idReserva',
            width: 120,
        },
        {
            title: 'Cliente',
            dataIndex: 'nomeExibido',
            key: 'cliente',
            width: 180,

        },
        {
            title: 'Vendedor',
            dataIndex: 'vendedor',
            key: 'vendedor',
            width: 120,
        },
        {
            title: 'Data',
            dataIndex: 'dataPagamento',
            key: 'dataPagamento',
            sorter: (a, b) => new Date(a.dataPagamento) - new Date(b.dataPagamento),
            defaultSortOrder: 'descend',
            render: (dataPagamento) => dataPagamento.substr(0, 10).split('-').reverse().join('/'),
            width: 120,
            
        },{
            title: 'Valor Reserva',
            dataIndex: 'valorTotalReserva', 
            key: 'valorReserva',
            render: (valorReserva) => `R$ ${valorReserva.toFixed(2).replace(".", ",")}`,
            align: 'right',
            width: 120,
        },{
            title: 'Valor Pago',
            dataIndex: 'valorTotalPago', 
            key: 'valorTotalPago',
            render: (valorTotalPago) => <div className="text-success">R$ {valorTotalPago.toFixed(2).replace(".", ",")}</div>,
            align: 'right',
            width: 120,
        },        
        {
            title: 'Custo Total',
            dataIndex: 'custoTotalReserva', 
            key: 'custoTotalReserva',
            render: (custoTotalReserva) => <div className="text-danger">R$ {custoTotalReserva.toFixed(2).replace(".", ",")}</div>,
            align: 'right',
            width: 120,
        },
        {
            title: 'Porcentagem',
            dataIndex: 'porcentagemComissao', 
            key: 'porcentagem',
            render: (porcentagemComissao) => `${porcentagemComissao || 0}%`,
            align: 'right',
            width: 120,
        },
        {
            title: 'Comissão',
            dataIndex: 'valorComissao',
            key: 'comissao',
            render: (valorComissaoFinal) => { 
                const valorFinal = valorComissaoFinal || 0;
                return (
                    <span className="text-success">
                        R$ {valorFinal.toFixed(2).replace(".", ",")}
                    </span>
                );
            },
            align: 'right',
            sorter: (a, b) => (a.valorComissaoFinal || 0) - (b.valorComissaoFinal || 0),
            width: 120,
        },
    ];
    
    return(
    <>
    {dados?
    <>
        <div class="row pt-3">
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-success border border-secondary h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bolder text-success text-uppercase mb-1 ">                                   
                                    <p className="m-auto pr-2">Comissões {`${months[month]}/${year}`}</p>
                                    </div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">R$ {dadoMes.valorTotalMes.toFixed(2).replace(".", ",")}</div>
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
                                <div class="h5 mb-0 font-weight-bold text-gray-800">R$ {dadoAno.valorTotalAno.toFixed(2).replace(".", ",")}</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="row pt-3 justify-content-between">
           
                <div className="col-md-4 mt-auto mb-4 d-none d-sm-block">
                    <label className="form-label">Intervalo de Datas</label>
                    <DatePicker.RangePicker 
                        style={{ width: '100%' }}
                        value={[dataInicio, dataFim]}
                        onChange={handleDateRangeChange}
                        format="DD/MM/YYYY"
                    />
            </div>
            <div className="col-12 mb-4 d-sm-none">
                <label className="form-label">Data Início</label>
                    <DatePicker 
                        placeholder="Início"
                        className='mb-4'
                        style={{ width: '100%', marginBottom: '10px' }}
                        value={dataInicio}
                        onChange={(date) => handleSingleDateChange(date, 'start')}
                        format="DD/MM/YYYY"
                        getPopupContainer={trigger => trigger.parentElement || document.body} 
                    />
                
                <label className="form-label">Data Fim</label>
                    <DatePicker 
                        placeholder="Fim"
                        style={{ width: '100%' }}
                        value={dataFim}
                        onChange={(date) => handleSingleDateChange(date, 'end')}
                        format="DD/MM/YYYY"
                        minDate={dataInicio}
                        getPopupContainer={trigger => trigger.parentElement || document.body} 
                    />
            </div>
            {isAdmin&&<div className="col-md-2 mt-auto mb-4">
                <label className="form-label">Vendedor</label>
                <Select
                    allowClear
                    placeholder="Todos os Vendedores"
                    style={{ width: '100%' }}
                    value={vendedorSelecionado}
                    onChange={(value) => setVendedorSelecionado(value)}
                >
                    {listaVendedores.map(vendedor => (
                        <Option key={vendedor.id} value={vendedor.username}>
                            {vendedor.username}
                        </Option>
                    ))}
                </Select>
            </div>}
            <div className="col-md-2 ml-auto mt-auto mb-4 d-flex"> 
                <button 
                    onClick={handleExportXLSX}
                    className="btn btn-info btn-sm ml-auto"
                >
                    Exportar Dados
                </button>
            </div>
        </div>

        <div className="table-responsive card border border-secondary mb-5">
            <Table
                dataSource={comissoeFiltradas} 
                columns={columns}
                bordered={true} 
                size="small"
                rowKey="comissoes"
                loading={loading} 
                scroll={{ 
                    y: 450
                }}
                pagination={{ 
                            current: currentPage,
                            pageSize: pageSize,
                            showSizeChanger: true, 
                            pageSizeOptions: ['10', '25', '50', '100'], 
                            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} itens`,
                            className: 'pagination-centered',
                        }}

                onChange={(pagination, filters, sorter) => handleTableChange(pagination)}
                footer={() => <div className="d-flex my-3">
                                <h5 className="ml-auto mr-2">Total:</h5> 
                                <h5 className="font-weight-bold">R$ {comissoeFiltradas.reduce((sum, data) =>  sum + data.valorComissao, 0).toFixed(2).replace(".", ",")}</h5>   
                            </div>}

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