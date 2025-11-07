import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Table, Tag, Button as AntButton, Select, DatePicker } from 'antd'; 
import DetalheReservaMUI from './DetalheReservaMUI.jsx'; 
import { getReservas, getUsuarios, editarStatusReserva, editarStatusTours, editarStatusPagamento, getToursByReservaId, getPagamentosByReservaId } from '../../FranciscoTourService.js';
import { useAuth } from '../../context/AuthContext.jsx'; 
import ModalPagamento from '../ModalPagamento.jsx';
import ModalEditarReserva from '../ModalEditarReserva.jsx';
const { Option } = Select;

const STATUS_MAP = {
    'Confirmado': { label: 'Confirmado', color: 'success' }, 
    'Cancelado': { label: 'Cancelado', color: 'error' },     
    'Pendente': { label: 'Pendente', color: 'warning' },     
};

const STATUS = {
    CONFIRMADO: { status: 'Confirmado', className: "fas fa-check-circle text-success", isDisabled: false },
    CANCELADO: { status: 'Cancelado', className: "fas fa-ban text-danger", isDisabled: true }
};

export default function TabelaReservas() {
    const { userRole } = useAuth();
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateCount, setUpdateCount] = useState(0); 
    const [listaVendedores, setListaVendedores] = useState([]);
    const [collapsePagamento, setCollapsePagamento] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    
    const [vendedorSelecionado, setVendedorSelecionado] = useState(null);
    const [dataInicio, setDataInicio] = useState(null);
    const [dataFim, setDataFim] = useState(null);
    
    const handleUpdate = () => setUpdateCount(prevCount => prevCount + 1);
    const isAdmin = userRole === "ADMIN";

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Ajustando o caminho para o serviço (subindo dois níveis)
                const [dataReservas, dataUsuarios] = await Promise.all([
                    getReservas(),
                    isAdmin ? getUsuarios() : Promise.resolve([]) 
                ]);

                if (Array.isArray(dataReservas)) {
                    // Prepara o nome exibido e o valor total/pago (vindos do Backend)
                    const processedReservas = dataReservas.map(r => {
                        const partesDoNome = r.nome ? r.nome.trim().split(/\s+/) : [];
                        const nomeExibido = partesDoNome.length > 1 
                            ? `${partesDoNome[0]} ${partesDoNome[partesDoNome.length - 1]}`
                            : r.nome;
                        return { ...r, nomeExibido };
                    });
                    setReservas(processedReservas);
                } else { setReservas([]); }

                if (Array.isArray(dataUsuarios)) {
                    const vendedores = dataUsuarios.map(u => ({ id: u.idUsuario, username: u.username }));
                    setListaVendedores(vendedores);
                }

            } catch (error) {
                console.error("Erro no carregamento de dados:", error);
                setReservas([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [updateCount, isAdmin]);

    // 🛑 Lógica de Filtragem (Mantida no Frontend)
    const reservasFiltradas = useMemo(() => {
        let filtrado = reservas;

        // --- FILTRO 1: VENDEDOR ---
        if (vendedorSelecionado) {
            filtrado = filtrado.filter(reserva => 
                reserva.vendedor && reserva.vendedor.toUpperCase() === vendedorSelecionado.toUpperCase()
            );
        }

        // --- FILTRO 2: INTERVALO DE DATAS ---
        if (dataInicio && dataFim) {
            const inicioTimestamp = new Date(dataInicio).getTime(); 

            // 2. Normalização do Fim do Período (23:59:59.999)
            const dataFimObj = new Date(dataFim);
            // Move para o próximo dia e subtrai 1 milissegundo (23:59:59)
            dataFimObj.setDate(dataFimObj.getDate() + 1); 
            const fimTimestamp = dataFimObj.getTime() - 1; 

            filtrado = filtrado.filter(reserva => {
                // 3. Converte a data da reserva (string ISO) para o Timestamp
                const dataReservaTimestamp = new Date(reserva.dataReserva).getTime(); 

                // 4. Comparação
                return dataReservaTimestamp >= inicioTimestamp && dataReservaTimestamp <= fimTimestamp;
            });
        }
        
        return filtrado;
    }, [reservas, vendedorSelecionado, dataInicio, dataFim]);
    
    // 🛑 1. Funções de Renderização
    
    const renderPaymentBadge = (text, record) => {
        const total = record.valorTotalCalculado || 0;
        const pago = text || 0; // text é o valorPagoCalculado
        
        let color = STATUS_MAP['Cancelado'].color;
        let label = "NÂO PAGO";

        if (total <= pago) { color = STATUS_MAP['Confirmado'].color; label = 'PAGO'; }
        else if (total > pago && pago > 0) { color = STATUS_MAP['Pendente'].color; label = 'PENDENTE'; }
        
        return <Tag color={color}>{label}</Tag>;
    };

    const renderStatusTag = (status) => {
        const statusInfo = STATUS_MAP[status] || STATUS_MAP['Confirmado'];
        return <Tag color={statusInfo.color}>{statusInfo.label}</Tag>;
    };

    // 🛑 3. Função de Renderização de Linha Expandida (Substitui o RowTabelaChild)
    const renderRowDetails = (record) => {
        // AntD passa o objeto da linha como 'record'
        return (
            <div style={{ padding: '10px 0', backgroundColor: '#f5f5f5' }}>
                <DetalheReservaMUI 
                    reserva={record} 
                    setUpdateCount={handleUpdate} 
                    // Outras props necessárias
                />
            </div>
        );
    };

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
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
    
    // 🛑 3. Função para Limpar Filtros
    const handleClearFilters = () => {
        setVendedorSelecionado(null);
        setDataInicio(null);
        setDataFim(null);
    };

    const handleCollapseClick = () => {
        setCollapsePagamento(prev => !prev);
    }
    // 🛑 4. Renderização Final
    const handleStatusUpdate = useCallback(async (record, status) => {

        try {
            const [dependentTours, dependentPayments] = await Promise.all([
                getToursByReservaId(record.idR),
                getPagamentosByReservaId(record.idR)
            ]);

            await editarStatusReserva({ status, idR: record.idR });
            
            const toursToUpdate = dependentTours.map(item => 
                editarStatusTours({ status: status, idtour: item.idtour })
            );

            const pagamentosToUpdate = dependentPayments.map(item => {
                let pagamentoStatus = item.status; 
                if (status === STATUS.CONFIRMADO.status) {
                    pagamentoStatus = 'Pago'; 
                } else if (status === STATUS.CANCELADO.status) {
                    pagamentoStatus = 'Cancelado'; 
                } 

                return editarStatusPagamento({ status: pagamentoStatus, idPagamento: item.idPagamento });
            });

            await Promise.all([...toursToUpdate, ...pagamentosToUpdate]);

            setUpdateCount(prevCount => prevCount + 1); 

        } catch (err) {
            console.error(`Erro ao atualizar status para ${status}:`, err);
        }
    }, [setUpdateCount]);

    const renderStatusDropdown = (text, record) => {
        const statusInfo = STATUS_MAP[text] || STATUS_MAP.CONFIRMADO;
        
        return (
            <div className="dropdown">
                <a type="button" data-toggle="dropdown" aria-expanded="false">
                    <Tag color={statusInfo.color}>
                        <i className={statusInfo.className}></i> {statusInfo.label}
                    </Tag>
                </a>
                <div style={{minWidth: "40px"}} className="dropdown-menu dropdown-menu-right">
                    
                    {/* Opção CONFIRMADO */}
                    <button 
                        className="dropdown-item" 
                        onClick={() => handleStatusUpdate(record, STATUS.CONFIRMADO.status)}
                    >
                        <i className={STATUS.CONFIRMADO.className}></i> {STATUS.CONFIRMADO.status}
                    </button>
                    
                    {/* Opção CANCELADO */}
                    <button 
                        className="dropdown-item" 
                        onClick={() => handleStatusUpdate(record, STATUS.CANCELADO.status)}
                    >
                        <i className={STATUS.CANCELADO.className}></i> {STATUS.CANCELADO.status}
                    </button>
                </div>
            </div> 
        );
    };

    const handleDropdownChange = (e) => {
        handleStatusUpdate(e.target.value);
    }

        // 🛑 2. Definição das Colunas AntD
    const columns = useMemo(() => [
        { 
            title: 'Cliente', 
            dataIndex: 'nomeExibido', 
            key: 'nome', 
            render: (text) => <p><i className="fas fa-user-alt"></i> {text}</p>,
            width: 180,
            sorter: (a, b) => a.nomeExibido.localeCompare(b.nomeExibido),
        },
        { 
            title: 'Data', 
            dataIndex: 'dataReserva', 
            key: 'dataReserva',
            // AntD lida com a ordenação de data automaticamente se o tipo for Date
            sorter: (a, b) => new Date(a.dataReserva) - new Date(b.dataReserva),
            defaultSortOrder: 'descend',
            render: (text) => text ? text.substr(0, 10).split('-').reverse().join('/') : '',
            width: 120,
        },
        { title: 'Total', dataIndex: 'valorTotalCalculado', key: 'valorTotalCalculado',
            render: (text) => `R$ ${(text || 0).toFixed(2).replace(".", ",")}`,
            width: 100,
        },
        { title: 'Pagamento', key: 'pagamento', dataIndex: 'valorPagoCalculado', render: renderPaymentBadge, width: 150 },
        { 
            title: 'Status', 
            dataIndex: 'status', 
            key: 'status',
            render: renderStatusDropdown,
            width: 100,
        },
        { 
            title: 'Vendedor', 
            dataIndex: 'vendedor', 
            key: 'vendedor',
            width: 100,
            render: (text, record) => {
                // 'text' é o valor de dataIndex ('vendedor')
                const isVendedor = record.acesso === 'VENDEDOR'; // Assumindo que 'acesso' está disponível
                const color = isVendedor ? 'blue' : 'geekblue'; // Estilo simples para distinguir
                
                return (
                    // Exibe o nome do vendedor dentro da Tag
                    <Tag color={color} key={text}>
                        {text}
                    </Tag>
                );
            }
        },
        {
            title: 'Ações',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '4px' }}>
                    {/* Botão Pagamento/Modal */}
                    <AntButton 
                        size="small" 
                        title="Ver Pagamento" 
                        icon={<i className="fas fa-money-bill-wave"></i>} 
                        data-toggle="modal" 
                        data-target={`#modal${record.idR}`}
                    />
                     {/* Botão Editar */}
                    <AntButton 
                        size="small" 
                        title="Editar" 
                        icon={<i className="fas fa-edit"></i>} 
                        data-toggle="modal" 
                        data-target={`#reservaEditar${record.idR}`}
                    />
                </div>
            ),
        },

    ], [renderPaymentBadge]); // Adiciona dependência para evitar erro de lint
    return ( 
        <>
        {reservasFiltradas.map(reserva => (
            <React.Fragment key={`modals-${reserva.idR}`}>
                {/* 1. Modal de Pagamento (ID: #modalPagamento{idR}) */}
                <ModalPagamento 
                    id={reserva.idR}
                    valorTotal={reserva.valorTotalCalculado}
                    setUpdateCount={handleUpdate}

                    // ... (outras props)
                />
                
                {/* 2. Modal de Edição (ID: #reservaEditar{idR}) */}
                <ModalEditarReserva 
                    idR={reserva.idR}
                    dadosReserva={reserva}
                    setUpdateCount={handleUpdate}
                    // ... (outras props)
                />

                {/* 3. Modal de Exclusão (ID: #reservaDelete{idR}) */}
                {/* ... */}
                
            </React.Fragment>
        ))}
        {/* 🛑 5. LINHA DE FILTROS NA INTERFACE (Inputs AntD) */}
                <div className="row mb-4 pt-3 align-items-end">
                    
                    {/* Filtro por Vendedor */}
                    <div className="col-md-3">
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
                    </div>

                    {/* Filtro por Intervalo de Datas */}
                    <div className="col-md-6">
                        <label className="form-label">Intervalo de Datas</label>
                        <DatePicker.RangePicker 
                            style={{ width: '100%' }}
                            value={[dataInicio, dataFim]}
                            onChange={handleDateRangeChange}
                            format="DD/MM/YYYY"
                        />
                    </div>
                    
                    {/* Botão de Limpar */}
                    <div className="col-md-3">
                        <AntButton 
                            onClick={handleClearFilters}
                            icon={<i className="fas fa-eraser"></i>}
                            type="default"
                            disabled={!vendedorSelecionado && !dataInicio && !dataFim}
                        >
                            Limpar Filtros
                        </AntButton>
                    </div>
                </div>
                {/* FIM LINHA DE FILTROS */}
            <Table
                rowKey="idR" // CRÍTICO: Chave única
                bordered={true}
                size="small" 
                columns={columns}
                dataSource={reservasFiltradas} // Usa o array filtrado
                loading={loading}
                scroll={{ 
                    y: 450 
                }}
                pagination={{ 
                        current: currentPage,
                        pageSize: pageSize,
                        showSizeChanger: true, // Exibe o seletor
                        pageSizeOptions: ['10', '25', '50', '100'], // Opções para o seletor
                        showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} itens`,
                        className: 'pagination-centered',
                    }}
                // Configuração de Expansão de Linha (NATIVA)
                expandable={{
                    expandedRowRender: renderRowDetails, // Função que renderiza o detalhe
                    rowExpandable: (record) => record.valorTotalCalculado >= 0, // Apenas expande se houver valor
                }}
                onChange={(pagination, filters, sorter) => handleTableChange(pagination)}
            />
        </>
    );
}